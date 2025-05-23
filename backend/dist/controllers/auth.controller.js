"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const config_1 = require("../config/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const mailer_1 = require("../utils/mailer");
class AuthController {
    constructor() {
        this.signup = async (req, res) => {
            const data = req.body;
            if (!data.email || !data.password || !data.phone_number) {
                res.status(400).json({
                    success: false,
                    message: "Please provide complete data to register",
                });
                return;
            }
            try {
                const hashedPassword = await bcrypt_1.default.hash(data.password, config_1.BCRYPT_SALT);
                data.password = hashedPassword;
                const user = await user_model_1.default.create({
                    ...data,
                    role: "user",
                    subscription_type: "regular",
                    provider: "manual",
                });
                const token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    subscription_type: user.subscription_type,
                }, config_1.JWT_SECRET, {
                    expiresIn: "2d",
                });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(201).json({
                    success: true,
                    user,
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
        this.login = async (req, res) => {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    message: "Please provide email and password",
                });
                return;
            }
            try {
                const user = await user_model_1.default.findOne({
                    where: {
                        email,
                    },
                });
                if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
                    res.status(401).json({
                        success: false,
                        message: "Invalid email or password",
                    });
                    return;
                }
                const token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    subscription_type: user.subscription_type,
                }, config_1.JWT_SECRET, {
                    expiresIn: "2d",
                });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(200).json({
                    success: true,
                    user,
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
        this.logout = (req, res) => {
            res.clearCookie("token");
            res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        };
        this.getCurrentUser = async (req, res) => {
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
                const user = await user_model_1.default.findByPk(decoded.id);
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: "User not found",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    user,
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
        this.findAllUser = async (req, res) => {
            try {
                const users = await user_model_1.default.findAll({
                    where: {
                        role: "user",
                    },
                });
                if (!users) {
                    res.status(404).json({
                        success: false,
                        message: "No users found",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    users,
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
        this.forgotPassword = async (req, res) => {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({
                    success: false,
                    message: "Please provide an email address",
                });
                return;
            }
            try {
                const user = await user_model_1.default.findOne({ where: { email } });
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: "User with this email does not exist",
                    });
                    return;
                }
                const resetToken = jsonwebtoken_1.default.sign({ id: user.id }, config_1.JWT_SECRET, {
                    expiresIn: "1h",
                });
                const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
                await mailer_1.transporter.sendMail({
                    from: process.env.SMTP_FROM_EMAIL,
                    to: user.email,
                    subject: "Password Reset Request",
                    html: `
                    <p>Hello ${user.name},</p>
                    <p>You requested to reset your password. Click the link below to reset it:</p>
                    <a href="${resetLink}">${resetLink}</a>
                    <p>If you did not request this, please ignore this email.</p>
                `,
                });
                res.status(200).json({
                    success: true,
                    message: "Password reset email sent successfully",
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong while sending the email",
                });
            }
        };
        this.resetPassword = async (req, res) => {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                res.status(400).json({
                    success: false,
                    message: "Token and new password are required",
                });
                return;
            }
            try {
                // Verify the token
                const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
                const user = await user_model_1.default.findByPk(decoded.id);
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: "Invalid or expired token",
                    });
                    return;
                }
                const hashedPassword = await bcrypt_1.default.hash(newPassword, config_1.BCRYPT_SALT);
                user.password = hashedPassword;
                await user.save();
                res.status(200).json({
                    success: true,
                    message: "Password reset successfully",
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong while resetting the password",
                });
            }
        };
        this.fetchMe = async (req, res) => {
            try {
                console.log(req.user);
                const user = await user_model_1.default.findByPk(req.user?.id);
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: "User not found",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    user,
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
        this.uploadProfileImage = async (req, res, next) => {
            console.log("Printing before try");
            try {
                console.log("Printing after try");
                if (!req.file) {
                    res.status(400).json({
                        message: "No file uploaded",
                    });
                    return;
                }
                const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
                const result = await cloudinary_1.default.uploader.upload(base64, {
                    folder: "job-portal/profiles",
                });
                const user = req.user;
                console.log(user);
                if (!user) {
                    res.status(403).json({
                        success: false,
                        message: "Please login first",
                    });
                    return;
                }
                await user_model_1.default.update({ profile_pic: result.secure_url }, {
                    where: {
                        id: user.id,
                    },
                });
                res.status(200).json({
                    imageUrl: result.secure_url,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    message: "Upload failed",
                });
            }
        };
        this.uploadCoverImage = async (req, res) => {
            try {
                if (!req.file) {
                    res.status(400).json({
                        success: false,
                        message: "No file uploaded",
                    });
                    return;
                }
                const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
                const result = await cloudinary_1.default.uploader.upload(base64, {
                    folder: "job-portal/covers",
                });
                const user = req.user;
                if (!user) {
                    res.status(403).json({
                        success: false,
                        message: "Please login first",
                    });
                    return;
                }
                await user_model_1.default.update({ cover_image: result.secure_url }, {
                    where: {
                        id: user.id,
                    },
                });
                res.status(200).json({
                    cover_image: result.secure_url,
                });
                return;
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Failed to upload cover page",
                });
            }
        };
        this.addSkills = async (req, res) => {
            try {
                const skills = req.body.skills;
                const user = req.user;
                if (!user) {
                    res.status(403).json({
                        success: false,
                        message: "Please login first",
                    });
                    return;
                }
                console.log(user);
                if (!skills || !Array.isArray(skills)) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide correct data",
                    });
                    return;
                }
                await user_model_1.default.update({ skills: skills }, {
                    where: {
                        id: user.id,
                    },
                });
                res.status(200).json({
                    success: true,
                    message: "Skills addded successfully",
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
        this.fetchUserById = async (req, res) => {
            try {
                const id = req.params.id;
                if (!id) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide id",
                    });
                    return;
                }
                const user = await user_model_1.default.findByPk(id);
                res.status(200).json({
                    success: true,
                    user,
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
        this.updateMe = async (req, res) => {
            try {
                const data = req.body;
                const user = await user_model_1.default.findByPk(req.user?.id);
                if (!user) {
                    res.status(404).json({ success: false, message: "User not found" });
                    return;
                }
                if (data.skills !== undefined && typeof data.skills === "string") {
                    try {
                        data.skills = JSON.parse(data.skills);
                    }
                    catch {
                        data.skills = data.skills
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                    }
                }
                if (req.files && req.files.profile_pic) {
                    const file = req.files.profile_pic[0];
                    const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
                    const result = await cloudinary_1.default.uploader.upload(base64, {
                        folder: "job-portal/profiles",
                    });
                    data.profile_pic = result.secure_url;
                }
                if (req.files && req.files.cover_image) {
                    const file = req.files.cover_image[0];
                    const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
                    const result = await cloudinary_1.default.uploader.upload(base64, {
                        folder: "job-portal/covers",
                    });
                    data.cover_image = result.secure_url;
                }
                await user.update(data);
                const updatedUser = await user_model_1.default.findByPk(user.id);
                res.status(200).json({ success: true, user: updatedUser });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ success: false, message: "Something went wrong" });
            }
        };
        this.setUserPremium = async (req, res) => {
            try {
                const user = req.user;
                if (!user) {
                    res.status(403).json({
                        success: false,
                        message: "Please login first",
                    });
                    return;
                }
                await user_model_1.default.update({
                    subscription_type: "booster",
                }, {
                    where: {
                        id: user.id
                    }
                });
                res.clearCookie("token");
                const token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    subscription_type: "booster",
                }, config_1.JWT_SECRET, {
                    expiresIn: "2d",
                });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(200).json({
                    success: true
                });
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
        this.deleteMe = async (req, res) => {
            try {
                await user_model_1.default.destroy({
                    where: { id: req.user?.id },
                });
                res.status(200).json({
                    success: true,
                    message: "User deleted successfully",
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
    }
}
exports.default = AuthController;
