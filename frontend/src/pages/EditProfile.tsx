<<<<<<< HEAD
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Layout from "../components/layout/Layout";
=======
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import { fetchCurrentUser, updateUser } from "@/redux/slices/userSlice";
import {
  getMyExperience,
  addExperience as addExperienceThunk,
  deleteExperience,
  updateExperience,
} from "@/redux/slices/experienceSlice";
import {
  getMyEducation,
  addEducation,
  deleteEducation,
  updateMyEducation,
} from "@/redux/slices/educationSlice";
import Layout from "../components/layout/Layout";
import {
  Camera,
  Save,
  X,
  Plus,
  Briefcase,
  GraduationCap,
  User,
  Award,
  Trash2,
  ArrowLeft,
  Upload,
} from "lucide-react";
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
<<<<<<< HEAD
import { toast } from "sonner";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  User,
  fetchCurrentUser,
  setProfile,
  updateUser,
} from "@/redux/slices/userSlice";
import { Camera } from "lucide-react";
import {
  addExperience,
  getMyExperience,
} from "@/redux/slices/experienceSlice";
import {
  addEducation,
  getMyEducation,
} from "@/redux/slices/educationSlice";

interface FormData {
  name: string;
  email: string;
  phone_number: string;
  bio: string;
  skills: string[];
  profile_pic?: File | null;
  cover_image?: File | null;
}

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone_number: "",
    bio: "",
    skills: [],
    profile_pic: null,
    cover_image: null,
  });

=======
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface ExperienceItem {
  id?: string;
  _id?: string;
  job_title: string;
  company_name: string;
  start_date: string;
  end_date: string;
  location: string;
  description: string;
  employment_type: string;
}

interface EducationItem {
  id?: string;
  _id?: string;
  education: string;
  specialization: string;
  college: string;
  start_year: string;
  end_year: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);
  const { user, loading, error } = userState || {};
  const experienceState = useSelector((state: RootState) => state.experience);
  const { experiences } = experienceState || {};
  const educationState = useSelector((state: RootState) => state.education);
  const { educationList } = educationState || {};
  const { isAuthenticated } = useAuth();

  const [isSaving, setIsSaving] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    phone_number: "",
    bio: "",
    skills: [] as string[],
    profile_pic: null as File | null,
    cover_image: null as File | null,
  });

  // Experience and Education states
  const [experienceItems, setExperienceItems] = useState<ExperienceItem[]>([]);
  const [educationItems, setEducationItems] = useState<EducationItem[]>([]);

>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
<<<<<<< HEAD
  const [isSaving, setIsSaving] = useState(false);

  // Experience Modal State
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [experienceForm, setExperienceForm] = useState({
    job_title: "",
    company_name: "",
    start_date: "",
    end_date: "",
    location: "",
    description: "",
    employment_type: "full_time",
  });

  // Education Modal State
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [educationForm, setEducationForm] = useState({
    education: "",
    specialization: "",
    start_year: "",
    end_year: "",
  });

  // Redux experience/education state
  const experienceState = useSelector((state: RootState) => state.experience);
  const educationState = useSelector((state: RootState) => state.education);

  useEffect(() => {
    if (!user?.id) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        bio: user.bio || "",
        skills: user.skills || [],
=======
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
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
        profile_pic: null,
        cover_image: null,
      });
      setProfilePicPreview(user.profile_pic || null);
      setCoverImagePreview(user.cover_image || null);
    }
  }, [user]);

  useEffect(() => {
<<<<<<< HEAD
    if (user?.id) {
      dispatch(getMyExperience());
      dispatch(getMyEducation());
    }
  }, [dispatch, user?.id]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);
    setFormData((prev) => ({ ...prev, skills: skillsArray }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
=======
    if (experiences) {
      setExperienceItems(experiences);
    }
  }, [experiences]);

  useEffect(() => {
    if (educationList) {
      setEducationItems(educationList);
    }
  }, [educationList]);

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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setProfileData((prev) => ({ ...prev, [name]: file }));
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
      if (name === "profile_pic") {
        setProfilePicPreview(URL.createObjectURL(file));
      } else if (name === "cover_image") {
        setCoverImagePreview(URL.createObjectURL(file));
      }
    }
  };

