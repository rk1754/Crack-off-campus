"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleVerifyPayment = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const cashfree_1 = require("../config/cashfree");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const simpleVerifyPayment = async (req, res) => {
    try {
        const { order_id, serviceName } = req.body;
        console.log("🚀 SIMPLE PAYMENT VERIFICATION STARTED:", { order_id, serviceName });
        // Basic validation
        if (!order_id || !serviceName) {
            res.status(400).json({
                success: false,
                message: "Order ID and service name are required",
            });
            return;
        }
        // Get user
        const user = req.user;
        if (!user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        // Verify payment with Cashfree (simplified) with proper error handling
        let orderDetails;
        try {
            orderDetails = await cashfree_1.cashfree.PGFetchOrder(order_id);
        }
        catch (cashfreeError) {
            console.error("❌ Cashfree API error:", {
                message: cashfreeError.message,
                status: cashfreeError.response?.status,
                statusText: cashfreeError.response?.statusText,
                data: cashfreeError.response?.data
            });
            res.status(500).json({
                success: false,
                message: "Cashfree order fetch failed",
                error: cashfreeError.message || "Failed to fetch order from Cashfree"
            });
            return;
        }
        if (!orderDetails || orderDetails.data?.order_status !== "PAID") {
            res.status(400).json({ success: false, message: "Order is not paid" });
            return;
        }
        console.log("✅ Payment verified, updating user...");
        // DIRECT DATABASE UPDATE - NO TRANSACTION, NO COMPLICATIONS
        const currentUser = await user_model_1.default.findByPk(user.id);
        if (!currentUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        console.log("📝 Current user state:", {
            subscription_type: currentUser.subscription_type,
            subscription_type_2: currentUser.subscription_type_2,
            is_premium: currentUser.is_premium
        });
        // SET VALUES DIRECTLY
        currentUser.subscription_type = serviceName;
        currentUser.subscription_type_2 = serviceName;
        currentUser.is_premium = true;
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);
        currentUser.subscription_expiry = expiry;
        // Set resource booleans based on serviceName
        if (serviceName === 'basic') {
            currentUser.cold_mail = true;
            currentUser.cover_letter = true;
            currentUser.hr_mail = true;
            currentUser.job = true;
        }
        else if (serviceName === 'standard' || serviceName === 'booster') {
            currentUser.resume = true;
            currentUser.referral = true;
            currentUser.cold_mail = true;
            currentUser.cover_letter = true;
            currentUser.hr_mail = true;
            currentUser.linkedin = true;
            currentUser.cv = true;
            currentUser.roadmaps = true;
            currentUser.interview = true;
            currentUser.job = true;
        }
        console.log("💾 About to save user with:", {
            subscription_type: currentUser.subscription_type,
            subscription_type_2: currentUser.subscription_type_2,
            is_premium: currentUser.is_premium
        });
        // SAVE DIRECTLY
        await currentUser.save();
        console.log("✅ User saved successfully!");
        // Verify the save worked
        const verifyUser = await user_model_1.default.findByPk(user.id);
        console.log("🔍 Verification after save:", {
            subscription_type: verifyUser?.subscription_type,
            subscription_type_2: verifyUser?.subscription_type_2,
            is_premium: verifyUser?.is_premium
        });
        // Create simple JWT token
        const token = jsonwebtoken_1.default.sign({
            id: verifyUser.id,
            email: verifyUser.email,
            subscription_type: verifyUser.subscription_type,
            subscription_type_2: verifyUser.subscription_type_2,
            is_premium: verifyUser.is_premium,
            subscription_expiry: verifyUser.subscription_expiry,
            phone_number: verifyUser.phone_number,
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        console.log("🎉 PAYMENT VERIFICATION COMPLETED SUCCESSFULLY!");
        res.json({
            success: true,
            message: "Payment verified and service updated",
            service_name: serviceName,
            subscription_expiry: verifyUser?.subscription_expiry,
        });
    }
    catch (error) {
        console.error("❌ ERROR in payment verification:", {
            message: error.message,
            name: error.name,
            stack: error.stack,
            response: error.response ? {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            } : undefined
        });
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message || "Unknown error",
            name: error.name,
            stack: error.stack
        });
    }
};
exports.simpleVerifyPayment = simpleVerifyPayment;
