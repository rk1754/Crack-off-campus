"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        console.log(decoded);
        req.user = { id: decoded.id, email: decoded.email, subscription_type: decoded.subscription_type };
        next();
    }
    catch (err) {
        console.error(err);
        res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
        return;
    }
};
exports.default = authMiddleware;
