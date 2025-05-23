"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const config_1 = require("../config/config");
const razorpay_1 = __importDefault(require("../config/razorpay"));
const user_model_1 = __importDefault(require("../models/user.model"));
class PaymentController {
    constructor() {
        this.createPaymentOrder = async (req, res) => {
            try {
                const { amount, currency = "INR" } = req.body;
                if (!amount) {
                    res.status(400).json({
                        success: false,
                        message: "Amount is required",
                    });
                    return;
                }
                const options = {
                    amount: amount, // Converted to paise
                    currency,
                    receipt: `receipt_${Date.now()}`,
                };
                const order = await razorpay_1.default.orders.create(options);
                res.status(201).json({
                    success: true,
                    order_id: order.id,
                    currency: currency,
                    amount: amount,
                });
                return;
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Problems occurring with payment, if amount is debited it will be sent back. \nThank You",
                });
                return;
            }
        };
        this.verifyAndStorePayment = async (req, res) => {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, user_id, } = req.body;
            try {
                const generatedSignature = crypto_1.default
                    .createHmac("sha256", config_1.RAZORPAY_KEY_SECRET)
                    .update(`${razorpay_order_id} | ${razorpay_payment_id}`)
                    .digest("hex");
                if (generatedSignature !== razorpay_signature) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid signature",
                    });
                    return;
                }
                // Premium User Logic
                const sub = {
                    199: "gold",
                    299: "gold_plus",
                    699: "diamond",
                    99: "job",
                };
                if (!(amount in sub)) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid Subscription amount",
                    });
                    return;
                }
                const subscriptionType = sub[amount];
                const payment = await transaction_model_1.default.create({
                    user_id,
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    amount,
                    currency,
                    captured: true,
                    status: "success",
                    method: "razorpay",
                });
                const user = req.user;
                const subscriptionExpiry = new Date();
                subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 30);
                await user_model_1.default.update({
                    subscription_type: subscriptionType,
                    subscription_expiry: subscriptionExpiry,
                    is_premium: true,
                }, {
                    where: {
                        id: user_id,
                    },
                });
                if (!payment) {
                    res.status(400).json({
                        success: false,
                        message: "Failed to capture payment",
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: "Payment success",
                    payment,
                });
                return;
            }
            catch (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong",
                    error: err,
                });
                return;
            }
        };
    }
}
exports.default = PaymentController;
