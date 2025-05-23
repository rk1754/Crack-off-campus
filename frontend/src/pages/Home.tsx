import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/layout/Layout";
import JobCard from "../components/job/JobCard";
import CompanyShowcase from "../components/home/CompanyShowcase";
import BrowseByCategory from "../components/home/BrowseByCategories";
import WhyChooseUs from "../components/home/WhyChooseUs";
import WhyChooseUs2 from "../components/home/WhyChooseUs2";
import JobSection from "../components/home/jobsSection";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAllJobs, Job } from "@/redux/slices/jobSlice";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { FaPlay } from "react-icons/fa";
import { Search, MapPin, Briefcase } from "lucide-react";
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
        name: "Crack Off Campus",
        description: "Unlock Premium Job Access (₹99)",
        order_id: orderData.order_id,
        handler: async function (response: any) {
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
          ondismiss: function () {
            console.log("Razorpay modal dismissed");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
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
    <Layout>
      <section
        style={{ backgroundColor: "rgb(186, 175, 220)" }}
        className="py-8 md:py-12"
      >
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <div className="mb-4 md:mb-6">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">
                  Don't Just Apply.{" "}
                  <span className="text-[#F97316]">Crack It.</span>
                </h2>
                <p className="text-black mb-4">
                  Don't just chase openings — unlock them. Discover jobs,
                  referrals, and real prep with Crack Off Campus.
                </p>
              </div>
              <div className="mt-4 md:mt-6 w-full">
                <div className="bg-white rounded-lg md:rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
                  <div className="flex items-center flex-1 p-2 md:p-3 border-b md:border-b-0 md:border-r border-gray-200">
                    <Search className="text-gray-400 w-5 h-5 ml-2 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder={
                        isMobile
                          ? "Skills or Job"
                          : "Search by Skills or Job Title"
                      }
                      className="w-full px-3 py-1 focus:outline-none text-gray-700 text-sm md:text-base"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center flex-1 p-2 md:p-3 border-b md:border-b-0 md:border-r border-gray-200">
                    <MapPin className="text-gray-400 w-5 h-5 ml-2 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full px-3 py-1 focus:outline-none text-gray-700 text-sm md:text-base"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                    />
                  </div>
                  <div className="hidden md:flex items-center flex-1 p-2 md:p-3 border-b md:border-b-0 md:border-r-0 border-gray-200">
                    <Briefcase className="text-gray-400 w-5 h-5 ml-2 flex-shrink-0" />
                    <select
                      className="w-full px-3 py-1 focus:outline-none text-gray-700 bg-transparent text-sm md:text-base appearance-none"
                      value={searchExperience}
                      onChange={(e) => setSearchExperience(e.target.value)}
                    >
                      <option value="">Experience</option>
                      <option value="0-1">0-1 Years</option>
                      <option value="1-3">1-3 Years</option>
                      <option value="3-5">3-5 Years</option>
                      <option value="5+">5+ Years</option>
                    </select>
                  </div>
                  <button
                    onClick={handleHomePageSearch}
                    className="flex-shrink-0 w-full md:w-auto bg-[#F97316] hover:bg-orange-600 text-white text-center md:text-left px-4 py-3 md:py-3"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-0 md:ml-6 mt-6">
                <Link
                  to="/jobs"
                  className="bg-purple-800 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-purple-900 transition"
                >
                  Browse Jobs
                </Link>
                <button className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-purple-800 transition">
                  <span className="bg-purple-800 text-white p-2 rounded-full">
                    <FaPlay className="w-3 h-3" />
                  </span>
                  How It Works?
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-6 md:mt-0">
              <img
                src="/lovable-uploads/img3.png"
                alt="Professional working"
                className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg"
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
            Join thousands of students and professionals who trust Crack Off
            Campus.
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
              This will grant you access to apply to premium jobs, view referral
              details, and more exclusive features.
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
  );
};

export default Home;
