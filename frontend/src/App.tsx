import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store";
import { Provider } from "react-redux";
import store from "./redux/store";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import ForgotPassword from "./pages/ForgetPassword";

import Home from "./pages/Home";
import JobListings from "./pages/JobListings";
import JobDetail from "./pages/JobDetail";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployersLogin from "./pages/EmployersLogin";
import NotFound from "./pages/NotFound";
import ServicesPage from "./pages/Services";
import PremiumPage from "./pages/premium";
import OurCrackers from "./pages/OurCrakers";
import ResourcesPage from "./pages/Resources";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import FaqPage from "./pages/FaqPage"; // Added
import RefundPolicyPage from "./pages/RefundPolicyPage"; // Import the new page
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage"; // Add this import

// import ServicesPage from "./pages/ServicesPage"
// import ServiceDetailPage from "./components/Services/ServiceDetailsPage";
import BookingPage from "./components/Services/BookingPage";
import FormPage from "./components/Services/FormPage";
import PaymentPage from "./components/Services/PaymentPage";
import SuccessPage from "./components/Services/SucessPage";

// Set up axios defaults
import axios from "axios";
import { BACKEND_URL } from "./redux/config";

// Configure axios
axios.defaults.baseURL = BACKEND_URL;
axios.defaults.withCredentials = true;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component
type ProtectedRouteProps = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

const ProtectedRoute = ({
  children,
  adminOnly = false,
}: ProtectedRouteProps) => {
  const user = useSelector((state: RootState) => state.user.user);
  const admin = useSelector((state: RootState) => state.admin?.admin);

  if (adminOnly && !admin) {
    return <Navigate to="/employers-login" />;
  }

  if (!adminOnly && !user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App = () => {
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<JobListings />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/edit"
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/settings"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/employers-login" element={<EmployersLogin />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route
                  path="/premium"
                  element={
                    <PremiumPage
                      isOpen={isPremiumModalOpen}
                      onClose={() => setIsPremiumModalOpen(false)}
                    />
                  }
                />
                <Route path="/our-crackers" element={<OurCrackers />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route
                  path="/terms-and-conditions"
                  element={<TermsAndConditionsPage />}
                />{" "}
                {/* Add this route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/faq" element={<FaqPage />} /> {/* Added */}
                <Route
                  path="/refund-policy"
                  element={<RefundPolicyPage />}
                />{" "}
                {/* Added */}
                <Route path="*" element={<NotFound />} />
                {/* <Route path="/services" element={<ServicesPage />} /> */}
                <Route
                  path="/services/:serviceId"
                  element={<BookingPage></BookingPage>}
                />
                <Route
                  path="/services/:serviceId/booking"
                  element={<BookingPage />}
                />
                <Route
                  path="/services/:serviceId/form"
                  element={<FormPage />}
                />
                <Route
                  path="/services/:serviceId/payment"
                  element={<PaymentPage />}
                />
                <Route
                  path="/services/:serviceId/success"
                  element={<SuccessPage />}
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
