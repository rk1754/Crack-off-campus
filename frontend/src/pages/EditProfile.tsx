"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  fetchCurrentUser,
  updateUser,
  setProfile,
  setCoverImage,
} from "@/redux/slices/userSlice";
import {
  getMyExperience,
  addExperience as addExperienceThunk,
  updateExperience,
  deleteExperience,
} from "@/redux/slices/experienceSlice";
import {
  getMyEducation,
  addEducation,
  updateMyEducation,
  deleteEducation,
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
  Building,
  BookOpen,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  location: string;
}

interface ValidationErrors {
  experience: { [key: number]: { [key: string]: string } };
  education: { [key: number]: { [key: string]: string } };
  profile: { [key: string]: string };
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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    experience: {},
    education: {},
    profile: {},
  });
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    phone_number: "",
    bio: "",
    skills: [] as string[],
  });

  // Experience and Education states
  const [experienceItems, setExperienceItems] = useState<ExperienceItem[]>([]);
  const [educationItems, setEducationItems] = useState<EducationItem[]>([]);

  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const [skillInput, setSkillInput] = useState("");
  const [isUploadingProfilePic, setIsUploadingProfilePic] = useState(false);
  const [isUploadingCoverImage, setIsUploadingCoverImage] = useState(false);

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
      });
      setProfilePicPreview(user.profile_pic || null);
      setCoverImagePreview(user.cover_image || null);
    }
  }, [user]);

  useEffect(() => {
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

  // Validation functions
  const validateProfileData = () => {
    const errors: { [key: string]: string } = {};

    if (!profileData.name.trim()) {
      errors.name = "Full name is required";
    }
    if (!profileData.phone_number.trim()) {
      errors.phone_number = "Phone number is required";
    }
    if (!profileData.bio.trim()) {
      errors.bio = "About me section is required";
    }
    if (profileData.skills.length === 0) {
      errors.skills = "At least one skill is required";
    }

    return errors;
  };

  const validateExperienceItem = (exp: ExperienceItem, index: number) => {
    const errors: { [key: string]: string } = {};

    if (!exp.job_title.trim()) {
      errors.job_title = "Job title is required";
    }
    if (!exp.company_name.trim()) {
      errors.company_name = "Company name is required";
    }
    if (!exp.start_date.trim()) {
      errors.start_date = "Start date is required";
    }
    if (!exp.end_date.trim()) {
      errors.end_date = "End date is required";
    }
    if (!exp.location.trim()) {
      errors.location = "Location is required";
    }
    if (!exp.description.trim()) {
      errors.description = "Job description is required";
    }
    if (!exp.employment_type.trim()) {
      errors.employment_type = "Employment type is required";
    }

    // Date validation
    if (exp.start_date && exp.end_date) {
      const startDate = new Date(exp.start_date);
      const endDate = new Date(exp.end_date);
      if (startDate >= endDate) {
        errors.end_date = "End date must be after start date";
      }
    }

    return errors;
  };

  const validateEducationItem = (edu: EducationItem, index: number) => {
    const errors: { [key: string]: string } = {};

    if (!edu.education.trim()) {
      errors.education = "Degree is required";
    }
    if (!edu.specialization.trim()) {
      errors.specialization = "Specialization is required";
    }
    if (!edu.college.trim()) {
      errors.college = "College/University is required";
    }
    if (!edu.start_year.trim()) {
      errors.start_year = "Start year is required";
    }
    if (!edu.end_year.trim()) {
      errors.end_year = "End year is required";
    }
    if (!edu.location.trim()) {
      errors.location = "Location is required";
    }

    // Year validation
    if (edu.start_year && edu.end_year) {
      const startYear = Number.parseInt(edu.start_year);
      const endYear = Number.parseInt(edu.end_year);
      const currentYear = new Date().getFullYear();

      if (startYear > currentYear) {
        errors.start_year = "Start year cannot be in the future";
      }
      if (endYear > currentYear + 10) {
        errors.end_year = "End year seems to far in the future";
      }
      if (startYear >= endYear) {
        errors.end_year = "End year must be after start year";
      }
    }

    return errors;
  };

  const validateAllForms = () => {
    const newValidationErrors: ValidationErrors = {
      experience: {},
      education: {},
      profile: {},
    };

    // Validate profile data
    newValidationErrors.profile = validateProfileData();

    // Validate experience items
    experienceItems.forEach((exp, index) => {
      const expErrors = validateExperienceItem(exp, index);
      if (Object.keys(expErrors).length > 0) {
        newValidationErrors.experience[index] = expErrors;
      }
    });

    // Validate education items
    educationItems.forEach((edu, index) => {
      const eduErrors = validateEducationItem(edu, index);
      if (Object.keys(eduErrors).length > 0) {
        newValidationErrors.education[index] = eduErrors;
      }
    });

    setValidationErrors(newValidationErrors);

    // Check if there are any errors
    const hasProfileErrors =
      Object.keys(newValidationErrors.profile).length > 0;
    const hasExperienceErrors =
      Object.keys(newValidationErrors.experience).length > 0;
    const hasEducationErrors =
      Object.keys(newValidationErrors.education).length > 0;

    return !(hasProfileErrors || hasExperienceErrors || hasEducationErrors);
  };

  // Clear specific field error
  const clearFieldError = (
    section: "profile" | "experience" | "education",
    index?: number,
    field?: string
  ) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      if (section === "profile" && field) {
        delete newErrors.profile[field];
      } else if (
        section === "experience" &&
        typeof index === "number" &&
        field
      ) {
        if (newErrors.experience[index]) {
          delete newErrors.experience[index][field];
          if (Object.keys(newErrors.experience[index]).length === 0) {
            delete newErrors.experience[index];
          }
        }
      } else if (
        section === "education" &&
        typeof index === "number" &&
        field
      ) {
        if (newErrors.education[index]) {
          delete newErrors.education[index][field];
          if (Object.keys(newErrors.education[index]).length === 0) {
            delete newErrors.education[index];
          }
        }
      }
      return newErrors;
    });
  }; // Automatic upload handlers for profile and cover images
  const handleProfileImageUpload = async (file: File) => {
    try {
      setIsUploadingProfilePic(true);
      toast.loading("Uploading profile image...", { id: "profile-upload" });
      const result = await dispatch(setProfile({ image: file })).unwrap();
      // Backend returns { imageUrl: string } for profile uploads
      if (result && typeof result === "object" && "imageUrl" in result) {
        setProfilePicPreview((result as any).imageUrl);
      }
      await dispatch(fetchCurrentUser()); // Refresh user data
      toast.success("Profile image updated successfully!", {
        id: "profile-upload",
      });
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload profile image", {
        id: "profile-upload",
      });
    } finally {
      setIsUploadingProfilePic(false);
    }
  };

  const handleCoverImageUpload = async (file: File) => {
    try {
      setIsUploadingCoverImage(true);
      toast.loading("Uploading cover image...", { id: "cover-upload" });
      const result = await dispatch(setCoverImage({ image: file })).unwrap();
      // Backend returns { cover_image: string } for cover uploads
      if (result && typeof result === "object" && "cover_image" in result) {
        setCoverImagePreview((result as any).cover_image);
      }
      await dispatch(fetchCurrentUser()); // Refresh user data
      toast.success("Cover image updated successfully!", {
        id: "cover-upload",
      });
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload cover image", {
        id: "cover-upload",
      });
    } finally {
      setIsUploadingCoverImage(false);
    }
  };
  // File change handler with automatic upload for images
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];

      // Validate file type
      const allowedImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedImageTypes.includes(file.type)) {
        toast.error(
          "Invalid file type. Please upload JPEG, PNG, or WebP images only."
        );
        return;
      }

      // Validate file size (1MB limit)
      const maxSize = 1 * 1024 * 1024; // 1MB in bytes
      if (file.size > maxSize) {
        toast.error(
          `Image size is bigger than 1MB. Please upload images smaller than 1MB. Current size: ${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)}MB`
        );
        return;
      }

      // Automatically upload based on the input name
      if (name === "profile_pic") {
        setProfilePicPreview(URL.createObjectURL(file));
        await handleProfileImageUpload(file);
      } else if (name === "cover_image") {
        setCoverImagePreview(URL.createObjectURL(file));
        await handleCoverImageUpload(file);
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
      clearFieldError("profile", undefined, "skills");
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
    clearFieldError("experience", index, field);
  };

  const removeExperience = (index: number) => {
    const updated = [...experienceItems];
    updated.splice(index, 1);
    setExperienceItems(updated);

    // Clear validation errors for this item
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.experience[index];
      return newErrors;
    });
  };

  const addEducationItem = () => {
    const newEducation: EducationItem = {
      education: "",
      specialization: "",
      college: "",
      start_year: "",
      end_year: "",
      location: "",
    };
    setEducationItems([...educationItems, newEducation]);
  };

  const updateEducationItem = (index: number, field: string, value: string) => {
    const updated = [...educationItems];
    updated[index] = { ...updated[index], [field]: value };
    setEducationItems(updated);
    clearFieldError("education", index, field);
  };

  const removeEducationItem = (index: number) => {
    const updated = [...educationItems];
    updated.splice(index, 1);
    setEducationItems(updated);

    // Clear validation errors for this item
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.education[index];
      return newErrors;
    });
  };

  const calculateDuration = (startYear: string, endYear: string) => {
    if (!startYear || !endYear) return "";
    const duration = Number.parseInt(endYear) - Number.parseInt(startYear);
    return `${duration} year${duration !== 1 ? "s" : ""}`;
  };
  const handleSaveProfile = async () => {
    // Validate all forms before saving
    const isValid = validateAllForms();

    if (!isValid) {
      toast.error(
        "Please fill in all required fields and fix any errors before saving."
      );
      return;
    }

    setIsSaving(true);
    try {
      // Save profile data (excluding images as they are handled automatically)
      const payload: any = {
        name: profileData.name,
        phone_number: profileData.phone_number,
        bio: profileData.bio,
        skills: profileData.skills,
      };

      await dispatch(updateUser({ data: payload })).unwrap();

      // Handle experience deletions
      const currentIds = experienceItems
        .map((e) => e.id || e._id)
        .filter(Boolean);
      if (experiences && Array.isArray(experiences)) {
        for (const oldExp of experiences) {
          const oldId = oldExp.id || oldExp._id;
          if (oldId && !currentIds.includes(oldId)) {
            await dispatch(deleteExperience(oldId)).unwrap();
          }
        }
      }
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

      // Handle education deletions
      const currentEduIds = educationItems
        .map((e) => e.id || e._id)
        .filter(Boolean);
      if (educationList && Array.isArray(educationList)) {
        for (const oldEdu of educationList) {
          const oldId = oldEdu.id || oldEdu._id;
          if (oldId && !currentEduIds.includes(oldId)) {
            await dispatch(deleteEducation(oldId)).unwrap();
          }
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
      console.error("Profile update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileDataChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    clearFieldError("profile", undefined, field);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 w-fit"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Profile
                </Button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Edit Profile
                  </h1>{" "}
                  <p className="text-gray-600 text-sm sm:text-base">
                    Update your professional information. Images upload
                    automatically when selected.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </span>
                )}
              </Button>
            </div>

            {/* Validation Summary */}
            {(Object.keys(validationErrors.profile).length > 0 ||
              Object.keys(validationErrors.experience).length > 0 ||
              Object.keys(validationErrors.education).length > 0) && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Please fix the validation errors below before saving your
                  profile.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6 sm:space-y-8">
              {/* Cover Photo & Profile Picture - Responsive like LinkedIn */}
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-gray-100 via-white to-purple-100">
                {/* Cover Image Section - Responsive height */}
                <div className="relative w-full h-32 sm:h-40 md:h-48">
                  {coverImagePreview ? (
                    <img
                      src={coverImagePreview || "/placeholder.svg"}
                      alt="Cover"
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-white to-purple-100">
                      <img
                        src="/placeholder.svg"
                        alt="Upload cover"
                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-60 mb-2"
                      />
                      <span className="text-gray-400 font-medium text-xs sm:text-sm md:text-base">
                        Upload Cover Image
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-white to-purple-200 opacity-70"></div>{" "}
                  <label className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/95 hover:bg-white p-2 sm:p-3 rounded-full cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
                    {isUploadingCoverImage ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Upload
                        size={16}
                        className="sm:w-5 sm:h-5 text-purple-600"
                      />
                    )}
                    <input
                      type="file"
                      name="cover_image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isUploadingCoverImage}
                    />
                  </label>
                </div>

                <CardContent className="relative pt-0 pb-6 sm:pb-8 px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-16 relative z-10">
                    {/* Profile Picture - Responsive sizing */}
                    <div className="relative flex-shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-2 sm:border-4 border-white bg-white overflow-hidden shadow-2xl">
                        <img
                          src={
                            profilePicPreview ||
                            user?.profile_pic ||
                            "/placeholder.svg?height=128&width=128" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>{" "}
                      <label className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-purple-600 hover:bg-purple-700 text-white p-1.5 sm:p-2 rounded-full cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
                        {isUploadingProfilePic ? (
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Camera size={12} className="sm:w-4 sm:h-4" />
                        )}
                        <input
                          type="file"
                          name="profile_pic"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={isUploadingProfilePic}
                        />
                      </label>
                    </div>{" "}
                    <div className="flex-1 sm:mb-4">
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Upload a professional photo and cover image to make your
                        profile stand out.{" "}
                        <span className="text-purple-600 font-medium">
                          Images are uploaded automatically.
                        </span>{" "}
                        <span className="text-orange-600 font-medium">
                          (Max 1MB each)
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information - Responsive */}
              <Card className="border-none shadow-lg bg-white">
                <CardHeader className="border-b border-purple-100 pb-4 px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-3 text-purple-700 text-lg sm:text-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User
                        size={16}
                        className="sm:w-5 sm:h-5 text-purple-600"
                      />
                    </div>
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-6 px-4 sm:px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label className="text-purple-700 font-medium text-sm sm:text-base">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={profileData.name}
                        onChange={(e) =>
                          handleProfileDataChange("name", e.target.value)
                        }
                        placeholder="Enter your full name"
                        className={`focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                          validationErrors.profile.name ? "border-red-500" : ""
                        }`}
                      />
                      {validationErrors.profile.name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {validationErrors.profile.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-purple-700 font-medium text-sm sm:text-base">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={profileData.phone_number}
                        onChange={(e) =>
                          handleProfileDataChange(
                            "phone_number",
                            e.target.value
                          )
                        }
                        placeholder="Enter your phone number"
                        className={`focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                          validationErrors.profile.phone_number
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {validationErrors.profile.phone_number && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {validationErrors.profile.phone_number}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-purple-700 font-medium text-sm sm:text-base">
                      About Me <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        handleProfileDataChange("bio", e.target.value)
                      }
                      placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                      rows={4}
                      className={`resize-none focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                        validationErrors.profile.bio ? "border-red-500" : ""
                      }`}
                    />
                    {validationErrors.profile.bio && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {validationErrors.profile.bio}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Skills - Responsive */}
              <Card className="border-none shadow-lg bg-white">
                <CardHeader className="border-b border-purple-100 pb-4 px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-3 text-purple-700 text-lg sm:text-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award
                        size={16}
                        className="sm:w-5 sm:h-5 text-purple-600"
                      />
                    </div>
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6 space-y-4 px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill (e.g., React, Python, etc.)"
                      onKeyPress={handleSkillInputKeyPress}
                      className="focus:border-purple-500 focus:ring-purple-500 border-purple-200 flex-1"
                    />
                    <Button
                      onClick={addSkill}
                      type="button"
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 sm:px-6 w-full sm:w-auto"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  {validationErrors.profile.skills && false && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle size={12} />
                      {validationErrors.profile.skills}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {profileData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300 transition-all duration-200 py-1 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-red-600 transition-colors"
                        >
                          <X size={12} className="sm:w-3 sm:h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Work Experience - Responsive */}
              <Card className="border-none shadow-lg bg-white">
                <CardHeader className="border-b border-purple-100 pb-4 px-4 sm:px-6">
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-purple-700 text-lg sm:text-xl">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Briefcase
                          size={16}
                          className="sm:w-5 sm:h-5 text-purple-600"
                        />
                      </div>
                      Work Experience
                    </div>
                    <Button
                      onClick={addExperienceItem}
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 w-full sm:w-auto"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Experience
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                  <div className="space-y-4 sm:space-y-6">
                    {experienceItems.map((exp, index) => (
                      <div
                        key={index}
                        className={`relative bg-gradient-to-r from-white to-purple-50/30 border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
                          validationErrors.experience[index]
                            ? "border-red-300 bg-red-50/20"
                            : "border-purple-200"
                        }`}
                      >
                        <Button
                          onClick={() => removeExperience(index)}
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 sm:p-2"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </Button>

                        {/* Experience Header */}
                        <div className="mb-4 sm:mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase
                              size={16}
                              className="sm:w-4 sm:h-4 text-purple-600"
                            />
                            <span className="text-xs sm:text-sm font-medium text-purple-700">
                              Experience #{index + 1}
                            </span>
                            {validationErrors.experience[index] && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertCircle size={10} className="mr-1" />
                                Required fields missing
                              </Badge>
                            )}
                          </div>
                          <Separator className="bg-purple-100" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Label className="text-purple-700 font-medium flex items-center gap-2 text-xs sm:text-sm">
                              <User size={12} className="sm:w-3 sm:h-3" />
                              Job Title <span className="text-red-500">*</span>
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
                              className={`focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                                validationErrors.experience[index]?.job_title
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {validationErrors.experience[index]?.job_title && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={10} />
                                {validationErrors.experience[index].job_title}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="text-purple-700 font-medium flex items-center gap-2 text-xs sm:text-sm">
                              <Building size={12} className="sm:w-3 sm:h-3" />
                              Company Name{" "}
                              <span className="text-red-500">*</span>
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
                              className={`focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                                validationErrors.experience[index]?.company_name
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {validationErrors.experience[index]
                              ?.company_name && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={10} />
                                {
                                  validationErrors.experience[index]
                                    .company_name
                                }
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="text-purple-700 font-medium flex items-center gap-2 text-xs sm:text-sm">
                              <Calendar size={12} className="sm:w-3 sm:h-3" />
                              Start Date <span className="text-red-500">*</span>
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
                              className={`focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                                validationErrors.experience[index]?.start_date
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {validationErrors.experience[index]?.start_date && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={10} />
                                {validationErrors.experience[index].start_date}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="text-purple-700 font-medium flex items-center gap-2 text-xs sm:text-sm">
                              <Calendar size={12} className="sm:w-3 sm:h-3" />
                              End Date <span className="text-red-500">*</span>
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
                              className={`focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                                validationErrors.experience[index]?.end_date
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {validationErrors.experience[index]?.end_date && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={10} />
                                {validationErrors.experience[index].end_date}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="text-purple-700 font-medium flex items-center gap-2 text-xs sm:text-sm">
                              <MapPin size={12} className="sm:w-3 sm:h-3" />
                              Location <span className="text-red-500">*</span>
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
                              className={`focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                                validationErrors.experience[index]?.location
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {validationErrors.experience[index]?.location && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={10} />
                                {validationErrors.experience[index].location}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="text-purple-700 font-medium flex items-center gap-2 text-xs sm:text-sm">
                              <Clock size={12} className="sm:w-3 sm:h-3" />
                              Employment Type{" "}
                              <span className="text-red-500">*</span>
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
                              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mt-1 text-sm sm:text-base ${
                                validationErrors.experience[index]
                                  ?.employment_type
                                  ? "border-red-500"
                                  : "border-purple-200"
                              }`}
                            >
                              <option value="full_time">Full Time</option>
                              <option value="part_time">Part Time</option>
                              <option value="contract">Contract</option>
                              <option value="internship">Internship</option>
                              <option value="freelance">Freelance</option>
                            </select>
                            {validationErrors.experience[index]
                              ?.employment_type && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={10} />
                                {
                                  validationErrors.experience[index]
                                    .employment_type
                                }
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-4">
                          <Label className="text-purple-700 font-medium text-xs sm:text-sm">
                            Job Description{" "}
                            <span className="text-red-500">*</span>
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
                            className={`resize-none focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                              validationErrors.experience[index]?.description
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                          {validationErrors.experience[index]?.description && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle size={10} />
                              {validationErrors.experience[index].description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {experienceItems.length === 0 && (
                      <div className="text-center py-6 sm:py-8 text-gray-500 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
                        <Briefcase
                          size={32}
                          className="sm:w-12 sm:h-12 mx-auto text-purple-300 mb-4"
                        />
                        <p className="mb-4 text-base sm:text-lg">
                          No work experience added yet.
                        </p>
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

              {/* Education - Responsive */}
              <Card className="border-none shadow-lg bg-white">
                <CardHeader className="border-b border-purple-100 pb-4 px-4 sm:px-6">
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-purple-700 text-lg sm:text-xl">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <GraduationCap
                          size={16}
                          className="sm:w-5 sm:h-5 text-purple-600"
                        />
                      </div>
                      Education
                    </div>
                    <Button
                      onClick={addEducationItem}
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 w-full sm:w-auto"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Education
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                  <div className="space-y-4 sm:space-y-6">
                    {educationItems.map((edu, index) => (
                      <div
                        key={index}
                        className={`relative bg-gradient-to-r from-white to-purple-50/30 border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
                          validationErrors.education[index]
                            ? "border-red-300 bg-red-50/20"
                            : "border-purple-200"
                        }`}
                      >
                        <Button
                          onClick={() => removeEducationItem(index)}
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 sm:p-2"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </Button>

                        {/* Education Header */}
                        <div className="mb-4 sm:mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <GraduationCap
                              size={16}
                              className="sm:w-4 sm:h-4 text-purple-600"
                            />
                            <span className="text-xs sm:text-sm font-medium text-purple-700">
                              Education #{index + 1}
                            </span>
                            {validationErrors.education[index] && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertCircle size={10} className="mr-1" />
                                Required fields missing
                              </Badge>
                            )}
                          </div>
                          <Separator className="bg-purple-100" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Label className="text-purple-700 font-medium flex items-center gap-2 text-xs sm:text-sm">
                              <Award size={12} className="sm:w-3 sm:h-3" />
                              Degree <span className="text-red-500">*</span>
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
                              className={`focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                                validationErrors.education[index]?.education
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {validationErrors.education[index]?.education && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={10} />
                                {validationErrors.education[index].education}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="text-purple-700 font-medium flex items-center gap-2 text-xs sm:text-sm">
                              <BookOpen size={12} className="sm:w-3 sm:h-3" />
                              Specialization/Branch{" "}
                              <span className="text-red-500">*</span>
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
                              className={`focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                                validationErrors.education[index]
                                  ?.specialization
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {validationErrors.education[index]
                              ?.specialization && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={10} />
                                {
                                  validationErrors.education[index]
                                    .specialization
                                }
                              </p>
                            )}
                          </div>
                          <div className="lg:col-span-2">
                            <Label className="text-purple-700 font-medium flex items-center gap-2 text-xs sm:text-sm">
                              <Building size={12} className="sm:w-3 sm:h-3" />
                              College/University{" "}
                              <span className="text-red-500">*</span>
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
                              className={`focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                                validationErrors.education[index]?.college
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {validationErrors.education[index]?.college && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={10} />
                                {validationErrors.education[index].college}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="text-purple-700 font-medium flex items-center gap-2 text-xs sm:text-sm">
                              <Calendar size={12} className="sm:w-3 sm:h-3" />
                              Start Year <span className="text-red-500">*</span>
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
                              className={`focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                                validationErrors.education[index]?.start_year
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {validationErrors.education[index]?.start_year && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={10} />
                                {validationErrors.education[index].start_year}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="text-purple-700 font-medium flex items-center gap-2 text-xs sm:text-sm">
                              <Calendar size={12} className="sm:w-3 sm:h-3" />
                              End Year <span className="text-red-500">*</span>
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
                              className={`focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                                validationErrors.education[index]?.end_year
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {validationErrors.education[index]?.end_year && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={10} />
                                {validationErrors.education[index].end_year}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label className="text-purple-700 font-medium flex items-center gap-2 text-xs sm:text-sm">
                              <MapPin size={12} className="sm:w-3 sm:h-3" />
                              Location <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              value={edu.location || ""}
                              onChange={(e) =>
                                updateEducationItem(
                                  index,
                                  "location",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Mumbai, India"
                              className={`focus:border-purple-500 focus:ring-purple-500 border-purple-200 mt-1 ${
                                validationErrors.education[index]?.location
                                  ? "border-red-500"
                                  : ""
                              }`}
                            />
                            {validationErrors.education[index]?.location && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={10} />
                                {validationErrors.education[index].location}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Duration Display */}
                        {edu.start_year && edu.end_year && (
                          <div className="mt-3 sm:mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="flex items-center gap-2 text-purple-700">
                              <Clock size={14} className="sm:w-4 sm:h-4" />
                              <span className="font-medium text-xs sm:text-sm">
                                Duration:{" "}
                                {calculateDuration(
                                  edu.start_year,
                                  edu.end_year
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {educationItems.length === 0 && (
                      <div className="text-center py-6 sm:py-8 text-gray-500 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
                        <GraduationCap
                          size={32}
                          className="sm:w-12 sm:h-12 mx-auto text-purple-300 mb-4"
                        />
                        <p className="mb-4 text-base sm:text-lg">
                          No education added yet.
                        </p>
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

              {/* Save Actions - Responsive */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-purple-100 gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/profile")}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 px-6 sm:px-8 w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Saving Changes...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
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
    </Layout>
  );
};

export default EditProfile;
