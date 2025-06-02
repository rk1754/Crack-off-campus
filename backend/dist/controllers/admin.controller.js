"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_model_1 = __importDefault(require("../models/admin.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AdminController {
    constructor() {
        // Admin signup method
        this.signUp = async (req, res) => {
            try {
                const data = req.body;
                if (!data.email || !data.password || !data.name || !data.phone_number) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide all details",
                    });
                    return;
                }
                const hashed_password = await bcrypt_1.default.hash(data.password, config_1.BCRYPT_SALT);
                data.password = hashed_password;
                const admin = await admin_model_1.default.create({
                    ...data,
                });
                if (!admin) {
                    res.status(500).json({
                        success: false,
                        message: "Something went wrong creating your profile",
                    });
                    return;
                }
                const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, is_admin: true }, config_1.JWT_SECRET, {
                    expiresIn: "2d",
                });
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
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong",
                });
                return;
            }
        };
        // Admin login method
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide email and password",
                    });
                    return;
                }
                const admin = await admin_model_1.default.findOne({ where: { email } });
                if (!admin || !(await bcrypt_1.default.compare(password, admin.password))) {
                    res.status(401).json({
                        success: false,
                        message: "Invalid email or password",
                    });
                    return;
                }
                const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, is_admin: true }, config_1.JWT_SECRET, {
                    expiresIn: "2d",
                });
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
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong",
                });
                return;
            }
        };
        // Admin logout method
        this.logout = (req, res) => {
            res.clearCookie("token");
            res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        };
        // Get current admin method
        this.getCurrentAdmin = async (req, res) => {
            try {
                const token = req.cookies.token;
                if (!token) {
                    res.status(401).json({
                        success: false,
                        message: "Not authenticated",
                    });
                    return;
                }
                const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
                const admin = await admin_model_1.default.findByPk(decoded.id);
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
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong",
                });
            }
        };
        this.updateMe = async (req, res) => {
            try {
                const data = req.body;
                const admin = await admin_model_1.default.findByPk(req.admin?.id);
                if (!admin) {
                    res.status(404).json({
                        success: false,
                        message: "Admin not found"
                    });
                    return;
                }
                await admin.update(data);
                res.status(200).json({
                    success: true,
                    admin
                });
                return;
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
                return;
            }
        };
        this.deleteMe = async (req, res) => {
            try {
                const id = req.admin?.id;
                if (!id) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide ID"
                    });
                    return;
                }
                await admin_model_1.default.destroy({
                    where: {
                        id: id
                    }
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
                return;
            }
        };
    }
}
exports.default = new AdminController;
