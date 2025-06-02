import React from "react";
import { FaUserPlus, FaFileAlt, FaSearch, FaPaperPlane } from "react-icons/fa";

const steps = [
  {
    id: 1,
    title: "Create an Account",
    description:
      "Register to access personalized job recommendations and application tracking.",
    icon: <FaUserPlus size={28} className="text-white" />,
    bgColor: "bg-blue-500",
  },
  {
    id: 2,
    title: "Complete Your Profile",
    description:
      "Upload your resume and fill out your profile to stand out to employers.",
    icon: <FaFileAlt size={28} className="text-white" />,
    bgColor: "bg-green-500",
  },
  {
    id: 3,
    title: "Search for Jobs",
    description:
      "Use our powerful search tools to find the perfect job for your skills and experience.",
    icon: <FaSearch size={28} className="text-white" />,
    bgColor: "bg-purple-500",
  },
  {
    id: 4,
    title: "Apply with Ease",
    description:
      "Apply to jobs with just a few clicks and track your application status.",
    icon: <FaPaperPlane size={28} className="text-white" />,
    bgColor: "bg-orange-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">
          How Crack of Campus Works
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Simple steps to find your dream job
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center p-6 rounded-lg border hover:shadow-lg transition-shadow duration-200"
            >
              <div className={`${step.bgColor} p-4 rounded-full mb-4`}>
                {step.icon}
              </div>
              <h3 className="text-lg font-medium text-foundit-blue mb-2">
                <span className="bg-foundit-blue text-white w-6 h-6 inline-flex items-center justify-center rounded-full text-sm mr-2">
                  {step.id}
                </span>
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
