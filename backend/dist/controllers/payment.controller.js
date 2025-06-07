"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const cashfree_1 = require("../config/cashfree");
const user_model_1 = __importDefault(require("../models/user.model"));
const logger_1 = __importDefault(require("../utils/logger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const db_1 = __importDefault(require("../config/db"));
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
                const user = req.user;
                if (!user) {
                    res.status(401).json({
                        success: false,
                        message: "Unauthorized user",
                    });
                    return;
                }
                const orderPayload = {
                    order_amount: amount,
                    order_currency: currency,
                    customer_details: {
                        customer_id: `user_${user.id || Date.now()}`,
                        customer_email: user.email || "test@example.com",
                        customer_phone: user.phone_number,
                    },
                    order_id: `order_${Date.now()}`,
                };
                const order = await cashfree_1.cashfree.PGCreateOrder(orderPayload);
                logger_1.default.info("Order created:", order.data);
                res.status(201).json({
                    success: true,
                    order_id: orderPayload.order_id,
                    payment_session_id: order.data.payment_session_id,
                    redirect_url: `https://payments.cashfree.com/pg/checkout?payment_session_id=${order.data.payment_session_id}`,
                });
                return;
            }
            catch (err) {
                console.error(err);
                logger_1.default.error("Error creating payment order:", err);
                res.status(500).json({
                    success: false,
                    message: "Problems occurring with payment, if amount is debited it will be sent back. \nThank You",
                });
                return;
            }
        };
        this.verifyPaymentAPI = async (req, res) => {
            try {
                logger_1.default.info("/payment/verify called", { body: req.body, user: req.user });
                const { order_id } = req.body;
                if (!order_id) {
                    logger_1.default.warn("order_id missing in /payment/verify", { body: req.body });
                    res.status(400).json({ success: false, message: "order_id is required" });
                    return;
                }
                // Fetch order details from Cashfree
                const orderDetails = await cashfree_1.cashfree.PGFetchOrder(order_id);
                logger_1.default.info("Cashfree order details", { order_id, orderDetails });
                if (!orderDetails || orderDetails.data.order_status !== "PAID") {
                    logger_1.default.warn("Order not paid", { order_id, orderDetails });
                    res.status(400).json({ success: false, message: "Payment not verified" });
                    return;
                }
                // Fetch payment details to get cf_payment_id
                const paymentDetails = await cashfree_1.cashfree.PGOrderFetchPayments(order_id);
                logger_1.default.info("Cashfree payment details", { order_id, paymentDetails });
                const successfulPayment = paymentDetails.data.find((payment) => payment.payment_status === "SUCCESS");
                if (!successfulPayment) {
                    logger_1.default.warn("No successful payment found", { order_id, paymentDetails });
                    res.status(400).json({ success: false, message: "No successful payment found" });
                    return;
                }
                // Get user from token/session
                const user = req.user;
                if (!user) {
                    logger_1.default.warn("Unauthorized user in /payment/verify", { user });
                    res.status(401).json({ success: false, message: "Unauthorized" });
                    return;
                }
                logger_1.default.info("User found for payment verification", { user_id: user.id });
                // Map amount to subscription type
                const subscriptionMap = {
                    1: "basic",
                    2: "standard",
                    3: "booster",
                    99: "job",
                    79: "resume",
                    49: "other_templates"
                };
                const subscriptionType = subscriptionMap[orderDetails.data.order_amount];
                if (!subscriptionType) {
                    logger_1.default.warn("Invalid subscription amount", { order_id, amount: orderDetails.data.order_amount });
                    res.status(400).json({ success: false, message: "Invalid subscription amount" });
                    return;
                }
                const subscriptionExpiry = new Date();
                subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 30);
                const u = await user_model_1.default.findByPk(user.id);
                if (!u) {
                    res.status(500).json({ success: false, message: "User not found" });
                    return;
                }
                if (u.subscription_type !== "regular") {
                    await db_1.default.transaction(async (t) => {
                        await user_model_1.default.update({
                            subscription_type_2: subscriptionType,
                            subscription_expiry: subscriptionExpiry,
                            is_premium: true,
                        }, { where: { id: user.id }, transaction: t });
                        await transaction_model_1.default.create({
                            user_id: user.id,
                            cf_order_id: order_id,
                            cf_payment_id: successfulPayment.cf_payment_id || "unknown",
                            amount: String(orderDetails.data.order_amount),
                            currency: orderDetails.data.order_currency,
                            captured: true,
                            status: "success",
                            method: "cashfree",
                            // Add dummy values for required Razorpay fields to avoid NOT NULL error
                            razorpay_order_id: "cashfree_dummy_order",
                            razorpay_payment_id: "cashfree_dummy_payment",
                            razorpay_signature: "cashfree_dummy_signature",
                        }, { transaction: t });
                    });
                }
                // Update user subscription and store transaction atomically
                else {
                    await db_1.default.transaction(async (t) => {
                        await user_model_1.default.update({
                            subscription_type: subscriptionType,
                            subscription_expiry: subscriptionExpiry,
                            is_premium: true,
                        }, { where: { id: user.id }, transaction: t });
                        await transaction_model_1.default.create({
                            user_id: user.id,
                            cf_order_id: order_id,
                            cf_payment_id: successfulPayment.cf_payment_id || "unknown",
                            amount: String(orderDetails.data.order_amount),
                            currency: orderDetails.data.order_currency,
                            captured: true,
                            status: "success",
                            method: "cashfree",
                            // Add dummy values for required Razorpay fields to avoid NOT NULL error
                            razorpay_order_id: "cashfree_dummy_order",
                            razorpay_payment_id: "cashfree_dummy_payment",
                            razorpay_signature: "cashfree_dummy_signature",
                        }, { transaction: t });
                    });
                }
                const us = await user_model_1.default.findByPk(user.id);
                if (!us) {
                    res.status(500).json({ success: false, message: "User not found" });
                    return;
                }
                // Update JWT token
                const token = jsonwebtoken_1.default.sign({
                    id: us.id,
                    email: us.email,
                    subscription_type: us.subscription_type,
                    subscription_type_2: us.subscription_type_2,
                    phone_number: us.phone_number,
                }, config_1.JWT_SECRET, { expiresIn: "2d" });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                logger_1.default.info("Payment verified and subscription updated", { user_id: user.id, subscriptionType, order_id });
                res.status(200).json({
                    success: true,
                    message: "Payment verified and subscription updated",
                    subscription_type: subscriptionType,
                    subscription_expiry: subscriptionExpiry,
                });
            }
            catch (err) {
                logger_1.default.error("Payment verification error in /payment/verify", { error: err, body: req.body, user: req.user });
                console.error("Payment verification error:", err);
                res.status(500).json({
                    success: false,
                    message: err.message || "Server error",
                });
            }
        };
        this.verifyAndStorePayment = async (req, res) => {
            const { cf_order_id, cf_payment_id, amount, currency, user_id } = req.body;
            try {
                const paymentDetails = await cashfree_1.cashfree.PGOrderFetchPayment(cf_order_id, cf_payment_id);
                if (!paymentDetails || paymentDetails.data.payment_status !== "SUCCESS") {
                    res.status(400).json({
                        success: false,
                        message: "Payment not successful or not found",
                    });
                    return;
                }
                const sub = {
                    1: "basic",
                    1: "standard",
                    3: "booster",
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
                    cf_order_id,
                    cf_payment_id,
                    amount: amount.toString(),
                    currency,
                    captured: true,
                    status: "success",
                    method: "cashfree",
                });
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
                logger_1.default.info("Payment verified and stored:", payment);
                res.status(200).json({
                    success: true,
                    message: "Payment success",
                    payment,
                });
                return;
            }
            catch (err) {
                logger_1.default.error("Error verifying and storing payment:", err);
                console.error(err);
                res.status(500).json({
                    success: false,
                    message: "Something went wrong",
                    error: err,
                });
                return;
            }
        };
        this.updateUserSubscription = async (req, res) => {
            try {
                const { userId, subscription_type, order_id } = req.body;
                if (!userId || !subscription_type || !order_id) {
                    res.status(400).json({
                        success: false,
                        message: "userId, subscription_type, and order_id are required",
                    });
                    return;
                }
                const validTypes = [
                    "basic",
                    "standard",
                    "booster",
                    "regular",
                    "job",
                    "resume",
                    "other_templates",
                ];
                if (!validTypes.includes(subscription_type)) {
                    res.status(400).json({
                        success: false,
                        message: `Invalid subscription_type. Must be one of: ${validTypes.join(", ")}`,
                    });
                    return;
                }
                const orderDetails = await cashfree_1.cashfree.PGFetchOrder(order_id);
                if (!orderDetails || orderDetails.data.order_status !== "PAID") {
                    res.status(400).json({
                        success: false,
                        message: "Payment not verified",
                    });
                    return;
                }
                const subscriptionExpiry = new Date();
                subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 30);
                await user_model_1.default.update({
                    subscription_type,
                    subscription_expiry: subscriptionExpiry,
                    is_premium: true,
                }, { where: { id: userId } });
                const user = await user_model_1.default.findByPk(userId);
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: "User not found",
                    });
                    return;
                }
                res.clearCookie("token");
                const token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    subscription_type: user.subscription_type,
                    phone_number: user.phone_number,
                }, config_1.JWT_SECRET, {
                    expiresIn: "2d",
                });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(200).json({
                    success: true,
                    message: "Subscription updated successfully",
                });
            }
            catch (err) {
                console.error("Subscription update error:", err);
                logger_1.default.error("Subscription update error:", err);
                res.status(500).json({
                    success: false,
                    message: "Failed to update subscription",
                    error: err.message,
                });
            }
        };
        this.verifyPayment = async (req, res) => {
            try {
                const { order_id } = req.query;
                if (!order_id) {
                    return res.redirect("/jobs?payment=error&message=order_id_missing");
                }
                // Fetch order details from Cashfree
                const orderDetails = await cashfree_1.cashfree.PGFetchOrder(order_id);
                if (!orderDetails || orderDetails.data.order_status !== "PAID") {
                    return res.redirect("/jobs?payment=failed");
                }
                // Fetch payment details to get cf_payment_id
                const paymentDetails = await cashfree_1.cashfree.PGOrderFetchPayments(order_id);
                const successfulPayment = paymentDetails.data.find((payment) => payment.payment_status === "SUCCESS");
                if (!successfulPayment) {
                    return res.redirect("/jobs?payment=failed");
                }
                const user = req.user;
                if (!user) {
                    return res.redirect("/jobs?payment=error&message=unauthorized");
                }
                // Map amount to subscription type
                const subscriptionMap = {
                    1: "gold",
                    2: "gold_plus",
                    3: "diamond",
                    99: "job",
                };
                const subscriptionType = subscriptionMap[orderDetails.data.order_amount];
                if (!subscriptionType) {
                    return res.redirect("/jobs?payment=error&message=invalid_amount");
                }
                const subscriptionExpiry = new Date();
                subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 30);
                // Update user subscription and store transaction atomically
                await db_1.default.transaction(async (t) => {
                    await user_model_1.default.update({
                        subscription_type: subscriptionType,
                        subscription_expiry: subscriptionExpiry,
                        is_premium: true,
                    }, { where: { id: user.id }, transaction: t });
                    await transaction_model_1.default.create({
                        user_id: user.id,
                        cf_order_id: order_id,
                        cf_payment_id: successfulPayment.cf_payment_id || "unknown",
                        amount: orderDetails.data.order_amount?.toString() || "0",
                        currency: orderDetails.data.order_currency,
                        captured: true,
                        status: "success",
                        method: "cashfree",
                    }, { transaction: t });
                });
                // Update JWT token
                const token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    subscription_type: subscriptionType,
                    phone_number: user.phone_number,
                }, config_1.JWT_SECRET, { expiresIn: "2d" });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.redirect("/jobs?payment=success");
            }
            catch (err) {
                console.error("Payment verification error:", err);
                logger_1.default.error("Payment verification error:", err);
                res.redirect(`/jobs?payment=error&message=${encodeURIComponent(err.message || "server_error")}`);
            }
        };
    }
}
exports.default = PaymentController;
