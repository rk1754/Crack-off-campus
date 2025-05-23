import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { AppDispatch } from "@/redux/store";
import {
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  Building,
  Check,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getJobById } from "@/redux/slices/jobSlice";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>(); // Use typed AppDispatch
  const { job, jobs, loading, error } = useSelector(
    (state: RootState) => state.job
  );

  useEffect(() => {
    if (id) {
      dispatch(getJobById(id)); // Dispatch the async thunk action
    }
  }, [dispatch, id]);
  if (!job) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foundit-blue mb-4">
            Job Not Found
          </h1>
          <p className="mb-6 text-gray-600">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/jobs" className="btn-primary">
            Browse All Jobs
          </Link>
        </div>
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
                <span className="flex items-center mb-2 md:mb-0">
                  <Calendar size={16} className="mr-1" />
                  Posted {job.posted_at.toString()}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={job.job_url}><button className="btn-accent">Apply Now</button></Link>
              <button className="border border-foundit-blue text-foundit-blue hover:bg-foundit-blue hover:text-white px-4 py-2 rounded-md transition-colors duration-200">
                Save Job
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-foundit-blue mb-4">
                Job Description
              </h2>
              <p className="text-gray-700 mb-6">{job.description}</p>

              <h3 className="text-lg font-semibold text-foundit-blue mb-3">
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
              </ul>

              <h3 className="text-lg font-semibold text-foundit-blue mb-3">
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
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-foundit-blue mb-4">
                How to Apply
              </h2>
              <p className="text-gray-700 mb-6">
                To apply for this position, click the "Apply Now" button and
                follow the application process. Make sure your profile and
                resume are up to date before applying.
              </p>
              <button className="btn-accent w-full py-3">Apply Now</button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-foundit-blue mb-4">
                Job Overview
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Calendar className="text-foundit-blue w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Date Posted</p>
                    <p className="font-medium">{job.posted_at.toString()}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <MapPin className="text-foundit-blue w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Briefcase className="text-foundit-blue w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Job Type</p>
                    <p className="font-medium">{job.employment_type}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <DollarSign className="text-green-600 w-5 h-5" />
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
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Briefcase className="text-foundit-blue w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Experience Level</p>
                      <p className="font-medium capitalize">{job.experience}</p>
                    </div>
                  </div>
                )}

                {job.passout_year && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <GraduationCap className="text-purple-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Target Batch</p>
                      <p className="font-medium">{job.passout_year}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-foundit-blue mb-4">
                About Company
              </h2>

              {/* Remove this image section for companies */}
              <div className="flex items-center mb-4">
                {/* <img 
                  src={job.} 
                  alt={`${job.company} logo`} 
                  className="w-16 h-16 object-cover rounded mr-4"
                /> */}
                <div>
                  <h3 className="font-medium text-lg">{job.company_name}</h3>
                  <a
                    href={job.job_url}
                    className="text-foundit-blue-light text-sm hover:underline"
                  >
                    View Company Profile
                  </a>
                </div>
              </div>

              <p className="text-gray-700">
                A leading company in the industry with a focus on innovation and
                employee growth. Join our team to work on exciting projects in a
                collaborative environment.
              </p>
            </div>

            <div className="bg-foundit-gray p-6 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">Share this job</h3>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;
