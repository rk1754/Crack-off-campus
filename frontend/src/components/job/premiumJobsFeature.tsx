import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  createPaymentOrder,
  verifyAndStorePayment,
} from "@/redux/slices/paymentSlice";
import { useNavigate } from "react-router-dom";

const PremiumJobsFeature: React.FC = () => {
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const paymentState = useSelector((state: RootState) => state.payment);

  const handleOpenUnlockModal = () => {
    if (!user) {
      navigate("/login?redirect=/jobs"); // Or the current page
    } else {
      setIsUnlockModalOpen(true);
    }
  };

  const handleCloseUnlockModal = () => {
    setIsUnlockModalOpen(false);
  };

  useEffect(() => {
    const scriptId = "razorpay-sdk-premium-feature";
    if (document.getElementById(scriptId) || window.Razorpay) {
      setIsRazorpayReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayReady(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK for PremiumJobsFeature");
      // Optionally, inform the user via toast or alert
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript && document.body.contains(existingScript)) {
        document.body.removeChild(existingScript);
      }
      // Not resetting isRazorpayReady to false here, as other components might use the SDK.
      // If this component is unmounted and remounted, the check at the start of useEffect handles it.
    };
  }, []);

  const handleRazorpayPayment = async () => {
    if (!user) {
      navigate("/login?redirect=/jobs"); // Or the current page
      return;
    }
    if (!isRazorpayReady) {
      alert(
        // Consider using a toast notification library if available
        "Payment gateway is still loading. Please wait a moment and try again."
      );
      return;
    }
    try {
      const resultAction = await dispatch(createPaymentOrder(99 * 100)); // Amount in paise
      const orderData = resultAction.payload;

      if (!orderData || !orderData.order_id) {
        alert("Failed to create payment order. Please try again.");
        return;
      }

      const options = {
        key: "rzp_test_GBC6wsiyhZIszp", // Replace with your actual Razorpay Key ID
        amount: orderData.amount, // Amount in paise from backend
        currency: orderData.currency || "INR",
        name: "Crack Off-Campus Job Access",
        description: "Unlock premium job access for ₹99",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            await dispatch(
              verifyAndStorePayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: orderData.amount, // Send amount in paise
                currency: orderData.currency || "INR",
                user_id: user.id,
              })
            ).unwrap();
            // alert("Payment successful! Premium job access unlocked.");
            setIsUnlockModalOpen(false);
            window.location.reload(); // Refresh to update user subscription status
          } catch (verificationError: any) {
            console.error("Payment verification error:", verificationError);
            alert(
              verificationError?.message ||
                "Payment verification failed. Please contact support."
            );
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone_number || "",
        },
        theme: {
          color: "#9b87f5",
        },
        modal: {
          ondismiss: function () {
            console.log("Razorpay modal dismissed");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error("Razorpay payment failed:", response.error);
        alert(
          `Payment Failed: ${response.error.description}. ${response.error.reason}`
        );
      });
      rzp.open();
    } catch (err: any) {
      console.error("Error during payment initiation:", err);
      alert(err?.message || "Payment failed to start. Please try again.");
    }
  };

  return (
    <>
      <div
        className="w-full mx-auto rounded-xl text-white shadow-lg"
        style={{ backgroundColor: "rgb(186, 175, 220)" }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <p className="text-sm md:text-base opacity-90">
                Struggling with getting shortlist after applying from career
                portal of company
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mt-1">
                Need Premium jobs Access
              </h2>
              <p className="text-sm md:text-base mt-1 opacity-90">
                You will get multiple features to apply job opportunities
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenUnlockModal}
              className="mt-4 md:mt-0 bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors shadow hover:shadow-md"
            >
              Unlock Premium Jobs
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 p-4 rounded-lg shadow">
              <p className="text-[#9b87f5] font-semibold">#Feature 1</p>
              <h3 className="font-bold text-lg mt-1">
                Apply via Internal Hiring Form
              </h3>
              <p className="text-gray-700 mt-1 text-sm">
                Directly apply by submitting internal hiring forms. Just fill in
                your details.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm text-gray-800 p-4 rounded-lg shadow">
              <p className="text-[#9b87f5] font-semibold">#Feature 2</p>
              <h3 className="font-bold text-lg mt-1">Apply via Referral</h3>
              <p className="text-gray-700 mt-1 text-sm">
                Fill a referral form and connect with employees who can refer
                you.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm text-gray-800 p-4 rounded-lg shadow">
              <p className="text-[#9b87f5] font-semibold">#Feature 3</p>
              <h3 className="font-bold text-lg mt-1">
                Apply via Sending Resume
              </h3>
              <p className="text-gray-700 mt-1 text-sm">
                Send your resume directly on recruiter email.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isUnlockModalOpen} onOpenChange={setIsUnlockModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unlock Premium Job Access</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg font-medium mb-2">
              Access premium job features for just{" "}
              <span className="text-[#9b87f5] font-bold">₹99</span>.
            </p>
            <p className="text-gray-600 mb-4 text-sm">
              This will grant you access to apply to premium jobs, view referral
              details, and more exclusive features for 30 days.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseUnlockModal}>
              Cancel
            </Button>
            <Button
              onClick={handleRazorpayPayment}
              className="bg-[#9b87f5] text-white hover:bg-[#7c66e0]"
              disabled={paymentState.loading || !isRazorpayReady}
            >
              {!isRazorpayReady && !paymentState.loading
                ? "Loading Gateway..."
                : paymentState.loading
                ? "Processing..."
                : "Pay ₹99 & Unlock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PremiumJobsFeature;
