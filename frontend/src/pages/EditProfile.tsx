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
    </Layout>
  );
};

export default EditProfile;
