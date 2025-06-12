import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "@/redux/slices/userSlice"; // Adjust import if needed
import { AppDispatch, RootState } from "@/redux/store";
import {
  downloadResumeTemplate,
  downloadReferralTemplate,
  downloadColdMailTemplate,
  downloadCoverLetterTemplate,
  downloadHrEmailTemplate,
} from "@/redux/slices/resourceSlice";
import { updateSubscriptionAfterPayment } from "@/utils/subscriptionUtils";

const PaymentVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    console.log(window.location.href);
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const order_id = params.get("order_id");
      const subscription_type = params.get("serviceName");
      // Try to get serviceName from both serviceName and job as fallback
      let serviceName = params.get("serviceName");
      if (!serviceName) {
        // Try fallback for job plan (as in JobListings.tsx)
        if (params.get("job")) {
          serviceName = "job";
        }
      }
      const resourceType = params.get("resourceType");
      const serviceId = params.get("serviceId");
      const date = params.get("date");
      const time = params.get("time");
      // If serviceName is not present, try to map resourceType
      const resourceTypeToServiceName: Record<string, string> = {
        "Resume / CV Review": "resume",
        "Get a Referral": "referral",
        "Cold Mail": "cold_mail",
        "HR Mail": "hr_mail",
        "Cover Letter": "cover_letter",
        "LinkedIn Review": "linkedin",
        CV: "cv",
        Roadmaps: "roadmaps",
        Interview: "interview",
        job: "job",
        // Add more mappings as needed
      };
      if (!serviceName && resourceType) {
        serviceName = resourceTypeToServiceName[resourceType] || resourceType;
      }
      // Log for debugging
      console.log(
        "order_id",
        order_id,
        "serviceName",
        serviceName,
        "resourceType",
        resourceType
      );
      if (!order_id || !serviceName) {
        toast.error(
          "Order ID or service name missing in payment verification."
        );
        navigate("/services");
        return;
      }
      try {
        console.log("About to send payment verification request with:", {
          order_id,
          serviceName,
          resourceType,
          serviceId,
          date,
          time,
        });

        // Step 1: Payment verification - different endpoint based on resourceType
        let verifyRes;
        if (resourceType !== null && resourceType !== undefined) {
          // Use verifyresources endpoint when resourceType is not null
          verifyRes = await axios.post(
            "/payment/verifyresources",
            {
              order_id,
              serviceName,
              resourceType,
              serviceId,
              date,
              time,
            },
            { withCredentials: true }
          );
        } else {
          // Use regular verify endpoint when resourceType is null
          verifyRes = await axios.post(
            "/payment/verify",
            {
              order_id,
              serviceName,
              resourceType,
              serviceId,
              date,
              time,
            },
            { withCredentials: true }
          );
        }
        if (verifyRes.data.success) {
          console.log("Payment verification successful:", verifyRes.data);
          toast.success("Payment successful!");

          // Set localStorage flag for recent payment to allow immediate downloads
          if (serviceName) {
            localStorage.setItem(
              `payment_${serviceName}`,
              Date.now().toString()
            );
            console.log(`✅ Payment flag set for ${serviceName}`);
          }

          // Check if this is a subscription-type payment that needs /update route
          const subscriptionTypes = ["basic", "standard", "booster", "job"];
          const isSubscriptionPayment = subscriptionTypes.includes(
            serviceName.toLowerCase()
          );

          if (isSubscriptionPayment) {
            console.log(
              `📦 Subscription payment detected: ${serviceName}. Running /update route...`
            );

            // Step 2: Update subscription for subscription-type payments
            try {
              const baseUrl =
                window.location.hostname === "localhost"
                  ? "http://localhost:5454"
                  : "https://api.crackoffcampus.com";

              const updateResponse = await fetch(`${baseUrl}/update`, {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: user.id,
                  subscription_type: serviceName,
                  order_id: order_id,
                }),
              });

              const updateRes = await updateResponse.json();

              if (updateResponse.ok && updateRes.success) {
                toast.success("Payment successful and subscription updated!");
                console.log("Subscription update response:", updateRes);
              } else {
                console.warn("Subscription update failed:", updateRes);
                toast.warning(
                  "Payment verified but subscription update failed. Contact support."
                );
              }
            } catch (updateError: any) {
              console.error("Subscription update error:", updateError);
              toast.warning(
                "Payment verified but subscription update failed. Contact support."
              );
            }
          } else {
            console.log(
              `🎯 Resource payment detected: ${serviceName}. Skipping /update route.`
            );
          }

          // Handle resource type purchase and trigger automatic download IMMEDIATELY
          if (resourceType) {
            const triggerDownload = () => {
              // Map resource types to the appropriate download action
              const resourceTypeToDownloadAction: Record<string, () => void> = {
                resume: () => dispatch(downloadResumeTemplate()),
                referral: () => dispatch(downloadReferralTemplate()),
                cold_mail: () => dispatch(downloadColdMailTemplate()),
                cover_letter: () => dispatch(downloadCoverLetterTemplate()),
                hr_mail: () => dispatch(downloadHrEmailTemplate()),
              };

              // Get the corresponding action for the resource type
              const downloadAction = resourceTypeToDownloadAction[serviceName];

              if (downloadAction) {
                // Trigger download immediately after payment verification
                try {
                  downloadAction();
                  toast.success(
                    `Your ${resourceType} template is being downloaded!`
                  );
                  console.log(
                    `✅ ${serviceName} template download triggered successfully!`
                  );
                } catch (err) {
                  console.error("Download error:", err);
                  toast.error(
                    "There was an error downloading your template. Please try again from the Resources page."
                  );
                }
              } else {
                console.error(
                  `No download action found for serviceName: ${serviceName}`
                );
                toast.error(
                  "Download action not found. Please try again from the Resources page."
                );
              }
            };

            // Trigger download immediately
            triggerDownload();
            navigate(`/resources?success=1&type=${resourceType}`);
          } else if (serviceId && date && time) {
            // Service booking: book the slot after payment
            setBookingInProgress(true);

            // Get booking data from localStorage (priority) or sessionStorage
            let bookingData: any = {};
            const localData = localStorage.getItem("serviceBookingData");
            const sessionData = sessionStorage.getItem("serviceBookingData");

            if (localData) {
              bookingData = JSON.parse(localData);
            } else if (sessionData) {
              bookingData = JSON.parse(sessionData);
            } // Get resume URL from sessionStorage if not in booking data
            const storedResumeUrl = sessionStorage.getItem("resumeUrl");
            const resumeUrl = bookingData.resume_url || storedResumeUrl;

            // Debug logging for resume URL
            console.log("=== RESUME URL DEBUG ===");
            console.log("bookingData.resume_url:", bookingData.resume_url);
            console.log("sessionStorage resumeUrl:", storedResumeUrl);
            console.log("Final resumeUrl:", resumeUrl);
            console.log("=== END RESUME URL DEBUG ==="); // Create the booking payload as JSON object (not FormData)
            const bookingPayload = {
              serviceId: serviceId,
              date: date,
              time: time,
              service_name: serviceName || "",
              name: bookingData.name || "",
              phone: bookingData.phone || "",
              email: bookingData.email || "",
              state: bookingData.state || "",
              targetRole: bookingData.targetRole || "",
              language: bookingData.language || "Hinglish",
              payment_status: "paid",
              order_id: order_id,
              resumeUrl: resumeUrl || "", // Include resume URL from sessionStorage
            }; // Debug: Log what we're sending
            console.log("Booking data retrieved from storage:", bookingData);
            console.log("Resume URL from sessionStorage:", resumeUrl);
            console.log("Final booking payload:", bookingPayload);

            try {
              const bookingRes = await fetch(
                "https://api.crackoffcampus.com/api/v1/session/booking/book",
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(bookingPayload),
                }
              );
              if (!bookingRes.ok) {
                const errorData = await bookingRes.json().catch(() => ({}));
                throw new Error(
                  errorData.message ||
                    `Failed to book slot (Status: ${bookingRes.status})`
                );
              } // Clear booking data from localStorage and sessionStorage after successful booking
              localStorage.removeItem("serviceBookingData");
              sessionStorage.removeItem("resumeUrl");
              sessionStorage.removeItem("serviceBookingData");
              setBookingInProgress(false);
              navigate(
                `/services/${serviceId}/booking/confirmation?date=${encodeURIComponent(
                  date
                )}&time=${encodeURIComponent(time)}&success=1`
              );
            } catch (bookingErr: any) {
              setBookingInProgress(false);
              toast.error(
                bookingErr?.message ||
                  "Payment succeeded but booking failed. Please contact support."
              );
              navigate(
                `/services/${serviceId}/booking?date=${encodeURIComponent(
                  date
                )}&time=${encodeURIComponent(time)}&error=1`
              );
            }
          } else {
            // Check if this is a job subscription payment
            if (serviceName === "job") {
              // Job subscription: redirect back to jobs page with success
              navigate(
                "/jobs?payment=success&message=job_subscription_activated"
              );
            } else {
              // Default: other premium subscriptions
              navigate("/profile");
            }
          }
        } else {
          toast.error(verifyRes.data.message || "Payment verification failed.");
          // Redirect based on context
          if (resourceType) {
            navigate(`/resources?error=1&type=${resourceType}`);
          } else if (serviceId && date && time) {
            navigate(
              `/services/${serviceId}/booking?date=${encodeURIComponent(
                date
              )}&time=${encodeURIComponent(time)}&error=1`
            );
          } else if (serviceName === "job") {
            // Job subscription failed: redirect back to jobs page with error
            navigate("/jobs?payment=failed");
          } else {
            navigate("/faq");
          }
        }
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
            "Payment verification failed. Please contact support."
        );
        // Redirect based on context
        if (resourceType) {
          navigate(`/resources?error=1&type=${resourceType}`);
        } else if (serviceId && date && time) {
          navigate(
            `/services/${serviceId}/booking?date=${encodeURIComponent(
              date
            )}&time=${encodeURIComponent(time)}&error=1`
          );
        } else if (serviceName === "job") {
          // Job subscription error: redirect back to jobs page with error
          navigate("/jobs?payment=error&message=verification_failed");
        } else {
          navigate("/privacy-policy");
        }
      }
    };

    verifyPayment();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-xl font-bold mb-2">
        {bookingInProgress ? "Booking Your Slot..." : "Verifying Payment..."}
      </div>
      <div className="text-gray-500">
        {bookingInProgress
          ? "Please wait while we confirm and book your session."
          : "Please wait while we confirm your subscription."}
      </div>
    </div>
  );
};

export default PaymentVerify;
