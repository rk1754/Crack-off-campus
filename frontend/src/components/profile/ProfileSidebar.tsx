import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Settings, Calendar, Download, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout as logoutAction } from "@/redux/slices/userSlice";
import axios from "axios";

const ProfileSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  const navItems = [
    {
      icon: <User size={18} />,
      label: "My Profile",
      path: "/profile",
    },
    {
      icon: <Calendar size={18} />,
      label: "Bookings",
      path: "/services",
    },
    {
      icon: <Download size={18} />,
      label: "Resources",
      path: "/resources",
    },
  ];

  // Logout handler
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      // Ignore error, proceed to clear state
    }
    dispatch(logoutAction());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="hidden lg:block w-full lg:w-80 p-6 bg-white rounded-2xl shadow-lg border border-purple-100">
      <div className="flex flex-col items-center mb-8 pb-6 border-b border-purple-100">
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 mb-4 overflow-hidden shadow-lg">
          <img
            src={user?.profile_pic || "/placeholder.svg?height=112&width=112"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent"></div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">
          {user?.name || "User"}
        </h3>
        <p className="text-purple-600 text-sm font-medium">
          {user?.subscription_type
            ? user.subscription_type.charAt(0).toUpperCase() +
            user.subscription_type.slice(1) +
            " Member"
            : "Member"}
        </p>
      </div>

      <nav className="mb-8">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                  ${location.pathname === item.path
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-600/25"
                    : "hover:bg-purple-50 text-gray-700 hover:text-purple-700"
                  }`}
              >
                <span
                  className={`mr-3 transition-transform duration-200 group-hover:scale-110 ${location.pathname === item.path
                      ? "text-white"
                      : "text-purple-600"
                    }`}
                >
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-6 border-t border-purple-100">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 w-full text-left group"
        >
          <LogOut className="h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
