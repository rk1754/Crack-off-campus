"use client";

import type React from "react";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Code,
  Monitor,
  Server,
  Layers,
  Smartphone,
  Brain,
  BarChart2,
  TrendingUp,
  Cloud,
  Figma,
  Globe,
  Feather,
  Database,
  Code2,
  Coffee,
  AtSign,
  FileText,
  Settings,
  TestTube,
  CloudCog,
} from "lucide-react";

interface JobCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const BrowseByCategory = () => {
  const jobCategories: JobCategory[] = [
    {
      id: "software-engineer",
      title: "Software Engineer",
      icon: <Code className="w-6 h-6 text-blue-500" />,
    },
    {
      id: "frontend-developer",
      title: "Frontend Developer",
      icon: <Monitor className="w-6 h-6 text-purple-500" />,
    },
    {
      id: "backend-developer",
      title: "Backend Developer",
      icon: <Server className="w-6 h-6 text-green-500" />,
    },
    {
      id: "fullstack-developer",
      title: "Full Stack Developer",
      icon: <Layers className="w-6 h-6 text-indigo-500" />,
    },
    {
      id: "mobile-developer",
      title: "Mobile Developer",
      icon: <Smartphone className="w-6 h-6 text-pink-500" />,
    },
    {
      id: "ai-ml-engineer",
      title: "AI/ML Engineer",
      icon: <Brain className="w-6 h-6 text-red-500" />,
    },
    {
      id: "data-analytics",
      title: "Data Analytics",
      icon: <BarChart2 className="w-6 h-6 text-yellow-500" />,
    },
    {
      id: "data-scientist",
      title: "Data Scientist",
      icon: <TrendingUp className="w-6 h-6 text-orange-500" />,
    },
    {
      id: "devops-engineer",
      title: "DevOps Engineer",
      icon: <Cloud className="w-6 h-6 text-cyan-500" />,
    },
    {
      id: "ui-ux-developer",
      title: "UI/UX Developer",
      icon: <Figma className="w-6 h-6 text-violet-500" />,
    },
    {
      id: "web-developer",
      title: "Web Developer",
      icon: <Globe className="w-6 h-6 text-blue-400" />,
    },
    {
      id: "flutter-developer",
      title: "Flutter Developer",
      icon: <Feather className="w-6 h-6 text-teal-500" />,
    },
    {
      id: "dotnet-developer",
      title: "Dot Net Developer",
      icon: <Database className="w-6 h-6 text-blue-600" />,
    },
    {
      id: "mern-stack-developer",
      title: "MERN Stack Developer",
      icon: <Code2 className="w-6 h-6 text-amber-500" />,
    },
    {
      id: "java-developer",
      title: "Java Developer",
      icon: <Coffee className="w-6 h-6 text-brown-500" />,
    },
    {
      id: "reactjs-developer",
      title: "ReactJs Developer",
      icon: <AtSign className="w-6 h-6 text-blue-300" />,
    },
    {
      id: "business-analyst",
      title: "Business Analyst",
      icon: <FileText className="w-6 h-6 text-gray-600" />,
    },
    {
      id: "system-engineer",
      title: "System Engineer",
      icon: <Settings className="w-6 h-6 text-slate-500" />,
    },
    {
      id: "qa-analyst",
      title: "QA Analyst",
      icon: <TestTube className="w-6 h-6 text-emerald-500" />,
    },
    {
      id: "cloud-engineer",
      title: "Cloud Engineer",
      icon: <CloudCog className="w-6 h-6 text-sky-500" />,
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(jobCategories.length / 10);

  const getCurrentCategories = () => {
    const startIndex = currentPage * 10;
    return jobCategories.slice(startIndex, startIndex + 10);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Popular Job roles
          </h2>
          <p className="text-gray-500 mt-2">
            Find the job role that's perfect for you
          </p>
        </div>

        <div className="relative px-2 sm:px-0">
          {/* Navigation Arrows - Now both are always visible and positioned better for mobile */}
          <div className="flex justify-between absolute top-1/2 -translate-y-1/2 w-full left-0 px-1 sm:px-4 z-10 pointer-events-none">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className={`bg-white rounded-full p-2 sm:p-3 shadow-md hover:bg-gray-100 transition-colors duration-200 pointer-events-auto ${
                currentPage === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100 cursor-pointer"
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
            </button>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className={`bg-white rounded-full p-2 sm:p-3 shadow-md hover:bg-gray-100 transition-colors duration-200 pointer-events-auto ${
                currentPage === totalPages - 1
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100 cursor-pointer"
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
            </button>
          </div>

          {/* Grid of Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 px-6 sm:px-8">
            {getCurrentCategories().map((category) => (
              <div
                key={category.id}
                className="bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden transform hover:scale-105 group cursor-pointer"
              >
                <div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-gray-50 rounded-full">
                  {category.icon}
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-1">
                  {category.title}
                </h3>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Removed the Page Indicators section as requested */}
      </div>
    </section>
  );
};

export default BrowseByCategory;
