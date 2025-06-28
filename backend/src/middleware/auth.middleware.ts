import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";

const authMiddleware = async(req : Request, res : Response, next : NextFunction):Promise<void>=>{
    try{
        console.log("=== AUTH MIDDLEWARE DEBUG ===");
        console.log("Cookies:", req.cookies);
        console.log("Headers:", req.headers);
        console.log("=== END AUTH DEBUG ===");
        
        const token = req.cookies.token;
        if(!token){
            console.error("Authentication failed: No token provided in cookies");
            res.status(401).json({
                success : false,
                message : "Please login again",
                error: "AUTH_TOKEN_MISSING"
            });
            return;
        }
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email : string, subscription_type : string, phone_number : string, subscription_type_2 : string, resume?: boolean, referral?: boolean, cold_mail?: boolean, cover_letter?: boolean, hr_mail?: boolean, linkedin?: boolean, cv?: boolean, roadmaps?: boolean, interview?: boolean, job?: boolean };
        console.log("JWT decoded successfully:", decoded);
        req.user = { id: decoded.id, email : decoded.email, subscription_type : decoded.subscription_type, phone_number : decoded.phone_number, subscription_type_2 : decoded.subscription_type_2, resume: decoded.resume, referral: decoded.referral, cold_mail: decoded.cold_mail, cover_letter: decoded.cover_letter, hr_mail: decoded.hr_mail, linkedin: decoded.linkedin, cv: decoded.cv, roadmaps: decoded.roadmaps, interview: decoded.interview, job: decoded.job };
        next();
    }catch(err: any){
        console.error("Authentication error:", err);
        res.status(401).json({
            success : false,
            message : "Not authenticated - Invalid or expired token",
            error: "AUTH_TOKEN_INVALID",
            details: process.env.NODE_ENV === "development" ? err.message : undefined
        });
        return;
    }
}

export default authMiddleware;