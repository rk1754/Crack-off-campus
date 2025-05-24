"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, ArrowRight } from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { Button } from "../ui/button";

interface ServiceDetails {
  id: number;
  title: string;
  duration: string;
  amount: number;
  moreDetails?: string;
  whatIncluded?: string[] | { title: string; description: string }[];
  availableReferrals?: string[];
}

export default function BookingPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const getServiceDetails = (id: string | undefined): ServiceDetails => {
    const serviceMap: Record<string, ServiceDetails> = {
      "1": {
        id: 1,
        title: "Resume / CV Review",
        duration: "45 Mins",
        amount: 199,
        moreDetails:
          "We'll help you revise your resume as per industry standards.",
        whatIncluded: [
          {
            title: "Step 1:- Share Your Resume or Details",
            description:
              "Send us your existing resume or share your education, experience, and career goals.",
          },
          {
            title: "Step 2:- Profile Analysis & Discussion",
            description:
              "Our expert will connect with you to understand your background and the kind of roles you're targeting.",
          },
          {
            title: "Step 3:- Get ATS-Friendly Format Suggestions",
            description:
              "Our expert will guide you with the best format and structure that aligns with ATS (Applicant Tracking Systems) standards used by companies.",
          },
          {
            title: "Step 4 :-Receive Personalized Feedback",
            description:
              "You’ll get clear feedback on content, layout, and keywords to help you improve your resume and increase your chances of getting shortlisted.",
          },
        ],
      },
      "2": {
        id: 2,
        title: "LinkedIn Review",
        duration: "45 Mins",
        amount: 199,
        moreDetails:
          "Enhance your LinkedIn profile for better visibility and outreach.",
        whatIncluded: [
          {
            title: "Step 1: Share Your LinkedIn Profile",
            description:
              "Send us the link to your LinkedIn profile or share a summary of your professional background.",
          },
          {
            title: "Step 2: Profile Review by Experts",
            description:
              "Our expert will review your profile to assess headline, summary, experience, skills, and overall presentation.",
          },
          {
            title: "Step 3: Get Improvement Suggestions",
            description:
              "Our expert will provide personalized suggestions to make your profile more professional, recruiter-friendly, and aligned with your career goals.",
          },
          {
            title: "Step 4: Optimize for Visibility & Reach",
            description:
              "You’ll receive tips on keywords, networking, and content that help boost your profile’s visibility and attract the right opportunities.",
          },
        ],
      },
      "3": {
        id: 3,
        title: "Get a Referral",
        duration: "45 Mins",
        amount: 199,
        moreDetails: "Get referred to top companies with a tailored approach.",
        whatIncluded: [
          {
            title: "Step 1: Learn the Right Strategy",
            description:
              "Our expert will guide you on how to approach employees and what to avoid while asking for referrals.",
          },
          {
            title: "Step 2: Use Professional Templates",
            description:
              "Get access to well-crafted message and email referral templates that you can customize based on your job role and the company.",
          },
          {
            title: "Step 3: Reach Out Smartly",
            description:
              "Send your referral request either through LinkedIn or by email using the exact techniques our expert shares.",
          },
          {
            title: "Step 4: Stay Prepared for the Next Step",
            description:
              "Our expert will guide you on what to do after you get a response or referral.",
          },
        ],
      },
      "4": {
        id: 4,
        title: "Career Guidance ",
        duration: "45 Mins",
        amount: 199,
        moreDetails:
          "Discuss your career path, job options, and get referrals.",
        whatIncluded: [
          {
            title: "Step 1: Share Your Current Situation",
            description:
              "Tell us about your academic background, career goals, and any challenges you’re facing.",
          },
          {
            title: "Step 2: Personalized Career Roadmap",
            description:
              "Our expert will help you get a clear action plan including what skills to focus on, which opportunities to explore, and the best career paths based on your interests, skills, and industry trends.",
          },
        ],
      },
      "5": {
        id: 5,
        title: "Quick Chat",
        duration: "15 Mins",
        amount: 49,
        moreDetails: "A brief 1-on-1 session to solve any quick career query.",
        whatIncluded: [
          "Solve doubts related to resumes, interviews or job switching",
          "Fast and actionable advice",
        ],
      },
      "6": {
        id: 6,
        title: "Find Job & Internship Strategy",
        duration: "45 Minutes",
        amount: 299,
        moreDetails:
          "Build a complete job search roadmap to land your dream role.",
        whatIncluded: [
          {
            title: "Step 1: Share Your Career Goals and Preferences",
            description:
              "Tell us about your academic background, interests, and the type of job or internship you're looking for.",
          },
          {
            title: "Step 2: Discover the Best Job and Internship Platforms",
            description:
              "Our expert will introduce you to the best online job and internship platforms or portals where you can find relevant opportunities.",
          },
          {
            title: "Step 3: Learn How to Connect with HR on LinkedIn",
            description:
              "Our expert will advise on how to search for HR professionals on LinkedIn, and how to approach them professionally.",
          },
        ],
      },
      "7": {
        id: 7,
        title: "Get Hired on LinkedIn",
        duration: "45 Mins",
        amount: 199,
        moreDetails: "Crack the hidden job market via LinkedIn optimization.",
        whatIncluded: [
          "Profile overhaul and keyword alignment",
          "Engagement strategy to get noticed",
          "Messaging templates to connect with recruiters",
        ],
      },
    };

    return (
      serviceMap[id || ""] || {
        id: Number.parseInt(id || "0"),
        title: "Service",
        duration: "30 Mins",
        amount: 199,
      }
    );
  };

  const service = getServiceDetails(serviceId);

  const handleGoBack = () => navigate("/services");

  const handleConfirmSlots = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time before proceeding.");
      return;
    }

    navigate(`/services/${serviceId}/form`, {
      state: { date: selectedDate, time: selectedTime },
    });
  };

  const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const dayNum = date.getDate();
      dates.push({
        day,
        month,
        dayNum,
        fullDate: `${month} ${dayNum}`,
      });
    }
    return dates;
  };

  const dates = getDates();

  const timeSlots = [
    "9:00 PM",
    "9:30 PM",
    "10:00 PM",
    "10:30 PM",
    "11:30 PM",
    "12:30 PM",
  ];

  return (
    <div className="min-h-screen bg-[rgb(186,175,220)] text-black">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Panel */}
        <div className="bg-white text-gray-800 rounded-lg p-6 shadow-lg">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-black mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {service.title}
            </h1>
            {/* <div className="flex items-center">
              <span className="font-medium">5</span>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 ml-1" />
            </div> */}
          </div>

          <div className="space-y-6">
            <div className="border-b pb-4">
              <p className="text-gray-600 font-medium">Meeting Duration</p>
              <p className="text-xl font-bold">{service.duration}</p>
            </div>

            <div>
              <p className="text-gray-600 font-medium">Amount</p>
              <p className="text-2xl font-bold text-[#F97316]">
                ₹{service.amount}
              </p>
            </div>

            {service.moreDetails && (
              <div className="pt-4">
                <h2 className="text-lg font-semibold mb-3">More Details</h2>
                <p className="text-gray-600">{service.moreDetails}</p>
              </div>
            )}

            {service.whatIncluded && (
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  What this booking will include:
                </h2>

                {/* Render subtext paragraphs if whatIncluded is array of objects */}
                {Array.isArray(service.whatIncluded) &&
                typeof service.whatIncluded[0] === "object" ? (
                  <div className="space-y-4 text-gray-600">
                    {(
                      service.whatIncluded as {
                        title: string;
                        description: string;
                      }[]
                    ).map((item, i) => (
                      <div key={i}>
                        <p className="font-semibold">{item.title}</p>
                        <p>{item.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    {(service.whatIncluded as string[]).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {service.availableReferrals && (
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  We've Available Referrals from 250+ companies:
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  {service.availableReferrals.map((company, i) => (
                    <li key={i}>{company}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white text-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6">What day should we meet?</h2>

          <div className="flex justify-between mb-8">
            {dates.map(({ day, month, dayNum, fullDate }, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(fullDate)}
                className={`cursor-pointer rounded-lg border-2 px-4 py-2 text-center ${
                  selectedDate === fullDate
                    ? "bg-[#F97316] text-white border-[#F97316]"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                <p className="text-sm font-semibold">{day}</p>
                <p className="text-xs">{month}</p>
                <p className="text-lg font-bold">{dayNum}</p>
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-6">What time works best?</h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {timeSlots.map((time, i) => (
              <button
                key={i}
                onClick={() => setSelectedTime(time)}
                className={`cursor-pointer rounded-lg border-2 px-4 py-2 text-center ${
                  selectedTime === time
                    ? "bg-[#F97316] text-white border-[#F97316]"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <Button
              className="w-full bg-[#F97316] hover:bg-[#ea630e] text-white font-semibold text-lg py-3"
              onClick={handleConfirmSlots}
            >
              Starts From 5 June
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
