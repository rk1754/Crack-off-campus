"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const job_model_1 = __importDefault(require("../models/job.model"));
class JobController {
    constructor() {
        this.createJob = async (req, res) => {
            try {
                const data = req.body;
                if (!data.title ||
                    !data.description ||
                    !data.job_url ||
                    !data.company_name
                // ctc_stipend, passout_year, experience are optional
                ) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide title, description, job_url, and company_name to create a job",
                    });
                    return;
                }
                const job = await job_model_1.default.create({
                    ...data, // includes ctc_stipend, passout_year, experience if provided
                    admin_id: req.admin?.id,
                    status: data.status ? data.status : "open",
                });
                res.status(201).json({
                    success: true,
                    job,
                });
                return;
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong while creating job",
                });
                return;
            }
        };
        this.getAllJobs = async (req, res) => {
            try {
                const jobs = await job_model_1.default.findAll();
                if (!jobs || jobs.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "No jobs found",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    jobs,
                });
                return; // Added return
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong",
                });
                return; // Added return
            }
        };
        this.findJobById = async (req, res) => {
            try {
                const jobId = req.params.id;
                const job = await job_model_1.default.findOne({
                    where: {
                        id: jobId,
                    },
                });
                if (!job) {
                    res.status(404).json({
                        success: false,
                        message: "Job not found",
                    });
                    return;
                }
                if (job.subscription_type !== "free" && req.user?.subscription_type !== "booster" && req.user?.subscription_type !== "standard" && req.user?.subscription_type !== "job" && req.user?.subscription_type !== "basic") {
                    res.status(403).json({
                        success: false,
                        message: "You are not allowed to view this job",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    job,
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
        this.updateJob = async (req, res) => {
            try {
                const jobId = req.params.id;
                const data = req.body; // data will contain ctc_stipend, passout_year, experience etc.
                const job = await job_model_1.default.findOne({
                    where: {
                        id: jobId,
                        // admin_id: req.admin?.id, // Ensure only admin who created can update, or remove for general admin update
                    },
                });
                if (!job) {
                    res.status(404).json({
                        success: false,
                        message: "Job not found or you are not authorized to update it",
                    });
                    return;
                }
                // Remove undefined fields from data to prevent accidentally clearing them
                Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
                await job.update(data);
                res.status(200).json({
                    success: true,
                    job,
                });
                return;
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong while updating job",
                });
                return;
            }
        };
        this.deleteJob = async (req, res) => {
            try {
                const jobId = req.params.id;
                if (!jobId) {
                    res.status(400).json({
                        success: false,
                        message: "Please provide job id",
                    });
                    return;
                }
                await job_model_1.default.destroy({
                    where: { id: jobId },
                });
                res.status(200).json({
                    success: true,
                    message: "Job deleted successfully",
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
        this.getAllJobsAdmin = async (req, res) => {
            try {
                const jobs = await job_model_1.default.findAll();
                if (!jobs) {
                    res.status(404).json({
                        success: false,
                        message: "No jobs found",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    jobs,
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
    }
}
exports.default = JobController;
