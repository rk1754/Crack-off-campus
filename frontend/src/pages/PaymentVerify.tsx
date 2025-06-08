import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "@/redux/slices/userSlice"; // Adjust import if needed
import { AppDispatch } from "@/redux/store";
import { BACKEND_URL } from "@/redux/config";
import {
  downloadResumeTemplate,
  downloadReferralTemplate,
  downloadColdMailTemplate,
  downloadCoverLetterTemplate,
  downloadHrEmailTemplate,
} from "@/redux/slices/resourceSlice";

const PaymentVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    console.log(window.location.href);
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const order_id = params.get("order_id");
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
        const res = await axios.post(
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
        if (res.data.success) {
          toast.success(res.data.message || "Payment successful!");

          // Refresh user profile in Redux
          dispatch(fetchCurrentUser());

          // Handle resource type purchase and trigger automatic download
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
                // Short delay to ensure user is properly updated in Redux
                setTimeout(() => {
                  try {
                    downloadAction();
                    toast.success(
                      `Your ${resourceType} template is being downloaded!`
                    );
                  } catch (err) {
                    console.error("Download error:", err);
                    toast.error(
                      "There was an error downloading your template. Please try again from the Resources page."
                    );
                  }
                }, 1500);
              }
            };

            // Trigger download and navigate
            triggerDownload();
            navigate(`/resources?success=1&type=${resourceType}`);
          } else if (serviceId && date && time) {
            // Service booking: book the slot after payment
            setBookingInProgress(true);
            // Get booking data from sessionStorage
            const bookingDataRaw = sessionStorage.getItem("serviceBookingData");
            let bookingData: any = {};
            if (bookingDataRaw) {
              bookingData = JSON.parse(bookingDataRaw);
            }
            // Compose FormData for booking (resume upload not supported after payment)
            const formData = new FormData();
            formData.append("serviceId", serviceId);
            formData.append("date", date);
            formData.append("time", time);
            // Ensure service_name is always set
            formData.append(
              "service_name",
              serviceName || bookingData.name || ""
            );
            formData.append("phone", bookingData.phone || "");
            formData.append("email", bookingData.email || "");
            formData.append("state", bookingData.state || "");
            formData.append("targetRole", bookingData.targetRole || "");
            formData.append("language", bookingData.language || "Hinglish");
            formData.append("payment_status", "paid");
            formData.append("order_id", order_id);

            // Note: Resume file cannot be attached after payment unless handled via backend or upload before payment

            try {
              const bookingRes = await fetch(
                `${BACKEND_URL}/session/booking/book`,
                {
                  method: "POST",
                  credentials: "include",
                  body: formData,
                }
              );
              if (!bookingRes.ok) {
                const errorData = await bookingRes.json().catch(() => ({}));
                throw new Error(
                  errorData.message ||
                    `Failed to book slot (Status: ${bookingRes.status})`
                );
              }
              // Clear booking data from sessionStorage
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
            // Default: premium subscription
            navigate("/profile");
          }
        } else {
          toast.error(res.data.message || "Payment verification failed.");
          // Redirect based on context
          if (resourceType) {
            navigate(`/resources?error=1&type=${resourceType}`);
          } else if (serviceId && date && time) {
            navigate(
              `/services/${serviceId}/booking?date=${encodeURIComponent(
                date
              )}&time=${encodeURIComponent(time)}&error=1`
            );
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
