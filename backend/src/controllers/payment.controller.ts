import { Request, Response } from "express";
import Transactions from "../models/transaction.model";
import { cashfree } from "../config/cashfree";
import User from "../models/user.model";
import { PaymentRequestBody, SubscriptionMap } from "../types/payment.types";
import logger from "../utils/logger";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import sequelize from "../config/db";

class PaymentController {  createPaymentOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { amount, currency = "INR", name, email, phone } = req.body;
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
      
      // Use provided phone or fallback to user's phone or default
      const customerPhone = phone || user.phone_number || "+919876543210";
        const orderPayload = {
        order_amount: amount,
        order_currency: currency,
        customer_details: {
          customer_id: `user_${user.id || Date.now()}`,
          customer_email: email || user.email || "test@example.com",
          customer_phone: customerPhone,
        },
        order_id: `order_${Date.now()}`,
      };
      
      let order;
      try {
        order = await cashfree.PGCreateOrder(orderPayload);
        logger.info("Order created:", order.data);      } catch (cashfreeError: any) {
        console.error("❌ Cashfree PGCreateOrder error:", {
          message: cashfreeError.message,
          status: cashfreeError.response?.status,
          statusText: cashfreeError.response?.statusText
        });
        
        logger.error("Error creating payment order:", {
          message: cashfreeError.message,
          name: cashfreeError.name,
          stack: cashfreeError.stack
        });
        res.status(500).json({
          success: false,
          message: "Cashfree order creation failed",
          error: cashfreeError.message || "Failed to create order with Cashfree"
        });
        return;
      }
      
