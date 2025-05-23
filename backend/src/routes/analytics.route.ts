import express from "express";
import AnalyticsController from "../controllers/analytics.controller";


const router = express.Router();
const analyticsController = new AnalyticsController();

router.get('/', analyticsController.dashboardOverview);

export default router;