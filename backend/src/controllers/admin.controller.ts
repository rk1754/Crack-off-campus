import { Request, Response } from "express";
import Admin from "../models/admin.model";
import bcrypt from "bcrypt";
import { BCRYPT_SALT, JWT_SECRET } from "../config/config";
import jwt from "jsonwebtoken";

class AdminController {
    // Admin signup method
    signUp = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body;
            if (!data.email || !data.password || !data.name || !data.phone_number) {
                res.status(400).json({
                    success: false,
                    message: "Please provide all details",
                });
                return;
            }

            const hashed_password = await bcrypt.hash(data.password, BCRYPT_SALT);
            data.password = hashed_password;
            const admin = await Admin.create({
                ...data,
            });
            if (!admin) {
                res.status(500).json({
                    success: false,
                    message: "Something went wrong creating your profile",
                });
                return;
            }

            const token = jwt.sign(
                { id: admin.id, email: admin.email, is_admin:true },
                JWT_SECRET,
                {
                    expiresIn: "2d",
                }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(201).json({
                success: true,
                admin,
                token,
            });
            return;
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Something went wrong",
            });
            return;
        }
    };

    // Admin login method
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    message: "Please provide email and password",
                });
                return;
            }

            const admin = await Admin.findOne({ where: { email } });
            if (!admin || !(await bcrypt.compare(password, admin.password))) {
                res.status(401).json({
                    success: false,
                    message: "Invalid email or password",
                });
                return;
            }

            const token = jwt.sign(
                { id: admin.id, email: admin.email, is_admin: true },
                JWT_SECRET,
                {
                    expiresIn: "2d",
                }
            );
            req.admin = admin;
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                success: true,
                admin,
                token,
            });
            return;
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Something went wrong",
            });
            return;
        }
    };

    // Admin logout method
    logout = (req: Request, res: Response): void => {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    };

    // Get current admin method
    getCurrentAdmin = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.cookies.token;
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: "Not authenticated",
                });
                return;
            }

            const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
            const admin = await Admin.findByPk(decoded.id);

            if (!admin) {
                res.status(404).json({
                    success: false,
                    message: "Admin not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                admin,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Something went wrong",
            });
        }
    };

    updateMe = async(req : Request, res : Response):Promise<void> =>{
        try{
            const data = req.body;
            const admin = await Admin.findByPk(req.admin?.id);
            if(!admin){
                res.status(404).json({
                    success : false,
                    message : "Admin not found"
                });
                return;
            }
            await admin.update(data);

            res.status(200).json({
                success : true,
                admin
            });
            return;
        }catch(err){
            console.error(err);
            res.status(500).json({
                success : false,
                message : "Something went wrong"
            });
            return;
        }
    }

    deleteMe = async(req : Request, res : Response):Promise<void> =>{
        try{
            const id = req.admin?.id;
            if(!id){
                res.status(400).json({
                    success : false,
                    message : "Please provide ID"
                });
                return;
            }

            await Admin.destroy({
                where : {
                    id : id
                }
            });
        }catch(err){
            console.error(err);
            res.status(500).json({
                success : false,
                message : "Something went wrong"
            });
            return;
        }
    }
}

export default new AdminController;