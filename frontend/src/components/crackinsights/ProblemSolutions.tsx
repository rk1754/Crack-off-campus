import type React from "react";
import { FaWhatsapp } from "react-icons/fa6";

const ProblemsSolutionsPage: React.FC = () => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="relative">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-800 dark:text-slate-100">
          Making Your Life Easier
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Problems Section */}
          <div className="bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900 rounded-2xl p-6 shadow-sm">
            <div className="bg-red-500 text-white font-semibold py-3 px-6 rounded-full text-center mb-6">
              The Problems You Are Facing
            </div>

            <div className="space-y-5">
              {[
                "Struggling to find relevant job opportunities?",
                "Not shortlisted your resume ?",
                "Unsure how to ask for referrals?",
                "Overwhelmed with interview preparation?",
                "Lack of personalized mentorship and guidance?",
              ].map((problem, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-2xl">❌</span>
                  <p className="text-slate-700 dark:text-slate-300">
                    {problem}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions Section */}
          <div className="bg-white dark:bg-gray-800 border border-green-100 dark:border-green-900 rounded-2xl p-6 shadow-sm">
            <div className="bg-green-500 text-white font-semibold py-3 px-6 rounded-full text-center mb-6">
              The Solutions We Propose
            </div>

            <div className="space-y-5">
              {[
                "Find tailored job and internship listings.",
                "Get expert feedback on your resume and LinkedIn.",
                "Access referral templates and networking tips.",
                "Prepare for interviews with real questions and mock sessions.",
                "Receive personalized mentorship and career guidance.",
              ].map((solution, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full p-1 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">
                    {solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Query Section */}
        <div className="mt-16 bg-[#9b87f5] dark:bg-[#6b5bb5] rounded-2xl p-8 text-white relative overflow-hidden shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Got a Query?</h2>
              <p className="text-indigo-100">Reach out to us on WhatsApp</p>
            </div>

            <a
              href="https://wa.me/+918218498723"
              className="flex items-center gap-2 bg-[#2eb73a] hover:bg-[#2eb73a]-600 transition-colors px-6 py-3 rounded-full font-medium text-white"
            >
              <FaWhatsapp />
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsSolutionsPage;
