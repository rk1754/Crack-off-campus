import { Request, Response } from "express";
import Transactions from "../models/transaction.model";
import { cashfree } from "../config/cashfree";
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
      // Cashfree order creation
      const orderPayload = {
        order_amount: amount / 100, // Cashfree expects INR, not paise
        order_currency: currency,
        customer_details: {
          customer_id: `user_${req.user?.id || Date.now()}`,
          customer_email: req.user?.email || "test@example.com",
          customer_phone: (req.user as { phone_number?: string })?.phone_number || "9999999999",
        },
        order_id: `order_${Date.now()}`,
      };
      const order = await cashfree.PGCreateOrder(orderPayload);
      
      res.status(201).json({
        success: true,
        order_id: orderPayload.order_id,
        currency: currency,
        amount: amount,
        payment_session_id: order.data.payment_session_id,
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
