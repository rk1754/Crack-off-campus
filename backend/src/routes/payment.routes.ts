import express from "express";
import PaymentController from "../controllers/payment.controller";
import { simpleVerifyPayment } from "../controllers/simplePayment.controller";
import authMiddleware from "../middleware/auth.middleware";
import { updateUserSubscriptionSimple } from "../controllers/payment.controller";

const router = express.Router();
const paymentController = new PaymentController();
router.post('/create-order',authMiddleware, paymentController.createPaymentOrder);

// Use the simple verify payment function instead
router.post('/verify',authMiddleware, simpleVerifyPayment);

// Commenting out the update-subscription and verify-and-store routes
// router.post('/update-subscription', authMiddleware, paymentController.updateUserSubscription);
// router.post('/verify-and-store', authMiddleware, paymentController.verifyAndStorePayment);

// Add a simple subscription update endpoint (no auth)
router.post('/update-subscription-simple', updateUserSubscriptionSimple);

export default router;