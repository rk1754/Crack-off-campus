
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface UserMenuProps {
  compact?: boolean;
  showLabels?: boolean;
}

const UserMenu = ({ compact = false, showLabels = false }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  
  const isAuthenticated = !!user;
  
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Successfully logged out");
    navigate("/");
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!isAuthenticated) {
    return (
      <div className={`flex ${compact ? 'flex-col md:flex-row' : 'flex-row'} space-x-2`}>
        <Link
          to="/login"
          className={`border border-[#9b87f5] text-[#9b87f5] ${compact ? 'px-2 py-1 text-sm' : 'px-4 py-2'} rounded-md text-center hover:bg-[#9b87f5] hover:text-white transition-colors`}
        >
          {compact ? 'Log In' : 'Login'}
        </Link>
        {!compact && (
          <Link
            to="/register"
            className="bg-[#F97316] hover:bg-orange-600 text-white px-4 py-2 rounded-md text-center transition-colors"
          >
            Register
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 rounded-full bg-[#9b87f5] hover:bg-[#8976e7] transition-colors focus:outline-none"
      >
        <Avatar className="h-8 w-8">
          {user?.profile_pic ? (
            <AvatarImage src={user.profile_pic} alt={user.name || "User"} />
          ) : (
            <AvatarFallback className="bg-[#9b87f5] text-white">
              {getInitials(user?.name || "")}
            </AvatarFallback>
          )}
        </Avatar>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="p-2 border-b border-gray-100">
            <p className="font-semibold">{user?.name || "User"}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
          <div className="py-1">
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4 mr-2" />
              View Profile
            </Link>
            <Link
              to="/profile/edit"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
            <button
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
      
      {showLabels && (
        <div className="mt-4 space-y-3">
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            onClick={() => setIsOpen(false)}
          >
            <User className="h-4 w-4 mr-2 inline" />
            View Profile
          </Link>
          <Link
            to="/profile/edit"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4 mr-2 inline" />
            Edit Profile
          </Link>
          <button
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2 inline" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
