import { Request, Response } from "express";
import User from "../models/user.model";
import Jobs from "../models/job.model";
import { Sequelize, Op } from "sequelize";

class AnalyticsController {
    dashboardOverview = async (req: Request, res: Response): Promise<void> => {
        try {
            // Total user count
            const userCount = await User.count();

            // Total job count
            const jobCount = await Jobs.count();

            // Total applications (assuming you have an Applications model, else set to 0)
            // Replace this with your actual applications count logic if needed
            let totalApplications = 0;
            // Example: totalApplications = await Applications.count();

            // Recent jobs (last 5)
            const recentJobs = await Jobs.findAll({
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
            const recentUsers = await User.findAll({
                order: [["createdAt", "DESC"]],
                limit: 5,
                attributes: ["id", "name", "email", "createdAt"],
                raw: true,
            });

            const recentUsersFormatted = recentUsers.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                joined_at: user.created_at, // Fix: use createdAt
            }));

            // Jobs by category (assuming you have a 'category' field, else group by employment_type)
            const jobsByCategoryRaw = await Jobs.findAll({
                attributes: [
                    [Sequelize.col("employment_type"), "category"],
                    [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
                ],
                group: ["employment_type"],
                raw: true,
            });

            const jobsByCategory: Record<string, number> = {};
            jobsByCategoryRaw.forEach((row: any) => {
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
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Something went wrong",
            });
        }
    };
}

export default AnalyticsController;



