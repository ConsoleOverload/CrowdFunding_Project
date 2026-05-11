import axiosInstance from "./axios";

export const getCampaigns = () =>
  axiosInstance.get("/campaign-api");

export const getSingleCampaign = (id) =>
  axiosInstance.get(`/campaign-api/${id}`);

export const createCampaign = (formData) =>
  axiosInstance.post(
    "/campaign-api/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );