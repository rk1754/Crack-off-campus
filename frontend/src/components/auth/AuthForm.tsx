import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, UserPlus, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { login as userLogin } from "@/redux/slices/userSlice"; // Ensure this is the correct import for user login action
import { login as adminLogin } from "@/redux/slices/adminSlice"; // Ensure this is the correct import for admin login action
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/redux/config";
import { AppDispatch } from "@/redux/store";

interface AuthFormProps {
  type: "login" | "register" | "employer";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For registration
  const [confirmPassword, setConfirmPassword] = useState(""); // Add this line
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false); // Added for register terms

  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";

  const formConfig = {
    login: {
      title: "Login to Your Account",
      buttonText: "Login",
      fields: ["email", "password"],
      footerText: "Don't have an account?",
      footerLink: `/register${location.search}`, // Preserve redirect query param
      footerLinkText: "Sign up",
    },
    register: {
      title: "Create Your Account",
      buttonText: "Register",
      fields: ["name", "email", "password"],
      footerText: "Already have an account?",
      footerLink: `/login${location.search}`, // Preserve redirect query param
      footerLinkText: "Log in",
    },
    employer: {
      title: "Employer / Admin Login",
      buttonText: "Login",
      fields: ["email", "password"],
      footerText: "Not an employer?",
      footerLink: "/login",
      footerLinkText: "User Login",
    },
  };

  const currentConfig = formConfig[type];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === "register") {
        const response = await axios.post(`${BACKEND_URL}/auth/register`, {
          name,
          email,
          password,
          phone_number: "Not provided", // Add a proper phone input if needed
        });

        dispatch(
          userLogin({ user: response.data.user, token: response.data.token })
        );
        toast.success("Registration successful!");
        navigate(redirectPath === "/profile" ? "/" : redirectPath); // Redirect to home or specified redirect
      } else if (type === "login") {
        const response = await axios.post(`${BACKEND_URL}/auth/login`, {
          email,
          password,
        });

        dispatch(
          userLogin({ user: response.data.user, token: response.data.token })
        );
        toast.success("Login successful!");
        navigate(redirectPath === "/profile" ? "/" : redirectPath); // MODIFIED: Redirect to home or specified redirect
      } else if (type === "employer") {
        // Check if this is the admin login
        // The special admin login check (email === "admin@gmail.com" && password === "admin123")
        // should ideally be handled by the backend for security.
        // Assuming backend handles admin authentication properly.
        try {
          const response = await axios.post(`${BACKEND_URL}/admin/login`, {
            email,
            password,
          });
          dispatch(
            adminLogin({
              admin: response.data.admin,
              token: response.data.token,
            })
          ); // Assuming admin login also returns a token
          toast.success("Employer login successful!");
          navigate("/admin"); // Admin always goes to /admin
        } catch (err) {
          console.error("Employer login error:", err);
          throw new Error("Authentication failed for employer/admin");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Authentication failed. Please check your credentials and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    toast.info("Google OAuth coming soon");
    // Add real logic later
    // Example: window.location.href = `${BACKEND_URL}/auth/google`;
  };

  // Check if this is an admin login attempt (visual cue, actual auth is backend)
  const isAdminLogin = type === "employer" && email === "admin@gmail.com";

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#2c3e50]">
        {isAdminLogin ? "Admin Login" : formConfig[type].title}
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === "register" && (
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1"
              required
              autoComplete="name"
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1"
            required
            autoComplete="email"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <div className="flex justify-between items-center">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            {type === "login" && (
              <Link
                to="/forgot-password"
                className="text-sm text-[#9b87f5] hover:underline"
              >
                Forgot Password?
              </Link>
            )}
          </div>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1"
            required
            autoComplete="current-password"
            placeholder="Enter your password"
          />
        </div>

        {type === "register" && (
          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1"
              required
              placeholder="Confirm your password"
            />
          </div>
        )}

        {type === "register" && (
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              />
            </div>
            <div className="ml-3 text-sm">
              <Label htmlFor="terms" className="text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-[#9b87f5] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-[#9b87f5] hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-2 px-4 bg-[#F97316] hover:bg-orange-600 text-white rounded-md transition-colors flex items-center justify-center"
          disabled={(type === "register" && !termsAccepted) || loading}
        >
          {loading
            ? "Processing..."
            : isAdminLogin
            ? "Login as Admin"
            : formConfig[type].icon}
          {loading
            ? ""
            : isAdminLogin
            ? "Login as Admin"
            : formConfig[type].buttonText}
        </Button>

        {!isAdminLogin && (
          <>
            {/* <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              onClick={handleGoogleAuth}
            >
              <img
                src="/lovable-uploads/google.png"
                alt="Google"
                className="h-7 w-7"
              />
              Continue with Google
            </Button> */}
          </>
        )}

        <div className="mt-6 text-center">{formConfig[type].footerText}</div>

        {type === "employer" && (
          <div className="mt-2 text-center text-sm text-gray-600">
            {/* <p>Admin access: admin@gmail.com / admin123</p> */}
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
