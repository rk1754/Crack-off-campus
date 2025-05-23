import express from "express";
import PaymentController from "../controllers/payment.controller";

const router = express.Router();
const paymentController = new PaymentController();
router.post('/create-order', paymentController.createPaymentOrder);

router.post('/verify', paymentController.verifyAndStorePayment);

export default router;