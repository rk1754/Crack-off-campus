"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import PremiumPlansModal from "../premium/PremiumPlansModel";
import UserMenu from "./UserMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const user = useSelector((state: RootState) => (state.user as any)?.user);

  // Use a custom hook to detect tablet devices
  const isTablet = useIsTablet();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const getActiveLinkClass = (path: string) =>
    location.pathname === path ? "text-[#9b87f5]" : "text-gray-700";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "Services", path: "/services" },
    { name: "Resources", path: "/resources" },
    { name: "Crack Insights", path: "/our-crackers" },
  ];

  const handlePremiumClick = () => {
    setIsPremiumModalOpen(true);
    if (isTablet || isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md py-2 md:py-3 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-3 md:px-4">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/logo.png"
              alt="Crack of Campus"
              className="h-7 md:h-8 lg:h-10 w-auto"
            />
            <span className="text-[#9b87f5] text-sm md:text-base lg:text-lg font-bold hidden sm:block">
              Crack Off-Campus
            </span>
          </Link>

          {/* Desktop Nav - Only show on large devices */}
          <div className="hidden lg:flex items-center space-x-1 lg:space-x-6">
            {navLinks
              .filter((link) => link.name !== "Employers Login")
              .map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className={`${getActiveLinkClass(
                    link.path
                  )} hover:text-[#9b87f5] font-medium text-xs lg:text-sm flex items-center gap-1 px-2 py-1`}
                >
                  {link.name}
                </Link>
              ))}

            <button
              onClick={handlePremiumClick}
              className="text-[#F97316] hover:text-orange-600 font-medium text-xs lg:text-sm px-2 py-1"
            >
              Go Premium
            </button>

            <div className="hidden lg:block">
              <UserMenu />
            </div>

            <Link
              to="/employers-login"
              className="text-gray-700 hover:text-[#9b87f5] font-medium text-xs lg:text-sm px-2 py-1"
            >
              Employers Login
            </Link>
          </div>

          {/* Mobile & Tablet Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="mr-1">
              <UserMenu compact={true} />
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-[#9b87f5] focus:outline-none p-1"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white fixed inset-0 z-50 pt-16 pb-6 px-4 overflow-y-auto">
            <div className="flex flex-col space-y-4 mt-4">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`${getActiveLinkClass(
                    link.path
                  )} hover:text-[#9b87f5] transition-colors py-3 text-base flex items-center gap-2 border-b border-gray-100`}
                >
                  {link.name}
                </Link>
              ))}

              <button
                onClick={handlePremiumClick}
                className="text-[#F97316] hover:text-orange-600 font-medium text-left py-3 text-base border-b border-gray-100"
              >
                Go Premium
              </button>

              {user ? (
                <div className="pt-4 border-t border-gray-200">
                  <UserMenu showLabels={true} />
                </div>
              ) : (
                <div className="pt-4 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="border border-[#9b87f5] text-[#9b87f5] px-4 py-3 rounded-md text-center hover:bg-[#9b87f5] hover:text-white transition-colors block"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-[#F97316] hover:bg-orange-600 text-white px-4 py-3 rounded-md text-center transition-colors block"
                  >
                    Register
                  </Link>
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-[#9b87f5] p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {isPremiumModalOpen && (
        <PremiumPlansModal
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
        />
      )}
    </>
  );
};

// Custom hook to detect tablet devices
function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const tabletQuery = window.matchMedia(
      "(min-width: 768px) and (max-width: 1023px)"
    );

    const handleTabletChange = (e: MediaQueryListEvent) => {
      setIsTablet(e.matches);
    };

    // Set initial value
    setIsTablet(tabletQuery.matches);

    // Add event listener
    tabletQuery.addEventListener("change", handleTabletChange);

    // Clean up
    return () => {
      tabletQuery.removeEventListener("change", handleTabletChange);
    };
  }, []);

  return isTablet;
}

export default Navbar;
