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
    
    // Use the base domain without /api/v1 since /update is a direct route in app.ts
    const baseUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5454' 
      : 'https://api.crackoffcampus.com';
    
    const response = await fetch(`${baseUrl}/update`, {
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
