import axios from "axios";
import store from "../redux/store";
import { logout } from "../redux/slices/userSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5454/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dispatch logout action
      store.dispatch(logout());
      // Optionally redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
