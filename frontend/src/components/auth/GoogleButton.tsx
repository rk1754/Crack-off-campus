// src/components/auth/GoogleButton.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

interface GoogleButtonProps {
  onClick: () => void;
  loading: boolean;
  variant?: "default" | "outline";
}

const GoogleButton: React.FC<GoogleButtonProps> = ({
  onClick,
  loading,
  variant = "outline",
}) => {
  return (
    <Button
      type="button"
      className={`w-full ${
        variant === "outline"
          ? "bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
          : ""
      } flex items-center justify-center relative font-medium`}
      onClick={onClick}
      disabled={loading}
      variant={variant}
    >
      <FaGoogle className="mr-2 h-4 w-4" />
      {loading ? "Connecting..." : "Continue with Google"}
    </Button>
  );
};

export default GoogleButton;
