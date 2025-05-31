"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/layout/Layout";
import JobCard from "../components/job/JobCard";
import CompanyShowcase from "../components/home/CompanyShowcase";
import BrowseByCategory from "../components/home/BrowseByCategories";
import WhyChooseUs from "../components/home/WhyChooseUs";
import WhyChooseUs2 from "../components/home/WhyChooseUs2";
import JobSection from "../components/home/jobsSection";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchAllJobs, type Job } from "@/redux/slices/jobSlice";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { FaPlay } from "react-icons/fa";
import { Search, MapPin, Briefcase, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  createPaymentOrder,
  verifyAndStorePayment,
} from "@/redux/slices/paymentSlice";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const {
    jobs: allJobs,
    loading: jobsLoading,
    error: jobsError,
  } = useSelector((state: RootState) => state.job);
  const paymentState = useSelector((state: RootState) => state.payment);

  const [recentFeaturedJobs, setRecentFeaturedJobs] = useState<Job[]>([]);
  const isMobile = useIsMobile();

  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchExperience, setSearchExperience] = useState("");

  useEffect(() => {
    if (user) {
      dispatch(fetchAllJobs());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user && allJobs && allJobs.length > 0) {
      const sortedJobs = [...allJobs]
        .sort(
          (a, b) =>
            new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
        )
        .slice(0, 4);
      setRecentFeaturedJobs(sortedJobs);
    } else if (!user) {
      const publicJobs = [...(allJobs || [])]
        .sort(
          (a, b) =>
            new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
        )
        .slice(0, 4);
      setRecentFeaturedJobs(publicJobs);
    } else {
      setRecentFeaturedJobs([]);
    }
  }, [allJobs, user]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayReady(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleOpenPremiumModal = () => {
    if (!user) {
      navigate("/login?redirect=/");
    } else {
      const premiumTiers = ["gold", "gold_plus", "diamond"];
      if (
        user.subscription_type &&
        premiumTiers.includes(user.subscription_type)
      ) {
        console.log("User already has premium access!");
        return;
      }
      setIsPremiumModalOpen(true);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!user) {
      console.error("Please log in to proceed with the payment.");
      navigate("/login?redirect=/");
      return;
    }
    if (!isRazorpayReady) {
      console.error(
        "Payment gateway is still loading. Please wait a moment and try again."
      );
      return;
    }
    try {
      const resultAction = await dispatch(createPaymentOrder(99 * 100));
      const orderData = resultAction.payload as {
        order_id: string;
        amount: number;
        currency: string;
        error?: string;
      };

      if (
        !orderData ||
        orderData.error ||
        !orderData.order_id ||
        !orderData.amount
      ) {
        console.error(
          "Order data is invalid or contains an error:",
          orderData?.error ||
            "Failed to create payment order. Please try again."
        );
        return;
      }

      const options = {
        key: "rzp_test_GBC6wsiyhZIszp",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Crack Off-Campus",
        description: "Unlock Premium Job Access (₹99)",
        order_id: orderData.order_id,
        handler: async (response: any) => {
          try {
            await dispatch(
              verifyAndStorePayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: orderData.amount,
                currency: orderData.currency || "INR",
                user_id: user.id,
              })
            ).unwrap();
            console.log("Payment successful! Premium access unlocked.");
            setIsPremiumModalOpen(false);
            window.location.reload();
          } catch (verificationError: any) {
            console.error(
              "Payment verification error:",
              verificationError?.message ||
                "Payment verification failed. Please contact support."
            );
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone_number || "",
        },
        theme: {
          color: "#9b87f5",
        },
        modal: {
          ondismiss: () => {
            console.log("Razorpay modal dismissed");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        console.error(
          "Razorpay payment failed:",
          response.error.description || response.error.reason
        );
      });
      rzp.open();
    } catch (paymentError: any) {
      console.error(
        "Razorpay payment initiation error:",
        paymentError?.message || "Payment failed to start. Please try again."
      );
    }
  };

  const handleHomePageSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchKeyword.trim()) {
      queryParams.set("keyword", searchKeyword.trim());
    }
    if (searchLocation.trim()) {
      queryParams.set("location", searchLocation.trim());
    }
    if (searchExperience.trim()) {
      queryParams.set("experience", searchExperience.trim());
    }
    navigate(`/jobs?${queryParams.toString()}`);
  };

  return (
    <>
      <Helmet>
        <title>
          Crack Off-Campus: Off Campus Jobs, Internships, Resume Review,
          Referrals & Career Guidance
        </title>
        <meta
          name="description"
          content="Crack Off-Campus is India's #1 platform for off campus jobs, internships, resume reviews, job referrals, and career guidance. Get hired faster with expert support, job alerts, and placement resources for students and freshers."
        />
        <link rel="canonical" href="https://crackoffcampus.com/" />
        <meta
          property="og:title"
          content="Crack Off-Campus: Off Campus Jobs, Internships, Resume Review, Referrals & Career Guidance"
        />
        <meta
          property="og:description"
          content="India's leading platform for off campus jobs, internships, resume reviews, job referrals, and career guidance. Find your dream job and get hired faster with Crack Off-Campus."
        />
        <meta
          property="og:image"
          content="https://lovable.dev/opengraph-image-p98pqg.png"
        />
        <meta property="og:url" content="https://crackoffcampus.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Crack Off-Campus: Off Campus Jobs, Internships, Resume Review, Referrals & Career Guidance"
        />
        <meta
          name="twitter:description"
          content="India's #1 platform for off campus jobs, internships, resume reviews, job referrals, and career guidance. Get hired faster with Crack Off-Campus."
        />
        <meta
          name="twitter:image"
          content="https://lovable.dev/opengraph-image-p98pqg.png"
        />
      </Helmet>
      <Layout>
        <section
          style={{ backgroundColor: "rgb(186, 175, 220)" }}
          className="py-8 md:py-12 lg:py-16"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    Don't Just Apply.{" "}
                    <span className="text-[#F97316]">Crack It.</span>
                  </h2>
                  <p className="text-black text-base sm:text-lg md:text-xl leading-relaxed">
                    Don't just chase openings — Unlock them. Discover jobs,
                    referrals, and real prep with Crack Off-Campus.
                  </p>
                </div>

                {/* Enhanced Responsive Search Form */}
                <div className="w-full">
                  <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Mobile Layout */}
                    <div className="block lg:hidden">
                      <div className="p-1">
                        <div className="space-y-1">
                          {/* Search Input */}
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#F97316] transition-colors" />
                            </div>
                            <input
                              type="text"
                              placeholder="Search by Skills, Job Title, or Company"
                              className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 bg-gray-50 rounded-lg border-0 focus:bg-white focus:ring-2 focus:ring-[#F97316] focus:ring-opacity-50 transition-all duration-200 text-base"
                              value={searchKeyword}
                              onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                          </div>

                          {/* Location Input */}
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-[#F97316] transition-colors" />
                            </div>
                            <input
                              type="text"
                              placeholder="City, State, or Remote"
                              className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 bg-gray-50 rounded-lg border-0 focus:bg-white focus:ring-2 focus:ring-[#F97316] focus:ring-opacity-50 transition-all duration-200 text-base"
                              value={searchLocation}
                              onChange={(e) =>
                                setSearchLocation(e.target.value)
                              }
                            />
                          </div>

                          {/* Experience Select */}
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Briefcase className="h-5 w-5 text-gray-400 group-focus-within:text-[#F97316] transition-colors" />
                            </div>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                              className="w-full pl-12 pr-12 py-4 text-gray-900 bg-gray-50 rounded-lg border-0 focus:bg-white focus:ring-2 focus:ring-[#F97316] focus:ring-opacity-50 transition-all duration-200 text-base appearance-none cursor-pointer"
                              value={searchExperience}
                              onChange={(e) =>
                                setSearchExperience(e.target.value)
                              }
                            >
                              <option value="">Experience Level</option>
                              <option value="0-1">0-1 Years</option>
                              <option value="1-3">1-3 Years</option>
                              <option value="3-5">3-5 Years</option>
                              <option value="5+">5+ Years</option>
                            </select>
                          </div>

                          {/* Search Button */}
                          <button
                            onClick={handleHomePageSearch}
                            className="w-full bg-gradient-to-r from-[#F97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] text-white py-4 px-6 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <Search className="h-5 w-5" />
                            Search Jobs
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:block">
                      <div className="flex items-stretch">
                        {/* Search Input */}
                        <div className="flex-1 relative group">
                          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#F97316] transition-colors" />
                          </div>
                          <input
                            type="text"
                            placeholder="Search by Skills, Job Title, or Company"
                            className="w-full h-16 pl-14 pr-6 text-gray-900 placeholder-gray-500 bg-white border-0 border-r border-gray-200 focus:bg-gray-50 focus:outline-none focus:ring-0 transition-all duration-200 text-base"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                          />
                        </div>

                        {/* Location Input */}
                        <div className="flex-1 relative group">
                          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-[#F97316] transition-colors" />
                          </div>
                          <input
                            type="text"
                            placeholder="City, State, or Remote"
                            className="w-full h-16 pl-14 pr-6 text-gray-900 placeholder-gray-500 bg-white border-0 border-r border-gray-200 focus:bg-gray-50 focus:outline-none focus:ring-0 transition-all duration-200 text-base"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                          />
                        </div>

                        {/* Experience Select */}
                        <div className="flex-1 relative group">
                          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <Briefcase className="h-5 w-5 text-gray-400 group-focus-within:text-[#F97316] transition-colors" />
                          </div>
                          <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            className="w-full h-16 pl-14 pr-14 text-gray-900 bg-white border-0 border-r border-gray-200 focus:bg-gray-50 focus:outline-none focus:ring-0 transition-all duration-200 text-base appearance-none cursor-pointer"
                            value={searchExperience}
                            onChange={(e) =>
                              setSearchExperience(e.target.value)
                            }
                          >
                            <option value="">Experience Level</option>
                            <option value="0-1">0-1 Years</option>
                            <option value="1-3">1-3 Years</option>
                            <option value="3-5">3-5 Years</option>
                            <option value="5+">5+ Years</option>
                          </select>
                        </div>

                        {/* Search Button */}
                        <button
                          onClick={handleHomePageSearch}
                          className="flex-shrink-0 bg-gradient-to-r from-[#F97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] text-white px-8 py-4 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                        >
                          <Search className="h-5 w-5" />
                          Search Jobs
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Search suggestions or popular searches */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-sm text-gray-600">Popular:</span>
                    {[
                      "React Developer",
                      "Python",
                      "Data Analyst",
                      "UI/UX Designer",
                    ].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchKeyword(term)}
                        className="text-sm bg-white/80 hover:bg-white text-gray-700 px-3 py-1 rounded-full border border-gray-200 hover:border-[#F97316] transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    to="/jobs"
                    className="bg-purple-800 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-purple-900 transition-colors"
                  >
                    Browse Jobs
                  </Link>
                  <button className="flex items-center gap-3 text-base font-medium text-gray-800 hover:text-purple-800 transition-colors">
                    <span className="bg-purple-800 text-white p-2 rounded-full">
                      <FaPlay className="w-3 h-3" />
                    </span>
                    How It Works?
                  </button>
                </div>
              </div>

              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <img
                  src="/lovable-uploads/img3.png"
                  alt="Professional working"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12 bg-white">
          <div className="container">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <h2 className="section-title">Featured Jobs</h2>
              {user && (
                <Link
                  to="/jobs"
                  className="text-foundit-orange hover:text-orange-700 font-medium"
                >
                  View All Jobs
                </Link>
              )}
            </div>
            {!user &&
            recentFeaturedJobs.length === 0 &&
            !jobsLoading &&
            !jobsError ? (
              <div className="text-center py-8 text-gray-600">
                <p className="text-lg mb-2">
                  Please{" "}
                  <Link
                    to="/login"
                    className="text-purple-600 hover:underline font-semibold"
                  >
                    log in
                  </Link>{" "}
                  to view featured jobs.
                </p>
                <p className="text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-purple-600 hover:underline font-semibold"
                  >
                    Sign up now
                  </Link>
                  !
                </p>
              </div>
            ) : jobsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg shadow-sm bg-white"
                  >
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-1" />
                    <Skeleton className="h-4 w-1/3 mb-3" />
                    <div className="flex justify-between items-center mt-3">
                      <Skeleton className="h-6 w-1/4" />
                      <Skeleton className="h-8 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : jobsError ? (
              <div className="text-center py-8 text-red-500">
                Error loading jobs. Please try again later.
              </div>
            ) : recentFeaturedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {recentFeaturedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    company={job.company_name}
                    location={job.location || "N/A"}
                    ctc_stipend={job.ctc_stipend || "Not Disclosed"}
                    postedDate={
                      job.posted_at
                        ? new Date(job.posted_at).toLocaleDateString()
                        : "N/A"
                    }
                    jobType={job.employment_type || "N/A"}
                    jobUrl={job.job_url || "#"}
                    jobSubscriptionType={job.subscription_type || "regular"}
                    userSubscriptionType={user?.subscription_type || "regular"}
                    onUnlockJob={handleOpenPremiumModal}
                    passout_year={job.passout_year}
                    experience={job.experience}
                    skills={job.skills}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No featured jobs available at the moment.
              </div>
            )}
            {user && recentFeaturedJobs.length > 0 && (
              <div className="text-center mt-8 md:mt-10">
                <Link to="/jobs" className="btn-accent">
                  Explore All Jobs
                </Link>
              </div>
            )}
          </div>
        </section>
        <CompanyShowcase />
        <BrowseByCategory />
        <WhyChooseUs />
        <JobSection user={user} />
        <WhyChooseUs2 />
        <section className="py-10 md:py-16 bg-foundit-blue text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Crack Your Next Interview?
            </h2>
            <p className="text-lg md:text-xl mb-8">
              Join thousands of students and professionals who trust Crack
              Off-Campus.
            </p>
            <Link
              to={user ? "/jobs" : "/register"}
              className="bg-white text-foundit-blue font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition text-lg"
            >
              {user ? "Find Jobs Now" : "Get Started"}
            </Link>
          </div>
        </section>
        <Dialog open={isPremiumModalOpen} onOpenChange={setIsPremiumModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Unlock Premium Job Access</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-lg font-medium mb-2">
                Access premium job features for just{" "}
                <span className="text-[#9b87f5] font-bold">₹99</span>.
              </p>
              <p className="text-gray-600 mb-4 text-sm">
                This will grant you access to apply to premium jobs, view
                referral details, and more exclusive features.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPremiumModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRazorpayPayment}
                className="bg-[#9b87f5] text-white hover:bg-[#7c66e0]"
                disabled={paymentState.loading || !isRazorpayReady}
              >
                {!isRazorpayReady && !paymentState.loading
                  ? "Loading Gateway..."
                  : paymentState.loading
                  ? "Processing..."
                  : "Pay ₹99 & Unlock"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Layout>
    </>
  );
};

export default Home;
