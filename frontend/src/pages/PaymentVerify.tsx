import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "@/redux/slices/userSlice"; // Adjust import if needed
import { AppDispatch } from "@/redux/store";

const PaymentVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const order_id = params.get("order_id");

      if (!order_id) {
        toast.error("Order ID missing in payment verification.");
        navigate("/profile");
        return;
      }

      try {
        // Call backend to verify payment and update subscription
        const res = await axios.post("/payment/verify", { order_id });
        if (res.data.success) {
          toast.success("Payment successful! Premium subscription activated.");
          // Optionally refresh user profile in Redux
          dispatch(fetchCurrentUser());
          navigate("/profile");
        } else {
          toast.error(res.data.message || "Payment verification failed.");
          navigate("/profile");
        }
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
            "Payment verification failed. Please contact support."
        );
        navigate("/profile");
      }
    };

    verifyPayment();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-xl font-bold mb-2">Verifying Payment...</div>
      <div className="text-gray-500">Please wait while we confirm your subscription.</div>
    </div>
  );
};

export default PaymentVerify;