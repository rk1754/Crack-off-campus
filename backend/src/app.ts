import express, { Request, Response, NextFunction } from 'express';
import { FRONTEND_URL, FRONTEND_URL_2, FRONTEND_URL_3, PORT } from './config/config';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.route';
import educationRoutes from './routes/education.route';
import experienceRoutes from './routes/experience.routes';
import jobRoutes from './routes/jobs.route';
import analyticsRoutes from './routes/analytics.route';
import paymentRoutes from './routes/payment.routes';
import sessionRoutes from './routes/session.route';
import sessionBookingRoutes from './routes/sessionBooking.route';
import resumeRoutes from './routes/resume.route';
import resumeUploadRoutes from './routes/resumeUpload.route';
import new_resumeRoutes from './routes/new_resume.route';
import resourcesRoutes from './routes/resources.routes';
import gofileRoutes from './routes/gofile.route';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import sequelize from './config/db';
import { Op } from 'sequelize';
import logger from './utils/logger';
import cluster from 'cluster';
import os from 'os';
// Import User model for direct payment update route
import User from './models/user.model';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config/config';

// Cache environment variables
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      subscription_type: string;
      subscription_type_2: string;
      phone_number: string;
      resume?: boolean;
      referral?: boolean;
      cold_mail?: boolean;
      cover_letter?: boolean;
      hr_mail?: boolean;
      linkedin?: boolean;
      cv?: boolean;
      roadmaps?: boolean;
      interview?: boolean;
      job?: boolean;
    }

    interface Admin {
      id: string;
      email: string;
    }

    interface Request {
      user?: User;
      admin?: Admin;
    }
  }
}

