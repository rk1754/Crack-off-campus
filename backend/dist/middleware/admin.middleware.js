"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const adminMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (!decoded.is_admin) {
            res.status(403).json({
                success: false,
                message: "Access denied. Admins only.",
            });
            return;
        }
        req.admin = { id: decoded.id, email: decoded.email };
        next();
    }
    catch (err) {
        console.error(err);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};
exports.default = adminMiddleware;
