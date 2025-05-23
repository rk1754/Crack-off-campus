"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const experience_model_1 = __importDefault(require("../models/experience.model"));
class ExperienceController {
    constructor() {
        this.addExperience = async (req, res) => {
            try {
                const { job_title, start_date, end_date, company_name, location, description, employment_type } = req.body;
                if (!job_title || !start_date || !end_date || !company_name || !location || !employment_type) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide all details"
                    });
                    return;
                }
                const user = req.user;
                if (!user) {
                    res.status(403).json({
                        success: false,
                        message: "Please login first"
                    });
                    return;
                }
                const experience = await experience_model_1.default.create({
                    job_title,
                    start_date,
                    user_id: user.id,
                    end_date,
                    company_name,
                    location,
                    description,
                    employment_type
                });
                if (!experience) {
                    res.status(500).json({
                        success: false,
                        message: "Failed to add experience"
                    });
                    return;
                }
                res.status(201).json({
                    success: true,
                    experience
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
        this.findExperienceByUser = async (req, res) => {
            try {
                const user = req.user;
                if (!user) {
                    res.status(403).json({
                        success: false,
                        message: "Please login first"
                    });
                    return;
                }
                const experience = await experience_model_1.default.findAll({
                    where: {
                        user_id: user.id
                    }
                });
                if (!experience) {
                    res.status(404).json({
                        success: false,
                        message: "Experience not found"
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    experience
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
        this.findExperienceById = async (req, res) => {
            try {
                const id = req.params.id;
                if (!id) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide ID"
                    });
                    return;
                }
                const experience = await experience_model_1.default.findByPk(id);
                if (!experience) {
                    res.status(404).json({
                        success: false,
                        message: "Experience not found"
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    experience
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
        this.updateExperience = async (req, res) => {
            try {
                const id = req.params.id;
                const data = req.body;
                if (!id) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide id to update experience"
                    });
                    return;
                }
                await experience_model_1.default.update(data, {
                    where: {
                        id: id
                    }
                });
                res.status(200).json({
                    success: true,
                    message: "Experience updated successfully"
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
        this.deleteExperience = async (req, res) => {
            try {
                const id = req.params.id;
                if (!id) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide ID"
                    });
                    return;
                }
                await experience_model_1.default.destroy({
                    where: {
                        id
                    }
                });
                res.status(200).json({
                    success: true,
                    message: "Experience deleted successfully"
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
    }
}
exports.default = ExperienceController;
