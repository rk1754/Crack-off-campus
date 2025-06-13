import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import SearchBar from "../components/job/SearchBar";
import JobCard from "../components/job/JobCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAllJobs, Job } from "@/redux/slices/jobSlice";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import PremiumJobsFeature from "@/components/job/premiumJobsFeature";
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
import { BACKEND_URL } from "@/redux/config";
import { fetchCurrentUser } from "@/redux/slices/userSlice";
import { updateSubscriptionAfterPayment } from "@/utils/subscriptionUtils";

// Use environment variable for Razorpay key
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

const JobListings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { jobs, loading, error } = useSelector((state: RootState) => state.job);
  const { user } = useSelector((state: RootState) => state.user);
  const paymentState = useSelector((state: RootState) => state.payment);
  const dispatchPayment = useDispatch<AppDispatch>();

  // Local state for search
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  // Sort state
  const [sortBy, setSortBy] = useState("recent");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  // Premium Modal State
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Payment state
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  // Razorpay script loading state
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);

  // Cashfree payment SDK loading state
  const [sdkLoaded, setSdkLoaded] = useState(false);
  useEffect(() => {
    dispatch(fetchCurrentUser());
    // eslint-disable-next-line
  }, [dispatch, user?.id]);

  useEffect(() => {
    setKeyword(searchParams.get("keyword") || "");
    setLocation(searchParams.get("location") || "");
  }, [searchParams]);

  useEffect(() => {
    dispatch(fetchAllJobs());
  }, [dispatch]);

  console.log("Jobs fetched:", jobs);

  useEffect(() => {
    let newFilteredJobs = [...jobs];

    if (keyword) {
      newFilteredJobs = newFilteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(keyword.toLowerCase()) ||
          job.company_name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (location) {
      newFilteredJobs = newFilteredJobs.filter(
        (job) =>
          job.location &&
          job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (sortBy === "recent") {
      newFilteredJobs.sort(
        (a, b) =>
          new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
      );
    } else if (sortBy === "relevant") {
      newFilteredJobs.sort((a, b) => {
        const aTitleMatch = a.title
          .toLowerCase()
          .includes(keyword.toLowerCase());
        const bTitleMatch = b.title
          .toLowerCase()
          .includes(keyword.toLowerCase());
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        return (
          new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
        );
      });
    }

    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, keyword, location, sortBy]);

  const handleSearch = (searchKeyword: string, searchLocation: string) => {
    setKeyword(searchKeyword);
    setLocation(searchLocation);
    setSearchParams({ keyword: searchKeyword, location: searchLocation });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  console.log("user", user);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobsToDisplay = filteredJobs.slice(
    indexOfFirstJob,
    indexOfLastJob
  );
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber: number) => {
    if (
      pageNumber > 0 &&
      pageNumber <= totalPages &&
      pageNumber !== currentPage
    ) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };
  let userSubscriptionType = "regular";
  if (user) {
    console.log("User subscription data:", {
      subscription_type: user.subscription_type,
      subscription_type_2: user.subscription_type_2,
      is_premium: user.is_premium,
      job: (user as any).job,
    });

    // Check both subscription_type and subscription_type_2
    if (
      user.subscription_type === "booster" ||
      user.subscription_type === "standard" ||
      user.subscription_type === "basic" ||
      user.subscription_type === "job" // Added "job" to recognize it as premium
    ) {
      userSubscriptionType = user.subscription_type;
    } else if (
      user.subscription_type_2 === "booster" ||
      user.subscription_type_2 === "standard" ||
      user.subscription_type_2 === "basic" ||
      user.subscription_type_2 === "job" // Added "job" to recognize it as premium
    ) {
      userSubscriptionType = user.subscription_type_2;
    } else if ((user as any).job === true) {
      // If user has job access flag, treat as job subscription
      userSubscriptionType = "job";
    } else {
      userSubscriptionType =
        user.subscription_type || user.subscription_type_2 || "regular";
    }
    console.log("Final userSubscriptionType:", userSubscriptionType);
  } // Auto-close premium modal if user has any premium subscription
  useEffect(() => {
    if (user) {
      // If user has subscription type "basic", "standard", "booster", or "job", close modal
      const premiumTypes = ["basic", "standard", "booster", "job"];
      if (
        (user.subscription_type && premiumTypes.includes(user.subscription_type)) ||
        (user.subscription_type_2 && premiumTypes.includes(user.subscription_type_2)) ||
        (user as any).job === true
      ) {
        console.log("User has premium subscription, auto-closing modal");
        setIsPremiumModalOpen(false);
      }
    }
  }, [user]);
  const handleOpenPremiumModal = () => {
    console.log("handleOpenPremiumModal called");
    console.log("User exists:", !!user);
    console.log("userSubscriptionType:", userSubscriptionType);
    console.log("user.subscription_type:", user?.subscription_type);
    console.log("user.subscription_type_2:", user?.subscription_type_2);
    console.log("user.is_premium:", user?.is_premium);
    console.log("user.job:", (user as any)?.job);

    if (!user) {
      console.log("No user, redirecting to login");
      navigate("/login?redirect=/jobs");
      return;
    }

    // If user has ANY subscription type other than "regular", don't show modal
    if (
      (user.subscription_type && user.subscription_type !== "regular" && user.subscription_type !== "other_templates") ||
      (user.subscription_type_2 && user.subscription_type_2 !== "regular" && user.subscription_type_2 !== "other_templates") || 
      (user as any).job === true
    ) {
      console.log("User has premium subscription, not showing modal");
      setIsPremiumModalOpen(false);
      return;
    }

    // Only show modal for users with no subscription or "regular" subscription
    console.log("User has regular/no subscription, showing premium modal");
    setIsPremiumModalOpen(true);
  };

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayReady(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const loadCashfreeSDK = async () => {
      if (document.getElementById("cashfree-sdk") || window.Cashfree) {
        setSdkLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "cashfree-sdk";
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      script.onload = () => setSdkLoaded(true);
      script.onerror = () => setSdkLoaded(false);
      document.body.appendChild(script);
    };
    loadCashfreeSDK();
    return () => {
      const existingScript = document.getElementById("cashfree-sdk");
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      setSdkLoaded(false);
    };
  }, []);

  const handleCashfreePayment = async () => {
    if (!sdkLoaded || !window.Cashfree) {
      alert("Payment gateway is not available. Please try again later.");
      return;
    }
    if (!user) {
      navigate("/login?redirect=/jobs");
      return;
    }
    try {
      // Create order for ₹99
      const res = await fetch(`${BACKEND_URL}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: 99, // Changed from 1 to 99 to match the modal display
          name: user.name,
          email: user.email,
          phone: user.phone_number || "+919876543210",
          currency: "INR",
        }),
      });
      const data = await res.json();
      const { payment_session_id, order_id } = data;

      // Store order_id for later use
      setCurrentOrderId(order_id);

      if (!payment_session_id) {
        alert("Payment session ID not found in response");
        return;
      }
      if (
        !payment_session_id.startsWith("session_") ||
        /[^a-zA-Z0-9_-]/.test(payment_session_id)
      ) {
        alert("Invalid payment session ID format");
        return;
      }
      const cashfree = new window.Cashfree({ mode: "production" });
      const order_type = "job";
      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        returnUrl: `https://www.crackoffcampus.com/payment/verify?order_id=${order_id}&serviceName=${order_type}`,
        redirectTarget: "_self" as "_self",
      };
      cashfree.checkout(checkoutOptions).then((result: any) => {
        if (result.error) {
          alert(`Payment error: ${result.error.message}`);
          setCurrentOrderId(null); // Clear order ID on error
        } else if (result.redirect) {
          // Cashfree will handle redirect to payment gateway
          // After payment, user will be redirected to returnUrl which handles verification and update
          console.log("Redirecting to Cashfree payment gateway...");
        }
        // Note: result.success won't be triggered here as Cashfree redirects to returnUrl
        // The payment verification and subscription update will be handled by PaymentVerify.tsx
      });
    } catch (err) {
      console.error("Payment initiation error:", err);
      alert("Payment failed to start. Please try again.");
      // Clear any stored order ID on error
      setCurrentOrderId(null);
    }
  }; // Handle payment success from URL parameters (after Cashfree redirect)
  useEffect(() => {
    const urlParams = new URLSearchParams(routeLocation.search);
    const paymentStatus = urlParams.get("payment");
    const paymentMessage = urlParams.get("message");

    if (paymentStatus === "success") {
      // Payment was successful, refresh user data
      console.log("Payment success detected, refreshing user data");
      dispatch(fetchCurrentUser());
      setIsPremiumModalOpen(false);
      setCurrentOrderId(null);

      // Show specific success message for job subscription
      if (paymentMessage === "job_subscription_activated") {
        alert("Payment successful! You now have access to premium jobs.");
      } else {
        alert("Payment successful!");
      }

      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (paymentStatus === "failed") {
      alert("Payment failed. Please try again.");
      setCurrentOrderId(null);

      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (paymentStatus === "error") {
      alert(
        `Payment error: ${
          paymentMessage || "Unknown error"
        }. Please contact support.`
      );
      setCurrentOrderId(null);

      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [routeLocation.search, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="py-8 md:py-12 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <PremiumJobsFeature />
      </div>
      <div className="bg-white py-8 md:py-12 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-10">
            Find Your <span className="text-[#9b87f5]">Perfect Job</span>
          </h1>
          <div className="max-w-2xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              initialKeyword={keyword}
              initialLocation={location}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <p className="text-gray-600 text-lg">
              Showing{" "}
              <span className="font-semibold text-[#9b87f5]">
                {currentJobsToDisplay.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#9b87f5]">
                {filteredJobs.length}
              </span>{" "}
              jobs
            </p>
            <div className="flex items-center mt-4 sm:mt-0">
              <label htmlFor="sort" className="mr-3 text-gray-600 text-md">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9b87f5] focus:border-[#9b87f5] text-md"
              >
                <option value="recent">Most Recent</option>
                <option value="relevant">Most Relevant</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-[#9b87f5] mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading jobs...</p>
            </div>
          )}
          {!loading && error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md text-center">
              <h3 className="font-bold text-xl mb-2">
                Oops! Something went wrong.
              </h3>
              <p className="text-md">
                Error loading jobs:{" "}
                {typeof error === "string"
                  ? error
                  : "An unexpected error occurred. Please try again later."}
              </p>
            </div>
          )}
          {!loading && !error && currentJobsToDisplay.length > 0 ? (
            <div className="space-y-6">
              {currentJobsToDisplay.map((job) => (
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
                  jobUrl={job.job_url}
                  jobSubscriptionType={job.subscription_type || "regular"}
                  userSubscriptionType={userSubscriptionType}
                  onUnlockJob={handleOpenPremiumModal}
                  passout_year={job.passout_year}
                  experience={job.experience}
                  skills={job.skills}
                />
              ))}
            </div>
          ) : (
            !loading &&
            !error && (
              <div className="text-center py-16 bg-gray-50 rounded-xl shadow-sm">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-2xl font-semibold text-[#7c66e0]">
                  No Jobs Found
                </h3>
                <p className="mt-2 text-md text-gray-500">
                  We couldn't find any jobs matching filters.
                </p>
                <p className="mt-1 text-md text-gray-500">
                  Try adjusting your search terms or check back later!
                </p>
              </div>
            )
          )}

          {filteredJobs.length > 0 && totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center shadow-md rounded-lg">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-t border-b border-l border-gray-300 rounded-l-lg bg-white text-gray-600 hover:bg-gray-50 text-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )
                  .map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`px-4 py-2 border-t border-b border-l border-gray-300 ${
                        currentPage === pageNumber
                          ? "bg-[#9b87f5] text-white font-semibold"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      } text-md transition-colors`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-r-lg bg-white text-gray-600 hover:bg-gray-50 text-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Premium Modal for Non-Premium Users */}
      <Dialog open={isPremiumModalOpen} onOpenChange={setIsPremiumModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Premium Jobs</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-lg font-medium mb-2">
              Access one month of all premium jobs for just{" "}
              <span className="text-[#9b87f5] font-bold">₹99</span>
            </p>
            <p className="text-gray-600 mb-4">
              Get exclusive access to premium job listings and boost your career
              opportunities.
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
              onClick={handleCashfreePayment}
              className="bg-[#9b87f5] text-white hover:bg-[#7c66e0]"
              disabled={paymentState.loading || !sdkLoaded}
            >
              {!sdkLoaded && !paymentState.loading
                ? "Loading Payment Gateway..."
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

export default JobListings;
