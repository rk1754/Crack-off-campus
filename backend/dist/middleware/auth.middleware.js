"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const authMiddleware = async (req, res, next) => {
    try {
        console.log("=== AUTH MIDDLEWARE DEBUG ===");
        console.log("Cookies:", req.cookies);
        console.log("Headers:", req.headers);
        console.log("=== END AUTH DEBUG ===");
        const token = req.cookies.token;
        if (!token) {
            console.error("Authentication failed: No token provided in cookies");
            res.status(401).json({
                success: false,
                message: "Not authenticated - No token provided in cookies",
                error: "AUTH_TOKEN_MISSING"
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        console.log("JWT decoded successfully:", decoded);
        req.user = { id: decoded.id, email: decoded.email, subscription_type: decoded.subscription_type, phone_number: decoded.phone_number, subscription_type_2: decoded.subscription_type_2, resume: decoded.resume, referral: decoded.referral, cold_mail: decoded.cold_mail, cover_letter: decoded.cover_letter, hr_mail: decoded.hr_mail, linkedin: decoded.linkedin, cv: decoded.cv, roadmaps: decoded.roadmaps, interview: decoded.interview, job: decoded.job };
        next();
    }
    catch (err) {
        console.error("Authentication error:", err);
        res.status(401).json({
            success: false,
            message: "Not authenticated - Invalid or expired token",
            error: "AUTH_TOKEN_INVALID",
            details: process.env.NODE_ENV === "development" ? err.message : undefined
        });
        return;
    }
};
exports.default = authMiddleware;
