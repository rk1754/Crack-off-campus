import { Request, Response } from "express";
import Transactions from "../models/transaction.model";
import { cashfree } from "../config/cashfree";
import User from "../models/user.model";
import { PaymentRequestBody, SubscriptionMap } from "../types/payment.types";
import logger from "../utils/logger";

class PaymentController {
  createPaymentOrder = async (req: Request, res: Response): Promise<void> => {
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
      if(!user){
        res.status(401).json({
          success: false,
          message: "Unauthorized user",
        });
        return;
      }
      // Cashfree order creation
      const orderPayload = {
        order_amount: amount, // <-- FIXED: do NOT divide by 100
        order_currency: currency,
        customer_details: {
          customer_id: `user_${user.id || Date.now()}`,
          customer_email: user.email || "test@example.com",
          customer_phone: user.phone_number,
        },
        order_id: `order_${Date.now()}`,
      };
      const order = await cashfree.PGCreateOrder(orderPayload);
      console.log("Order created:");
      logger.info("Order created:", order.data);
res.status(201).json({
  success: true,
  order_id: orderPayload.order_id,
  payment_session_id: order.data.payment_session_id,
  redirect_url: `https://payments.cashfree.com/pg/checkout?payment_session_id=${order.data.payment_session_id}`,
});
      return;
    } catch (err) {
      console.error(err);
      logger.error("Error creating payment order:", err);
      res.status(500).json({
        success: false,
        message:
          "Problems occurring with payment, if amount is debited it will be sent back. \nThank You",
      });
      return;
    }
  };

  verifyAndStorePayment = async (
    req: Request<{}, {}, PaymentRequestBody>,
    res: Response
  ): Promise<void> => {
    const {
      cf_order_id,
      cf_payment_id,
      amount,
      currency,
      user_id,
    } = req.body;
    try {
      // Verify payment status from Cashfree
      const paymentDetails = await cashfree.PGOrderFetchPayment(cf_order_id!, cf_payment_id! );
      if (!paymentDetails || paymentDetails.data.payment_status !== "SUCCESS") {
        res.status(400).json({
          success: false,
          message: "Payment not successful or not found",
        });
        return;
      }
      // Premium User Logic
      const sub: SubscriptionMap = {
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
      const payment = await Transactions.create({
        user_id,
        cf_order_id,
        cf_payment_id,
        amount,
        currency,
        captured: true,
        status: "success",
        method: "cashfree",
      });
      const subscriptionExpiry = new Date();
      subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 30);
      await User.update(
        {
          subscription_type: subscriptionType,
          subscription_expiry: subscriptionExpiry,
          is_premium: true,
        },
        {
          where: {
            id: user_id,
          },
        }
      );
      if (!payment) {
        res.status(400).json({
          success: false,
          message: "Failed to capture payment",
        });
        return;
      }
      logger.info("Payment verified and stored:", payment);
      res.status(200).json({
        success: true,
        message: "Payment success",
        payment,
      });
      return;
    } catch (err) {
      logger.error("Error verifying and storing payment:", err);
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: err,
      });
      return;
    }
  };

  updateUserSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, subscription_type, order_id } = req.body;
      if (!userId || !subscription_type) {
        res.status(400).json({
          success: false,
          message: "userId and subscription_type are required",
        });
        return;
      }
      // Set expiry to 30 days from now
      const subscriptionExpiry = new Date();
      subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 30);
      await User.update(
        {
          subscription_type,
          subscription_expiry: subscriptionExpiry,
          is_premium: true,
        },
        { where: { id: userId } }
      );
      res.status(200).json({
        success: true,
        message: "Subscription updated successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Failed to update subscription",
        error: err,
      });
    }
  };
}

export default PaymentController;
