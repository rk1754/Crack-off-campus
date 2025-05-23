import { Request, Response } from "express";
import crypto from "crypto";
import Transactions from "../models/transaction.model";
import { RAZORPAY_KEY_SECRET } from "../config/config";
import razorpay from "../config/razorpay";
import User from "../models/user.model";
import { PaymentRequestBody, SubscriptionMap } from "../types/payment.types";

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
      const options = {
        amount: amount, // Converted to paise
        currency,
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.status(201).json({
        success: true,
        order_id: order.id,
        currency: currency,
        amount: amount,
      });
      return;
    } catch (err) {
      console.error(err);
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
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
      user_id,
    } = req.body;
    try {
      const generatedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
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
      res.status(200).json({
        success: true,
        message: "Payment success",
        payment,
      });
      return;
    } catch (err) {
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

export default PaymentController;
