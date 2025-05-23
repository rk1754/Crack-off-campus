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
const new_resume_route_1 = __importDefault(require("./routes/new_resume.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:8080",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.get("/", (res) => {
    res.status(200).json({
        message: "Foundit API up and running",
    });
});
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/admin", admin_route_1.default);
app.use("/api/v1/education", education_route_1.default);
app.use("/api/v1/experience", experience_routes_1.default);
app.use("/api/v1/job", jobs_route_1.default);
app.use("/api/v1/analytics", analytics_route_1.default);
app.use("/api/v1/session", session_route_1.default);
app.use("/api/v1/session/booking", sessionBooking_route_1.default);
app.use("/api/v1/resume", resume_route_1.default);
app.use("/api/v1/payment", payment_routes_1.default);
app.use('/api/v2/resume', new_resume_route_1.default);
app.listen(config_1.PORT, async () => {
    // await sequelize.sync({force : true});
    console.log(`Server is running on port ${config_1.PORT}`);
});
