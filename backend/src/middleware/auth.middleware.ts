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
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email : string, subscription_type : string };
        console.log(decoded);
        req.user = { id: decoded.id, email : decoded.email, subscription_type : decoded.subscription_type};
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