"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

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
  const user = useSelector((state: any) => state.user?.user);

  const allFeatures = [
    "One Month Access to Premium Jobs",
    "Cover Letter",
    "Cold Email Template",
    "2000+ HR Contact Directory",
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
        "2000+ HR Contact Directory",
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
        "2000+ HR Contact Directory",
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
        "2000+ HR Contact Directory",
        "Resume Template",
        "Cover Letter Template",
        "One Get a Referral Session",
        "One Resume Review Session",
      ],
      recommended: false,
    },
  ];

  // Razorpay script loader
  React.useEffect(() => {
    if (!isOpen) return;
  
    // Check if script is already loaded
    if (document.getElementById("razorpay-sdk") || window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }
  
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
      // Cleanup only if script is still in the DOM
      const existingScript = document.getElementById("razorpay-sdk");
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      setRazorpayLoaded(false);
    };
  }, [isOpen]);

  const handleContinue = async (planName: string) => {
    if (!user) {
      toast.error("Please login to purchase a premium plan.");
      return;
    }
    if (!razorpayLoaded || !window.Razorpay) {
      toast.error("Payment gateway is not available. Please try again later.");
      console.error("Razorpay SDK not loaded");
      return;
    }
    setLoading(true);
    try {
      const amount = planAmountMap[planName];
      // 1. Create payment order via backend
      const orderRes = await axios.post("/api/v1/payment/create-order", {
        amount,
      });
      const { order_id, currency } = orderRes.data;
  
      // 2. Open Razorpay checkout
      const options = {
        key: "rzp_test_GBC6wsiyhZIszp",
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        name: "Foundit Premium",
        description: `${planName} Plan`,
        image: "/logo.png",
        order_id,
        handler: async function (response: any) {
          try {
            // 3. Verify and store payment via backend
            const verifyRes = await axios.post("/api/v1/payment/verify", {
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
            }
          } catch (err: any) {
            toast.error(
              err?.response?.data?.message ||
                "Payment verification failed. Please contact support."
            );
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
        // Handle payment failure
        "payment.failed": function (response: any) {
          toast.error(`Payment failed: ${response.error.description}`);
          setLoading(false);
          console.error("Payment failed:", response.error);
        },
      };
  
      // Initialize and open Razorpay checkout
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
          <h2 className="text-xl sm:text-2xl font-semibold text-[#9b87f5] dark:text-[#b3a4f7]">
            Go Premium
          </h2>
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
                    onClick={() => handleContinue(plan.name)}
                    className="w-full bg-[#F97316] hover:bg-orange-500 text-white mb-4 sm:mb-6"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Continue"}
                  </Button>

                  <div className="space-y-2 sm:space-y-3">
                    {allFeatures.map((feature, i) => {
                      const isIncluded = plan.includedFeatures.includes(feature);
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
