"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Calendar, Star } from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useResumeUpload } from "../../hooks/useResumeUpload";

interface ServiceDetails {
  id: number;
  title: string;
}

export default function FormPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const location = useLocation();
  // Get slot info from navigation state
  const { date, time, amount } = (location.state || {}) as {
    date?: string;
    time?: string;
    amount: string;
  };
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    resume: null as File | null,
    resumeUrl: "" as string,
    state: "",
    targetRole: "",
    language: "Hinglish",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // Resume upload hook
  const { uploadResume, isUploading, uploadProgress } = useResumeUpload();

  // Get user from Redux store
  const user = useSelector((state: any) => state.user?.user);
  const subscriptionType =
    user?.subscription_type || user?.subscription_type_2 || "regular";

  const BACKEND_URL = "https://api.crackoffcampus.com";
  // const BACKEND_URL = "http://localhost:5454";

  const getServiceTitle = (id: string | undefined): string => {
    const titleMap: Record<string, string> = {
      "1": "Resume / CV Review",
      "2": "LinkedIn Review",
      "3": "Get a Referral",
      "4": "Personalized Projects for Your Target Role",
      "5": "Quick Chat",
      "6": "Find Job & Internship Strategy",
      "7": "Get Hired on LinkedIn",
    };
    return titleMap[id || ""] || "Service";
  };

  const serviceTitle = getServiceTitle(serviceId);
  console.log("Service Title:", serviceTitle);
  const handleGoBack = () => {
    navigate(`/services/${serviceId}/booking`);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setError("Resume file size exceeds 2 MB");
        return;
      }
      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  // Load Cashfree SDK on mount
  useEffect(() => {
    console.log(amount);
    const loadCashfreeSDK = async () => {
      if (document.getElementById("cashfree-sdk") || window.Cashfree) {
        setSdkLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "cashfree-sdk";
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      script.onload = () => setSdkLoaded(true);
      script.onerror = () => {
        setSdkLoaded(false);
        toast.error("Failed to load Cashfree SDK. Please try again.");
      };
      document.body.appendChild(script);
    };
    loadCashfreeSDK();
    return () => {
      const existingScript = document.getElementById("cashfree-sdk");
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      setSdkLoaded(false);
    };
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.state ||
      !formData.resume
    ) {
      setError("Please fill all required fields.");
      return;
    }
    if (!date || !time) {
      setError("Please select a slot before proceeding.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // First, upload the resume and get the URL
      const resumeUrl = await uploadResume(formData.resume);

      // Update form data with resume URL
      setFormData((prev) => ({ ...prev, resumeUrl }));

      // Booster user direct booking for Resume Review or Referral
      if (
        subscriptionType === "booster" &&
        (serviceId === "1" || serviceId === "3")
      ) {
        // Direct booking API call with resume URL
        const bookingData = {
          serviceId: serviceId || "",
          service_name: serviceTitle,
          date,
          time,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          state: formData.state,
          targetRole: formData.targetRole,
          language: formData.language,
          resume_url: resumeUrl,
        };

        await axios.post(
          `${BACKEND_URL}/api/v1/session/booking/book`,
          bookingData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Booking successful! Check your email for details.");
        navigate("/services/booking/success");
        setIsSubmitting(false);
        return;
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error.message ||
          "An error occurred while uploading resume or booking."
      );
      setIsSubmitting(false);
      return;
    }
    if (!sdkLoaded || !window.Cashfree) {
      setError("Payment gateway is not available. Please try again later.");
      return;
    }

    try {
      // First upload resume and get URL if not already uploaded
      let resumeUrl = formData.resumeUrl;
      if (!resumeUrl && formData.resume) {
        resumeUrl = await uploadResume(formData.resume);
        setFormData((prev) => ({ ...prev, resumeUrl }));
      }

      // Store booking form data in sessionStorage for use after payment
      sessionStorage.setItem(
        "serviceBookingData",
        JSON.stringify({
          serviceId,
          date,
          time,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          state: formData.state,
          targetRole: formData.targetRole,
          language: formData.language,
          resume_url: resumeUrl, // Store resume URL instead of file
        })
      ); // 1. Create Cashfree order (call your backend endpoint)
      console.log(amount);
      const paymentOrderRes = await axios.post(
        `${BACKEND_URL}/api/v1/payment/create-order`,
        {
          amount: Number(amount), // You may want to get the actual amount dynamically
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }
      );
      const { payment_session_id, order_id } = paymentOrderRes.data;
      if (!payment_session_id) {
        throw new Error("Payment session ID not found in response");
      }
      if (
        !payment_session_id.startsWith("session_") ||
        /[^a-zA-Z0-9_-]/.test(payment_session_id)
      ) {
        throw new Error("Invalid payment session ID format");
      }

      // 2. Trigger Cashfree checkout
      const cashfree = new window.Cashfree({ mode: "production" });
      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        returnUrl: `https://www.crackoffcampus.com/payment/verify?order_id=${order_id}&date=${encodeURIComponent(
          date
        )}&time=${encodeURIComponent(
          time
        )}&serviceId=${serviceId}&serviceName=${encodeURIComponent(
          serviceTitle
        )}`,
        redirectTarget: "_blank" as "_blank",
      };
      cashfree.checkout(checkoutOptions).then((result: any) => {
        if (result.error) {
          setError(`Payment error: ${result.error.message}`);
          setIsSubmitting(false);
        }
        // No further action here; booking will be handled after payment verification
      });
    } catch (error: any) {
      if (error.message && error.message.includes("Slot already booked")) {
        setError(
          "This slot has just been booked by someone else. Please select another slot."
        );
      } else if (error.message && error.message.includes("Failed to fetch")) {
        setError(
          "Cannot connect to the backend server. Please ensure the server is running on port 5454."
        );
      } else if (
        error.message &&
        error.message.toLowerCase().includes("unauthorized")
      ) {
        setError("You are not authorized. Please log in again.");
      } else {
        setError(
          error.message || "An error occurred while processing payment."
        );
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(186,175,220)] text-gray-800">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-[#fdfdfd] text-gray-800 rounded-lg p-6 shadow-lg">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-[#F97316] mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#F97316]">
              {serviceTitle}
            </h1>
            {/* <div className="flex items-center">
              <span className="font-medium">4.7</span>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 ml-1" />
            </div> */}
          </div>

          <div className="flex items-center mb-6 text-[#F97316]">
            <Calendar className="h-5 w-5 mr-2" />
            <div>
              <p className="font-medium">
                Date:{" "}
                {date ? (
                  date
                ) : (
                  <span className="text-red-500">Not selected</span>
                )}
              </p>
              <p className="text-sm text-gray-500">
                Time:{" "}
                {time ? (
                  time
                ) : (
                  <span className="text-red-500">Not selected</span>
                )}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto text-[#F97316] border-[#F97316]"
              onClick={() => navigate(`/services/${serviceId}/booking`)}
            >
              Change
            </Button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter your Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="border-gray-300"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="border-gray-300"
              />
            </div>{" "}
            <div className="space-y-2">
              <Label htmlFor="resume" className="text-gray-700">
                Upload your resume <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 ml-2">
                  (PDF, DOC, DOCX - less than 2 MB)
                </span>
              </Label>
              <div className="flex">
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                  className="border-gray-300"
                  disabled={isUploading}
                />
              </div>

              {/* Show selected file name */}
              {formData.resume && (
                <div className="text-sm text-gray-600 mt-1">
                  Selected file: {formData.resume.name}
                  {formData.resumeUrl && (
                    <span className="text-green-600 ml-2">✓ Uploaded</span>
                  )}
                </div>
              )}

              {/* Show upload progress */}
              {isUploading && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#F97316] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-gray-700">
                Select Your State <span className="text-red-500">*</span>
              </Label>
              <Input
                id="state"
                name="state"
                placeholder="Select Your State"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="text-gray-700">
                Select the Language <span className="text-red-500">*</span>
              </Label>
              <Input
                id="language"
                name="language"
                value={formData.language}
                readOnly
                disabled
                className="border-gray-300 bg-gray-100 cursor-not-allowed"
              />
            </div>{" "}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full bg-[#F97316] hover:bg-orange-600 text-white"
              >
                {isUploading
                  ? "Uploading Resume..."
                  : isSubmitting
                  ? "Processing..."
                  : "Confirm Details"}
              </Button>
              {(isSubmitting || isUploading) && (
                <p className="text-sm text-gray-600 mt-2">
                  {isUploading
                    ? "Please wait while we upload your resume..."
                    : "Processing your request..."}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
