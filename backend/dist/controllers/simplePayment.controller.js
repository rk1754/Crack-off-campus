"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleVerifyPayment = void 0;
const cashfree_1 = require("../config/cashfree");
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
            // Don't log the entire error object to avoid circular references
            console.error("❌ Cashfree API error:", cashfreeError.message);
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
        console.log("✅ Payment verified successfully!");
        res.json({
            success: true,
            message: "Payment verified successfully",
            service_name: serviceName,
            order_id: order_id,
            user_id: user.id
        });
    }
    catch (error) {
        // Avoid logging circular references
        console.error("❌ ERROR in payment verification:", error.message);
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message || "Unknown error"
        });
    }
};
exports.simpleVerifyPayment = simpleVerifyPayment;