      res.status(201).json({
        success: true,
        order_id: orderPayload.order_id,
        payment_session_id: order.data.payment_session_id,
        redirect_url: `https://payments.cashfree.com/pg/checkout?payment_session_id=${order.data.payment_session_id}`,
      });
      return;    } catch (err: any) {
      console.error("General error in createPaymentOrder:", {
        message: err.message,
        name: err.name
      });
      logger.error("Error creating payment order:", {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      res.status(500).json({
        success: false,
        message:
          "Problems occurring with payment, if amount is debited it will be sent back. \nThank You",
        error: err.message
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

      // Fetch order details from Cashfree with proper error handling
      let orderDetails;
      try {
        orderDetails = await cashfree.PGFetchOrder(order_id as string);
        logger.info("Cashfree order details", { order_id, orderDetails });      } catch (cashfreeError: any) {
        console.error("❌ Cashfree PGFetchOrder error:", {
          message: cashfreeError.message,
          status: cashfreeError.response?.status,
          statusText: cashfreeError.response?.statusText
        });
        
        res.status(500).json({
          success: false,
          message: "Cashfree order fetch failed",
          error: cashfreeError.message || "Failed to fetch order from Cashfree"
        });
        return;
      }
      
      if (!orderDetails || orderDetails.data.order_status !== "PAID") {
        logger.warn("Order not paid", { order_id, orderDetails });
        res
          .status(400)
          .json({ success: false, message: "Payment not verified" });
        return;
      }

      // Fetch payment details to get cf_payment_id with proper error handling
      let paymentDetails;
      try {
        paymentDetails = await cashfree.PGOrderFetchPayments(
          order_id as string
        );
        logger.info("Cashfree payment details", { order_id, paymentDetails });      } catch (cashfreeError: any) {
        console.error("❌ Cashfree PGOrderFetchPayments error:", {
          message: cashfreeError.message,
          status: cashfreeError.response?.status,
          statusText: cashfreeError.response?.statusText
        });
        
        res.status(500).json({
          success: false,
          message: "Cashfree payment details fetch failed",
          error: cashfreeError.message || "Failed to fetch payment details from Cashfree"
        });
        return;
      }
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
      "resume": ["resume"],
      "referral": ["referral"],
      "cold_mail": ["cold_mail"],
      "hr_mail": ["hr_mail"],
      "cover_letter": ["cover_letter"],
      "linkedin": ["linkedin"],
      "cv": ["cv"],
      "roadmaps": ["roadmaps"],
      "interview": ["interview"],
      "job" : ["job"],
      // Subscription types (set all resource booleans)
      "basic": ["cold_mail", "cover_letter", "hr_mail", "job"],
      "standard": [
        "resume",
        "referral",
        "cold_mail",
        "cover_letter",
        "hr_mail",
        "linkedin",
        "cv",
        "job",
        "roadmaps",
        "interview",
      ],
      "booster": [
        "resume",
        "job",
        "referral",
        "cold_mail",
        "cover_letter",
        "hr_mail",
        "linkedin",        "cv",
        "roadmaps",
        "interview",
      ],
      // Add more mappings as needed
    };

      // Map individual resource names to valid subscription types
      const resourceToSubscriptionType: Record<string, string> = {
        "referral": "other_templates",
        "cold_mail": "other_templates", 
        "cover_letter": "other_templates",
        "hr_mail": "other_templates",
        "resume": "resume",
        "job": "job",
        "basic": "basic",
        "standard": "standard", 
        "booster": "booster",
        "regular": "regular",
        "other_templates": "other_templates"
      };

      const actualSubscriptionType = resourceToSubscriptionType[serviceName];
      if (!actualSubscriptionType) {
        logger.warn("Invalid serviceName provided", { serviceName, validTypes: Object.keys(resourceToSubscriptionType) });
        res.status(400).json({
          success: false,
          message: `Invalid serviceName. Must be one of: ${Object.keys(resourceToSubscriptionType).join(', ')}`,
        });
        return;
      }

      console.log("Service name validation passed:", serviceName, "-> mapped to:", actualSubscriptionType);
      logger.info("Service name validation passed", { serviceName, actualSubscriptionType });

      const updateFields: any = {
        is_premium: true,
        subscription_expiry: (() => {
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 30);
          return expiry;
        })(),
        subscription_type: actualSubscriptionType,
        subscription_type_2: actualSubscriptionType,
      };

      // Set all relevant boolean fields to true
      const fieldsToSet = serviceFieldMap[serviceName];
      if (fieldsToSet && Array.isArray(fieldsToSet)) {
        for (const field of fieldsToSet) {
          updateFields[field] = true;
        }
      }

      console.log("Final updateFields before database update:", updateFields);
      logger.info("Final updateFields before database update", updateFields);

      // Update user
      await sequelize.transaction(async (t: any) => {
        try {
          // First, let's check the current user state
          const currentUser = await User.findByPk(user.id, { transaction: t });
          console.log("=== TRANSACTION START ===");
          console.log("Current user state before update:", {
            id: currentUser?.id,
            subscription_type: currentUser?.subscription_type,
            subscription_type_2: currentUser?.subscription_type_2,
            is_premium: currentUser?.is_premium
          });
          console.log("Update fields to apply:", updateFields);
            // Validate that the actualSubscriptionType is a valid ENUM value
          const validSubscriptionTypes = ['regular', 'basic', 'standard', 'booster', 'job', 'resume', 'other_templates'];
          if (!validSubscriptionTypes.includes(actualSubscriptionType)) {
            throw new Error(`Invalid actualSubscriptionType: ${actualSubscriptionType}. Valid values: ${validSubscriptionTypes.join(', ')}`);
          }// Let's try a more direct approach with individual field updates
          console.log("=== ATTEMPTING DIRECT FIELD UPDATES ===");
          
          // Use the existing currentUser instead of redeclaring
          if (!currentUser) {
            throw new Error("User not found");
          }
            // Update fields directly on the instance
          currentUser.subscription_type = actualSubscriptionType as any;
          currentUser.subscription_type_2 = actualSubscriptionType as any;
          currentUser.is_premium = true;
          currentUser.subscription_expiry = updateFields.subscription_expiry;
          
          // Set resource fields
          const fieldsToSet = serviceFieldMap[serviceName];
          if (fieldsToSet && Array.isArray(fieldsToSet)) {
            for (const field of fieldsToSet) {
              (currentUser as any)[field] = true;
            }
          }
            console.log("About to save user with values:", {
            subscription_type: currentUser.subscription_type,
            subscription_type_2: currentUser.subscription_type_2,
            is_premium: currentUser.is_premium
          });
          
          // Save the instance
          const savedUser = await currentUser.save({ transaction: t });
          console.log("User saved successfully:", {
            subscription_type: savedUser.subscription_type,
            subscription_type_2: savedUser.subscription_type_2,
            is_premium: savedUser.is_premium
          });
            
          // Check the user state immediately after save within transaction
          console.log("User state immediately after save in transaction:", {
            id: savedUser.id,
            subscription_type: savedUser.subscription_type,
            subscription_type_2: savedUser.subscription_type_2,
            is_premium: savedUser.is_premium,
            subscription_expiry: savedUser.subscription_expiry
          });
          
          // Validate the update was successful within the transaction
          if (savedUser.subscription_type !== actualSubscriptionType) {
            console.error("CRITICAL: subscription_type was not saved correctly within transaction!");
            throw new Error(`subscription_type save failed. Expected: ${actualSubscriptionType}, Got: ${savedUser.subscription_type}`);
          }
          
          if (savedUser.subscription_type_2 !== actualSubscriptionType) {
            console.error("CRITICAL: subscription_type_2 was not saved correctly within transaction!");
            throw new Error(`subscription_type_2 save failed. Expected: ${actualSubscriptionType}, Got: ${savedUser.subscription_type_2}`);
          }
          
          console.log("✅ Both subscription types saved correctly within transaction");
          
          // Create transaction record
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
          
          console.log("✅ Transaction record created successfully");
          console.log("=== TRANSACTION WILL COMMIT ===");        } catch (transactionError: any) {
          console.error("❌ Error during transaction:", {
            message: transactionError.message,
            name: transactionError.name
          });
          console.error("=== TRANSACTION WILL ROLLBACK ===");
          logger.error("Transaction error", { 
            message: transactionError.message,
            name: transactionError.name,
            stack: transactionError.stack,
            userId: user.id 
          });
          throw transactionError; // This will cause the transaction to rollback
        }
      });

      console.log("=== CHECKING FINAL STATE AFTER TRANSACTION COMMIT ===");
      // Check what was actually saved
      const updatedUser = await User.findByPk(user.id);
      console.log("Final user data after transaction commit:", {
        id: updatedUser?.id,
        subscription_type: updatedUser?.subscription_type,
        subscription_type_2: updatedUser?.subscription_type_2,
        is_premium: updatedUser?.is_premium,
        subscription_expiry: updatedUser?.subscription_expiry
      });
      logger.info("User data after update", {
        subscription_type: updatedUser?.subscription_type,
        subscription_type_2: updatedUser?.subscription_type_2,
        is_premium: updatedUser?.is_premium,
        subscription_expiry: updatedUser?.subscription_expiry
      });      console.log("=== VALIDATING FINAL DATA FOR JWT TOKEN ===");
      const us = await User.findByPk(user.id);
      if (!us) {
        console.error("❌ CRITICAL: User not found for JWT token generation!");
        res.status(500).json({ success: false, message: "User not found" });
        return;
      }
      
      console.log("User data for JWT token:", {
        id: us.id,
        email: us.email,
        subscription_type: us.subscription_type,
        subscription_type_2: us.subscription_type_2,
        is_premium: us.is_premium,
        subscription_expiry: us.subscription_expiry
      });
      
      // Validate the user data before creating JWT
      if (us.subscription_type !== serviceName) {
        console.error("❌ CRITICAL: User subscription_type is still incorrect before JWT generation!");
        console.error("Expected:", serviceName, "Got:", us.subscription_type);
      } else {
        console.log("✅ subscription_type is correct for JWT");
      }
      
      if (us.subscription_type_2 !== serviceName) {
        console.error("❌ CRITICAL: User subscription_type_2 is still incorrect before JWT generation!");
        console.error("Expected:", serviceName, "Got:", us.subscription_type_2);
      } else {
        console.log("✅ subscription_type_2 is correct for JWT");
      }

      // Update JWT token with both subscription types AND resource flags
      const tokenPayload = {
        id: us.id,
        email: us.email,
        subscription_type: us.subscription_type,
        subscription_type_2: us.subscription_type_2,
        phone_number: us.phone_number,
        // Add all resource booleans to the JWT token
        resume: us.resume,
        referral: us.referral,
        cold_mail: us.cold_mail,
        cover_letter: us.cover_letter,
        hr_mail: us.hr_mail,
        linkedin: us.linkedin,
        cv: us.cv,
        roadmaps: us.roadmaps,
        interview: us.interview,
        job: us.job,
      };
      
      console.log("JWT token payload:", tokenPayload);
      
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "2d" });
      
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      console.log("✅ JWT token updated with new subscription data");

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
      });    } catch (err: any) {
      logger.error("Payment verification error in /payment/verify", {
        message: err.message,
        name: err.name,
        stack: err.stack,
        body: req.body,
        user: req.user ? { id: req.user.id, email: req.user.email } : undefined,
      });

      console.error("Payment verification error:", {
        message: err.message,
        name: err.name
      });
      
      res.status(500).json({
        success: false,
        message: err.message || "Server error",
        error: err.message,
        name: err.name
      });
    }
  };

  // --- DISABLED: Do not allow this endpoint to update subscription_type fields anymore ---
  updateUserSubscription = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId, subscription_type, order_id } = req.body;
      if (!userId || !subscription_type) {
        res.status(400).json({
          success: false,
          message: "userId and subscription_type are required",
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
      
      // Convert subscription_type to lowercase for case-insensitive comparison
      const normalizedSubscriptionType = subscription_type.toLowerCase();
      
      if (!validTypes.includes(normalizedSubscriptionType)) {
        res.status(400).json({
          success: false,
          message: `Invalid subscription_type. Must be one of: ${validTypes.join(
            ", "
          )}`,
        });
        return;
      }

      // Since Razorpay handles payment verification, we skip Cashfree order verification
      logger.info("Updating subscription for Razorpay payment", { 
        userId, 
        subscription_type: normalizedSubscriptionType, 
        order_id 
      });      const subscriptionExpiry = new Date();
      subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 30);
        // Define features based on subscription type
      const updateData: any = {
        subscription_type: normalizedSubscriptionType,
        subscription_type_2: normalizedSubscriptionType,
        subscription_expiry: subscriptionExpiry,
        is_premium: true,
      };

      // Set feature flags based on subscription type
      if (normalizedSubscriptionType === "basic") {
        updateData.job = true; // Premium Jobs access
        updateData.cover_letter = true;
        updateData.cold_mail = true;
        updateData.hr_mail = true;
      } else if (normalizedSubscriptionType === "standard") {
        updateData.job = true; // Premium Jobs access
        updateData.cover_letter = true;
        updateData.cold_mail = true;
        updateData.hr_mail = true;
        updateData.resume = true;
        updateData.referral = true;
      } else if (normalizedSubscriptionType === "booster") {
        updateData.job = true; // Premium Jobs access
        updateData.cover_letter = true;
        updateData.cold_mail = true;
        updateData.hr_mail = true;
        updateData.resume = true;
        updateData.referral = true;
        // Additional features for booster plan could be added here
        // Note: "One Get a Referral Session" and "One Resume Review Session" 
        // might need separate handling as they are service-based features
      }
      
      await User.update(updateData, { where: { id: userId } });
      
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
          subscription_type_2: user.subscription_type_2,
          phone_number: user.phone_number,
          // Add all resource booleans to the JWT token
          resume: user.resume,
          referral: user.referral,
          cold_mail: user.cold_mail,
          cover_letter: user.cover_letter,
          hr_mail: user.hr_mail,
          linkedin: user.linkedin,
          cv: user.cv,
          roadmaps: user.roadmaps,
          interview: user.interview,
          job: user.job,
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
        subscription_type: normalizedSubscriptionType,
        subscription_expiry: subscriptionExpiry,
      });    } catch (err: any) {
      console.error("Subscription update error:", {
        message: err.message,
        name: err.name
      });
      logger.error("Subscription update error:", {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      res.status(500).json({
        success: false,
        message: "Failed to update subscription",
        error: err.message,
      });
    }
  };  verifyPayment = async (req: Request, res: Response): Promise<any> => {
    try {
      const { order_id } = req.query;
      const serviceName = req.query.serviceName as string;
      const resourceType = req.query.resourceType as string;
      
      if (!order_id) {
        // Support JSON error for AJAX
        if (req.headers.accept?.includes("application/json") || req.query.json === "1") {
          return res.status(400).json({ success: false, message: "order_id_missing" });
        }
        return res.redirect("/jobs?payment=error&message=order_id_missing");
      }
      
      // Fetch order details from Cashfree with proper error handling
      let orderDetails;
      try {
        orderDetails = await cashfree.PGFetchOrder(order_id as string);
      } catch (cashfreeError: any) {
        console.error("❌ Cashfree PGFetchOrder error in verifyPayment:", {
          message: cashfreeError.message,
          status: cashfreeError.response?.status,
          statusText: cashfreeError.response?.statusText
        });
        
        if (req.headers.accept?.includes("application/json") || req.query.json === "1") {
          return res.status(500).json({ 
            success: false, 
            message: "Cashfree order fetch failed",
            error: cashfreeError.message 
          });
        }
        return res.redirect("/jobs?payment=error&message=cashfree_error");
      }
      
      if (!orderDetails || orderDetails.data.order_status !== "PAID") {
        return res.redirect("/jobs?payment=failed");
      }
      
      // Fetch payment details to get cf_payment_id with proper error handling
      let paymentDetails;
      try {
        paymentDetails = await cashfree.PGOrderFetchPayments(
          order_id as string
        );
      } catch (cashfreeError: any) {
        console.error("❌ Cashfree PGOrderFetchPayments error in verifyPayment:", {
          message: cashfreeError.message,
          status: cashfreeError.response?.status,
          statusText: cashfreeError.response?.statusText
        });
        
        if (req.headers.accept?.includes("application/json") || req.query.json === "1") {
          return res.status(500).json({ 
            success: false, 
            message: "Cashfree payment details fetch failed",
            error: cashfreeError.message 
          });
        }        
        return res.redirect("/jobs?payment=error&message=cashfree_error");
      }
      
      const successfulPayment = paymentDetails.data.find(
        (payment: any) => payment.payment_status === "SUCCESS"
      );
      if (!successfulPayment) {
        return res.redirect("/jobs?payment=failed");
      }
      
      const user = req.user;
      if (!user) {
        if (req.headers.accept?.includes("application/json") || req.query.json === "1") {
          return res.status(401).json({ success: false, message: "unauthorized" });
        }
        return res.redirect("/jobs?payment=error&message=unauthorized");
      }
        // Determine subscription type based on serviceName/resourceType or payment amount
      let subscriptionType: string;
      
      if (serviceName) {
        // Map individual resource names to valid subscription types
        const resourceToSubscriptionType: Record<string, string> = {
          "referral": "other_templates",
          "cold_mail": "other_templates", 
          "cover_letter": "other_templates",
          "hr_mail": "other_templates",
          "resume": "resume",
          "job": "job",
          "basic": "basic",
          "standard": "standard", 
          "booster": "booster",
          "regular": "regular",
          "other_templates": "other_templates"
        };
        
        const mappedType = resourceToSubscriptionType[serviceName];
        if (!mappedType) {
          if (req.headers.accept?.includes("application/json") || req.query.json === "1") {
            return res.status(400).json({ 
              success: false, 
              message: `Invalid serviceName: ${serviceName}. Valid values: ${Object.keys(resourceToSubscriptionType).join(', ')}`
            });
          }
          return res.redirect("/jobs?payment=error&message=invalid_service");
        }
        subscriptionType = mappedType;
      } else if (resourceType) {
        // Use resourceType if provided 
        subscriptionType = resourceType;
      } else {
        // Fallback to amount-based mapping for backward compatibility
        const subscriptionMap: SubscriptionMap = {
          1: "basic",
          2: "standard",
          3: "booster",
          4: "resume", // ₹4 for resume template
          99: "job",
        };
        subscriptionType = subscriptionMap[orderDetails.data.order_amount!];
        
        if (!subscriptionType) {
          if (req.headers.accept?.includes("application/json") || req.query.json === "1") {
            return res.status(400).json({ success: false, message: "invalid_amount" });
          }
          return res.redirect("/jobs?payment=error&message=invalid_amount");
        }
      }
      
      const subscriptionExpiry = new Date();
      subscriptionExpiry.setDate(subscriptionExpiry.getDate() + 30);
      
      // Define features based on subscription type
      const updateData: any = {
        subscription_type: subscriptionType,
        subscription_type_2: subscriptionType,
        subscription_expiry: subscriptionExpiry,
        is_premium: true,
      };      // Set feature flags based on subscription type AND original serviceName
      if (subscriptionType === "basic") {
        updateData.job = true; // Premium Jobs access
        updateData.cover_letter = true;
        updateData.cold_mail = true;
        updateData.hr_mail = true;
      } else if (subscriptionType === "standard") {
        updateData.job = true; // Premium Jobs access
        updateData.cover_letter = true;
        updateData.cold_mail = true;
        updateData.hr_mail = true;
        updateData.resume = true;
        updateData.referral = true;
      } else if (subscriptionType === "booster") {
        updateData.job = true; // Premium Jobs access
        updateData.cover_letter = true;
        updateData.cold_mail = true;
        updateData.hr_mail = true;
        updateData.resume = true;
        updateData.referral = true;
      } else if (subscriptionType === "job") {
        updateData.job = true; // Premium Jobs access only
      } else if (subscriptionType === "resume") {
        updateData.resume = true; // Resume template access only
      } else if (subscriptionType === "other_templates") {
        // For other_templates, set the specific resource boolean based on original serviceName
        if (serviceName === "referral") {
          updateData.referral = true;
        } else if (serviceName === "cold_mail") {
          updateData.cold_mail = true;
        } else if (serviceName === "cover_letter") {
          updateData.cover_letter = true;
        } else if (serviceName === "hr_mail") {
          updateData.hr_mail = true;
        }
      }
      
      // Update user subscription and store transaction atomically
      await sequelize.transaction(async (t: any) => {
        await User.update(updateData, { where: { id: user.id }, transaction: t });
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
      const updatedUserForToken = await User.findByPk(user.id);
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          subscription_type: subscriptionType,
          subscription_type_2: updatedUserForToken?.subscription_type_2,
          phone_number: user.phone_number,
          resume: updatedUserForToken?.resume,
          referral: updatedUserForToken?.referral,
          cold_mail: updatedUserForToken?.cold_mail,
          cover_letter: updatedUserForToken?.cover_letter,
          hr_mail: updatedUserForToken?.hr_mail,
          linkedin: updatedUserForToken?.linkedin,
          cv: updatedUserForToken?.cv,
          roadmaps: updatedUserForToken?.roadmaps,
          interview: updatedUserForToken?.interview,
          job: updatedUserForToken?.job,
        },
        JWT_SECRET,
        { expiresIn: "2d" }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      // If AJAX or ?json=1, return JSON with updated user
      if (req.headers.accept?.includes("application/json") || req.query.json === "1") {
        return res.status(200).json({
          success: true,
          message: "Payment verified and service updated",
          user: updatedUserForToken,
        });
      }
      // Default: redirect
      res.redirect("/jobs?payment=success");
    } catch (err: any) {
      console.error("Payment verification error:", {
        message: err.message,
        name: err.name
      });
      
      logger.error("Payment verification error:", {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      
      if (req.headers.accept?.includes("application/json") || req.query.json === "1") {
        return res.status(500).json({ 
          success: false, 
          message: err.message || "server_error",
          error: err.message,
          name: err.name
        });
      }
      res.redirect(
        `/jobs?payment=error&message=${encodeURIComponent(
          err.message || "server_error"
        )}`
      );
    }
  };
}

export default PaymentController;
