import CommunityServices from "@/components/Services/CommunityServices";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import {
  downloadResumeTemplate,
  downloadHrEmailTemplate,
  downloadReferralTemplate,
  downloadColdMailTemplate,
  downloadCoverLetterTemplate,
} from "../redux/slices/resourceSlice";
import {
  createPaymentOrder,
  verifyAndStorePayment,
} from "../redux/slices/paymentSlice";
import { RootState, AppDispatch } from "../redux/store";

// Razorpay key from env for production
const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_GBC6wsiyhZIszp";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const parseDescription = (desc: string) => {
  // Split description into main and "What you get" section
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
  const { error, order, loading } = useSelector(
    (state: RootState) => state.payment
  );
  const userSubscription = useSelector(
    (state: RootState) => state.user.user?.subscription_type
  );
  const user = useSelector((state: RootState) => state.user.user);

  // Payment handler
  const handleUpgradeSubscription = async (
    requiredSubscriptionType: string
  ) => {
    let amountInPaise = 0;
    if (requiredSubscriptionType === "resume") {
      amountInPaise = 7900; // 79 INR
    } else if (requiredSubscriptionType === "other_templates") {
      amountInPaise = 4900; // 49 INR
    } else {
      return;
    }
    if (amountInPaise > 0) {
      dispatch(createPaymentOrder(amountInPaise));
    }
  };

  // Razorpay effect
  useEffect(() => {
    const openRazorpay = async () => {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }
      if (order && order.order_id) {
        let paymentDescription = "Upgrade Subscription";
        if (order.amount === 7900)
          paymentDescription = "Payment for Resume Template Access";
        else if (order.amount === 4900)
          paymentDescription = "Payment for Templates Access";

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Crack off Campus",
          description: paymentDescription,
          order_id: order.order_id,
          handler: async (response: any) => {
            dispatch(
              verifyAndStorePayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: order.amount, // Assuming backend expects amount in paise
                currency: "INR",
                user_id: user?.id,
              })
            );
          },
          theme: { color: "#F37254" },
        };
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    };
    if (order && order.order_id) {
      openRazorpay();
    }
  }, [order, dispatch, user]);

  // Access logic
  const canAccess = (resource: any) => {
    if (["booster", "standard", "basic"].includes(userSubscription))
      return true;
    if (
      resource.requiredSubscription === "resume" &&
      userSubscription === "resume"
    )
      return true;
    if (
      resource.requiredSubscription === "other_templates" &&
      userSubscription === "other_templates"
    )
      return true;
    return false;
  };

  // Helper for login check
  const requireLogin = (action: () => void) => {
    if (!user) {
      alert("Please login to access this resource.");
      return;
    }
    action();
  };

  const resources = [
    {
      id: 1,
      title: "Resume Template",
      description:
        "Start applying with a well-structured resume template. It helps you stand out to recruiters and boosts your chances of landing your job.\n\nWhat you get:\n Editable Resume ATS Template\n Recorded session on how to edit this resume according to your profile.\n Shortlisted sample resume",
      buttonText: "Get a Resume Template",
      imagePath: "/lovable-uploads/Resume Template.png",
      imageAlt: "Resume Template",
      action: () => requireLogin(() => dispatch(downloadResumeTemplate())),
      requiredSubscription: "resume",
    },
    {
      id: 2,
      title: "Referral Template",
      description:
        "Reach out the right way with a clear referral template. It increases your chances of getting noticed and referred for the job you want.\n\nWhat you get:\n Editable Referral template\n Recorded session on how to edit this referral template according to your profile.",
      buttonText: "Get a Referral Template",
      imagePath: "/lovable-uploads/refralTemplate.png",
      imageAlt: "Referral Template",
      action: () => requireLogin(() => dispatch(downloadReferralTemplate())),
      requiredSubscription: "other_templates",
    },
    {
      id: 3,
      title: "Cold Email Template",
      description:
        "Make a strong first impression with a clear cold email template — increase your chances of getting replies and landing the opportunities you're aiming for.\n\nWhat you get:\n Editable Cold email template\n Recorded session on how to edit this cold email template according to your profile and how to send on recruiter email.",
      buttonText: "Get a Cold Email Template",
      imagePath: "/lovable-uploads/ColdEmail.png",
      imageAlt: "Cold Email Template",
      action: () => requireLogin(() => dispatch(downloadColdMailTemplate())),
      requiredSubscription: "other_templates",
    },
    {
      id: 4,
      title: "Cover Letter",
      description:
        "Start your job application with a clear cover letter — it adds a personal touch and increases your chances of getting shortlisted.\n\nWhat you get:\n Editable Cover letter template\n Recorded session on how to edit this cover letter according to your profile and how to send on recruiter email.",
      buttonText: "Get a Cover Letter",
      imagePath: "/lovable-uploads/cover_letter-removebg-preview.png",
      imageAlt: "Cover Letter",
      action: () => requireLogin(() => dispatch(downloadCoverLetterTemplate())),
      requiredSubscription: "other_templates",
    },
    {
      id: 5,
      title: "HR Email Template",
      description:
        "Start building meaningful connections with a trusted HR Contact Directory — get noticed and improve your chances of landing interviews.\n\nWhat you get:\n 9000+ verified HR emails Sheet in which will be company names and emails. A recorded session on how to contact HR`s.",
      buttonText: "Get Verified HR Emails",
      imagePath: "/lovable-uploads/hr_contants-removebg-preview.png",
      imageAlt: "HR Contact Directory",
      action: () => requireLogin(() => dispatch(downloadHrEmailTemplate())),
      requiredSubscription: "other_templates",
    },
    {
      id: 6,
      title: "LinkedIn Optimize Profile",
      description:
        "Start networking smart with a well-optimized LinkedIn profile — it improves your chances of getting seen, approached, and hired.",
      buttonText: "Optimize Your LinkedIn Profile",
      imagePath: "/lovable-uploads/LinkedinProfile.png",
      imageAlt: "LinkedIn Profile Optimization",
    },
    {
      id: 7,
      title: "9000+ Verified HR`s Emails",
      description:
        "Start building meaningful connections with a trusted HR Contact Directory — get noticed and improve your chances of landing interviews.\n\nWhat you get:\n 9000+ verified HR emails Sheet in which will be company names and emails. A recorded session on how to contact HR`s.",
      buttonText: "Get Verified HR Eamils",
      imagePath: "/lovable-uploads/hr_contants-removebg-preview.png",
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
                      className="mt-2 bg-orange-500 hover:bg-orange-600 text-white"
                      size="lg"
                      disabled={
                        resource.buttonText === "Coming Soon" || loading
                      }
                      onClick={
                        canAccess(resource)
                          ? resource.action
                          : () =>
                              user
                                ? handleUpgradeSubscription(
                                    resource.requiredSubscription
                                  )
                                : alert("Please login to access this resource.")
                      }
                    >
                      {resource.buttonText}
                    </Button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
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
