"use client";

import type React from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface StudentProfile {
  id: number;
  name: string;
  role: string;
  company: string;
  achievement?: string;
  image: string;
  testimonial: string;
}

const NextArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-md hover:bg-indigo-50 dark:hover:bg-indigo-900 p-3 rounded-full focus:outline-none transition-all duration-300"
    onClick={onClick}
    aria-label="Next Slide"
  >
    <FaChevronRight className="text-indigo-600 dark:text-indigo-400 w-4 h-4" />
  </button>
);

const PrevArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-md hover:bg-indigo-50 dark:hover:bg-indigo-900 p-3 rounded-full focus:outline-none transition-all duration-300"
    onClick={onClick}
    aria-label="Previous Slide"
  >
    <FaChevronLeft className="text-indigo-600 dark:text-indigo-400 w-4 h-4" />
  </button>
);

const StudentPlacementsPage: React.FC = () => {
  const studentProfiles: StudentProfile[] = [
    {
      id: 1,
      name: "Yashvanth Donthula",
      role: "Full Stack Developer",
      company: "Amagle Software",
      image: "/lovable-uploads/Student1.jpg",
      testimonial:
        "Crack Off Campus is a game-changer! The group provides guidance, job updates, and tips that really helped me. I landed an amazing job through it. Highly recommended!",
    },
    {
      id: 2,
      name: "Rushikesh Mhaske",
      role: "Got Assessment Full stack Intern",
      company: "Often",
      image: "/lovable-uploads/Student2.jpg",
      testimonial:
        "I recently applied through Crack Off Campus and received assignment tasks from multiple companies. Great experience so far!",
    },
    {
      id: 3,
      name: "Abhishek Kumar",
      role: "Full Stack Developer Intern",
      company: "Eventory",
      image: "/lovable-uploads/Student3.jpg",
      testimonial:
        "Cracking off-campus placements helped me secure a full-stack internship. Great platform for quick opportunities!",
    },
    {
      id: 4,
      name: "Mahaveer Singh",
      role: "Got Assessment Frontend Developer Intern",
      company: "CA Monk",
      image: "/lovable-uploads/Student4.jpg",
      testimonial:
        "Best way to grab good internships and placement opportunities. Crack Off Campus gives great info and referrals!",
    },
    {
      id: 5,
      name: "Rahul Dora",
      role: "Software Developer",
      company: "Amagle Software",
      image: "/lovable-uploads/Student6.jpg",
      testimonial:
        "A platform that connects job seekers directly with employers — makes job hunting easier and efficient.",
    },
    {
      id: 6,
      name: "Abhishek Saini",
      role: "Frontend Developer Intern",
      company: "Binbag",
      image: "/lovable-uploads/akshaysaini.png",
      testimonial:
        "Being a part of Binbag as a Frontend Developer has been an exciting journey. The team’s commitment to innovation and sustainability aligns perfectly with my passion for building user-centric digital experiences. Every day brings a new challenge, and that’s what keeps me motivated.",
    },
    {
      id: 7,
      name: "Siddhant Gupta",
      role: "Got Assessment Full Stack Developer Intern",
      company: "Often",
      image: "/lovable-uploads/boy.png",
      testimonial:
        "Posting daily job opportunities is a big help. Making a real difference and guiding many towards their first career break..",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="w-full">
      {/* TOP FULL-WIDTH SECTION */}
      <div
        className="w-full px-4 md:py-16 text-center"
        style={{ backgroundColor: "rgb(186, 175, 220)" }}
      >
        <h1 className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wide text-lg md:text-xl lg:text-2xl">
          Success in Progress
        </h1>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 text-gray-900 dark:text-gray-100">
          From Shortlisted to Selected – Track Every Step
        </h2>
        <p className="mt-4 text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          Explore real journeys of students who've been shortlisted, received
          interview calls, got task assignments, or successfully placed in top
          companies.
        </p>
      </div>

      {/* SLIDER SECTION */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 dark:bg-gray-900">
        <Slider {...settings}>
          {studentProfiles.map((student) => (
            <div key={student.id} className="px-3 py-2">
              <div className="bg-gray-100 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-6 rounded-xl h-[300px] flex flex-col justify-between hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-300 min-h-0 border-spacing-2">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 border-2 border-indigo-100 dark:border-indigo-800">
                    <img
                      src={student.image || "/placeholder.svg"}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {student.role}
                    </p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      at{" "}
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                        {student.company}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 flex-grow overflow-hidden line-clamp-5 leading-relaxed">
                  {student.testimonial}
                </p>

                {/* <button className="mt-4 self-start text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center group transition-colors duration-200">
                  Read Full Story
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button> */}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default StudentPlacementsPage;
