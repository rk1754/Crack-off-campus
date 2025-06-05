import { Request, Response } from "express";
import Transactions from "../models/transaction.model";
import { cashfree } from "../config/cashfree";
import User from "../models/user.model";
import { PaymentRequestBody, SubscriptionMap } from "../types/payment.types";
import logger from "../utils/logger";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import sequelize from "../config/db";

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
      const order = await cashfree.PGCreateOrder(orderPayload);
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
  verifyPaymentAPI = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info("/payment/verify called", { body: req.body, user: req.user });
      const { order_id, serviceName } = req.body;
      if (!order_id || !serviceName) {
        logger.warn("order_id or serviceName missing in /payment/verify", {
          body: req.body,
        });
        res.status(400).json({
          success: false,
          message: "order_id and serviceName are required",
        });
        return;
      }

      // Fetch order details from Cashfree
      const orderDetails = await cashfree.PGFetchOrder(order_id as string);
      logger.info("Cashfree order details", { order_id, orderDetails });
      if (!orderDetails || orderDetails.data.order_status !== "PAID") {
        logger.warn("Order not paid", { order_id, orderDetails });
        res
          .status(400)
          .json({ success: false, message: "Payment not verified" });
        return;
      }

      // Fetch payment details to get cf_payment_id
      const paymentDetails = await cashfree.PGOrderFetchPayments(
        order_id as string
      );
      logger.info("Cashfree payment details", { order_id, paymentDetails });
      const successfulPayment = paymentDetails.data.find(
        (payment: any) => payment.payment_status === "SUCCESS"
      );
      if (!successfulPayment) {
        logger.warn("No successful payment found", {
          order_id,
          paymentDetails,
        });
        res
          .status(400)
          .json({ success: false, message: "No successful payment found" });
        return;
      }

      // Get user from token/session
      const user = req.user;
      if (!user) {
        logger.warn("Unauthorized user in /payment/verify", { user });
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      logger.info("User found for payment verification", { user_id: user.id });

      // Set the correct boolean field based on serviceName
      const serviceFieldMap: Record<string, string[]> = {
        // Individual resources (use enum keys)
        resume: ["resume"],
        referral: ["referral"],
        cold_mail: ["cold_mail"],
        hr_mail: ["hr_mail"],
        cover_letter: ["cover_letter"],
        linkedin: ["linkedin"],
        cv: ["cv"],
        roadmaps: ["roadmaps"],
        interview: ["interview"],

        // Subscription types (set all resource booleans)
        basic: ["cold_mail", "cover_letter", "hr_mail"],
        standard: [
          "resume",
          "referral",
          "cold_mail",
          "cover_letter",
          "hr_mail",
          "linkedin",
          "cv",
          "roadmaps",
          "interview",
        ],
        booster: [
          "resume",
          "referral",
          "cold_mail",
          "cover_letter",
          "hr_mail",
          "linkedin",
          "cv",
          "roadmaps",
          "interview",
        ],
        // Add more mappings as needed
      };

      const updateFields: any = {
        is_premium: true,
        subscription_expiry: (() => {
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 30);
          return expiry;
        })(),
        // Do NOT set subscription_type for individual resources
      };

      // Only set subscription_type if serviceName is a valid subscription (not a resource)
      const validSubscriptionTypes = [
        "basic",
        "standard",
        "booster",
        "regular",
        "job",
        "resume",
        "other_templates",
      ];
      if (validSubscriptionTypes.includes(serviceName)) {
        updateFields.subscription_type = serviceName;
      }

      // Set all relevant boolean fields to true
      const fieldsToSet = serviceFieldMap[serviceName];
      if (fieldsToSet && Array.isArray(fieldsToSet)) {
        for (const field of fieldsToSet) {
          updateFields[field] = true;
        }
      }

      // Update user
      await sequelize.transaction(async (t: any) => {
        await User.update(updateFields, {
          where: { id: user.id },
          transaction: t,
        });
        await Transactions.create(
          {
            user_id: user.id,
            cf_order_id: order_id as string,
            cf_payment_id: successfulPayment.cf_payment_id || "unknown",
            amount: String(orderDetails.data.order_amount),
            currency: orderDetails.data.order_currency as string,
            captured: true,
            status: "success",
            method: "cashfree",
            razorpay_order_id: "cashfree_dummy_order",
            razorpay_payment_id: "cashfree_dummy_payment",
            razorpay_signature: "cashfree_dummy_signature",
          },
          { transaction: t }
        );
      });

      const us = await User.findByPk(user.id);
      if (!us) {
        res.status(500).json({ success: false, message: "User not found" });
        return;
      }

      // Update JWT token
      const token = jwt.sign(
        {
          id: us.id,
          email: us.email,
          subscription_type: us.subscription_type,
          subscription_type_2: us.subscription_type_2,
          phone_number: us.phone_number,
        },
        JWT_SECRET,
        { expiresIn: "2d" }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      logger.info("Payment verified and subscription updated", {
        user_id: user.id,
        serviceName,
        order_id,
      });
      res.status(200).json({
        success: true,
        message: "Payment verified and service updated",
        service_name: serviceName,
        subscription_expiry: updateFields.subscription_expiry,
      });
    } catch (err: any) {
      logger.error("Payment verification error in /payment/verify", {
        error: err,
        body: req.body,
        user: req.user,
      });
      console.error("Payment verification error:", err);
      res.status(500).json({
        success: false,
        message: err.message || "Server error",
      });
    }
  };

  verifyAndStorePayment = async (
    req: Request<{}, {}, PaymentRequestBody>,
    res: Response
  ): Promise<void> => {
    const { cf_order_id, cf_payment_id, amount, currency, user_id } = req.body;
    try {
      const paymentDetails = await cashfree.PGOrderFetchPayment(
        cf_order_id!,
        cf_payment_id!
      );
      if (!paymentDetails || paymentDetails.data.payment_status !== "SUCCESS") {
        res.status(400).json({
          success: false,
          message: "Payment not successful or not found",
        });
        return;
      }
      const sub: SubscriptionMap = {
        199: "basic",
        299: "standard",
        699: "booster",
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
        amount: amount.toString(),
        currency,
        captured: true,
        status: "success",
        method: "cashfree",
      });
      // Fetch user to check current subscription
      const user = await User.findByPk(user_id);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      // Only set subscription_type to 'job' if user is not already premium
      const premiumTiers = ["booster", "standard", "basic"];
      let updateFields: any = {
        subscription_expiry: (() => {
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 30);
          return expiry;
        })(),
        is_premium: true,
      };
      if (
        subscriptionType === "job" &&
        premiumTiers.includes(user.subscription_type)
      ) {
        // Do not downgrade, just update expiry and is_premium
      } else {
        updateFields.subscription_type = subscriptionType;
      }
      await User.update(updateFields, { where: { id: user_id } });
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

  updateUserSubscription = async (
    req: Request,
    res: Response
  ): Promise<void> => {
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
          message: `Invalid subscription_type. Must be one of: ${validTypes.join(
            ", "
          )}`,
        });
        return;
      }
      const orderDetails = await cashfree.PGFetchOrder(order_id);
      if (!orderDetails || orderDetails.data.order_status !== "PAID") {
        res.status(400).json({
          success: false,
          message: "Payment not verified",
        });
        return;
      }
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
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }
      res.clearCookie("token");
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          subscription_type: user.subscription_type,
          phone_number: user.phone_number,
        },
        JWT_SECRET,
        {
          expiresIn: "2d",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        success: true,
        message: "Subscription updated successfully",
      });
    } catch (err: any) {
      console.error("Subscription update error:", err);
      logger.error("Subscription update error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to update subscription",
        error: err.message,
      });
    }
  };

  verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { order_id } = req.query;
      if (!order_id) {
        return res.redirect("/jobs?payment=error&message=order_id_missing");
      }
      // Fetch order details from Cashfree
      const orderDetails = await cashfree.PGFetchOrder(order_id as string);
      if (!orderDetails || orderDetails.data.order_status !== "PAID") {
        return res.redirect("/jobs?payment=failed");
      }
      // Fetch payment details to get cf_payment_id
      const paymentDetails = await cashfree.PGOrderFetchPayments(
        order_id as string
      );
      const successfulPayment = paymentDetails.data.find(
        (payment: any) => payment.payment_status === "SUCCESS"
      );
      if (!successfulPayment) {
        return res.redirect("/jobs?payment=failed");
      }
      const user = req.user;
      if (!user) {
        return res.redirect("/jobs?payment=error&message=unauthorized");
      }
      // Map amount to subscription type
      const subscriptionMap: SubscriptionMap = {
        199: "basic",
        299: "standard",
        699: "booster",
        99: "job",
      };
      const subscriptionType = subscriptionMap[orderDetails.data.order_amount!];
      if (!subscriptionType) {
        return res.redirect("/jobs?payment=error&message=invalid_amount");
      }
      const subscriptionExpiry = new Date();
      subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 30);
      // Only set subscription_type to 'job' if user is not already premium
      const premiumTiers = ["booster", "standard", "basic"];
      let updateFields: any = {
        subscription_expiry: subscriptionExpiry,
        is_premium: true,
      };
      if (
        subscriptionType === "job" &&
        premiumTiers.includes(user.subscription_type)
      ) {
        // Do not downgrade, just update expiry and is_premium
      } else {
        updateFields.subscription_type = subscriptionType;
      }
      await sequelize.transaction(async (t: any) => {
        await User.update(
          updateFields,
          { where: { id: user.id }, transaction: t }
        );
        await Transactions.create(
          {
            user_id: user.id,
            cf_order_id: order_id as string,
            cf_payment_id: successfulPayment.cf_payment_id || "unknown",
            amount: orderDetails.data.order_amount?.toString() || "0",
            currency: orderDetails.data.order_currency as string,
            captured: true,
            status: "success",
            method: "cashfree",
          },
          { transaction: t }
        );
      });
      // Update JWT token
      const updatedUser = await User.findByPk(user.id);
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          subscription_type: updatedUser?.subscription_type || subscriptionType,
          phone_number: user.phone_number,
        },
        JWT_SECRET,
        { expiresIn: "2d" }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.redirect("/jobs?payment=success");
    } catch (err: any) {
      console.error("Payment verification error:", err);
      logger.error("Payment verification error:", err);
      res.redirect(
        `/jobs?payment=error&message=${encodeURIComponent(
          err.message || "server_error"
        )}`
      );
    }
  };
}

export default PaymentController;
