import CommunityServices from "@/components/Services/CommunityServices";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import {
  downloadResumeTemplate,
  downloadHrEmailTemplate,
  downloadReferralTemplate,
  downloadColdMailTemplate,
  downloadCoverLetterTemplate,
} from "../redux/slices/resourceSlice";
import { fetchCurrentUser } from "../redux/slices/userSlice";
import { RootState, AppDispatch } from "../redux/store";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "../redux/config";

const parseDescription = (desc: string) => {
  const [main, whatYouGet] = desc.split("What you get:");
  const points =
    whatYouGet
      ?.split("\n")
      .map((line) => line.trim())
      .filter((line) => !!line) || [];
  return { main: main?.trim(), points };
};

const ResourcesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [loading, setLoading] = useState(false); // Only for payment
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  // Check for payment success in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const type = urlParams.get("type");

    if (success === "1" && type) {
      toast.success(
        `Payment successful! Your ${type} template is now available for download.`
      );
      // Refresh user data to get updated permissions
      dispatch(fetchCurrentUser());
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [dispatch]);

  // Load Cashfree SDK
  useEffect(() => {
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
  // Payment handler
  const handleUpgradeSubscription = async (requiredBoolean: string) => {
    if (!user) {
      toast.error("Please login to access this resource.");
      return;
    }

    if (!sdkLoaded || !window.Cashfree) {
      toast.error("Payment gateway is not available. Please try again later.");
      return;
    }

    let amountInPaise = 0;
    if (requiredBoolean === "resume") {
      amountInPaise = 79; // ₹4
    } else if (
      ["referral", "cold_mail", "cover_letter", "hr_mail"].includes(
        requiredBoolean
      )
    ) {
      amountInPaise = 49; // ₹1
    } else {
      return;
    }

    setLoading(true);
    try {
      const orderRes = await axios.post(`${BACKEND_URL}/payment/create-order`, {
        amount: amountInPaise,
        name: user.name,
        email: user.email,
        phone: user.phone_number || "+919876543210",
      });
      const { payment_session_id, order_id } = orderRes.data;
      if (!payment_session_id)
        throw new Error("Payment session ID not found in response");
      if (
        !payment_session_id.startsWith("session_") ||
        /[^a-zA-Z0-9_-]/.test(payment_session_id)
      ) {
        throw new Error("Invalid payment session ID format");
      }
      const cashfree = new window.Cashfree({
        mode: "production",
      });
      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        returnUrl: `https://crackoffcampus.com/payment/verify?order_id=${order_id}&serviceName=${requiredBoolean}&resourceType=${requiredBoolean}`,
        redirectTarget: "_blank" as "_blank",
      };
      cashfree.checkout(checkoutOptions).then((result: any) => {
        if (result.error) {
          toast.error(`Payment error: ${result.error.message}`);
          setLoading(false);
        } else if (result.redirect) {
          toast.info("Redirecting to Cashfree payment gateway...");
        }
      });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Could not initiate payment. Please try again."
      );
      setLoading(false);
    }
  };
  // Helper for login check and error handling
  const requireLogin = async (
    action: () => Promise<any> | void,
    resourceId?: number
  ) => {
    if (!user) {
      toast.error("Please login to access this resource.");
      return;
    }
    if (resourceId) setDownloadingId(resourceId);
    try {
      await action();
    } catch (error: any) {
      // Handle specific error messages from the backend
      const errorMessage = error.message || "Failed to download resource";
      if (errorMessage.includes("Access denied")) {
        toast.error("Access denied. Please purchase this resource first.");
      } else if (errorMessage.includes("Not authenticated")) {
        toast.error("Please login to download this resource.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      if (resourceId) setDownloadingId(null);
    }
  };

  // Resource definitions with requiredBoolean for access
  const resources = [
    {
      id: 1,
      title: "Resume Template",
      description:
        "Start applying with a well-structured resume template. It helps you stand out to recruiters and boosts your chances of landing your job.\n\nWhat you get:\n A Editable ATS Friendly resume template",
      buttonText: "Get a Resume Template",
      imagePath: "/lovable-uploads/Resume Template.png",
      imageAlt: "Resume Template",
      action: () => requireLogin(() => dispatch(downloadResumeTemplate()), 1),
      requiredBoolean: "resume",
    },
    {
      id: 2,
      title: "Referral Template",
      description:
        "Reach out the right way with a clear referral template. It increases your chances of getting noticed and referred for the job you want.\n\nWhat you get:\n A Editable referral template.",
      buttonText: "Get a Referral Template",
      imagePath: "/lovable-uploads/refralTemplate.png",
      imageAlt: "Referral Template",
      action: () => requireLogin(() => dispatch(downloadReferralTemplate()), 2),
      requiredBoolean: "referral",
    },
    {
      id: 3,
      title: "Cold Email Template",
      description:
        "Make a strong first impression with a clear cold email template — increase your chances of getting replies and landing the opportunities you're aiming for.\n\nWhat you get:\nA Editable cold email template.",
      buttonText: "Get a Cold Email Template",
      imagePath: "/lovable-uploads/ColdEmail.png",
      imageAlt: "Cold Email Template",
      action: () => requireLogin(() => dispatch(downloadColdMailTemplate()), 3),
      requiredBoolean: "cold_mail",
    },
    {
      id: 4,
      title: "Cover Letter",
      description:
        "Start your job application with a clear cover letter — it adds a personal touch and increases your chances of getting shortlisted.\n\nWhat you get:\n A Editable cover letter template.",
      buttonText: "Get a Cover Letter",
      imagePath: "/lovable-uploads/cover_letter-removebg-preview.png",
      imageAlt: "Cover Letter",
      action: () =>
        requireLogin(() => dispatch(downloadCoverLetterTemplate()), 4),
      requiredBoolean: "cover_letter",
    },
    {
      id: 5,
      title: "9000+ Verified HR Emails",
      description:
        "Start building meaningful connections with a trusted HR emails sheet — get noticed and improve your chances of landing interviews.\n\nWhat you get:\n 9000+ verified HR emails Sheet.",
      buttonText: "Get Verified HR Emails",
      imagePath: "/lovable-uploads/hr_contants-removebg-preview.png",
      imageAlt: "HR Contact Directory",
      action: () => requireLogin(() => dispatch(downloadHrEmailTemplate()), 5),
      requiredBoolean: "hr_mail",
    },
    {
      id: 6,
      title: "LinkedIn Optimize Profile",
      description:
        "Start networking smart with a well-optimized LinkedIn profile — it improves your chances of getting seen, approached, and hired.",
      buttonText: "Coming Soon",
      imagePath: "/lovable-uploads/LinkedinProfile.png",
      imageAlt: "LinkedIn Profile Optimization",
    },
    {
      id: 7,
      title: "CV Template",
      description:
        " Start applying with a well-structured CV template it helps you stand out to recruiters and boosts your chances of landing your job.",
      buttonText: "Coming Soon",
      imagePath: "/lovable-uploads/CV Template.png",
      imageAlt: "HR Contact Directory",
    },
    {
      id: 8,
      title: "Roadmaps",
      description:
        " Career roadmaps to help you navigate your professional journey with confidence.",
      buttonText: "Coming Soon",
      imagePath: "/lovable-uploads/Roadmap-removebg-preview.png",
      imageAlt: "Career Roadmaps",
    },
    {
      id: 9,
      title: "Projects Ideation",
      description:
        "Get inspired with project ideas that will enhance your portfolio and showcase your skills to potential employers.",
      buttonText: "Coming Soon",
      imagePath: "/lovable-uploads/Project Ideation.png",
      imageAlt: "Projects Ideation",
    },
    {
      id: 10,
      title: "Interview Preparation",
      description:
        " Comprehensive interview preparation resources to help you ace your interviews and land your dream job.",
      buttonText: "Coming Soon",
      imagePath: "/lovable-uploads/Interview_pre-removebg-preview.png",
      imageAlt: "Interview Preparation",
    },
  ];

  return (
    <Layout>
      {/* Banner Section */}
      <section
        style={{ backgroundColor: "rgb(186, 175, 220)" }}
        className="py-8 md:py-12 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-4">
          Resources
        </h1>
        <p className="text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto">
          Access our comprehensive collection of placement resources designed to
          help you succeed in your job search and career advancement.
        </p>
      </section>

      {/* Resources List */}
      <section className="py-12 sm:py-16 bg-background dark:bg-gray-900">
        <div className="container">
          <div className="space-y-16 md:space-y-24">
            {resources.map((resource, index) => {
              const { main, points } = parseDescription(resource.description);
              const isDownloading = downloadingId === resource.id;
              return (
                <div
                  key={resource.id}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center gap-8 md:gap-12`}
                >
                  {/* Image */}
                  <div className="w-full md:w-2/5">
                    <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 p-6 flex items-center justify-center">
                      <img
                        src={resource.imagePath || "/placeholder.svg"}
                        alt={resource.imageAlt}
                        className="max-h-56 max-w-full w-auto object-contain"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-3/5 space-y-4">
                    <div
                      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                        index % 3 === 0
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          : index % 3 === 1
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      }`}
                    >
                      Resource {resource.id}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                      {resource.title}
                    </h2>
                    <div className="text-muted-foreground dark:text-gray-300 whitespace-pre-line">
                      {main}
                      {points.length > 0 && (
                        <div className="mt-3">
                          <div className="font-semibold mb-1">
                            What you get:
                          </div>
                          <ul className="space-y-2">
                            {points.map((point, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <FaCheck className="text-green-500 mt-1" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Button
                      className={`mt-2 bg-orange-500 hover:bg-orange-600 text-white${
                        isDownloading ? " blur-sm" : ""
                      }`}
                      size="lg"
                      disabled={
                        resource.buttonText === "Coming Soon" ||
                        loading ||
                        !sdkLoaded ||
                        isDownloading
                      }
                      onClick={async () => {
                        // If no requiredBoolean, just show coming soon
                        if (!resource.requiredBoolean) return;

                        // Debug: log user object and requiredBoolean
                        console.log("User object before download:", user);
                        console.log(
                          "Checking field:",
                          resource.requiredBoolean,
                          "Value:",
                          user ? user[resource.requiredBoolean] : undefined
                        );

                        // Check if user has access to the resource
                        if (user && user[resource.requiredBoolean] === true) {
                          // User has access, allow download
                          await resource.action();
                          return;
                        }

                        // User doesn't have access, redirect to payment
                        setLoading(true);
                        await handleUpgradeSubscription(
                          resource.requiredBoolean
                        );
                        setLoading(false);
                      }}
                    >
                      {isDownloading
                        ? "Downloading..."
                        : loading
                        ? "Processing..."
                        : !sdkLoaded
                        ? "Loading..."
                        : resource.buttonText === "Coming Soon"
                        ? "Coming Soon"
                        : user && user[resource.requiredBoolean] === true
                        ? "Download"
                        : resource.buttonText}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <CommunityServices />
    </Layout>
  );
};

export default ResourcesPage;
