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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const PremiumJobsFeature: React.FC = () => {
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);

  const handleOpenUnlockModal = () => {
    if (!user) {
      navigate("/login?redirect=/jobs");
    } else {
      setIsUnlockModalOpen(true);
    }
  };

  const handleCloseUnlockModal = () => {
    setIsUnlockModalOpen(false);
  };

  // Load Cashfree SDK
  useEffect(() => {
    const scriptId = "cashfree-sdk-premium-feature";
    if (document.getElementById(scriptId) || window.Cashfree) {
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => setSdkLoaded(true);
    script.onerror = () => {
      setSdkLoaded(false);
      toast.error("Failed to load Cashfree SDK. Please try again.");
      console.error("Failed to load Cashfree SDK for PremiumJobsFeature");
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript && document.body.contains(existingScript)) {
        document.body.removeChild(existingScript);
      }
      setSdkLoaded(false);
    };
  }, []);

  const handleCashfreePayment = async () => {
    if (!user) {
      navigate("/login?redirect=/jobs");
      return;
    }
    if (!sdkLoaded || !window.Cashfree) {
      toast.error("Payment gateway is not available. Please try again later.");
      return;
    }
    try {
      // Amount in INR
      const amount = 99;
      const orderRes = await axios.post("/payment/create-order", {
        amount,
        name: user.name,
        email: user.email,
        phone: user.phone_number || "+919876543210",
      });
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
      }

      const cashfree = new window.Cashfree({
        mode: "production",
      });

      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        returnUrl: `https://www.crackoffcampus.com/payment/verify?order_id=${order_id}`,
        redirectTarget: "_blank" as "_blank",
      };

      cashfree.checkout(checkoutOptions).then(async (result: any) => {
        if (result.error) {
          toast.error(`Payment error: ${result.error.message}`);
          setIsUnlockModalOpen(false);
        } else if (result.redirect) {
          toast.info("Redirecting to Cashfree payment gateway...");
        } else if (result.status === "SUCCESS" || result.status === "COMPLETED") {
          // Call backend to update user subscription after successful payment
          try {
            await axios.post("/payment/update-subscription", {
              userId: user.id,
              subscription_type: "premium",
              order_id,
            });
            toast.success("Premium subscription activated!");
            // Optionally, refresh user data here
          } catch (err) {
            toast.error("Payment succeeded but failed to update subscription. Please contact support.");
          }
          setIsUnlockModalOpen(false);
        }
      });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Could not initiate payment. Please try again."
      );
      console.error("Payment initiation error:", err);
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
      <p className="text-sm md:text-base text-black">
        Struggling with getting shortlist after applying from career
        portal of company
      </p>
      <h2 className="text-2xl md:text-3xl font-bold mt-1 text-black">
        Need Premium jobs Access
      </h2>
      <p className="text-sm md:text-base mt-1 text-black">
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
              onClick={handleCashfreePayment}
              className="bg-[#9b87f5] text-white hover:bg-[#7c66e0]"
              disabled={!sdkLoaded}
            >
              {!sdkLoaded
                ? "Loading Gateway..."
                : "Pay ₹99 & Unlock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PremiumJobsFeature;