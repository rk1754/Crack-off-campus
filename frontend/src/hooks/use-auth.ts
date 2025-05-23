import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function useAuth() {
  const { user } = useSelector((state: RootState) => state.user);
  const { admin } = useSelector((state: RootState) => state.admin);

  return {
    isAuthenticated: !!user,
    isAdmin: !!admin,
    user,
    admin,
  };
}
