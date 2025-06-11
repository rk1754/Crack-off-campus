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
// Create order route
router.post('/create-order', auth_middleware_1.default, paymentController.createPaymentOrder);
// Simple verify payment route - only verifies payment, doesn't update subscription
router.post('/verify', auth_middleware_1.default, simplePayment_controller_1.simpleVerifyPayment);
// GET route for payment verification (used by Cashfree returnUrl)
router.post('/verifyresources', auth_middleware_1.default, paymentController.verifyPaymentAPI);
// Subscription update route - separate route for updating subscription after payment verification
router.post('/update', auth_middleware_1.default, paymentController.updateUserSubscription);
// Disabled routes (use simple approach instead)
// router.post('/verify-and-store', authMiddleware, paymentController.verifyAndStorePayment);
exports.default = router;
