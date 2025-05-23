"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function WhyChooseUs() {
  const navigate = useNavigate();

  const resources = [
    {
      title: "Resume Template",
      img: "/lovable-uploads/Resume Template.png",
      color: "bg-blue-100",
    },
    {
      title: "CV Template",
      img: "/lovable-uploads/CVTemplate.png",
      color: "bg-red-100",
    },
    {
      title: "Referral Template",
      img: "/lovable-uploads/refralTemplate.png",
      color: "bg-emerald-100",
    },
    {
      title: "Cold Email Template",
      img: "/lovable-uploads/ColdMailTemplate.png",
      color: "bg-amber-100",
    },
    {
      title: "Interview Preparation",
      img: "/lovable-uploads/InterviewPreparation.png",
      color: "bg-indigo-100",
    },
    {
      title: "Cover Letter",
      img: "/lovable-uploads/CoverLetter.png",
      color: "bg-purple-100",
    },
  ];

  const handleExploreResources = () => {
    navigate("/resources");
  };

  return (
    <section
      style={{ backgroundColor: "rgb(186, 175, 220)" }}
      className="py-8 sm:py-10 md:py-12 px-4 md:px-6 lg:px-8 text-black"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start md:items-center">
          {/* Left Side Text */}
          <div className="space-y-3 sm:space-y-4 mb-6 md:mb-0 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Placement Resources
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Prepare smarter with the right placement resources — from resume
              tips to interview prep, everything you need to boost your chances
              and crack the job.
            </p>
            <Button
              onClick={handleExploreResources}
              className="mt-2 sm:mt-4 bg-orange-500 hover:bg-orange-600 text-white border border-black/20 text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2"
            >
              Explore All Resources
            </Button>
          </div>

          {/* Right Side Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {resources.map((resource, index) => (
              <Card
                key={index}
                className="bg-gray-100 text-gray-800 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-2 sm:p-3 md:p-4 flex flex-col items-center text-center">
                  <div
                    className={`${resource.color} p-2 sm:p-3 md:p-4 rounded-full mb-2 md:mb-3`}
                  >
                    <img
                      src={resource.img || "/placeholder.svg"}
                      alt={resource.title}
                      className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-xs sm:text-sm line-clamp-2">
                    {resource.title}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
