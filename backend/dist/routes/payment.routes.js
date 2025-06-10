"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = __importDefault(require("../controllers/payment.controller"));
const simplePayment_controller_1 = require("../controllers/simplePayment.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
const paymentController = new payment_controller_1.default();
router.post('/create-order', auth_middleware_1.default, paymentController.createPaymentOrder);
// Use the simple verify payment function instead
router.post('/verify', auth_middleware_1.default, simplePayment_controller_1.simpleVerifyPayment);
// Commenting out the update-subscription and verify-and-store routes
// router.post('/update-subscription', authMiddleware, paymentController.updateUserSubscription);
// router.post('/verify-and-store', authMiddleware, paymentController.verifyAndStorePayment);
// Add a simple subscription update endpoint (no auth)
exports.default = router;
