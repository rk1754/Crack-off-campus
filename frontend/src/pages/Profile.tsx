import React, { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCurrentUser } from "@/redux/slices/userSlice";
import Layout from "../components/layout/Layout";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import { jobListings } from "../data/mockData";
import { MapPin, Mail, Phone, Download, Edit, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Root } from "react-dom/client";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);
  const { user, loading, error } = userState || {};

  // Fetch experience state
  const experienceState = useSelector((state: RootState) => state.experience);
  const { experiences, currentExperience } = experienceState || {};

  // Fetch education state
  const educationState = useSelector((state: RootState) => state.education);
  const { education, educationList } = educationState || {};

  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  // If not authenticated, redirect to login
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  // Get applied jobs data (would come from backend in production)
  const appliedJobs = jobListings.slice(0, 2); // Just show 2 for preview

  if (loading) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <p>Loading profile data...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-8 text-center text-red-500">
          <p>Error loading profile: {error}</p>
        </div>
      </Layout>
    );
  }

  // Default empty array for skills if user.skills doesn't exist
  const userSkills = user?.skills || [];

  return (
    <Layout>
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 lg:col-span-3 space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-foundit-gray overflow-hidden">
                  <img
                    src={user?.profile_pic || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-foundit-blue">
                      {user?.name || "User"}
                    </h1>
                    <div className="mt-2 md:mt-0">
                      <Link
                        to="/profile/edit"
                        className="inline-flex items-center text-sm text-foundit-blue hover:text-foundit-blue-light"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit Profile
                      </Link>
                    </div>
                  </div>

                  <p className="text-lg text-gray-700 mb-3">
                    Software Developer
                  </p>

                  <div className="flex flex-col md:flex-row flex-wrap gap-y-2 text-sm text-gray-600">
                    <div className="flex items-center mr-4">
                      <MapPin size={16} className="mr-1" />
                      <span>Mumbai, India</span>
                    </div>
                    <div className="flex items-center mr-4">
                      <Mail size={16} className="mr-1" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="mr-1" />
                      <span>{user?.phone_number || "Not provided"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
                <Button
                  variant="default"
                  className="flex items-center"
                  onClick={() => toast.info("Resume download coming soon")}
                >
                  <Download size={16} className="mr-2" />
                  Download Resume
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={() => toast.info("Resume update coming soon")}
                >
                  <Edit size={16} className="mr-2" />
                  Update Resume
                </Button>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foundit-blue">
                  About Me
                </h2>
                <Link
                  to="/profile/edit"
                  className="text-sm text-foundit-blue hover:text-foundit-blue-light"
                >
                  <Edit size={16} />
                </Link>
              </div>
              <p className="text-gray-700">
                {user?.bio ||
                  "No bio provided yet. Click the edit button to add your bio."}
              </p>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foundit-blue">
                  Skills
                </h2>
                <Link
                  to="/profile/edit"
                  className="text-sm text-foundit-blue hover:text-foundit-blue-light"
                >
                  <Edit size={16} />
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {userSkills.length > 0 ? (
                  userSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-foundit-blue px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No skills added yet. Click the edit button to add your
                    skills.
                  </p>
                )}
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foundit-blue">
                  Experience
                </h2>
                <Link
                  to="/profile/edit"
                  className="text-sm text-foundit-blue hover:text-foundit-blue-light"
                >
                  <Edit size={16} />
                </Link>
              </div>

              <div className="space-y-6">
                <div className="border-b pb-6 last:border-b-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                    <h3 className="text-lg font-medium">Software Developer</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-1" />
                      <span>Jan 2023 - Present</span>
                    </div>
                  </div>
                  <p className="text-foundit-blue mb-2">
                    Tech Solutions Inc, Mumbai
                  </p>
                  <p className="text-gray-700">
                    Developed and maintained web applications using React and
                    Node.js. Implemented responsive designs and optimized
                    application performance.
                  </p>
                </div>

                <div className="border-b pb-6 last:border-b-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                    <h3 className="text-lg font-medium">Junior Developer</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-1" />
                      <span>Jun 2021 - Dec 2022</span>
                    </div>
                  </div>
                  <p className="text-foundit-blue mb-2">
                    Digital Innovations, Bangalore
                  </p>
                  <p className="text-gray-700">
                    Assisted in front-end development using HTML, CSS, and
                    JavaScript. Participated in UI/UX improvements and bug
                    fixing.
                  </p>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foundit-blue">
                  Education
                </h2>
                <Link
                  to="/profile/edit"
                  className="text-sm text-foundit-blue hover:text-foundit-blue-light"
                >
                  <Edit size={16} />
                </Link>
              </div>

              <div className="space-y-6">
                <div className="border-b pb-6 last:border-b-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                    <h3 className="text-lg font-medium">
                      B.Tech in Computer Science
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-1" />
                      <span>2017 - 2021</span>
                    </div>
                  </div>
                  <p className="text-foundit-blue">Mumbai University, Mumbai</p>
                </div>
              </div>
            </div>

            {/* Applied Jobs Preview */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foundit-blue">
                  Recently Applied Jobs
                </h2>
                <Link
                  to="/profile/applied-jobs"
                  className="text-sm text-foundit-orange hover:text-orange-700"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {appliedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start">
                      <img
                        src={job.logo}
                        alt={`${job.company} logo`}
                        className="w-12 h-12 object-cover rounded mr-4"
                      />
                      <div>
                        <Link
                          to={`/jobs/${job.id}`}
                          className="text-lg font-medium text-foundit-blue hover:text-foundit-blue-light"
                        >
                          {job.title}
                        </Link>
                        <p className="text-gray-600 mb-1">{job.company}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
