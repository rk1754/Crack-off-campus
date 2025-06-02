import express from "express";
import JobController from "../controllers/job.controller";
import adminMiddleware from "../middleware/admin.middleware";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();

const jobController = new JobController();


router.post('/new',adminMiddleware ,jobController.createJob);

router.get('/all', jobController.getAllJobs);

router.get('/all/admin', adminMiddleware, jobController.getAllJobsAdmin);

router.put('/update/:id',adminMiddleware, jobController.updateJob);

router.delete('/:id',adminMiddleware, jobController.deleteJob);

router.get('/by/id/:id',authMiddleware, jobController.findJobById);


export default router;