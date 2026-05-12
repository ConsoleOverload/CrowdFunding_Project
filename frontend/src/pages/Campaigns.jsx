import {
  useEffect,
  useState,
} from "react";

import Navbar
from "../components/Navbar";

import Footer
from "../components/Footer";

import Loader
from "../components/Loader";

import CampaignCard
from "../components/CampaignCard";

import {
  getCampaigns
} from "../api/campaignApi";

function Campaigns() {

  const [campaigns, setCampaigns] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH CAMPAIGNS

  const fetchCampaigns = async () => {

    try {

      const res =
        await getCampaigns();

      setCampaigns(
        res.data.payload || []
      );

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (

    <div className="min-h-screen bg-bg">

      <Navbar />

      <main className="section-container">

        <div className="page-container">

          {/* PAGE HEADER */}

          <div className="section-heading">

            <div className="badge">

              Active Campaigns

            </div>

            <h1 className="section-title mt-6">

              Support meaningful causes

            </h1>

            <p className="section-subtitle">

              Discover verified fundraisers helping people,
              communities, education initiatives, medical emergencies,
              and impactful social causes.

            </p>

          </div>

          {/* LOADING */}

          {loading ? (

            <Loader />

          ) : campaigns.length === 0 ? (

            <div className="card p-12 text-center">

              <h2 className="text-2xl font-semibold">

                No campaigns available

              </h2>

              <p className="mt-4 text-text-muted">

                Campaigns created by users will appear here.

              </p>

            </div>

          ) : (

            /* CAMPAIGNS GRID */

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {campaigns.map((campaign) => (

                <CampaignCard
                  key={campaign._id}
                  campaign={campaign}
                />

              ))}

            </div>

          )}

        </div>

      </main>

      <Footer />

    </div>
  );
}

export default Campaigns;