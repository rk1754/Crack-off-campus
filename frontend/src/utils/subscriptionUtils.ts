import axios from "axios";
import { toast } from "sonner";

export const updateSubscriptionAfterPayment = async (
  orderId: string,
  subscription_type: string,
  userId: string
) => {
  try {
    console.log("Updating subscription after payment:", {
      orderId,
      subscription_type,
      userId,
    });

    // Call user-subscription-simple API with service_name as subscription_type
    const subscriptionRes = await axios.post(
      "https://api.crackoffcampus.com/api/v1/payment/update-subscription-simple",
      {
        userId: userId,
        subscription_type: subscription_type,
      },
      { withCredentials: true }
    );

    if (subscriptionRes.data) {
      console.log("Subscription updated successfully:", subscriptionRes.data);
      toast.success("Subscription updated successfully!");
      return true;
    }
  } catch (err: any) {
    console.error("Error updating subscription:", err);
    toast.error("Failed to update subscription. Please contact support.");
    return false;
  }
};
