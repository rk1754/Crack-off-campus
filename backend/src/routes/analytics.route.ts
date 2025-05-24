import express from "express";
import AnalyticsController from "../controllers/analytics.controller";
import adminMiddleware from "../middleware/admin.middleware";



const router = express.Router();
const analyticsController = new AnalyticsController();

router.get('/', adminMiddleware, analyticsController.dashboardOverview);

export default router;