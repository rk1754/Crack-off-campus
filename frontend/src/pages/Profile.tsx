<<<<<<< HEAD
import React, { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCurrentUser } from "@/redux/slices/userSlice";
import { getMyExperience } from "@/redux/slices/experienceSlice";
import { getMyEducation } from "@/redux/slices/educationSlice";
import Layout from "../components/layout/Layout";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import { jobListings } from "../data/mockData";
import { MapPin, Mail, Phone, Download, Edit, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Root } from "react-dom/client";
=======
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchCurrentUser, updateUser } from "@/redux/slices/userSlice";
import {
  getMyExperience,
  addExperience,
  deleteExperience,
} from "@/redux/slices/experienceSlice";
import {
  getMyEducation,
  addEducation,
  deleteEducation,
} from "@/redux/slices/educationSlice";
import Layout from "../components/layout/Layout";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import {
  Mail,
  Phone,
  Edit,
  Calendar,
  Camera,
  Save,
  X,
  Plus,
  Briefcase,
  GraduationCap,
  User,
  Award,
  CheckCircle,
  MapPin,
  Trash2,
  Star,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);
  const { user, loading, error } = userState || {};
<<<<<<< HEAD

  // Fetch experience state
  const experienceState = useSelector((state: RootState) => state.experience);
  const { experiences, currentExperience } = experienceState || {};

  // Fetch education state
  const educationState = useSelector((state: RootState) => state.education);
  const { education, educationList } = educationState || {};

  const { isAuthenticated } = useAuth();
=======
  const experienceState = useSelector((state: RootState) => state.experience);
  const { experiences, currentExperience } = experienceState || {};
  const educationState = useSelector((state: RootState) => state.education);
  const { education, educationList } = educationState || {};
  const { isAuthenticated } = useAuth();

  // Editing states
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    name: "",
    phone_number: "",
    bio: "",
    skills: [] as string[],
    profile_pic: null,
    cover_image: null,
  });

  const [experienceForm, setExperienceForm] = useState({
    job_title: "",
    company_name: "",
    start_date: "",
    end_date: "",
    location: "",
    description: "",
    employment_type: "full_time",
  });

  const [educationForm, setEducationForm] = useState({
    education: "",
    specialization: "",
    college: "",
    start_year: "",
    end_year: "",
  });

  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const [skillInput, setSkillInput] = useState("");

>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
      dispatch(getMyExperience());
      dispatch(getMyEducation());
    }
  }, [dispatch, isAuthenticated]);

<<<<<<< HEAD
  // If not authenticated, redirect to login
=======
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        phone_number: user.phone_number || "",
        bio: user.bio || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
        profile_pic: null,
        cover_image: null,
      });
      setProfilePicPreview(user.profile_pic || null);
      setCoverImagePreview(user.cover_image || null);
    }
  }, [user]);

>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

<<<<<<< HEAD
  // Get applied jobs data (would come from backend in production)
  const appliedJobs = jobListings.slice(0, 2); // Just show 2 for preview