const ALLOWED_ORIGINS = [FRONTEND_URL, FRONTEND_URL_2, FRONTEND_URL_3].filter(Boolean) as string[];
const NODE_ENV = process.env.NODE_ENV || 'production';
const IS_PRODUCTION = NODE_ENV === 'production';
const CPU_CORES = os.cpus().length;

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Cluster setup for load balancing
if (cluster.isPrimary && IS_PRODUCTION) {
  logger.info(`Primary process ${process.pid} is running`);

  // Fork workers for each CPU core
  for (let i = 0; i < CPU_CORES; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died with code ${code}, signal ${signal}. Restarting...`);
    cluster.fork();
  });
} else {
  const app = express();
  // Middleware  app.use(compression()); // Compress responses
  app.use(limiter); // Apply rate limiting
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '50mb' })); // Increased limit for file uploads
  app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Increased limit for file uploads
  app.use(cookieParser());

  // Security headers with helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", ...ALLOWED_ORIGINS],
        },
      },
    })
  );

  // Declare global Express types
  
  // Routes
  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      message: 'Foundit API up and running',
    });
  });

  // Test endpoint for file upload debugging
  app.post('/test-upload', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Upload endpoint is working',
      bodySize: JSON.stringify(req.body).length,
      headers: req.headers,
    });
  });
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/education', educationRoutes);
  app.use('/api/v1/experience', experienceRoutes);
  app.use('/api/v1/job', jobRoutes);
  app.use('/api/v1/analytics', analyticsRoutes);  app.use('/api/v1/session', sessionRoutes);
  app.use('/api/v1/session/booking', sessionBookingRoutes);  app.use('/api/v1/resume', resumeRoutes);
  app.use('/api/v1/resume-upload', resumeUploadRoutes);
  app.use('/api/v1/payment', paymentRoutes);
  app.use('/api/v1/gofile', gofileRoutes);
  app.use('/api/v1/new/resume', new_resumeRoutes);
  app.use('/api/v1/resources', resourcesRoutes);
  
  // Direct payment update route - accessible without auth
  app.post('/update', async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('=== /update route called ===');
      console.log('Request body:', req.body);
      console.log('Request headers:', req.headers);
        const { userId, subscription_type } = req.body;
      
      // Map individual resource names to valid subscription types
      const resourceToSubscriptionType: Record<string, string> = {
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
      const user = await User.findByPk(userId);
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
      } else if (actualSubscriptionType === "standard" || actualSubscriptionType === "booster") {
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
      } else if (actualSubscriptionType === "job") {
        user.job = true;
      } else if (actualSubscriptionType === "resume") {
        user.resume = true;
      } else if (actualSubscriptionType === "other_templates") {
        // For other_templates, set the specific resource boolean based on original subscription_type
        if (subscription_type === "referral") {
          user.referral = true;
        } else if (subscription_type === "cold_mail") {
          user.cold_mail = true;
        } else if (subscription_type === "cover_letter") {
          user.cover_letter = true;
        } else if (subscription_type === "hr_mail") {
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
      const token = jwt.sign(
        {
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
        },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      
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
    } catch (err: any) {
      console.error('=== /update route error ===');
      console.error('Error details:', err);
      res.status(500).json({ 
        success: false, 
        message: err.message || "Server error" 
      });
      return;
    }
  });
  
  // Subscription expiry check route - runs every 10 minutes automatically
  app.get('/check-subscription-expiry', async (req: Request, res: Response): Promise<void> => {
    try {
      const currentDate = new Date();
      console.log('=== Subscription expiry check started ===');
      console.log('Current date:', currentDate);      // Find all users whose subscription has expired
      const expiredUsers = await User.findAll({
        where: {
          subscription_expiry: {
            [Op.lt]: currentDate // Less than current date means expired
          },
          subscription_type: {
            [Op.ne]: 'regular' // Not equal to regular (already expired users)
          }
        }
      });

      console.log(`Found ${expiredUsers.length} users with expired subscriptions`);

      let updatedCount = 0;
      for (const user of expiredUsers) {
        console.log(`Updating user ${user.id} - Subscription expired on ${user.subscription_expiry}`);
        
        // Update subscription types to regular
        user.subscription_type = 'regular';
        user.subscription_type_2 = 'regular';
        user.is_premium = false;
        
        // Reset all premium features to false
        user.resume = false;
        user.referral = false;
        user.cold_mail = false;
        user.cover_letter = false;
        user.hr_mail = false;
        user.linkedin = false;
        user.cv = false;
        user.roadmaps = false;
        user.interview = false;
        user.job = false;

        await user.save();
        updatedCount++;
      }

      console.log(`Successfully updated ${updatedCount} expired subscriptions`);
      console.log('=== Subscription expiry check completed ===');

      res.status(200).json({
        success: true,
        message: `Successfully checked and updated ${updatedCount} expired subscriptions`,
        updatedCount,
        totalExpiredUsers: expiredUsers.length
      });

    } catch (error: any) {
      console.error('=== Subscription expiry check error ===');
      console.error('Error details:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error checking subscription expiry'
      });
    }
  });

  // Set up automatic subscription expiry check every 10 minutes
  setInterval(async () => {
    try {
      console.log('=== Automatic subscription expiry check triggered ===');
      const currentDate = new Date();
        // Find all users whose subscription has expired
      const expiredUsers = await User.findAll({
        where: {
          subscription_expiry: {
            [Op.lt]: currentDate
          },
          subscription_type: {
            [Op.ne]: 'regular'
          }
        }
      });

      if (expiredUsers.length > 0) {
        console.log(`Found ${expiredUsers.length} users with expired subscriptions - updating to regular`);
        
        let updatedCount = 0;
        for (const user of expiredUsers) {
          // Update subscription types to regular
          user.subscription_type = 'regular';
          user.subscription_type_2 = 'regular';
          user.is_premium = false;
          
          // Reset all premium features to false
          user.resume = false;
          user.referral = false;
          user.cold_mail = false;
          user.cover_letter = false;
          user.hr_mail = false;
          user.linkedin = false;
          user.cv = false;
          user.roadmaps = false;
          user.interview = false;
          user.job = false;

          await user.save();
          updatedCount++;
        }

        console.log(`Automatically updated ${updatedCount} expired subscriptions to regular`);
      } else {
        console.log('No expired subscriptions found during automatic check');
      }
    } catch (error: any) {
      console.error('Error in automatic subscription expiry check:', error);
    }
  }, 10 * 60 * 1000); // Run every 10 minutes (10 * 60 * 1000 milliseconds)
  
  // Global error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`${err.message} - ${req.method} ${req.url}`);
    
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
  app.listen(PORT, async () => {
    try {
      await sequelize.authenticate(); // Test DB connection
      // await sequelize.sync({ force: false }); // Uncomment if schema sync is needed
      logger.info(`Worker ${process.pid} running on port ${PORT}`);
    } catch (err:any) {
      logger.error(`Database connection failed: ${err.message}`);
      process.exit(1);
    }
  });
}