"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "@/redux/config";
import { fetchCurrentUser } from "@/redux/slices/userSlice";

// Ensure the cashfree.d.ts file is included in your project
// If not, create it as shown in the previous response

export interface PremiumPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onContinue?: (planName: string) => void;
  onCancel?: () => void;
  details: string;
}

const planAmountMap: Record<string, number> = {
  BASIC: 1,
  STANDARD: 3,
  BOOSTER: 6,
};

const planSubscriptionTypeMap: Record<string, string> = {
  BASIC: "basic",
  STANDARD: "standard",
  BOOSTER: "booster",
};

const PremiumPlansModal: React.FC<PremiumPlansModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Silently return null if modal is closed
  if (!isOpen) {
    return null;
  }

  // Guard clauses for invalid props
  if (!onClose || typeof onClose !== "function") {
    console.error("Invalid props: onClose is missing or not a function", {
      isOpen,
      onClose,
    });
    return null;
  }

  // Load Cashfree SDK
  useEffect(() => {
    const loadCashfreeSDK = async () => {
      if (document.getElementById("cashfree-sdk") || window.Cashfree) {
        setSdkLoaded(true);
        console.log("Cashfree SDK already loaded");
        return;
      }

      console.log("Loading Cashfree SDK...");
      const script = document.createElement("script");
      script.id = "cashfree-sdk";
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      script.onload = () => {
        setSdkLoaded(true);
        console.log("Cashfree SDK loaded successfully");
      };
      script.onerror = () => {
        setSdkLoaded(false);
        toast.error("Failed to load Cashfree SDK. Please try again.");
        console.error("Cashfree SDK failed to load");
      };
      document.body.appendChild(script);
    };

    loadCashfreeSDK();

    return () => {
      const existingScript = document.getElementById("cashfree-sdk");
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      setSdkLoaded(false);
    };
  }, []);

  const allFeatures = [
    "One Month Access to Premium Jobs",
    "Cover Letter",
    "Cold Email Template",
    "9000+ Verified HR`s Emails",
    "Resume Template",
    "Referral Template",
    "One Get a Referral Session",
    "One Resume Review Session",
  ];

  const plans = [
    {
      name: "BASIC",
      price: "₹199",
      originalPrice: "₹299",
      includedFeatures: [
        "One Month Access to Premium Jobs",
        "Cover Letter",
        "Cold Email Template",
        "9000+ Verified HR`s Emails",
      ],
      recommended: false,
    },
    {
      name: "STANDARD",
      price: "₹329",
      originalPrice: "₹499",
      includedFeatures: [
        "One Month Access to Premium Jobs",
        "Cover Letter",
        "Cold Email Template",
        "9000+ Verified HR`s Emails",
        "Resume Template",
        "Referral Template",
      ],
      recommended: true,
    },
    {
      name: "BOOSTER",
      price: "₹699",
      originalPrice: "₹999",
      includedFeatures: [
        "One Month Access to Premium Jobs",
        "Cover Letter",
        "Cold Email Template",
        "9000+ Verified HR`s Emails",
        "Resume Template",
        "Referral Template",
        "One Get a Referral Session",
        "One Resume Review Session",
      ],
      recommended: false,
    },
  ];

  const handleContinue = async (planName: string) => {
    // Store planName in localStorage for global access
    localStorage.setItem("selectedPlanName", planName);
    console.log("handleContinue called for plan:", planName.toLowerCase());
    if (!user) {
      toast.error("Please log in to purchase a premium plan.");
      navigate("/login");
      onClose();
      console.log("User not logged in, redirecting to login.");
      return;
    }

    if (!sdkLoaded || !window.Cashfree) {
      toast.error("Payment gateway is not available. Please try again later.");
      console.error("Cashfree SDK not loaded");
      return;
    }

    setLoading(true);
    try {
      const amount = planAmountMap[planName];
      console.log("Creating Cashfree order for amount:", amount);
      const orderRes = await axios.post(`${BACKEND_URL}/payment/create-order`, {
        amount,
        name: user.name,
        email: user.email,
        phone: user.phone_number || "+919876543210",
      });
      console.log("Order response:", orderRes.data);
      const { payment_session_id, order_id } = orderRes.data;

      if (!payment_session_id) {
        throw new Error("Payment session ID not found in response");
      }

      // Validate payment_session_id
      if (
        !payment_session_id.startsWith("session_") ||
        /[^a-zA-Z0-9_-]/.test(payment_session_id)
      ) {
        console.error("Invalid payment_session_id:", payment_session_id);

        throw new Error("Invalid payment session ID format");
      } // Initialize Cashfree SDK
      const cashfree = new window.Cashfree({
        mode: "production",
      });
      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        returnUrl: `${
          window.location.origin
        }/payment/verify?order_id=${order_id}&serviceName=${planName.toLowerCase()}`,
        redirectTarget: "_self" as "_self", // Change to _self so it stays in same tab
      };

      // Start checkout
      cashfree.checkout(checkoutOptions).then(async (result: any) => {
        if (result.error) {
          toast.error(`Payment error: ${result.error.message}`);
          setLoading(false);
        } else if (result.redirect) {
          // User will be redirected to Cashfree payment page
          toast.info("Redirecting to payment gateway...");
          // The verification will happen on the backend after payment
        }
      });

      setLoading(false);
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Could not initiate payment. Please try again.";
      toast.error(errorMessage);
      setLoading(false);
    }
  };
  // Listen for payment verification success (e.g., via URL param or event)
  useEffect(() => {
    // Check if payment was successful (e.g., /?payment=success&order_id=...)
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success" && user) {
      // This logic is now handled in PaymentVerify.tsx
      // Keeping this for backwards compatibility if needed
      console.log("Payment success detected in PremiumPlansModal");
    }
  }, [window.location.search, user]);
  // Removed verifyAndUpdateSubscription useEffect as this logic is now handled in PaymentVerify.tsx

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-w-[95vw] p-0 overflow-hidden bg-card dark:bg-card border border-border">
        <DialogHeader className="p-4 sm:p-6 border-b border-border">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#9b87f5] dark:text-[#b3a4f7]">
            Go Premium
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose a premium plan to unlock exclusive features and enhance your
            job search experience.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`border rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg ${
                  plan.recommended
                    ? "border-blue-500 dark:border-blue-400"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              >
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl sm:text-3xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-sm sm:text-lg text-muted-foreground line-through">
                        {plan.originalPrice}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
                      Save{" "}
                      {(
                        ((Number.parseInt(plan.originalPrice.slice(1)) -
                          Number.parseInt(plan.price.slice(1))) /
                          Number.parseInt(plan.originalPrice.slice(1))) *
                        100
                      ).toFixed(0)}
                      %
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Confirm purchase of ${plan.name} plan for ${plan.price}?`
                        )
                      ) {
                        handleContinue(plan.name);
                      }
                    }}
                    className="w-full bg-[#F97316] hover:bg-orange-500 text-white mb-4 sm:mb-6"
                    disabled={loading || !sdkLoaded}
                  >
                    {loading
                      ? "Processing..."
                      : !sdkLoaded
                      ? "Loading..."
                      : "Continue"}
                  </Button>

                  <div className="space-y-2 sm:space-y-3">
                    {allFeatures.map((feature, i) => {
                      const isIncluded =
                        plan.includedFeatures.includes(feature);
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-2 text-xs sm:text-sm ${
                            isIncluded
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {isIncluded ? (
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                          ) : (
                            <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 dark:text-red-400 flex-shrink-0" />
                          )}
                          <span className="text-wrap">{feature}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumPlansModal;
