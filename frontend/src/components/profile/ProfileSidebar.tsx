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
      await axios.post("/auth/logout", {}, { withCredentials: true }); // Adjust endpoint if needed
    } catch (err) {
      // Ignore error, proceed to clear state
    }
    dispatch(logoutAction());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="w-full md:w-64 p-5 bg-white rounded-lg shadow">
      <div className="flex flex-col items-center mb-6 pb-6 border-b">
        <div className="w-24 h-24 rounded-full bg-foundit-gray mb-3 overflow-hidden">
          <img
            src={user?.profile_pic || "/placeholder.svg"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-medium">{user?.name || "User"}</h3>
        <p className="text-gray-600 text-sm">Software Developer</p>
      </div>

      <nav>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors
                  ${
                    location.pathname === item.path
                      ? "bg-foundit-blue text-white"
                      : "hover:bg-foundit-gray text-gray-700 hover:text-foundit-blue"
                  }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 pt-6 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-md transition-colors w-full text-left"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
