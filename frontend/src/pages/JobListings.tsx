import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import SearchBar from "../components/job/SearchBar";
import JobCard from "../components/job/JobCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAllJobs, Job } from "@/redux/slices/jobSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { fetchCurrentUser } from "@/redux/slices/userSlice";

const RAZORPAY_KEY_ID = "YOUR_RAZORPAY_PUBLIC_KEY"; // Replace with your Razorpay public key

const JobListings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
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

  // Razorpay script loading state
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);

  const userSubscriptionType = user.subscription_type || "regular";
  console.log(userSubscriptionType);
  useEffect(()=>{
    dispatch(fetchCurrentUser());
  }, [dispatch, user?.id])

  console.log("USer: ", user);
  useEffect(() => {
    setKeyword(searchParams.get("keyword") || "");
    setLocation(searchParams.get("location") || "");
  }, [searchParams]);

  useEffect(() => {
    // Only fetch jobs if user is logged in
      dispatch(fetchAllJobs());
  }, [dispatch]);

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

  const handleOpenPremiumModal = () => {
    if (!user) {
      // Redirect to login if the user is not logged in
      navigate("/login?redirect=/jobs");
    } else if (
      userSubscriptionType === "premium" || // Check if the user is already a premium user
      userSubscriptionType === "booster" || // Add other premium subscription types if applicable
      userSubscriptionType === "standard" ||
      userSubscriptionType === "basic"
    ) {
      // Do nothing if the user is already a premium user
      return;
    } else {
      // Open the modal for non-premium users
      setIsPremiumModalOpen(true);
    }
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

  const handleRazorpayPayment = async () => {
    if (!isRazorpayReady) {
      alert(
        "Payment gateway is still loading. Please wait a moment and try again."
      );
      return;
    }
    try {
      // Create order for ₹99 (amount in paise)
      const resultAction = await dispatchPayment(createPaymentOrder(99 * 100));
      const orderData = resultAction.payload;

      if (!orderData || !orderData.order_id) {
        alert("Failed to create payment order. Please try again.");
        return;
      }

      const options = {
        key: "rzp_test_GBC6wsiyhZIszp",
        amount: orderData.amount,
        currency: "INR",
        name: "Premium Jobs Access",
        description: "Unlock all premium jobs for ₹99",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          await dispatchPayment(
            verifyAndStorePayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: orderData.amount,
              currency: orderData.currency,
              user_id: user.id,
            })
          );
          setIsPremiumModalOpen(false);
          window.location.reload();
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#9b87f5",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      alert("Payment failed to start. Please try again.");
    }
  };

  // If user is not logged in, show the login/register message
  if (!user) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-150px)] flex items-center justify-center bg-white text-center px-4">
          <div className="space-y-4">
            <p className="text-gray-700 text-lg">
              Please{" "}
              <span
                className="text-purple-600 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/login?redirect=/jobs")}
              >
                log in
              </span>{" "}
              to view job listings.
            </p>
            <p className="text-gray-600">
              Don’t have an account?{" "}
              <span
                className="text-purple-600 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/register?redirect=/jobs")}
              >
                Sign up now!
              </span>
            </p>
          </div>
        </div>
      </Layout>
    );
  }

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
            <p className="text-gray-700 text-lg">
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
              <label htmlFor="sort" className="mr-3 text-gray-700 text-md">
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
                  We couldn't find any jobs matching your current search or
                  filters.
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
              onClick={handleRazorpayPayment}
              className="bg-[#9b87f5] text-white hover:bg-[#7c66e0]"
              disabled={paymentState.loading || !isRazorpayReady}
            >
              {!isRazorpayReady && !paymentState.loading
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