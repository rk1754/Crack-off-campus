import express from "express";
import PaymentController from "../controllers/payment.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();
const paymentController = new PaymentController();
router.post('/create-order',authMiddleware, paymentController.createPaymentOrder);

router.post('/verify',authMiddleware, paymentController.verifyPaymentAPI);

router.post('/update-subscription', authMiddleware, paymentController.updateUserSubscription);

export default router;