import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";

const authMiddleware = async(req : Request, res : Response, next : NextFunction):Promise<void>=>{
    try{
        const token = req.cookies.token;
        if(!token){
            res.status(401).json({
                success : false,
                message : "Not authenticated"
            });
            return;
        }
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email : string, subscription_type : string, phone_number : string, subscription_type_2 : string, resume?: boolean, referral?: boolean, cold_mail?: boolean, cover_letter?: boolean, hr_mail?: boolean, linkedin?: boolean, cv?: boolean, roadmaps?: boolean, interview?: boolean, job?: boolean };
        console.log(decoded);
        req.user = { id: decoded.id, email : decoded.email, subscription_type : decoded.subscription_type, phone_number : decoded.phone_number, subscription_type_2 : decoded.subscription_type_2, resume: decoded.resume, referral: decoded.referral, cold_mail: decoded.cold_mail, cover_letter: decoded.cover_letter, hr_mail: decoded.hr_mail, linkedin: decoded.linkedin, cv: decoded.cv, roadmaps: decoded.roadmaps, interview: decoded.interview, job: decoded.job };
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({
            success : false,
            message : "Not authenticated"
        });
        return;
    }
}

export default authMiddleware;