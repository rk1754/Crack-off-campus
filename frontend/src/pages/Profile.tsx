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
import { Mail, Phone, Edit, Calendar, Camera, Save, X, Plus, Briefcase, GraduationCap, User, Award, CheckCircle, MapPin, Trash2, Star, Building, BookOpen, Clock, Users, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);
  const { user, loading, error } = userState || {};
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
    location: "",
  });

  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
      dispatch(getMyExperience());
      dispatch(getMyEducation());
    }
  }, [dispatch, isAuthenticated]);

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

  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-600 font-medium">
              Loading your profile...
            </p>
          </div>
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
      location: "",
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
        location: "",
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

  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate) return "";

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Hidden on mobile */}
            <div className="lg:col-span-1">
              <ProfileSidebar />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Cover Photo & Profile Header */}
              <Card className="overflow-hidden bg-gradient-to-br from-gray-100 via-white to-purple-100 shadow-2xl border-none">
                <div className="relative h-64">
                  {coverImagePreview ? (
                    <img
                      src={coverImagePreview || "/placeholder.svg"}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-white to-purple-100">
                      <img
                        src="/placeholder.svg"
                        alt="Upload cover"
                        className="w-24 h-24 opacity-60 mb-2"
                      />
                      <span className="text-gray-400 font-medium">
                        Upload Cover Image
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-white to-purple-200 opacity-70"></div>
                  {editingSection === "profile" && (
                    <label className="absolute top-6 right-6 bg-white hover:bg-gray-800 text-white p-3 rounded-full cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
                      <Camera size={20} className="text-purple-500" />
                      <span className="hidden sm:inline text-purple-700">
                        Update Cover
                      </span>
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
                      <div className="w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                        <img
                          src={
                            profilePicPreview ||
                            user?.profile_pic ||
                            "/placeholder.svg?height=160&width=160" ||
                            "/placeholder.svg"
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {editingSection === "profile" && (
                        <label className="absolute bottom-4 right-4 bg-gray-300 hover:bg-gray-800 text-black p-3 rounded-full cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
                          <Camera size={18} className="text-black" />
                          <span className="hidden sm:inline">Update</span>
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
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                          <h1 className="text-4xl font-bold text-gray-900">
                            {user?.name || "User"}
                          </h1>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
                            <Mail size={16} className="text-purple-500" />
                            <span>{user?.email || "Not provided"}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
                            <Phone size={16} className="text-purple-500" />
                            <span>{user?.phone_number || "Not provided"}</span>
                          </div>
                        </div>
                      </div>
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
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {user?.bio ||
                      "No bio provided yet."}
                  </p>
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
                </CardHeader>
                <CardContent className="pt-6">
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
                        No skills added yet.
                      </p>
                    )}
                  </div>
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
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {experiences && experiences.length > 0 ? (
                      experiences.map((exp: any, index: number) => (
                        <div
                          key={exp.id || exp._id}
                          className="group relative bg-gradient-to-r from-white to-purple-50/30 border border-purple-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-200"
                        >
                          {/* Header with Job Title and Duration */}
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {exp.job_title}
                              </h3>
                              <div className="flex items-center gap-2 text-purple-700 font-semibold mb-3">
                                <Building size={18} className="text-purple-600" />
                                <span className="text-lg">{exp.company_name}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
                                <Calendar size={16} className="text-purple-600" />
                                <span className="text-sm font-medium text-purple-800">
                                  {exp.start_date
                                    ? format(
                                      new Date(exp.start_date.slice(0, 10)),
                                      "MMM yyyy"
                                    )
                                    : ""}{" "}
                                  -{" "}
                                  {exp.end_date
                                    ? format(
                                      new Date(exp.end_date.slice(0, 10)),
                                      "MMM yyyy"
                                    )
                                    : "Present"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock size={14} className="text-gray-500" />
                                <span>{calculateDuration(exp.start_date, exp.end_date)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Location and Employment Type */}
                          <div className="flex flex-wrap gap-3 mb-4">
                            {exp.location && (
                              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                                <MapPin size={14} className="text-gray-500" />
                                <span className="text-sm text-gray-700">{exp.location}</span>
                              </div>
                            )}
                            <Badge
                              variant="outline"
                              className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-purple-200 font-medium px-3 py-1"
                            >
                              {(exp.employment_type || "")
                                .replace("_", " ")
                                .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </Badge>
                          </div>

                          {/* Description */}
                          {exp.description && (
                            <div className="bg-white/70 rounded-lg p-4 border border-purple-100">
                              <p className="text-gray-700 leading-relaxed">
                                {exp.description}
                              </p>
                            </div>
                          )}
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
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    {educationList && educationList.length > 0 ? (
                      educationList.map((edu: any, idx: number) => (
                        <div key={edu.id || edu._id || idx} className="mb-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 relative group">
                          <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-2">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-purple-600" />
                                <span className="font-semibold">Degree:</span>
                                <span>{edu.education || <span className="text-gray-400">N/A</span>}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-gray-500" />
                                <span className="font-semibold">Specialization:</span>
                                <span>{edu.specialization || <span className="text-gray-400">N/A</span>}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-gray-500" />
                                <span className="font-semibold">College/University:</span>
                                <span>{(edu.college !== undefined && edu.college !== null && edu.college !== "") ? edu.college : <span className="text-gray-400">N/A</span>}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="font-semibold">Location:</span>
                                <span>{(edu.location !== undefined && edu.location !== null && edu.location !== "") ? edu.location : <span className="text-gray-400">N/A</span>}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="font-semibold">Year:</span>
                                <span>{edu.start_year ? new Date(edu.start_year).getFullYear() : <span className="text-gray-400">N/A</span>} to {edu.end_year ? new Date(edu.end_year).getFullYear() : <span className="text-gray-400">N/A</span>}</span>
                              </div>
                            </div>
                            {/* Removed Delete button for read-only view */}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No education details added yet.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

