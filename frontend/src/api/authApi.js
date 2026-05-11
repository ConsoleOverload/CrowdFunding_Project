import axiosInstance from "./axios";

export const signupUser = (data) =>
  axiosInstance.post("/auth-api/users", data);

export const loginUser = (data) =>
  axiosInstance.post("/auth-api/login", data);

export const logoutUser = () =>
  axiosInstance.get("/auth-api/logout");

export const checkAuth = () =>
  axiosInstance.get("/auth-api/check-auth");