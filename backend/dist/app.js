"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config/config");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const education_route_1 = __importDefault(require("./routes/education.route"));
const experience_routes_1 = __importDefault(require("./routes/experience.routes"));
const jobs_route_1 = __importDefault(require("./routes/jobs.route"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const session_route_1 = __importDefault(require("./routes/session.route"));
const sessionBooking_route_1 = __importDefault(require("./routes/sessionBooking.route"));
const resume_route_1 = __importDefault(require("./routes/resume.route"));
const resumeUpload_route_1 = __importDefault(require("./routes/resumeUpload.route"));
const new_resume_route_1 = __importDefault(require("./routes/new_resume.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const db_1 = __importDefault(require("./config/db"));
const logger_1 = __importDefault(require("./utils/logger"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
// Import User model for direct payment update route
const user_model_1 = __importDefault(require("./models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_2 = require("./config/config");
const ALLOWED_ORIGINS = [config_1.FRONTEND_URL, config_1.FRONTEND_URL_2, config_1.FRONTEND_URL_3].filter(Boolean);
const NODE_ENV = process.env.NODE_ENV || 'production';
const IS_PRODUCTION = NODE_ENV === 'production';
const CPU_CORES = os_1.default.cpus().length;
// Rate limiter configuration
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
});
// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
// Cluster setup for load balancing
if (cluster_1.default.isPrimary && IS_PRODUCTION) {
    logger_1.default.info(`Primary process ${process.pid} is running`);
    // Fork workers for each CPU core
    for (let i = 0; i < CPU_CORES; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on('exit', (worker, code, signal) => {
        logger_1.default.warn(`Worker ${worker.process.pid} died with code ${code}, signal ${signal}. Restarting...`);
        cluster_1.default.fork();
    });
}
else {
    const app = (0, express_1.default)();
    // Middleware  app.use(compression()); // Compress responses
    app.use(limiter); // Apply rate limiting
    app.use((0, cors_1.default)(corsOptions));
    app.use(express_1.default.json({ limit: '50mb' })); // Increased limit for file uploads
    app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' })); // Increased limit for file uploads
    app.use((0, cookie_parser_1.default)());
    // Security headers with helmet
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                connectSrc: ["'self'", ...ALLOWED_ORIGINS],
            },
        },
    }));
    // Declare global Express types
    // Routes
    app.get('/', (req, res) => {
        res.status(200).json({
            message: 'Foundit API up and running',
        });
    });
    // Test endpoint for file upload debugging
    app.post('/test-upload', (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Upload endpoint is working',
            bodySize: JSON.stringify(req.body).length,
            headers: req.headers,
        });
    });
    app.use('/api/v1/auth', auth_routes_1.default);
    app.use('/api/v1/admin', admin_route_1.default);
    app.use('/api/v1/education', education_route_1.default);
    app.use('/api/v1/experience', experience_routes_1.default);
    app.use('/api/v1/job', jobs_route_1.default);
    app.use('/api/v1/analytics', analytics_route_1.default);
    app.use('/api/v1/session', session_route_1.default);
    app.use('/api/v1/session/booking', sessionBooking_route_1.default);
    app.use('/api/v1/resume', resume_route_1.default);
    app.use('/api/v1/resume-upload', resumeUpload_route_1.default);
    app.use('/api/v1/payment', payment_routes_1.default);
    app.use('/api/v1/new/resume', new_resume_route_1.default);
    // Direct payment update route - accessible without auth
    app.post('/update', async (req, res) => {
        try {
            console.log('=== /update route called ===');
            console.log('Request body:', req.body);
            console.log('Request headers:', req.headers);
            const { userId, subscription_type } = req.body;
            // Map individual resource names to valid subscription types
            const resourceToSubscriptionType = {
                "referral": "other_templates",
                "cold_mail": "other_templates",
                "cover_letter": "other_templates",
                "hr_mail": "other_templates",
                "resume": "resume",
                "job": "job",
                "basic": "basic",
                "standard": "standard",
                "booster": "booster",
                "regular": "regular",
                "other_templates": "other_templates"
            };
            // Get the actual subscription type for database
            const actualSubscriptionType = resourceToSubscriptionType[subscription_type];
            if (!actualSubscriptionType) {
                console.log('Invalid subscription type:', subscription_type);
                res.status(400).json({
                    success: false,
                    message: `Invalid subscription_type. Must be one of: ${Object.keys(resourceToSubscriptionType).join(", ")}`
                });
                return;
            }
            // Allowed subscription types as per User model ENUM
            const validTypes = [
                "basic",
                "standard",
                "booster",
                "regular",
                "job",
                "resume",
                "other_templates"
            ];
            if (!userId || !subscription_type) {
                console.log('Missing required fields:', { userId, subscription_type });
                res.status(400).json({
                    success: false,
                    message: "userId and subscription_type are required"
                });
                return;
            }
            console.log('Finding user with ID:', userId);
            const user = await user_model_1.default.findByPk(userId);
            if (!user) {
                console.log('User not found:', userId);
                res.status(404).json({
                    success: false,
                    message: "User not found"
                });
                return;
            }
            console.log('Current user subscription:', {
                current_subscription_type: user.subscription_type,
                current_subscription_type_2: user.subscription_type_2,
                original_subscription_type: subscription_type,
                mapped_subscription_type: actualSubscriptionType
            });
            // Update subscription types with the mapped value
            user.subscription_type = actualSubscriptionType;
            user.subscription_type_2 = actualSubscriptionType;
            user.is_premium = true;
            // Set expiry date
            const subscriptionExpiry = new Date();
            subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 30);
            user.subscription_expiry = subscriptionExpiry;
            // Set resource booleans based on the ACTUAL subscription type AND original serviceName
            if (actualSubscriptionType === "basic") {
                user.cold_mail = true;
                user.cover_letter = true;
                user.hr_mail = true;
                user.job = true;
            }
            else if (actualSubscriptionType === "standard" || actualSubscriptionType === "booster") {
                user.resume = true;
                user.referral = true;
                user.cold_mail = true;
                user.cover_letter = true;
                user.hr_mail = true;
                user.linkedin = true;
                user.cv = true;
                user.roadmaps = true;
                user.interview = true;
                user.job = true;
            }
            else if (actualSubscriptionType === "job") {
                user.job = true;
            }
            else if (actualSubscriptionType === "resume") {
                user.resume = true;
            }
            else if (actualSubscriptionType === "other_templates") {
                // For other_templates, set the specific resource boolean based on original subscription_type
                if (subscription_type === "referral") {
                    user.referral = true;
                }
                else if (subscription_type === "cold_mail") {
                    user.cold_mail = true;
                }
                else if (subscription_type === "cover_letter") {
                    user.cover_letter = true;
                }
                else if (subscription_type === "hr_mail") {
                    user.hr_mail = true;
                }
            }
            console.log('About to save user with:', {
                subscription_type: user.subscription_type,
                subscription_type_2: user.subscription_type_2,
                is_premium: user.is_premium,
                subscription_expiry: user.subscription_expiry
            });
            await user.save();
            console.log('User saved successfully');
            // Generate new JWT token
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
                subscription_type: user.subscription_type,
                subscription_type_2: user.subscription_type_2,
                phone_number: user.phone_number,
                is_premium: user.is_premium,
                // Add all resource booleans to the JWT token
                resume: user.resume,
                referral: user.referral,
                cold_mail: user.cold_mail,
                cover_letter: user.cover_letter,
                hr_mail: user.hr_mail,
                linkedin: user.linkedin,
                cv: user.cv,
                roadmaps: user.roadmaps,
                interview: user.interview,
                job: user.job,
            }, config_2.JWT_SECRET, {
                expiresIn: "7d",
            });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            console.log('=== /update route success ===');
            res.status(200).json({
                success: true,
                message: "Subscription updated successfully",
                user: {
                    id: user.id,
                    email: user.email,
                    subscription_type: user.subscription_type,
                    subscription_type_2: user.subscription_type_2,
                    is_premium: user.is_premium,
                    subscription_expiry: user.subscription_expiry
                }
            });
            return;
        }
        catch (err) {
            console.error('=== /update route error ===');
            console.error('Error details:', err);
            res.status(500).json({
                success: false,
                message: err.message || "Server error"
            });
            return;
        }
    });
    // Global error handler
    app.use((err, req, res, next) => {
        logger_1.default.error(`${err.message} - ${req.method} ${req.url}`);
        // Handle multer errors specifically
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(413).json({
                success: false,
                message: 'File size too large. Please upload files smaller than 10MB.',
            });
            return;
        }
        if (err.code === 'LIMIT_FIELD_VALUE') {
            res.status(413).json({
                success: false,
                message: 'Request entity too large. Please reduce the file size.',
            });
            return;
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            res.status(400).json({
                success: false,
                message: 'Unexpected file field. Please check your file upload.',
            });
            return;
        }
        res.status(err.status || 500).json({
            success: false,
            message: IS_PRODUCTION ? 'Internal Server Error' : err.message,
        });
    });
    // Start server
    app.listen(config_1.PORT, async () => {
        try {
            await db_1.default.authenticate(); // Test DB connection
            // await sequelize.sync({ force: false }); // Uncomment if schema sync is needed
            logger_1.default.info(`Worker ${process.pid} running on port ${config_1.PORT}`);
        }
        catch (err) {
            logger_1.default.error(`Database connection failed: ${err.message}`);
            process.exit(1);
        }
    });
}
