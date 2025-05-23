"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InterviewQuestion {
  id: string;
  company: string;
  companyLogo?: string;
  role: string;
  pdfLink: string;
}

const PreviouslyAskedQuestions: React.FC = () => {
  const interviewQuestions: InterviewQuestion[] = [
    {
      id: "amazonintern-sde",
      company: "Amazon",
      companyLogo: "/lovable-uploads/logos/amazonlogo.png",
      role: "Software Development Engineer Intern",
      pdfLink: "/lovable-uploads/Amazon Intern.pdf",
    },
    {
      id: "amazon-sde",
      company: "Amazon",
      companyLogo: "/lovable-uploads/logos/amazonlogo.png",
      role: "Software Development Engineer-1",
      pdfLink: "/lovable-uploads/Amazon.pdf",
    },
    {
      id: "arcesium-sde",
      company: "Arcesium",
      companyLogo: "/lovable-uploads/logos/Acresiu.png",
      role: "Software Development Engineer",
      pdfLink: "/lovable-uploads/Arcesium.pdf",
    },
    {
      id: "cars24-sde",
      company: "CARS24",
      companyLogo: "/lovable-uploads/logos/Cars24.jpg",
      role: "Software Development Engineer-1",
      pdfLink: "/lovable-uploads/CARS24.pdf",
    },
    {
      id: "gooldmansacs",
      company: "Goldman Sachs",
      companyLogo: "/lovable-uploads/logos/GoldmanSacs.jpg",
      role: "Software Development Engineer",
      pdfLink: "/lovable-uploads/Goldman Sachs.pdf",
    },
    {
      id: "Zeotap",
      company: "Zeotap",
      companyLogo: "/lovable-uploads/logos/Zeotap.png",
      role: "Software Development Engineer",
      pdfLink: "/lovable-uploads/Zeotap.pdf",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Previously Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore real interview questions shared by students who have already
            faced top companies. These authentic documents will help you
            understand what to expect and prepare better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewQuestions.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900 p-1 mb-4 flex items-center justify-center">
                    <img
                      src={
                        item.companyLogo ||
                        `/placeholder.svg?height=80&width=80`
                      }
                      alt={`${item.company} logo`}
                      className="w-16 h-16 object-contain rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
                    {item.company}
                  </h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-4">
                    {item.role}
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                  >
                    <a href={item.pdfLink} download>
                      <Download className="mr-2 h-4 w-4" />
                      Download Questions
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviouslyAskedQuestions;
