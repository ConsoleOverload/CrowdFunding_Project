import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://crowdfunding-project-srtl.onrender.com",
  withCredentials: true,
});

export default axiosInstance;