=======
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  if (loading) {
    return (
      <Layout>
        <div className="container py-8 text-center">
<<<<<<< HEAD
          <p>Loading profile data...</p>
=======
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-600 font-medium">
              Loading your profile...
            </p>
          </div>
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
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

<<<<<<< HEAD
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
                    {/* <div className="flex items-center mr-4">
                      <MapPin size={16} className="mr-1" />
                      <span>Mumbai, India</span>
                    </div> */}
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
                {experiences && experiences.length > 0 ? (
                  experiences.map((exp: any) => (
                    <div
                      key={exp.id || exp._id}
                      className="border-b pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                        <h3 className="text-lg font-medium">{exp.job_title}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {exp.start_date} - {exp.end_date || "Present"}
                          </span>
                        </div>
                      </div>
                      <p className="text-foundit-blue mb-2">
                        {exp.company_name}, {exp.location}
                      </p>
                      <p className="text-gray-700">{exp.description}</p>
                      <p className="text-xs text-gray-500">
                        {exp.employment_type}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No experience added yet.</p>
                )}
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
                {educationList && educationList.length > 0 ? (
                  educationList.map((edu: any) => (
                    <div
                      key={edu.id || edu._id}
                      className="border-b pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                        <h3 className="text-lg font-medium">
                          {edu.education}{" "}
                          {edu.specialization && `(${edu.specialization})`}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {edu.start_year} - {edu.end_year}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No education added yet.</p>
                )}
              </div>
=======
  // Handlers
  const handleEdit = (section: string) => {
    setEditingSection(section);
  };

  const handleCancel = () => {
    setEditingSection(null);
    // Reset forms
    if (user) {
      setProfileData({
        name: user.name || "",
        phone_number: user.phone_number || "",
        bio: user.bio || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
        profile_pic: null,
        cover_image: null,
      });
    }
    setExperienceForm({
      job_title: "",
      company_name: "",
      start_date: "",
      end_date: "",
      location: "",
      description: "",
      employment_type: "full_time",
    });
    setEducationForm({
      education: "",
      specialization: "",
      college: "",
      start_year: "",
      end_year: "",
    });
    setSkillInput("");
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const payload: any = {
      name: profileData.name,
      phone_number: profileData.phone_number,
      bio: profileData.bio,
      skills: profileData.skills,
    };
    if (profileData.profile_pic) payload.profile_pic = profileData.profile_pic;
    if (profileData.cover_image) payload.cover_image = profileData.cover_image;

    try {
      await dispatch(updateUser({ data: payload })).unwrap();
      toast.success("Profile updated successfully!");
      await dispatch(fetchCurrentUser());
      setEditingSection(null);
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddExperience = async () => {
    try {
      await dispatch(addExperience(experienceForm as any)).unwrap();
      toast.success("Experience added!");
      setEditingSection(null);
      setExperienceForm({
        job_title: "",
        company_name: "",
        start_date: "",
        end_date: "",
        location: "",
        description: "",
        employment_type: "full_time",
      });
      await dispatch(getMyExperience());
    } catch (err) {
      toast.error("Failed to add experience");
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await dispatch(deleteExperience(id)).unwrap();
      toast.success("Experience deleted!");
      await dispatch(getMyExperience());
    } catch (err) {
      toast.error("Failed to delete experience");
    }
  };

  const handleAddEducation = async () => {
    try {
      await dispatch(addEducation(educationForm as any)).unwrap();
      toast.success("Education added!");
      setEditingSection(null);
      setEducationForm({
        education: "",
        specialization: "",
        college: "",
        start_year: "",
        end_year: "",
      });
      await dispatch(getMyEducation());
    } catch (err) {
      toast.error("Failed to add education");
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      await dispatch(deleteEducation(id)).unwrap();
      toast.success("Education deleted!");
      await dispatch(getMyEducation());
    } catch (err) {
      toast.error("Failed to delete education");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setProfileData((prev) => ({ ...prev, [name]: file }));
      if (name === "profile_pic") {
        setProfilePicPreview(URL.createObjectURL(file));
      } else if (name === "cover_image") {
        setCoverImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !profileData.skills.includes(trimmedSkill)) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSkillInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Hidden on mobile */}
            <div className="lg:col-span-1">
              <ProfileSidebar />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Cover Photo & Profile Header */}
              <Card className="overflow-hidden border-none shadow-xl bg-white">
                <div className="relative h-64 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600">
                  {coverImagePreview && (
                    <img
                      src={coverImagePreview || "/placeholder.svg"}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  {editingSection === "profile" && (
                    <label className="absolute top-6 right-6 bg-white/95 hover:bg-white p-3 rounded-full cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Camera size={20} className="text-purple-600" />
                      <input
                        type="file"
                        name="cover_image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <CardContent className="relative pt-0 pb-8">
                  <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20 relative z-10">
                    <div className="relative">
                      <div className="w-40 h-40 rounded-full border-4 border-white bg-white overflow-hidden shadow-2xl">
                        <img
                          src={
                            profilePicPreview ||
                            user?.profile_pic ||
                            "/placeholder.svg?height=160&width=160"
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {editingSection === "profile" && (
                        <label className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
                          <Camera size={18} />
                          <input
                            type="file"
                            name="profile_pic"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    <div className="flex-1 md:mb-6 mt-20">
                      {editingSection === "profile" ? (
                        <div className="space-y-4">
                          <Input
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="text-3xl font-bold border-0 border-b-2 border-gray-300 rounded-none px-0 focus:border-purple-600 bg-transparent"
                            placeholder="Your Name or Title (e.g., Software Developer)"
                          />
                          <Input
                            value={profileData.phone_number}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                phone_number: e.target.value,
                              }))
                            }
                            placeholder="Phone Number"
                            className="text-lg border-0 border-b-2 border-gray-300 rounded-none px-0 focus:border-purple-600 bg-transparent"
                          />
                        </div>
                      ) : (
                        <>
                          <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {user?.name || "User"}
                          </h1>
                          {user?.name && (
                            <p className="text-xl text-purple-600 font-semibold mb-4 flex items-center">
                              <Star
                                size={20}
                                className="mr-2 text-yellow-500"
                              />
                              {user.name}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
                              <Mail size={16} className="text-purple-500" />
                              <span>{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
                              <Phone size={16} className="text-purple-500" />
                              <span>
                                {user?.phone_number || "Not provided"}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {editingSection === "profile" ? (
                        <>
                          <Button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200 shadow-lg hover:shadow-xl px-6 py-3"
                          >
                            {isSaving ? (
                              <span className="flex items-center">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                Saving...
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <Save size={16} className="mr-2" />
                                Save Changes
                              </span>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="border-purple-200 text-purple-700 hover:bg-purple-50 transition-all duration-200 px-6 py-3"
                          >
                            <X size={16} className="mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleEdit("profile")}
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50 transition-all duration-200 px-6 py-3"
                        >
                          <Edit size={16} className="mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b border-purple-100 pb-4">
                  <CardTitle className="flex items-center gap-3 text-purple-700 text-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User size={20} className="text-purple-600" />
                    </div>
                    About Me
                  </CardTitle>
                  {editingSection !== "about" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit("about")}
                      className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg"
                    >
                      <Edit size={16} />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="pt-6">
                  {editingSection === "about" ? (
                    <div className="space-y-4">
                      <Textarea
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="resize-none focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {isSaving ? (
                            <span className="flex items-center">
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                              Saving...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Save size={16} className="mr-2" />
                              Save
                            </span>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="border-purple-200 text-purple-700 hover:bg-purple-50 transition-all duration-200"
                        >
                          <X size={16} className="mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {user?.bio ||
                        "No bio provided yet. Click the edit button to add your bio."}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b border-purple-100 pb-4">
                  <CardTitle className="flex items-center gap-3 text-purple-700 text-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award size={20} className="text-purple-600" />
                    </div>
                    Skills & Expertise
                  </CardTitle>
                  {editingSection !== "skills" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit("skills")}
                      className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg"
                    >
                      <Edit size={16} />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="pt-6">
                  {editingSection === "skills" ? (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="Add a skill (e.g., React, Python, etc.)"
                          onKeyPress={handleSkillInputKeyPress}
                          className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                        />
                        <Button
                          onClick={addSkill}
                          type="button"
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {profileData.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300 transition-all duration-200 py-2 px-4 text-sm font-medium"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-red-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {isSaving ? (
                            <span className="flex items-center">
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                              Saving...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Save size={16} className="mr-2" />
                              Save Skills
                            </span>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="border-purple-200 text-purple-700 hover:bg-purple-50 transition-all duration-200"
                        >
                          <X size={16} className="mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {(user?.skills || []).length > 0 ? (
                        (user?.skills || []).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 py-2 px-4 text-sm font-medium"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center w-full py-8">
                          No skills added yet. Click the edit button to showcase
                          your expertise.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Experience Section */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b border-purple-100 pb-4">
                  <CardTitle className="flex items-center gap-3 text-purple-700 text-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Briefcase size={20} className="text-purple-600" />
                    </div>
                    Work Experience
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit("experience")}
                    className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Experience
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  {editingSection === "experience" && (
                    <div className="mb-8 p-6 border border-purple-200 rounded-xl bg-gradient-to-br from-purple-50 to-white shadow-sm">
                      <h4 className="font-semibold mb-6 text-purple-800 flex items-center text-lg">
                        <Plus size={20} className="mr-2 text-purple-600" />
                        Add New Experience
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-purple-700 font-medium">
                            Job Title
                          </Label>
                          <Input
                            value={experienceForm.job_title}
                            onChange={(e) =>
                              setExperienceForm((prev) => ({
                                ...prev,
                                job_title: e.target.value,
                              }))
                            }
                            placeholder="e.g., Senior Software Engineer"
                            className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                          />
                        </div>
                        <div>
                          <Label className="text-purple-700 font-medium">
                            Company Name
                          </Label>
                          <Input
                            value={experienceForm.company_name}
                            onChange={(e) =>
                              setExperienceForm((prev) => ({
                                ...prev,
                                company_name: e.target.value,
                              }))
                            }
                            placeholder="e.g., Google Inc."
                            className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                          />
                        </div>
                        <div>
                          <Label className="text-purple-700 font-medium">
                            Start Date
                          </Label>
                          <Input
                            type="date"
                            value={experienceForm.start_date}
                            onChange={(e) =>
                              setExperienceForm((prev) => ({
                                ...prev,
                                start_date: e.target.value,
                              }))
                            }
                            className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                          />
                        </div>
                        <div>
                          <Label className="text-purple-700 font-medium">
                            End Date
                          </Label>
                          <Input
                            type="date"
                            value={experienceForm.end_date}
                            onChange={(e) =>
                              setExperienceForm((prev) => ({
                                ...prev,
                                end_date: e.target.value,
                              }))
                            }
                            className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                          />
                        </div>
                        <div>
                          <Label className="text-purple-700 font-medium">
                            Location
                          </Label>
                          <Input
                            value={experienceForm.location}
                            onChange={(e) =>
                              setExperienceForm((prev) => ({
                                ...prev,
                                location: e.target.value,
                              }))
                            }
                            placeholder="e.g., San Francisco, CA"
                            className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                          />
                        </div>
                        <div>
                          <Label className="text-purple-700 font-medium">
                            Employment Type
                          </Label>
                          <select
                            value={experienceForm.employment_type}
                            onChange={(e) =>
                              setExperienceForm((prev) => ({
                                ...prev,
                                employment_type: e.target.value,
                              }))
                            }
                            className="w-full border border-purple-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="full_time">Full Time</option>
                            <option value="part_time">Part Time</option>
                            <option value="contract">Contract</option>
                            <option value="internship">Internship</option>
                            <option value="freelance">Freelance</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label className="text-purple-700 font-medium">
                          Job Description
                        </Label>
                        <Textarea
                          value={experienceForm.description}
                          onChange={(e) =>
                            setExperienceForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Describe your role, responsibilities, and key achievements..."
                          rows={4}
                          className="resize-none focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                        />
                      </div>
                      <div className="flex gap-3 mt-6">
                        <Button
                          onClick={handleAddExperience}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Add Experience
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="border-purple-200 text-purple-700 hover:bg-purple-50 transition-all duration-200"
                        >
                          <X size={16} className="mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {experiences && experiences.length > 0 ? (
                      experiences.map((exp: any, index: number) => (
                        <div
                          key={exp.id || exp._id}
                          className="group border-l-4 border-purple-600 pl-6 pb-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent p-4 rounded-r-xl transition-all duration-200 relative"
                        >
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteExperience(exp.id || exp._id)
                              }
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                            <h3 className="text-xl font-bold text-gray-900">
                              {exp.job_title}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 bg-purple-50 px-3 py-1 rounded-full">
                              <Calendar
                                size={14}
                                className="mr-1 text-purple-500"
                              />
                              <span>
                                {exp.start_date
                                  ? format(
                                      new Date(exp.start_date.slice(0, 10)),
                                      "dd MMM yyyy"
                                    )
                                  : ""}{" "}
                                -{" "}
                                {exp.end_date
                                  ? format(
                                      new Date(exp.end_date.slice(0, 10)),
                                      "dd MMM yyyy"
                                    )
                                  : "Present"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center text-purple-600 font-semibold mb-3">
                            <Building size={16} className="mr-2" />
                            {exp.company_name} • {exp.location}
                          </div>
                          <p className="text-gray-700 mb-3 leading-relaxed">
                            {exp.description}
                          </p>
                          <Badge
                            variant="outline"
                            className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-purple-200 font-medium"
                          >
                            {(exp.employment_type || "")
                              .replace("_", " ")
                              .toUpperCase()}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-white rounded-xl">
                        <Briefcase
                          size={48}
                          className="mx-auto text-purple-300 mb-4"
                        />
                        <p className="text-gray-500 mb-4 text-lg">
                          No work experience added yet.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                          onClick={() => handleEdit("experience")}
                        >
                          <Plus size={16} className="mr-2" />
                          Add Your First Experience
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Education Section */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b border-purple-100 pb-4">
                  <CardTitle className="flex items-center gap-3 text-purple-700 text-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <GraduationCap size={20} className="text-purple-600" />
                    </div>
                    Education
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit("education")}
                    className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Education
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  {editingSection === "education" && (
                    <div className="mb-8 p-6 border border-purple-200 rounded-xl bg-gradient-to-br from-purple-50 to-white shadow-sm">
                      <h4 className="font-semibold mb-6 text-purple-800 flex items-center text-lg">
                        <Plus size={20} className="mr-2 text-purple-600" />
                        Add New Education
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-purple-700 font-medium">
                            Degree
                          </Label>
                          <Input
                            value={educationForm.education}
                            onChange={(e) =>
                              setEducationForm((prev) => ({
                                ...prev,
                                education: e.target.value,
                              }))
                            }
                            placeholder="e.g., Bachelor of Science"
                            className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                          />
                        </div>
                        <div>
                          <Label className="text-purple-700 font-medium">
                            Specialization
                          </Label>
                          <Input
                            value={educationForm.specialization}
                            onChange={(e) =>
                              setEducationForm((prev) => ({
                                ...prev,
                                specialization: e.target.value,
                              }))
                            }
                            placeholder="e.g., Computer Science"
                            className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                          />
                        </div>
                        <div>
                          <Label className="text-purple-700 font-medium">
                            College/University
                          </Label>
                          <Input
                            value={educationForm.college}
                            onChange={(e) =>
                              setEducationForm((prev) => ({
                                ...prev,
                                college: e.target.value,
                              }))
                            }
                            placeholder="e.g., IIT Bombay"
                            className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                          />
                        </div>
                        <div>
                          <Label className="text-purple-700 font-medium">
                            Start Year
                          </Label>
                          <Input
                            type="number"
                            value={educationForm.start_year}
                            onChange={(e) =>
                              setEducationForm((prev) => ({
                                ...prev,
                                start_year: e.target.value,
                              }))
                            }
                            placeholder="2020"
                            className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                          />
                        </div>
                        <div>
                          <Label className="text-purple-700 font-medium">
                            End Year
                          </Label>
                          <Input
                            type="number"
                            value={educationForm.end_year}
                            onChange={(e) =>
                              setEducationForm((prev) => ({
                                ...prev,
                                end_year: e.target.value,
                              }))
                            }
                            placeholder="2024"
                            className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <Button
                          onClick={handleAddEducation}
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Add Education
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="border-purple-200 text-purple-700 hover:bg-purple-50 transition-all duration-200"
                        >
                          <X size={16} className="mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {educationList && educationList.length > 0 ? (
                      educationList.map((edu: any) => (
                        <div
                          key={edu.id || edu._id}
                          className="group border-l-4 border-purple-600 pl-6 pb-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent p-4 rounded-r-xl transition-all duration-200 relative"
                        >
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteEducation(edu.id || edu._id)
                              }
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                            <h3 className="text-xl font-bold text-gray-900">
                              {edu.education}
                              {edu.specialization && (
                                <span className="text-gray-600 font-normal">
                                  {" "}
                                  in {edu.specialization}
                                </span>
                              )}
                              {edu.college && (
                                <span className="block text-purple-700 text-base font-medium mt-1">
                                  {edu.college}
                                </span>
                              )}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 bg-purple-50 px-3 py-1 rounded-full">
                              <Calendar
                                size={14}
                                className="mr-1 text-purple-500"
                              />
                              <span>
                                {edu.start_year
                                  ? format(new Date(edu.start_year), "yyyy")
                                  : ""}{" "}
                                -{" "}
                                {edu.end_year
                                  ? format(new Date(edu.end_year), "yyyy")
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-white rounded-xl">
                        <GraduationCap
                          size={48}
                          className="mx-auto text-purple-300 mb-4"
                        />
                        <p className="text-gray-500 mb-4 text-lg">
                          No education added yet.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                          onClick={() => handleEdit("education")}
                        >
                          <Plus size={16} className="mr-2" />
                          Add Your Education
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
