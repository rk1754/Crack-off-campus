import axios from "axios";
import { toast } from "sonner";

export const updateSubscriptionAfterPayment = async (
  orderId: string,
  serviceName: string,
  userId: string
) => {
  try {
    console.log("Updating subscription after payment:", {
      orderId,
      serviceName,
      userId,
    });

    // Call user-subscription-simple API with service_name as subscription_type
    const subscriptionRes = await axios.post(
      "https://api.crackoffcampus.com/api/v1/user-subscriptiom-simple",
      {
        userId: userId,
        subscription_type: serviceName,
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
