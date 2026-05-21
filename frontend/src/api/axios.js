import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://crowdfunding-backend-9jxx.onrender.com",
  withCredentials: true, // send cookies (JWT token) with every request
});

// Response interceptor — handle 401 globally (token expired/invalid)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or not logged in — clear any stale state
      // (actual redirect handled per-component or by ProtectedRoutes)
      console.warn("Unauthorized request — token may have expired.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
