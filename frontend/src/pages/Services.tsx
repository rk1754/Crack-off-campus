import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Linkedin,
  FolderGit2,
  Share2,
  MessageSquare,
  Mic,
  Briefcase,
  GraduationCap,
  Users,
  Globe,
  ClipboardCheck,
  Video,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";

interface ServiceCardProps {
  id: number;
  title: string;
  tagline: string;
  meetingDuration: string;
  amount: number | null;
  originalPrice?: number;
  icon: React.ElementType;
  color: string;
  iconColor: string;
  isComingSoon: boolean;
}

const ServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceCardProps[]>([
    {
      id: 1,
      title: "Resume / CV Review",
      tagline: "Don't just submit, Stand out. Perfect your resume with us.",
      meetingDuration: "45 Minutes",
      amount: 199,
      originalPrice: 499,
      icon: FileText,
      color: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      isComingSoon: false,
    },
    {
      id: 2,
      title: "LinkedIn Review",
      tagline: "Turn views into interviews with a standout profile.",
      meetingDuration: "45 Minutes",
      amount: 199,
      originalPrice: 499,
      icon: Linkedin,
      color: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      isComingSoon: false,
    },
    {
      id: 3,
      title: "Get a Referral",
      tagline: "Land interviews faster with a real referral.",
      meetingDuration: "45 Minutes",
      amount: 199,
      originalPrice: 499,
      icon: Share2,
      color: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      isComingSoon: false,
    },
    {
      id: 4,
      title: "Career Guidance",
      tagline: "Align your goals with the right opportunities.",
      meetingDuration: "45 Minutes",
      amount: 199,
      originalPrice: 499,
      icon: GraduationCap,
      color: "bg-indigo-100 dark:bg-indigo-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      isComingSoon: false,
    },
    {
      id: 5,
      title: "Quick Chat",
      tagline: "One chat could change your placement game.",
      meetingDuration: "15 Minutes",
      amount: 49,
      originalPrice: 119,
      icon: MessageSquare,
      color: "bg-pink-100 dark:bg-pink-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      isComingSoon: false,
    },
    {
      id: 6,
      title: "Find Jobs & Internships Strategy",
      tagline: "Learn how to search — the smart way.",
      meetingDuration: "45 Minutes",
      amount: 299,
      originalPrice: 699,
      icon: Briefcase,
      color: "bg-amber-100 dark:bg-amber-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      isComingSoon: false,
    },
    {
      id: 7,
      title: "Get Hired on LinkedIn",
      tagline: "Master LinkedIn job hunting like a pro.",
      meetingDuration: "45 Minutes",
      amount: 299,
      originalPrice: 699,
      icon: Globe,
      color: "bg-teal-100 dark:bg-teal-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      isComingSoon: true,
    },
    {
      id: 8,
      title: "Interview Prep & Tips",
      tagline: "Crack tough questions with smart answers.",
      meetingDuration: "45 Minutes",
      amount: 199,
      originalPrice: 499,
      icon: Mic,
      color: "bg-cyan-100 dark:bg-cyan-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      isComingSoon: true,
    },
    {
      id: 9,
      title: "Project Review",
      tagline: "Make your project shine in interviews.",
      meetingDuration: "45 Minutes",
      amount: 199,
      originalPrice: 499,
      icon: FolderGit2,
      color: "bg-orange-100 dark:bg-orange-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      isComingSoon: true,
    },
    {
      id: 10,
      title: "Full Mentorship",
      tagline: "One-on-one guidance for your placement journey.",
      meetingDuration: "1 Hour",
      amount: 799,
      originalPrice: 1499,
      icon: Users,
      color: "bg-rose-100 dark:bg-rose-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      isComingSoon: true,
    },
    {
      id: 11,
      title: "Mock Interview",
      tagline: "Get interview-ready with real-time mock sessions.",
      meetingDuration: "45 Minutes",
      amount: 299,
      originalPrice: 699,
      icon: ClipboardCheck,
      color: "bg-slate-100 dark:bg-slate-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      isComingSoon: true,
    },
    {
      id: 12,
      title: "Webinar",
      tagline: "Webinar to boost your off-campus placement journey.",
      meetingDuration: "1 Hour",
      amount: null,
      originalPrice: undefined,
      icon: Video,
      color: "bg-neutral-100 dark:bg-neutral-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      isComingSoon: true,
    },
  ]);

  const handleServiceRequest = (serviceId: number) => {
    navigate(`/services/${serviceId}`);
  };

  const ServiceCard = ({
    id,
    title,
    tagline,
    meetingDuration,
    amount,
    originalPrice,
    icon: Icon,
    color,
    iconColor,
    isComingSoon,
  }: ServiceCardProps) => (
    <div className="bg-white shadow-md hover:shadow-2xl rounded-2xl overflow-hidden border border-gray-200 flex flex-col transition-transform duration-300 hover:scale-[1.02] min-h-[320px]">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6 flex-grow">{tagline}</p>

        <div className="mt-auto">
          <div className="bg-gray-100 dark:bg-gray-800/20 rounded-lg p-4 mb-4">
            <div className="flex justify-between border-b border-gray-200 pb-2 mb-2 text-sm text-gray-600">
              <span>Meeting Duration</span>
              <span className="font-medium">{meetingDuration}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Amount</span>
              <span className="flex items-center gap-2">
                {originalPrice && amount !== null && (
                  <span className="line-through text-gray-500 text-xs">
                    ₹{originalPrice}
                  </span>
                )}
                <span className="text-xl font-bold text-gray-800">
                  {amount === null || amount === 0 ? "Free" : `₹${amount}`}
                </span>
              </span>
            </div>
          </div>
          {!isComingSoon ? (
            <Button
              onClick={() => handleServiceRequest(id)}
              className="w-full bg-[rgb(150,130,209)] hover:bg-[rgb(160,140,220)] text-white transition-colors"
            >
              {title === "Quick Chat" ? "Chat Now" : "Book Now"}
            </Button>
          ) : (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 py-2 px-4 rounded-lg text-center font-semibold">
              Coming Soon
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <section
        className="py-16 text-center relative"
        style={{ backgroundColor: "rgb(186, 175, 220)" }}
      >
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
            Our Services
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-200">
            Unlock expert guidance and accelerate your placement journey.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/10 dark:to-gray-900/30"></div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
