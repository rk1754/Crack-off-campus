import express from "express";
import PaymentController from "../controllers/payment.controller";
import { simpleVerifyPayment } from "../controllers/simplePayment.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();
const paymentController = new PaymentController();

// Create order route
router.post('/create-order', authMiddleware, paymentController.createPaymentOrder);

// Simple verify payment route - only verifies payment, doesn't update subscription
router.post('/verify', authMiddleware, simpleVerifyPayment);

// GET route for payment verification (used by Cashfree returnUrl)
router.get('/verify', authMiddleware, paymentController.verifyPayment);

// Subscription update route - separate route for updating subscription after payment verification
router.post('/update', authMiddleware, paymentController.updateUserSubscription);

// Disabled routes (use simple approach instead)
// router.post('/verify-and-store', authMiddleware, paymentController.verifyAndStorePayment);

export default router;