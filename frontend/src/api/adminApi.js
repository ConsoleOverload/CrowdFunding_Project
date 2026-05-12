import axiosInstance from "./axios";

export const getAllCampaigns = () =>
  axiosInstance.get(
    "/admin-api/campaigns"
  );

export const approveCampaign = (id) =>
  axiosInstance.put(
    `/admin-api/campaigns/${id}/approve`
  );

export const rejectCampaign = (id) =>
  axiosInstance.put(
    `/admin-api/campaigns/${id}/reject`
  );

export const deleteCampaign = (id) =>
  axiosInstance.delete(
    `/admin-api/campaigns/${id}`
  );
