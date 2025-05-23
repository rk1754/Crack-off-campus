import type React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProblemsSolutionsPage from "../components/crackinsights/ProblemSolutions";
import StudentPlacementsPage from "../components/crackinsights/StudentsPlacements";
import PreviouslyAskedQuestions from "@/components/crackinsights/PreviouslyAskedQuestions";

const OurCrackers: React.FC = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-grow flex flex-col">
        <div className="flex-grow w-full">
          <StudentPlacementsPage />
          <PreviouslyAskedQuestions />
          <ProblemsSolutionsPage />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OurCrackers;
