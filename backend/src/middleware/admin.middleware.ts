import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";

const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email : string, is_admin : boolean };

        if (!decoded.is_admin) {
            res.status(403).json({
                success: false,
                message: "Access denied. Admins only.",
            });
            return;
        }
        req.admin = { id: decoded.id, email : decoded.email};
        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
        next(err);
    }
};

export default adminMiddleware;