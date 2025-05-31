"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import type { AppDispatch } from "@/redux/store";
import {
  Calendar,
  MapPin,
  Briefcase,
  Building,
  Check,
  DollarSign,
  GraduationCap,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { getJobById } from "@/redux/slices/jobSlice";
import { format } from "date-fns";
import PremiumPlansModal from "@/components/premium/PremiumPlansModel";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { job, loading, error } = useSelector((state: RootState) => state.job);
  const { user } = useSelector((state: RootState) => state.user);
  const [showPremiumModal, setShowPremiumModal] = useState(true);

  useEffect(() => {
    if (id) {
      dispatch(getJobById(id));
    }
  }, [dispatch, id]);

  // Scroll to top when JobDetail mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- Premium job access logic ---
  const isPremiumJob =
    job && job.subscription_type && job.subscription_type !== "regular";
  const isUserPremium =
    user &&
    [
      "booster",
      "job",
      "standard",
      "basic",
      "premium",
      "gold",
      "gold_plus",
      "diamond",
    ].includes(user.subscription_type);

  if (!job || (isPremiumJob && !isUserPremium)) {
    return (
      <Layout>
        <PremiumPlansModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          title="Unlock Premium Jobs"
          description="Access one month of all premium jobs for just ₹99"
          details="Get exclusive access to premium job listings and boost your career opportunities."
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-foundit-gray py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-foundit-blue">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center mt-2 text-gray-600">
                <span className="flex items-center mr-4 mb-2 md:mb-0">
                  <Building size={16} className="mr-1" />
                  {job.company_name}
                </span>
                <span className="flex items-center mr-4 mb-2 md:mb-0">
                  <MapPin size={16} className="mr-1" />
                  {job.location}
                </span>
                <span className="flex items-center mr-4 mb-2 md:mb-0">
                  <Briefcase size={16} className="mr-1" />
                  {job.employment_type}
                </span>
                {/* <span className="flex items-center mb-2 md:mb-0">
                  <Calendar size={16} className="mr-1" />
                  Posted {job.posted_at.toString()}
                </span> */}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* <button className="border border-foundit-blue text-foundit-blue hover:bg-foundit-blue hover:text-white px-4 py-2 rounded-md transition-colors duration-200">
                Save Job
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Premium Job Instructions */}
            {isPremiumJob && (
              <div className="bg-gray-100 border border-gray-200 p-6 rounded-lg shadow-sm mb-6">
                <div className="flex items-start mb-4">
                  {/* <AlertCircle className="text-orange-500 w-6 h-6 mr-3 flex-shrink-0 mt-1" /> */}
                  {/* <h2 className="text-lg font-semibold text-orange-800">
                    Premium Job Application Guidelines
                  </h2> */}
                </div>

                <p className="text-black mb-4 font-bold">
                  Please follow the instructions carefully before applying to
                  premium jobs.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="bg-black-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-1">
                      1
                    </span>
                    <p className="text-black-700">
                      Premium jobs can help improve your chances of getting an
                      interview call but it does not guarantee a shortlist or
                      response. Shortlisting also depends on the strength of
                      your resume, including your skills, education,
                      experiences, projects, and achievements.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-black-500 text-Black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-1">
                      2
                    </span>
                    <p className="text-Black-700">
                      Send your resume to the recruiter's email with a brief
                      introduction. Make sure that both the email subject and
                      the resume PDF filename are correctly formatted.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-foundit-blue mb-4">
                Job Description
              </h2>
              <p className="text-gray-700 mb-6">{job.description}</p>

              {/* <h3 className="text-lg font-semibold text-foundit-blue mb-3">
                Requirements
              </h3>
              <ul className="list-none space-y-2 mb-6">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <Check
                      size={18}
                      className="text-green-500 mr-2 flex-shrink-0 mt-1"
                    />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul> */}

              {/* <h3 className="text-lg font-semibold text-foundit-blue mb-3">
                Benefits & Perks
              </h3>
              <ul className="list-none space-y-2 mb-4">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check
                      size={18}
                      className="text-green-500 mr-2 flex-shrink-0 mt-1"
                    />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul> */}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              {/* <h2 className="text-xl font-semibold text-foundit-blue mb-4">
                How to Apply
              </h2>
              <p className="text-gray-700 mb-6">
                To apply for this position, click the "Apply Now" button and
                follow the application process. Make sure your profile and
                resume are up to date before applying.
              </p> */}
              <a
                href={
                  job.job_url?.startsWith("http://") ||
                  job.job_url?.startsWith("https://")
                    ? job.job_url
                    : `https://${job.job_url}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 block text-center rounded-md font-semibold text-white bg-foundit-orange hover:bg-orange-600 transition-colors duration-200"
              >
                Apply Now
              </a>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-foundit-blue mb-4">
                Job Overview
              </h2>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                    <Calendar className="text-orange-500 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Date Posted</p>
                    <p className="font-medium">
                      {job.posted_at
                        ? format(new Date(job.posted_at), "dd MMM yyyy")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <MapPin className="text-blue-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                    <Briefcase className="text-yellow-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Job Type</p>
                    <p className="font-medium">{job.employment_type}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <DollarSign className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">CTC / Stipend</p>
                    <p className="font-medium">
                      {job.ctc_stipend || "Not Disclosed"}
                    </p>
                  </div>
                </div>

                {job.experience && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-4">
                      <Briefcase className="text-pink-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Experience Level</p>
                      <p className="font-medium capitalize">{job.experience}</p>
                    </div>
                  </div>
                )}

                {job.passout_year && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                      <GraduationCap className="text-purple-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Target Batch</p>
                      <p className="font-medium">{job.passout_year}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;
