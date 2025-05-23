import React from "react";
import Layout from "../components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Assuming shadcn/ui accordion

interface FaqItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

const faqData: FaqItem[] = [
  // General Questions
  {
    id: "general-1",
    question: "What is Crack Off-Campus?",
    answer:
      "Crack Off-Campus is a comprehensive platform designed to assist students and recent graduates in navigating the off-campus job market. We provide job listings, career enhancement services, premium subscriptions with exclusive resources, and learning materials to help you succeed.",
  },
  {
    id: "general-2",
    question: "Who is this platform for?",
    answer:
      "Our platform is primarily for students, recent graduates seeking off-campus job placements and internships, and any job seeker looking to enhance their career prospects through our specialized services and resources.",
  },
  {
    id: "general-3",
    question: "How do I create an account?",
    answer: (
      <>
        You can create an account by clicking on the "Sign Up" or "Register"
        button, usually found in the navigation bar. You'll need to provide some
        basic information like your name, email address, and create a password.
      </>
    ),
  },
  // Job Listings
  {
    id: "jobs-1",
    question: "How do I search for jobs on Crack Off-Campus?",
    answer:
      "You can search for jobs using our search bar on the homepage or by navigating to the 'Jobs' page. You can filter listings by keywords, location, job type, and other criteria to find relevant opportunities.",
  },
  {
    id: "jobs-2",
    question: "Are all job listings verified?",
    answer:
      "We strive to list legitimate job opportunities. However, we recommend users exercise due diligence and research companies before applying or sharing personal information. If you encounter a suspicious listing, please report it to us.",
  },
  {
    id: "jobs-3",
    question: "What are premium job listings?",
    answer:
      "Premium job listings are exclusive opportunities that are typically accessible to users with an active premium subscription. These may include jobs from top companies or roles with specific benefits.",
  },
  // Career Services
  {
    id: "services-1",
    question: "What career services do you offer?",
    answer:
      "We offer a range of paid, one-on-one career services, including Resume/CV Review, LinkedIn Profile Optimization, Mock Interviews, Career Guidance & Strategy Sessions, and Referral Assistance. You can find more details on our 'Services' page.",
  },
  {
    id: "services-2",
    question: "How do I book a career service?",
    answer:
      "You can book a service by visiting the specific service page, selecting any available options, and completing the payment process. Once your booking and payment are confirmed, we will reach out to schedule your session.",
  },
  {
    id: "services-3",
    question: "Can I reschedule or cancel a booked service?",
    answer: (
      <>
        Generally, payments for booked services are non-refundable. You may be
        able to reschedule a service session with advance notice (e.g., 48
        hours), subject to availability and our policy outlined in the Terms and
        Conditions. Please contact us at{" "}
        <a
          href="mailto:support@crackoffcampus.com"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          support@crackoffcampus.com
        </a>{" "}
        for assistance.
      </>
    ),
  },
  // Premium Subscriptions
  {
    id: "premium-1",
    question: "What are the benefits of a premium subscription?",
    answer:
      "Premium subscriptions (e.g., BASIC, STANDARD, BOOSTER) unlock exclusive benefits such as access to premium job listings, downloadable resources (like resume templates, cover letters), and potentially bundled career services or access to HR contact directories. Details are available on our 'Pricing' or 'Premium Plans' page.",
  },
  {
    id: "premium-2",
    question: "How do I purchase a premium subscription?",
    answer:
      "You can purchase a premium subscription by visiting our 'Pricing' or 'Premium Plans' page, selecting the plan that suits you, and completing the payment process.",
  },
  {
    id: "premium-3",
    question: "Are subscription fees refundable?",
    answer:
      "Subscription fees are generally non-refundable, regardless of your usage of the premium features during the subscription period, as stated in our Terms and Conditions.",
  },
  {
    id: "premium-4",
    question: "Does my subscription auto-renew?",
    answer:
      "Currently, our subscriptions do not auto-renew unless explicitly stated at the time of purchase. You will need to manually renew your subscription to continue enjoying premium benefits after your current plan expires.",
  },
  // Payments
  {
    id: "payments-1",
    question: "What payment methods do you accept?",
    answer:
      "We accept various payment methods through our third-party payment gateway, Razorpay. This typically includes credit/debit cards, net banking, UPI, and popular wallets.",
  },
  {
    id: "payments-2",
    question: "Is my payment information secure?",
    answer:
      "Yes, your payment information is processed securely by our trusted third-party payment gateway (Razorpay). We do not store your full card details on our servers. Please refer to Razorpay's security policies for more information.",
  },
  // Account & Technical
  {
    id: "account-1",
    question: "I forgot my password. How can I reset it?",
    answer:
      "If you've forgotten your password, you can click on the 'Forgot Password?' link on the login page. You'll receive an email with instructions on how to reset your password.",
  },
  {
    id: "account-2",
    question: "How can I update my profile information?",
    answer:
      "Once logged in, you can usually find an 'Account Settings' or 'My Profile' section where you can update your personal information, resume, and other details.",
  },
  {
    id: "account-3",
    question: "Who should I contact for support or if I have more questions?",
    answer: (
      <>
        If you have any further questions or need support, please feel free to
        contact us at{" "}
        <a
          href="mailto:support@crackoffcampus.com"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          support@crackoffcampus.com
        </a>
        , or use the contact form on our 'Contact Us' page.
      </>
    ),
  },
];

const FaqPage: React.FC = () => {
  return (
    <Layout>
      <section
        className="py-16 text-center relative"
        style={{ backgroundColor: "rgb(186, 175, 220)" }}
      >
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-200">
            Find answers to common questions about Crack Off-Campus.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/10 dark:to-gray-900/30"></div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqData.map((item) => (
            <AccordionItem
              value={item.id}
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 text-left text-base sm:text-lg font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800/30 text-sm sm:text-base leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </Layout>
  );
};

export default FaqPage;
