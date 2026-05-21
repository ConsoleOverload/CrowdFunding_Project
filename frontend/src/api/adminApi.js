import axiosInstance from "./axios";

// ── ADMIN CAMPAIGN MANAGEMENT ───────────────────────────────

export const getPendingCampaigns = () =>
  axiosInstance.get("/admin-api/campaigns/pending");

export const approveCampaign = (id) =>
  axiosInstance.put(`/admin-api/campaigns/approve/${id}`);

export const rejectCampaign = (id) =>
  axiosInstance.put(`/admin-api/campaigns/reject/${id}`);

// Admin stats — all campaigns summary
export const getAllCampaignsAdmin = () =>
  axiosInstance.get("/admin-api/campaigns/all");

// ── USER (own profile) ──────────────────────────────────────

export const getMyProfile = () =>
  axiosInstance.get("/user-api/users");

export const updateMyProfile = (data) =>
  axiosInstance.put("/user-api/users", data);

export const updateProfileImage = (formData) =>
  axiosInstance.put("/user-api/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteMyAccount = () =>
  axiosInstance.delete("/user-api/users");

export const changePassword = (data) =>
  axiosInstance.put("/auth-api/password", data);

// ── DONATIONS ────────────────────────────────────────────────

export const getMyDonations = () =>
  axiosInstance.get("/donation-api/my-donations");

export const getCampaignDonations = (campaignId) =>
  axiosInstance.get(`/donation-api/campaign/${campaignId}`);

// ── RAZORPAY ─────────────────────────────────────────────────

export const createRazorpayOrder = (data) =>
  axiosInstance.post("/razorpay-api/create-order", data);

export const verifyRazorpayPayment = (data) =>
  axiosInstance.post("/razorpay-api/verify-payment", data);
