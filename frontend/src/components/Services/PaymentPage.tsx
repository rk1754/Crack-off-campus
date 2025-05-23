"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { Button } from "../ui/button";
import { Helmet } from "react-helmet-async";

interface ServiceDetails {
  id: number;
  title: string;
  amount: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  // Mock service data based on ID
  const getServiceDetails = (id: string | undefined): ServiceDetails => {
    const serviceMap: Record<string, ServiceDetails> = {
      "1": {
        id: 1,
        title: "Resume / CV Review",
        amount: 199,
      },
      "2": {
        id: 2,
        title: "LinkedIn Review",
        amount: 199,
      },
      "3": {
        id: 3,
        title: "Get a Referral",
        amount: 199,
      },
      "4": {
        id: 4,
        title: "Career Guidance | Referral (Exp: 0-2 years)",
        amount: 199,
      },
      "5": {
        id: 5,
        title: "Quick Chat",
        amount: 49,
      },
      "6": {
        id: 6,
        title: "Find Job & Internship Strategy",
        amount: 299,
      },
      "7": {
        id: 7,
        title: "Get Hired on LinkedIn",
        amount: 199,
      },
    };

    return (
      serviceMap[id || ""] || {
        id: Number.parseInt(id || "0"),
        title: "Service",
        amount: 199,
      }
    );
  };

  const service = getServiceDetails(serviceId);
  const pageTitle = `Payment for ${service.title} - Crack Off Campus`;
  const metaDescription = `Complete your payment for the service: ${service.title}. Crack Off Campus offers placement support, resume reviews, job referrals, and career guidance for students and freshers.`;
  const metaKeywords =
    "off campus placements, resume review, job referrals, LinkedIn profile review, internship search, fresher jobs, mock interviews, career mentorship, ATS resume, job portal for students, placement support, Crack Off Campus, student job help, interview preparation, career guidance, final year jobs, tech jobs for freshers, career bootcamp, job application strategy, resume feedback, HR email list, off campus drive";

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsLoading(false);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoBack = () => {
    navigate(`/services/${serviceId}/form`);
  };

  const initializeRazorpay = () => {
    if (isLoading) return;

    setPaymentInitiated(true);

    // In a real app, you would get this from your backend
    const options = {
      key: "rzp_test_GBC6wsiyhZIszp", // Replace with your actual Razorpay key
      amount: service.amount * 100, // Amount in paise
      currency: "INR",
      name: "Engineer Hub",
      description: `Payment for ${service.title}`,
      image: "https://www.engineerhub.in/logo.png",
      handler: (response: any) => {
        // Handle successful payment
        console.log("Payment successful:", response);
        navigate(`/services/${serviceId}/success`);
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#157373",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        {/* You can also add other meta tags like og:image, og:url, etc. */}
      </Helmet>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />

        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-500 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Complete Your Payment</h1>
              <p className="text-gray-600">
                You're almost there! Complete your payment to confirm your
                booking.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <h2 className="font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium">{service.title}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">May 15, 2025</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">05:50 PM</span>
                </div>

                <div className="border-t border-gray-200 my-3"></div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{service.amount}</span>
                </div>

                <div className="border-t border-gray-200 my-3"></div>

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{service.amount}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Secure payment powered by Razorpay</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>
                  Your information is protected with industry-standard
                  encryption
                </span>
              </div>

              <Button
                onClick={initializeRazorpay}
                disabled={isLoading || paymentInitiated}
                className="w-full bg-[rgb(150,130,209)] hover:bg-[rgb(160,140,220)] text-white"
              >
                {isLoading
                  ? "Loading..."
                  : paymentInitiated
                  ? "Processing..."
                  : "Pay Now"}
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
