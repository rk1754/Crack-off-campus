"use client";

import type React from "react";
import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Calendar, Star } from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface ServiceDetails {
  id: number;
  title: string;
}

export default function FormPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const location = useLocation();
  // Get slot info from navigation state
  const { date, time } = (location.state || {}) as {
    date?: string;
    time?: string;
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    resume: null as File | null,
    state: "",
    targetRole: "",
    language: "Hinglish",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = "http://localhost:5454";

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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (
  //     !formData.name ||
  //     !formData.phone ||
  //     !formData.email ||
  //     !formData.resume ||
  //     !formData.state
  //   ) {
  //     setError("Please fill all required fields.");
  //     return;
  //   }
  //   if (!date || !time) {
  //     setError("Please select a slot before proceeding.");
  //     return;
  //   }
  //   setIsSubmitting(true);
  //   setError(null);

  //   try {
  //     const token = localStorage.getItem("token");
  //     console.log(token);

  //     // Book the slot (send to backend)
  //     const bookingData = new FormData();
  //     bookingData.append("service_id", serviceId || "");
  //     bookingData.append("date", date);
  //     bookingData.append("time", time);
  //     bookingData.append("name", formData.name);
  //     bookingData.append("phone", formData.phone);
  //     bookingData.append("email", formData.email);
  //     if (formData.resume) {
  //       bookingData.append("resume", formData.resume);
  //     }
  //     bookingData.append("state", formData.state);
  //     bookingData.append("targetRole", formData.targetRole);
  //     bookingData.append("language", formData.language);
  //     console.log(bookingData);

  //     const response = await fetch(`${BACKEND_URL}/api/v1/session/booking/book`, {
  //       method: "POST",
  //       body: bookingData,
  //       credentials : "include"
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json().catch(() => ({}));
  //       throw new Error(
  //         errorData.message ||
  //           `Failed to book slot (Status: ${response.status})`
  //       );
  //     }

  //     // Success: go to payment page
  //     navigate(`/services/${serviceId}/payment`);
  //   } catch (error: any) {
  //     if (error.message.includes("Slot already booked")) {
  //       setError("This slot has just been booked by someone else. Please select another slot.");
  //     } else if (error.message.includes("Failed to fetch")) {
  //       setError(
  //         "Cannot connect to the backend server. Please ensure the server is running on port 5454."
  //       );
  //     } else {
  //       setError(
  //         error.message || "An error occurred while booking the slot."
  //       );
  //     }
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.state
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
      // Only send what backend expects
      const bookingData = {
        service_id: serviceId,
        date,
        time,
        payment_status: "pending", // or whatever default you want
      };

      const response = await fetch(
        `${BACKEND_URL}/api/v1/session/booking/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to book slot (Status: ${response.status})`
        );
      }

      // Success: go to payment page
      navigate(`/services/${serviceId}/payment`);
    } catch (error: any) {
      if (error.message.includes("Slot already booked")) {
        setError(
          "This slot has just been booked by someone else. Please select another slot."
        );
      } else if (error.message.includes("Failed to fetch")) {
        setError(
          "Cannot connect to the backend server. Please ensure the server is running on port 5454."
        );
      } else if (error.message.toLowerCase().includes("unauthorized")) {
        setError("You are not authorized. Please log in again.");
      } else {
        setError(error.message || "An error occurred while booking the slot.");
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume" className="text-gray-700">
                Upload your resume <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 ml-2">
                  (less than 2 MB)
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
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="ml-2 bg-[#F97316] text-white hover:bg-orange-600"
                >
                  Browse
                </Button>
              </div>
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
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#F97316] hover:bg-orange-600 text-white"
              >
                {isSubmitting ? "Processing..." : "Confirm Details"}
              </Button>
              {isSubmitting && (
                <p className="text-sm text-gray-600 mt-2">
                  Submission in progress...
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
