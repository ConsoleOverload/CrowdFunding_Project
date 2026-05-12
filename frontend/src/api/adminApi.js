import axiosInstance from "./axios";

export const getAllCampaigns = () =>
  axiosInstance.get("/admin/campaigns");

export const approveCampaign = (id) =>
  axiosInstance.put(
    `/admin/campaigns/${id}/approve`
  );

export const rejectCampaign = (id) =>
  axiosInstance.put(
    `/admin/campaigns/${id}/reject`
  );

export const deleteCampaign = (id) =>
  axiosInstance.delete(
    `/admin/campaigns/${id}`
  );