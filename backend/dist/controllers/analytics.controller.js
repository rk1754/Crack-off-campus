"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const job_model_1 = __importDefault(require("../models/job.model"));
const sequelize_1 = require("sequelize");
class AnalyticsController {
    constructor() {
        this.dashboardOverview = async (req, res) => {
            try {
                // Total user count
                const userCount = await user_model_1.default.count();
                // Total job count
                const jobCount = await job_model_1.default.count();
                // Total applications (assuming you have an Applications model, else set to 0)
                // Replace this with your actual applications count logic if needed
                let totalApplications = 0;
                // Example: totalApplications = await Applications.count();
                // Recent jobs (last 5)
                const recentJobs = await job_model_1.default.findAll({
                    order: [["posted_at", "DESC"]],
                    limit: 5,
                    attributes: ["id", "title", "company_name", "posted_at"],
                    raw: true,
                });
                // Add applications count to each job (set to 0 if not available)
                const recentJobsWithApplications = recentJobs.map((job) => ({
                    id: job.id,
                    title: job.title,
                    company: job.company_name,
                    posted_at: job.posted_at,
                    applications: 0, // Replace with actual count if available
                }));
                // Recent users (last 5)
                const recentUsers = await user_model_1.default.findAll({
                    order: [["createdAt", "DESC"]],
                    limit: 5,
                    attributes: ["id", "name", "email", "createdAt"],
                    raw: true,
                });
                const recentUsersFormatted = recentUsers.map((user) => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    joined_at: user.created_at,
                }));
                // Jobs by category (assuming you have a 'category' field, else group by employment_type)
                const jobsByCategoryRaw = await job_model_1.default.findAll({
                    attributes: [
                        [sequelize_1.Sequelize.col("employment_type"), "category"],
                        [sequelize_1.Sequelize.fn("COUNT", sequelize_1.Sequelize.col("id")), "count"],
                    ],
                    group: ["employment_type"],
                    raw: true,
                });
                const jobsByCategory = {};
                jobsByCategoryRaw.forEach((row) => {
                    jobsByCategory[row.category || "Other"] = parseInt(row.count, 10);
                });
                // Applications by date (mocked, replace with real data if available)
                const applicationsByDate = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    return {
                        date: date.toISOString().split("T")[0],
                        count: Math.floor(Math.random() * 50) + 10,
                    };
                }).reverse();
                res.status(200).json({
                    totalUsers: userCount,
                    totalJobs: jobCount,
                    totalApplications,
                    recentJobs: recentJobsWithApplications,
                    recentUsers: recentUsersFormatted,
                    jobsByCategory,
                    applicationsByDate,
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
    }
}
exports.default = AnalyticsController;
