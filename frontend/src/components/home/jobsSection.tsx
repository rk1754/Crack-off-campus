import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "@/redux/slices/userSlice"; // Make sure User type is correctly imported or defined
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface JobSectionProps {
  user: User | null; // Accept user as a prop
}

const JobSection: React.FC<JobSectionProps> = ({ user }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <section
      style={{ backgroundColor: "rgb(186, 175, 220)" }} // Or any other style you prefer for logged-in users
      className="py-8 sm:py-12 px-4 md:px-6 lg:px-8 text-black"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side Image - Order changes on mobile */}
          <div
            className={`flex justify-center ${
              isMobile ? "order-2" : "order-1"
            } h-[300px] sm:h-[400px] md:h-[500px] relative`}
          >
            <img
              src="/lovable-uploads/job3dimg.png" // Ensure this path is correct
              alt="Find Your Dream Job"
              className="object-contain h-full"
              loading="lazy"
            />
          </div>

          {/* Right Side Content (Text) - Order changes on mobile */}
          <div
            className={`space-y-4 text-center md:text-left ${
              isMobile ? "order-1" : "order-2"
            }`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Find Your Dream Opportunities
            </h2>
            <p className="text-base sm:text-lg text-gray-700">
              Explore the right jobs, not just any — start your journey toward
              your dream opportunity today
            </p>
            <Button
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 sm:px-6 sm:py-3"
              onClick={() => navigate("/jobs")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobSection;
