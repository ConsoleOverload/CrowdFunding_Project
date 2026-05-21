import axiosInstance from "./axios";

// GET all approved campaigns (public)
export const getCampaigns = () =>
  axiosInstance.get("/campaign-api");

// GET single campaign by id
export const getSingleCampaign = (id) =>
  axiosInstance.get(`/campaign-api/${id}`);

// CREATE campaign (multipart/form-data with coverImage + gallery)
export const createCampaign = (formData) =>
  axiosInstance.post("/campaign-api/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// SOFT DELETE campaign (PATCH)
export const deleteCampaign = (id) =>
  axiosInstance.patch(`/campaign-api/delete/${id}`);

// RESTORE campaign (PUT)
export const restoreCampaign = (id) =>
  axiosInstance.put(`/campaign-api/restore/${id}`);

// GET campaigns created by the logged-in user (all statuses)
export const getMyCampaigns = () =>
  axiosInstance.get("/campaign-api/my-campaigns");