<<<<<<< HEAD
  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload: Partial<User> = {
      name: formData.name,
      phone_number: formData.phone_number,
      bio: formData.bio,
      skills: formData.skills,
    };

    if (formData.profile_pic) {
      (payload as any).profile_pic = formData.profile_pic;
    }
    if (formData.cover_image) {
      (payload as any).cover_image = formData.cover_image;
    }

    try {
      await dispatch(updateUser({ data: payload })).unwrap();
      toast.success("Profile updated successfully!");
      dispatch(fetchCurrentUser());
    } catch (err: any) {
      toast.error(
        `Failed to update profile: ${err.message || "Please try again."}`
      );
=======
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

  // Add Experience UI handler (renamed to avoid thunk conflict)
  const addExperienceItem = () => {
    const newExperience: ExperienceItem = {
      job_title: "",
      company_name: "",
      start_date: "",
      end_date: "",
      location: "",
      description: "",
      employment_type: "full_time",
    };
    setExperienceItems([...experienceItems, newExperience]);
  };

  const updateExperienceItem = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...experienceItems];
    updated[index] = { ...updated[index], [field]: value };
    setExperienceItems(updated);
  };

  const removeExperience = (index: number) => {
    const updated = [...experienceItems];
    updated.splice(index, 1);
    setExperienceItems(updated);
  };

  const addEducationItem = () => {
    const newEducation: EducationItem = {
      education: "",
      specialization: "",
      college: "",
      start_year: "",
      end_year: "",
    };
    setEducationItems([...educationItems, newEducation]);
  };

  const updateEducationItem = (index: number, field: string, value: string) => {
    const updated = [...educationItems];
    updated[index] = { ...updated[index], [field]: value };
    setEducationItems(updated);
  };

  const removeEducationItem = (index: number) => {
    const updated = [...educationItems];
    updated.splice(index, 1);
    setEducationItems(updated);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Save profile data
      const payload: any = {
        name: profileData.name,
        phone_number: profileData.phone_number,
        bio: profileData.bio,
        skills: profileData.skills,
      };
      if (profileData.profile_pic)
        payload.profile_pic = profileData.profile_pic;
      if (profileData.cover_image)
        payload.cover_image = profileData.cover_image;

      await dispatch(updateUser({ data: payload })).unwrap();

      // Save experience items
      for (const exp of experienceItems) {
        if (exp.id || exp._id) {
          // Update existing
          await dispatch(
            updateExperience({ ...exp, id: exp.id || exp._id })
          ).unwrap();
        } else if (exp.job_title && exp.company_name) {
          // Add new
          await dispatch(addExperienceThunk(exp as any)).unwrap();
        }
      }

      // Save education items
      for (const edu of educationItems) {
        if (edu.id || edu._id) {
          // Update existing
          await dispatch(
            updateMyEducation({ ...edu, id: edu.id || edu._id })
          ).unwrap();
        } else if (edu.education) {
          // Add new
          await dispatch(addEducation(edu as any)).unwrap();
        }
      }

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err: any) {
      // Show backend error message if available
      const backendMsg =
        err?.response?.data?.message || err?.message || err?.toString();
      toast.error(`Failed to update profile: ${backendMsg}`);
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
      console.error("Profile update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

<<<<<<< HEAD
  // Experience handlers
  const handleExperienceInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExperienceForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(addExperience(experienceForm as any)).unwrap();
      toast.success("Experience added!");
      setIsExperienceModalOpen(false);
      setExperienceForm({
        job_title: "",
        company_name: "",
        start_date: "",
        end_date: "",
        location: "",
        description: "",
        employment_type: "full_time",
      });
      dispatch(getMyExperience());
    } catch (err: any) {
      toast.error("Failed to add experience");
    }
  };

  // Education handlers
  const handleEducationInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEducationForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(addEducation(educationForm as any)).unwrap();
      toast.success("Education added!");
      setIsEducationModalOpen(false);
      setEducationForm({
        education: "",
        specialization: "",
        start_year: "",
        end_year: "",
      });
      dispatch(getMyEducation());
    } catch (err: any) {
      toast.error("Failed to add education");
    }
  };

  if (userLoading && !user?.id) {
    return (
      <Layout>
        <div className="container py-8 text-center">Loading profile...</div>
      </Layout>
    );
  }

  if (userError) {
    return (
      <Layout>
        <div className="container py-8 text-center text-red-500">
          Error loading profile: {userError}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-4 md:py-8 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div className="md:col-span-1">
            <ProfileSidebar />
          </div>
          <div className="md:col-span-3">
            <form
              onSubmit={handleSaveChanges}
              className="bg-white rounded-lg shadow p-6 md:p-8 space-y-6"
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Edit Your Profile
              </h1>

              <div className="space-y-2">
                <Label htmlFor="cover_image">Cover Image</Label>
                <div className="relative h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {coverImagePreview ? (
                    <img
                      src={coverImagePreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">No cover image</span>
                  )}
                  <label
                    htmlFor="cover_image_input"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera size={32} className="text-white" />
                  </label>
                  <input
                    type="file"
                    id="cover_image_input"
                    name="cover_image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profilePicPreview ? (
                    <img
                      src={profilePicPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-xs text-center">
                      No photo
                    </span>
                  )}
                  <label
                    htmlFor="profile_pic_input"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera size={24} className="text-white" />
                  </label>
                  <input
                    type="file"
                    id="profile_pic_input"
                    name="profile_pic"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="profile_pic_input"
                    className="cursor-pointer text-purple-600 hover:underline"
                  >
                    Change Profile Photo
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    readOnly
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500">
                    Email cannot be changed.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="e.g., +1234567890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">About Me (Bio)</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={5}
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us a bit about yourself..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={formData.skills.join(", ")}
                  onChange={handleSkillsChange}
                  placeholder="e.g., React, Node.js, Python"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map(
                    (skill, index) =>
                      skill && (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      )
                  )}
                </div>
              </div>

              {/* Add Experience/Education Buttons */}
              <div className="flex gap-4 mb-4">
                <Button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => setIsExperienceModalOpen(true)}
                >
                  + Add Experience
                </Button>
                <Button
                  type="button"
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => setIsEducationModalOpen(true)}
                >
                  + Add Education
                </Button>
              </div>

              {/* List Experience */}
              <div>
                <h2 className="font-semibold text-lg mb-2">Experience</h2>
                <ul className="space-y-2">
                  {experienceState.experiences && experienceState.experiences.length > 0 ? (
                    experienceState.experiences.map((exp: any) => (
                      <li key={exp.id || exp._id} className="border rounded p-2">
                        <div className="font-medium">{exp.job_title} at {exp.company_name}</div>
                        <div className="text-sm text-gray-500">{exp.start_date} - {exp.end_date || "Present"}</div>
                        <div className="text-sm">{exp.location}</div>
                        <div className="text-xs text-gray-700">{exp.description}</div>
                        <div className="text-xs text-gray-400">{exp.employment_type}</div>
                      </li>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">No experience added yet.</div>
                  )}
                </ul>
              </div>

              {/* List Education */}
              <div>
                <h2 className="font-semibold text-lg mb-2">Education</h2>
                <ul className="space-y-2">
                  {educationState.educationList && educationState.educationList.length > 0 ? (
                    educationState.educationList.map((edu: any) => (
                      <li key={edu.id || edu._id} className="border rounded p-2">
                        <div className="font-medium">{edu.education} ({edu.specialization})</div>
                        <div className="text-sm text-gray-500">{edu.start_year} - {edu.end_year}</div>
                      </li>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">No education added yet.</div>
                  )}
                </ul>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving || userLoading}
                  className="bg-[#9b87f5] hover:bg-[#8a74e8]"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add Experience Modal */}
      {isExperienceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Experience</h2>
            <form onSubmit={handleAddExperience} className="space-y-3">
              <div>
                <Label>Job Title</Label>
                <Input name="job_title" value={experienceForm.job_title} onChange={handleExperienceInput} required />
              </div>
              <div>
                <Label>Company Name</Label>
                <Input name="company_name" value={experienceForm.company_name} onChange={handleExperienceInput} required />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input type="date" name="start_date" value={experienceForm.start_date} onChange={handleExperienceInput} required />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" name="end_date" value={experienceForm.end_date} onChange={handleExperienceInput} />
              </div>
              <div>
                <Label>Location</Label>
                <Input name="location" value={experienceForm.location} onChange={handleExperienceInput} required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea name="description" value={experienceForm.description} onChange={handleExperienceInput} />
              </div>
              <div>
                <Label>Employment Type</Label>
                <select
                  name="employment_type"
                  value={experienceForm.employment_type}
                  onChange={handleExperienceInput}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="full_time">Full Time</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsExperienceModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Education Modal */}
      {isEducationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Education</h2>
            <form onSubmit={handleAddEducation} className="space-y-3">
              <div>
                <Label>Degree</Label>
                <Input name="education" value={educationForm.education} onChange={handleEducationInput} required />
              </div>
              <div>
                <Label>Specialization</Label>
                <Input name="specialization" value={educationForm.specialization} onChange={handleEducationInput} />
              </div>
              <div>
                <Label>Start Year</Label>
                <Input type="number" name="start_year" value={educationForm.start_year} onChange={handleEducationInput} required />
              </div>
              <div>
                <Label>End Year</Label>
                <Input type="number" name="end_year" value={educationForm.end_year} onChange={handleEducationInput} required />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsEducationModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
=======
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Profile
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Edit Profile
                  </h1>
                  <p className="text-gray-600">
                    Update your professional information
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3"
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
            </div>

            <div className="space-y-8">
              {/* Cover Photo & Profile Picture */}
              <Card className="overflow-hidden border-none shadow-lg bg-white">
                <div className="relative h-48 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600">
                  {coverImagePreview && (
                    <img
                      src={coverImagePreview || "/placeholder.svg"}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <label className="absolute top-4 right-4 bg-white/95 hover:bg-white p-3 rounded-full cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
                    <Upload size={20} className="text-purple-600" />
                    <input
                      type="file"
                      name="cover_image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <CardContent className="relative pt-0 pb-8">
                  <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 relative z-10">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-2xl">
                        <img
                          src={
                            profilePicPreview ||
                            user?.profile_pic ||
                            "/placeholder.svg?height=128&width=128" ||
                            "/placeholder.svg"
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
                        <Camera size={16} />
                        <input
                          type="file"
                          name="profile_pic"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="flex-1 md:mb-4">
                      <p className="text-gray-600 text-sm">
                        Upload a professional photo and cover image to make your
                        profile stand out
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card className="border-none shadow-lg bg-white">
                <CardHeader className="border-b border-purple-100 pb-4">
                  <CardTitle className="flex items-center gap-3 text-purple-700 text-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User size={20} className="text-purple-600" />
                    </div>
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-purple-700 font-medium">
                        Full Name
                      </Label>
                      <Input
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter your full name"
                        className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                      />
                    </div>
                    <div>
                      <Label className="text-purple-700 font-medium">
                        Phone Number
                      </Label>
                      <Input
                        value={profileData.phone_number}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            phone_number: e.target.value,
                          }))
                        }
                        placeholder="Enter your phone number"
                        className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-purple-700 font-medium">
                      About Me
                    </Label>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                      rows={4}
                      className="resize-none focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="border-none shadow-lg bg-white">
                <CardHeader className="border-b border-purple-100 pb-4">
                  <CardTitle className="flex items-center gap-3 text-purple-700 text-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award size={20} className="text-purple-600" />
                    </div>
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
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
                </CardContent>
              </Card>

              {/* Work Experience */}
              <Card className="border-none shadow-lg bg-white">
                <CardHeader className="border-b border-purple-100 pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-purple-700 text-xl">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Briefcase size={20} className="text-purple-600" />
                      </div>
                      Work Experience
                    </div>
                    <Button
                      onClick={addExperienceItem}
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Experience
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {experienceItems.map((exp, index) => (
                      <div
                        key={index}
                        className="p-6 border border-purple-200 rounded-xl bg-gradient-to-br from-purple-50 to-white relative"
                      >
                        <Button
                          onClick={() => removeExperience(index)}
                          variant="ghost"
                          size="sm"
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-purple-700 font-medium">
                              Job Title
                            </Label>
                            <Input
                              value={exp.job_title || ""}
                              onChange={(e) =>
                                updateExperienceItem(
                                  index,
                                  "job_title",
                                  e.target.value
                                )
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
                              value={exp.company_name || ""}
                              onChange={(e) =>
                                updateExperienceItem(
                                  index,
                                  "company_name",
                                  e.target.value
                                )
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
                              value={
                                exp.start_date
                                  ? exp.start_date.slice(0, 10)
                                  : ""
                              }
                              onChange={(e) =>
                                updateExperienceItem(
                                  index,
                                  "start_date",
                                  e.target.value
                                )
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
                              value={
                                exp.end_date ? exp.end_date.slice(0, 10) : ""
                              }
                              onChange={(e) =>
                                updateExperienceItem(
                                  index,
                                  "end_date",
                                  e.target.value
                                )
                              }
                              className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                            />
                          </div>
                          <div>
                            <Label className="text-purple-700 font-medium">
                              Location
                            </Label>
                            <Input
                              value={exp.location || ""}
                              onChange={(e) =>
                                updateExperienceItem(
                                  index,
                                  "location",
                                  e.target.value
                                )
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
                              value={exp.employment_type}
                              onChange={(e) =>
                                updateExperienceItem(
                                  index,
                                  "employment_type",
                                  e.target.value
                                )
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
                            value={exp.description || ""}
                            onChange={(e) =>
                              updateExperienceItem(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Describe your role, responsibilities, and key achievements..."
                            rows={3}
                            className="resize-none focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                          />
                        </div>
                      </div>
                    ))}
                    {experienceItems.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase
                          size={48}
                          className="mx-auto text-purple-300 mb-4"
                        />
                        <p className="mb-4">No work experience added yet.</p>
                        <Button
                          onClick={addExperienceItem}
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Plus size={16} className="mr-2" />
                          Add Your First Experience
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="border-none shadow-lg bg-white">
                <CardHeader className="border-b border-purple-100 pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-purple-700 text-xl">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <GraduationCap size={20} className="text-purple-600" />
                      </div>
                      Education
                    </div>
                    <Button
                      onClick={addEducationItem}
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Education
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {educationItems.map((edu, index) => (
                      <div
                        key={index}
                        className="p-6 border border-purple-200 rounded-xl bg-gradient-to-br from-purple-50 to-white relative"
                      >
                        <Button
                          onClick={() => removeEducationItem(index)}
                          variant="ghost"
                          size="sm"
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-purple-700 font-medium">
                              Degree
                            </Label>
                            <Input
                              value={edu.education}
                              onChange={(e) =>
                                updateEducationItem(
                                  index,
                                  "education",
                                  e.target.value
                                )
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
                              value={edu.specialization}
                              onChange={(e) =>
                                updateEducationItem(
                                  index,
                                  "specialization",
                                  e.target.value
                                )
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
                              value={edu.college}
                              onChange={(e) =>
                                updateEducationItem(
                                  index,
                                  "college",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., IIT Bombay"
                              className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-purple-700 font-medium">
                                Start Year
                              </Label>
                              <Input
                                type="number"
                                value={edu.start_year}
                                onChange={(e) =>
                                  updateEducationItem(
                                    index,
                                    "start_year",
                                    e.target.value
                                  )
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
                                value={edu.end_year}
                                onChange={(e) =>
                                  updateEducationItem(
                                    index,
                                    "end_year",
                                    e.target.value
                                  )
                                }
                                placeholder="2024"
                                className="focus:border-purple-500 focus:ring-purple-500 border-purple-200"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {educationItems.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <GraduationCap
                          size={48}
                          className="mx-auto text-purple-300 mb-4"
                        />
                        <p className="mb-4">No education added yet.</p>
                        <Button
                          onClick={addEducationItem}
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Plus size={16} className="mr-2" />
                          Add Your Education
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Save Actions */}
              <div className="flex justify-between items-center pt-8 border-t border-purple-100">
                <Button
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 px-8"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3"
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Saving Changes...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save size={16} className="mr-2" />
                      Save All Changes
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
>>>>>>> 410557a16c5902b86bb8a61d687c4901d1e4fac8
    </Layout>
  );
};

export default EditProfile;
