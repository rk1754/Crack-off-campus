"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/redux/store"
import { fetchCurrentUser, updateUser } from "@/redux/slices/userSlice"
import { getMyExperience, addExperience, deleteExperience } from "@/redux/slices/experienceSlice"
import { getMyEducation, addEducation, deleteEducation } from "@/redux/slices/educationSlice"
import Layout from "../components/layout/Layout"
import ProfileSidebar from "../components/profile/ProfileSidebar"
import {
  Mail,
  Phone,
  Calendar,
  Camera,
  Briefcase,
  GraduationCap,
  User,
  Award,
  MapPin,
  Building,
  BookOpen,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { format } from "date-fns"

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>()
  const userState = useSelector((state: RootState) => state.user)
  const { user, loading, error } = userState || {}
  const experienceState = useSelector((state: RootState) => state.experience)
  const { experiences, currentExperience } = experienceState || {}
  const educationState = useSelector((state: RootState) => state.education)
  const { education, educationList } = educationState || {}
  const { isAuthenticated } = useAuth()

  // Editing states
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [profileData, setProfileData] = useState({
    name: "",
    phone_number: "",
    bio: "",
    skills: [] as string[],
    profile_pic: null,
    cover_image: null,
  })

  const [experienceForm, setExperienceForm] = useState({
    job_title: "",
    company_name: "",
    start_date: "",
    end_date: "",
    location: "",
    description: "",
    employment_type: "full_time",
  })

  const [educationForm, setEducationForm] = useState({
    education: "",
    specialization: "",
    college: "",
    start_year: "",
    end_year: "",
    location: "",
  })

  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
  const [skillInput, setSkillInput] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser())
      dispatch(getMyExperience())
      dispatch(getMyEducation())
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        phone_number: user.phone_number || "",
        bio: user.bio || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
        profile_pic: null,
        cover_image: null,
      })
      setProfilePicPreview(user.profile_pic || null)
      setCoverImagePreview(user.cover_image || null)
    }
  }, [user])

  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />
  }

  if (loading) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-600 font-medium">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-8 text-center text-red-500">
          <p>Error loading profile: {error}</p>
        </div>
      </Layout>
    )
  }

  // Handlers
  const handleEdit = (section: string) => {
    setEditingSection(section)
  }

  const handleCancel = () => {
    setEditingSection(null)
    // Reset forms
    if (user) {
      setProfileData({
        name: user.name || "",
        phone_number: user.phone_number || "",
        bio: user.bio || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
        profile_pic: null,
        cover_image: null,
      })
    }
    setExperienceForm({
      job_title: "",
      company_name: "",
      start_date: "",
      end_date: "",
      location: "",
      description: "",
      employment_type: "full_time",
    })
    setEducationForm({
      education: "",
      specialization: "",
      college: "",
      start_year: "",
      end_year: "",
      location: "",
    })
    setSkillInput("")
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    const payload: any = {
      name: profileData.name,
      phone_number: profileData.phone_number,
      bio: profileData.bio,
      skills: profileData.skills,
    }
    if (profileData.profile_pic) payload.profile_pic = profileData.profile_pic
    if (profileData.cover_image) payload.cover_image = profileData.cover_image

    try {
      await dispatch(updateUser({ data: payload })).unwrap()
      toast.success("Profile updated successfully!")
      await dispatch(fetchCurrentUser())
      setEditingSection(null)
    } catch (err) {
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddExperience = async () => {
    try {
      await dispatch(addExperience(experienceForm as any)).unwrap()
      toast.success("Experience added!")
      setEditingSection(null)
      setExperienceForm({
        job_title: "",
        company_name: "",
        start_date: "",
        end_date: "",
        location: "",
        description: "",
        employment_type: "full_time",
      })
      await dispatch(getMyExperience())
    } catch (err) {
      toast.error("Failed to add experience")
    }
  }

  const handleDeleteExperience = async (id: string) => {
    try {
      await dispatch(deleteExperience(id)).unwrap()
      toast.success("Experience deleted!")
      await dispatch(getMyExperience())
    } catch (err) {
      toast.error("Failed to delete experience")
    }
  }

  const handleAddEducation = async () => {
    try {
      await dispatch(addEducation(educationForm as any)).unwrap()
      toast.success("Education added!")
      setEditingSection(null)
      setEducationForm({
        education: "",
        specialization: "",
        college: "",
        start_year: "",
        end_year: "",
        location: "",
      })
      await dispatch(getMyEducation())
    } catch (err) {
      toast.error("Failed to add education")
    }
  }

  const handleDeleteEducation = async (id: string) => {
    try {
      await dispatch(deleteEducation(id)).unwrap()
      toast.success("Education deleted!")
      await dispatch(getMyEducation())
    } catch (err) {
      toast.error("Failed to delete education")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files[0]) {
      const file = files[0]
      setProfileData((prev) => ({ ...prev, [name]: file }))
      if (name === "profile_pic") {
        setProfilePicPreview(URL.createObjectURL(file))
      } else if (name === "cover_image") {
        setCoverImagePreview(URL.createObjectURL(file))
      }
    }
  }

  const addSkill = () => {
    const trimmedSkill = skillInput.trim()
    if (trimmedSkill && !profileData.skills.includes(trimmedSkill)) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill],
      }))
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleSkillInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate) return ""

    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()

    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? "s" : ""}`
    } else {
      return `${years} year${years !== 1 ? "s" : ""} ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-8">
            {/* Sidebar - Hidden on mobile and tablet */}
            <div className="hidden xl:block xl:col-span-1">
              <ProfileSidebar />
            </div>

            {/* Main Content */}
            <div className="xl:col-span-3 space-y-4 sm:space-y-8">
              {/* Cover Photo & Profile Header - Responsive like LinkedIn */}
              <Card className="overflow-hidden bg-gradient-to-br from-gray-100 via-white to-purple-100 shadow-2xl border-none">
                {/* Cover Image Section - Responsive height */}
                <div className="relative w-full h-32 sm:h-48 md:h-56 lg:h-64">
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
                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 opacity-60 mb-2"
                      />
                      <span className="text-gray-400 font-medium text-xs sm:text-sm md:text-base">
                        Upload Cover Image
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-white to-purple-200 opacity-70"></div>
                  {editingSection === "profile" && (
                    <label className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 bg-white hover:bg-gray-800 text-white p-2 sm:p-3 rounded-full cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
                      <Camera size={16} className="sm:w-5 sm:h-5 text-purple-500" />
                      <span className="hidden lg:inline text-purple-700 text-sm">Update Cover</span>
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

                <CardContent className="relative pt-0 pb-4 sm:pb-8 px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-16 md:-mt-20 relative z-10">
                    {/* Profile Picture - Responsive sizing */}
                    <div className="relative flex-shrink-0">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-2xl border-2 sm:border-4 border-white bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
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
                        <label className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-gray-300 hover:bg-gray-800 text-black p-2 sm:p-3 rounded-full cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
                          <Camera size={14} className="sm:w-4 sm:h-4 text-black" />
                          <span className="hidden lg:inline text-xs">Update</span>
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

                    {/* User Info - Responsive layout */}
                    <div className="flex-1 sm:mb-6 mt-4 sm:mt-20 w-full">
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 break-words">
                            {user?.name || "User"}
                          </h1>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
                            <Mail size={14} className="sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                            <span className="truncate">{user?.email || "Not provided"}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
                            <Phone size={14} className="sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                            <span className="truncate">{user?.phone_number || "Not provided"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Section - Responsive */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b border-purple-100 pb-4 px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-3 text-purple-700 text-lg sm:text-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User size={16} className="sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    About Me
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                  <p className="text-purple-800 leading-relaxed text-base sm:text-lg">
                    {user?.bio || "No bio provided yet."}
                  </p>
                </CardContent>
              </Card>

              {/* Skills Section - Responsive */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b border-purple-100 pb-4 px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-3 text-purple-700 text-lg sm:text-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award size={16} className="sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {(user?.skills || []).length > 0 ? (
                      (user?.skills || []).map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 py-1 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium"
                        >
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center w-full py-6 sm:py-8 text-sm sm:text-base">
                        No skills added yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Experience Section - Responsive */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b border-purple-100 pb-4 px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-3 text-purple-700 text-lg sm:text-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Briefcase size={16} className="sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                  <div className="space-y-4 sm:space-y-6">
                    {experiences && experiences.length > 0 ? (
                      experiences.map((exp: any, index: number) => (
                        <div
                          key={exp.id || exp._id}
                          className="group relative bg-purple-50 border border-purple-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:border-purple-300"
                        >
                          {/* Header with Job Title and Duration - Unified Color Combo */}
                          <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-800 mb-2 break-words">
                                {exp.job_title}
                              </h3>
                              <div className="flex items-center gap-2 text-purple-700 font-semibold mb-2 sm:mb-3">
                                <Building
                                  size={14}
                                  className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-700 flex-shrink-0"
                                />
                                <span className="text-sm sm:text-base md:text-lg break-words text-purple-700">{exp.company_name}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 sm:px-4 sm:py-2 rounded-full w-fit">
                                <Calendar size={12} className="sm:w-4 sm:h-4 text-purple-700 flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-medium text-purple-700 whitespace-nowrap">
                                  {exp.start_date ? format(new Date(exp.start_date.slice(0, 10)), "MMM yyyy") : ""} - {exp.end_date ? format(new Date(exp.end_date.slice(0, 10)), "MMM yyyy") : "Present"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-700">
                                <Clock size={12} className="sm:w-3 sm:h-3 text-purple-700 flex-shrink-0" />
                                <span>{calculateDuration(exp.start_date, exp.end_date)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Location and Employment Type - Unified Color Combo */}
                          <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                            {exp.location && (
                              <div className="flex items-center gap-2 bg-purple-100 px-2 sm:px-3 py-1 rounded-full">
                                <MapPin size={12} className="sm:w-3 sm:h-3 text-purple-700 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-purple-700">{exp.location}</span>
                              </div>
                            )}
                            <Badge
                              variant="outline"
                              className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-purple-200 font-medium px-2 sm:px-3 py-1 text-xs sm:text-sm"
                            >
                              {(exp.employment_type || "")
                                .replace("_", " ")
                                .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </Badge>
                          </div>

                          {/* Description - Unified Color Combo */}
                          {exp.description && (
                            <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-100">
                              <p className="text-purple-800 leading-relaxed text-sm sm:text-base">{exp.description}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 sm:py-12 bg-gradient-to-br from-purple-50 to-white rounded-xl">
                        <Briefcase size={32} className="sm:w-12 sm:h-12 mx-auto text-purple-300 mb-4" />
                        <p className="text-gray-500 mb-4 text-base sm:text-lg">No work experience added yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Education Section - Responsive */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b border-purple-100 pb-4 px-4 sm:px-6">
                  <CardTitle className="flex items-center gap-3 text-purple-700 text-lg sm:text-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <GraduationCap size={16} className="sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                  {/* Add Education Inline Form */}
                  {editingSection === "add-education" && (
                    <form
                      className="mb-6 p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-4"
                      onSubmit={e => {
                        e.preventDefault();
                        handleAddEducation();
                      }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">Degree</label>
                          <input
                            type="text"
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border-purple-200"
                            value={educationForm.education}
                            onChange={e => setEducationForm(f => ({ ...f, education: e.target.value }))}
                            placeholder="e.g., B.Tech, B.Sc, MBA"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">Specialization</label>
                          <input
                            type="text"
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border-purple-200"
                            value={educationForm.specialization}
                            onChange={e => setEducationForm(f => ({ ...f, specialization: e.target.value }))}
                            placeholder="e.g., Computer Science"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">College/University</label>
                          <input
                            type="text"
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border-purple-200"
                            value={educationForm.college}
                            onChange={e => setEducationForm(f => ({ ...f, college: e.target.value }))}
                            placeholder="e.g., IIT Bombay"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">Location</label>
                          <input
                            type="text"
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border-purple-200"
                            value={educationForm.location}
                            onChange={e => setEducationForm(f => ({ ...f, location: e.target.value }))}
                            placeholder="e.g., Mumbai, India"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">Start Year</label>
                          <input
                            type="number"
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border-purple-200"
                            value={educationForm.start_year}
                            onChange={e => setEducationForm(f => ({ ...f, start_year: e.target.value }))}
                            placeholder="e.g., 2020"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-700 mb-1">End Year</label>
                          <input
                            type="number"
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border-purple-200"
                            value={educationForm.end_year}
                            onChange={e => setEducationForm(f => ({ ...f, end_year: e.target.value }))}
                            placeholder="e.g., 2024"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button
                          type="submit"
                          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg"
                          onClick={() => setEditingSection(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                  {/* Add Education Button */}
                  <button
                    className="mb-4 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 font-semibold px-6 py-2 rounded-lg shadow hover:from-purple-200 hover:to-purple-300 transition"
                    onClick={() => setEditingSection(editingSection === "add-education" ? null : "add-education")}
                  >
                    + Add Education
                  </button>
                  <div className="space-y-2">
                    {educationList && educationList.length > 0 ? (
                      educationList.map((edu: any, idx: number) => (
                        <div
                          key={edu.id || edu._id || idx}
                          className="mb-4 p-3 sm:p-4 rounded-xl bg-purple-50 border border-purple-200 relative group"
                        >
                          <div className="flex flex-col gap-2 sm:gap-3">
                            <div className="space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
                                <span className="font-semibold text-sm sm:text-base text-purple-700">Degree:</span>
                                <span className="text-sm sm:text-base break-words text-purple-800">
                                  {edu.education || <span className="text-purple-400">N/A</span>}
                                </span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-purple-700 flex-shrink-0" />
                                <span className="font-semibold text-sm sm:text-base text-purple-700">Specialization:</span>
                                <span className="text-sm sm:text-base break-words text-purple-800">
                                  {edu.specialization || <span className="text-purple-400">N/A</span>}
                                </span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <Building className="w-3 h-3 sm:w-4 sm:h-4 text-purple-700 flex-shrink-0" />
                                <span className="font-semibold text-sm sm:text-base text-purple-700">College/University:</span>
                                <span className="text-sm sm:text-base break-words text-purple-800">
                                  {edu.college !== undefined && edu.college !== null && edu.college !== "" ? (
                                    edu.college
                                  ) : (
                                    <span className="text-purple-400">N/A</span>
                                  )}
                                </span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-purple-700 flex-shrink-0" />
                                <span className="font-semibold text-sm sm:text-base text-purple-700">Location:</span>
                                <span className="text-sm sm:text-base break-words text-purple-800">
                                  {edu.location !== undefined && edu.location !== null && edu.location !== "" ? (
                                    edu.location
                                  ) : (
                                    <span className="text-purple-400">N/A</span>
                                  )}
                                </span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-700 flex-shrink-0" />
                                <span className="font-semibold text-sm sm:text-base text-purple-700">Year:</span>
                                <span className="text-sm sm:text-base text-purple-800">
                                  {edu.start_year ? (
                                    new Date(edu.start_year).getFullYear()
                                  ) : (
                                    <span className="text-purple-400">N/A</span>
                                  )}{" "}
                                  to{" "}
                                  {edu.end_year ? (
                                    new Date(edu.end_year).getFullYear()
                                  ) : (
                                    <span className="text-purple-400">N/A</span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-purple-400 text-center py-6 sm:py-8 text-sm sm:text-base">
                        No education details added yet.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
