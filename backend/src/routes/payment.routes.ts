import express from "express";
import PaymentController from "../controllers/payment.controller";
import { simpleVerifyPayment } from "../controllers/simplePayment.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();
const paymentController = new PaymentController();
router.post('/create-order',authMiddleware, paymentController.createPaymentOrder);

// Use the simple verify payment function instead
router.post('/verify',authMiddleware, simpleVerifyPayment);

router.post('/update-subscription', authMiddleware, paymentController.updateUserSubscription);

export default router;