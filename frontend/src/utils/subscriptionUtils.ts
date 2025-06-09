import axios from "axios";
import { toast } from "sonner";
import { BACKEND_URL } from "@/redux/config";

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
    
    // Use the direct /update endpoint that's now in app.ts without any auth restrictions
    const response = await fetch("https://api.crackoffcampus.com/update", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        subscription_type: subscription_type,
      }),
    });
    
    const subscriptionRes = await response.json();
    
    // Check if response is successful
    if (!response.ok) {
      console.error("HTTP Error:", response.status, response.statusText);
      console.error("Response body:", subscriptionRes);
      toast.error(`Failed to update subscription: ${subscriptionRes.message || 'HTTP ' + response.status}`);
      return false;
    }
    
    if (subscriptionRes.success && subscriptionRes.user) {
      console.log("Subscription updated successfully:", subscriptionRes.user);
      toast.success("Subscription updated successfully!");
      return true;
    } else {
      console.error("Subscription update failed:", subscriptionRes);
      toast.error(subscriptionRes.message || "Failed to update subscription");
      return false;
    }
  } catch (err: any) {
    console.error("Error updating subscription:", err);
    toast.error("Failed to update subscription. Please contact support.");
    return false;
  }
};
