"use client";

import React, { useState, useEffect } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { User } from "@/redux/slices/userSlice";

export interface PremiumPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const planAmountMap: Record<string, number> = {
  BASIC: 199,
  STANDARD: 299,
  BOOSTER: 699,
};

const PremiumPlansModal: React.FC<PremiumPlansModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  // Fix: select the actual user object from the slice
  const user = useSelector((state: RootState) => state.user.user);

  // Silently return null if modal is closed
  if (!isOpen) {
    return null;
  }

  // Guard clauses for invalid props or user
  if (!onClose || typeof onClose !== "function") {
    console.error("Invalid props: onClose is missing or not a function", {
      isOpen,
      onClose,
    });
    return null;
  }

  if (!user || !user.id || !user.name || !user.email) {
    console.error("Invalid user data", { user });
    toast.error("Please log in to access premium plans.");
    onClose();
    return null;
  }

  const allFeatures = [
    "One Month Access to Premium Jobs",
    "Cover Letter",
    "Cold Email Template",
    "9000+ Verified HR`s Emails",
    "Resume Template",
    "Cover Letter Template",
    "One Get a Referral Session",
    "One Resume Review Session",
  ];

  const plans = [
    {
      name: "BASIC",
      price: "₹199",
      includedFeatures: [
        "One Month Access to Premium Jobs",
        "Cover Letter",
        "Cold Email Template",
        "9000+ Verified HR`s Emails", // <-- fixed: match string exactly
      ],
      recommended: false,
    },
    {
      name: "STANDARD",
      price: "₹299",
      includedFeatures: [
        "One Month Access to Premium Jobs",
        "Cover Letter",
        "Cold Email Template",
        "9000+ Verified HR`s Emails", // <-- fixed: match string exactly
        "Resume Template",
        "Cover Letter Template",
      ],
      recommended: true,
    },
    {
      name: "BOOSTER",
      price: "₹699",
      includedFeatures: [
        "One Month Access to Premium Jobs",
        "Cover Letter",
        "Cold Email Template",
        "9000+ Verified HR`s Emails", // <-- fixed: match string exactly
        "Resume Template",
        "Cover Letter Template",
        "One Get a Referral Session",
        "One Resume Review Session",
      ],
      recommended: false,
    },
  ];

  // Razorpay script loader
  useEffect(() => {
    if (document.getElementById("razorpay-sdk") || window.Razorpay) {
      setRazorpayLoaded(true);
      console.log("Razorpay SDK already loaded or present");
      return;
    }

    console.log("Loading Razorpay SDK...");
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
      console.log("Razorpay SDK loaded successfully");
    };
    script.onerror = () => {
      setRazorpayLoaded(false);
      toast.error("Failed to load payment gateway. Please try again.");
      console.error("Razorpay SDK failed to load");
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById("razorpay-sdk");
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      setRazorpayLoaded(false);
      console.log("Razorpay SDK script removed");
    };
  }, []);

  const handleContinue = async (planName: string) => {
    console.log("handleContinue called for plan:", planName);
    if (!user) {
      toast.error("Please login to purchase a premium plan.");
      console.log("User not logged in");
      return;
    }
    if (!razorpayLoaded || !window.Razorpay) {
      toast.error("Payment gateway is not available. Please try again later.");
      console.error("Razorpay SDK not loaded");
      return;
    }

    const razorpayKey = "rzp_test_GBC6wsiyhZIszp";
    if (!razorpayKey) {
      toast.error(
        "Payment gateway configuration is missing. Please contact support."
      );
      console.error("Razorpay key is not defined");
      return;
    }

    setLoading(true);
    try {
      const amount = planAmountMap[planName];
      console.log("Creating order for amount:", amount);
      const orderRes = await axios.post("/payment/create-order", { amount });
      console.log("Order response:", orderRes.data);
      const { order_id, currency } = orderRes.data;

      const options = {
        key: razorpayKey,
        amount: amount * 100,
        currency,
        name: "Crack Off-Campus Premium",
        description: `${planName} Plan`,
        image: "/lovable-Uploads/logo.png",
        order_id,
        handler: async function (response: any) {
          console.log("Payment handler triggered:", response);
          try {
            const verifyRes = await axios.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount,
              currency,
              user_id: user.id,
            });
            if (verifyRes.data.success) {
              toast.success("Payment successful! Premium activated.");
              onClose();
            } else {
              toast.error("Payment verification failed.");
              console.error("Verification failed:", verifyRes.data);
            }
          } catch (err: any) {
            toast.error(
              err?.response?.data?.message ||
                "Payment verification failed. Please contact support."
            );
            console.error("Verification error:", err);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#9b87f5",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            console.log("Razorpay modal dismissed");
          },
        },
        "payment.failed": function (response: any) {
          toast.error(`Payment failed: ${response.error.description}`);
          setLoading(false);
          console.error("Payment failed:", response.error);
        },
      };

      console.log("Opening Razorpay checkout with options:", options);
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
        console.error("Payment failed event:", response.error);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Could not initiate payment. Please try again."
      );
      console.error("Payment initiation error:", err);
    } finally {
      setLoading(false);
    }
  };

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
                  <div className="text-xl sm:text-3xl font-bold mb-4 text-foreground">
                    {plan.price}
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
                    disabled={loading || !razorpayLoaded}
                  >
                    {loading
                      ? "Processing..."
                      : razorpayLoaded
                      ? "Continue"
                      : "Loading..."}
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
