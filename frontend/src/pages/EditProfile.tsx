import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Layout from "../components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
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
        profile_pic: null,
        cover_image: null,
      });
      setProfilePicPreview(user.profile_pic || null);
      setCoverImagePreview(user.cover_image || null);
    }
  }, [user]);

  useEffect(() => {
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
      if (name === "profile_pic") {
        setProfilePicPreview(URL.createObjectURL(file));
      } else if (name === "cover_image") {
        setCoverImagePreview(URL.createObjectURL(file));
      }
    }
  };

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
      console.error("Profile update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

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
    </Layout>
  );
};

export default EditProfile;
