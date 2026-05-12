import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";

import AdminCampaignTable
from "../components/AdminCampaignTable";

import {
  getAllCampaigns,
  approveCampaign,
  rejectCampaign,
  deleteCampaign,
} from "../api/adminApi";

function AdminDashboard() {

  const [campaigns, setCampaigns] =
    useState([]);

  // FETCH CAMPAIGNS
  const fetchCampaigns = async () => {

    try {

      const res =
        await getAllCampaigns();

      setCampaigns(
        res.data.payload
      );

    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to fetch campaigns"
      );
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // APPROVE CAMPAIGN
  const handleApprove = async (id) => {

    try {

      await approveCampaign(id);

      toast.success(
        "Campaign approved"
      );

      fetchCampaigns();

    } catch {

      toast.error(
        "Approval failed"
      );
    }
  };

  // REJECT CAMPAIGN
  const handleReject = async (id) => {

    try {

      await rejectCampaign(id);

      toast.success(
        "Campaign rejected"
      );

      fetchCampaigns();

    } catch {

      toast.error(
        "Reject failed"
      );
    }
  };

  // DELETE CAMPAIGN
  const handleDelete = async (id) => {

    try {

      await deleteCampaign(id);

      toast.success(
        "Campaign deleted"
      );

      fetchCampaigns();

    } catch {

      toast.error(
        "Delete failed"
      );
    }
  };

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto py-12 px-6">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold text-blue-700">

            Admin Dashboard

          </h1>

          <p className="mt-4 text-lg text-gray-600">

            Manage campaigns and approve fundraisers

          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {/* TOTAL */}

          <div className="bg-white p-6 rounded-2xl shadow-md">

            <h2 className="text-lg font-semibold text-gray-600">

              Total Campaigns

            </h2>

            <p className="text-4xl font-bold text-blue-600 mt-3">

              {campaigns.length}

            </p>

          </div>

          {/* APPROVED */}

          <div className="bg-white p-6 rounded-2xl shadow-md">

            <h2 className="text-lg font-semibold text-gray-600">

              Approved Campaigns

            </h2>

            <p className="text-4xl font-bold text-green-600 mt-3">

              {
                campaigns.filter(
                  (campaign) =>
                    campaign.status ===
                    "approved"
                ).length
              }

            </p>

          </div>

          {/* PENDING */}

          <div className="bg-white p-6 rounded-2xl shadow-md">

            <h2 className="text-lg font-semibold text-gray-600">

              Pending Campaigns

            </h2>

            <p className="text-4xl font-bold text-yellow-500 mt-3">

              {
                campaigns.filter(
                  (campaign) =>
                    campaign.status ===
                    "pending"
                ).length
              }

            </p>

          </div>

        </div>

        {/* CAMPAIGN TABLE */}

        <AdminCampaignTable
          campaigns={campaigns}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />

      </div>

    </div>
  );
}

export default AdminDashboard;