import type React from "react";
import { Link } from "react-router-dom";
import { Instagram, Send, Linkedin, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-foundit-blue dark:bg-gray-900 text-white w-full">
      <div className="container mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* First Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">About us</h3>
            <Link
              to="/"
              className="flex items-center mb-4 transition-transform hover:translate-x-1"
            >
              <span className="text-white text-xl font-bold">
                Crack of Campus
              </span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              From job listings and resume help to referrals and interview
              support, we offer everything in one place. Our goal is to guide
              students at every step and make their career journey smoother and
              more successful.
            </p>
            <div className="flex space-x-5">
              <a
                href="https://www.instagram.com/crack_off_campus?igsh=MWY3bDhsdDRyZ2x0Yw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://t.me/crackoffcampus635"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Telegram</span>
              </a>
              <a
                href="https://www.linkedin.com/company/crack-off-campus/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://youtube.com/@crackoff-campus?si=lTgpkMErg3XIwdLM"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          {/* Second Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/jobs"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Job Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Companies
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Applied Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Third Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/our-crackers"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Crack Insights
                </Link>
              </li>
              <li>
                <Link
                  to="/our-crackers"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Fourth Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/our-crackers"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-300 hover:text-white transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Crack Off-Campus. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
