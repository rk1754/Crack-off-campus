"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analytics_controller_1 = __importDefault(require("../controllers/analytics.controller"));
const router = express_1.default.Router();
const analyticsController = new analytics_controller_1.default();
router.get('/', analyticsController.dashboardOverview);
exports.default = router;
