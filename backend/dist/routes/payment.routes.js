"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = __importDefault(require("../controllers/payment.controller"));
const router = express_1.default.Router();
const paymentController = new payment_controller_1.default();
router.post('/create-order', paymentController.createPaymentOrder);
router.post('/verify', paymentController.verifyAndStorePayment);
exports.default = router;
