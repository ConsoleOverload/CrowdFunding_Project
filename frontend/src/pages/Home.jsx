import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CampaignCard from "../components/CampaignCard";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCampaigns } from "../api/campaignApi";

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [completedCampaigns, setCompletedCampaigns] = useState([]);
  const [featuredCampaign, setFeaturedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaigns()
      .then((res) => {
        const all = res.data?.campaigns || res.data || [];
        // Filter campaigns that have reached or exceeded their goal
        const completed = all.filter(
          (c) => c.status === "completed" || c.raisedAmount >= c.goalAmount
        );
        setCompletedCampaigns(completed.slice(0, 3));
        // Use the first completed campaign as featured, or fall back to any campaign
        setFeaturedCampaign(completed[0] || all[0] || null);
      })
      .catch(() => {
        // Silently fail — static fallback shown below
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStartFundraiser = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/create");
    }
  };

  const pct = featuredCampaign
    ? Math.min(
        Math.round((featuredCampaign.raisedAmount / featuredCampaign.goalAmount) * 100),
        100
      )
    : 68;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* HERO SECTION */}
      <section className="section-container">
        <div className="page-container">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

            {/* LEFT CONTENT */}
            <div>
              <div className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-muted shadow-sm">
                Community-driven crowdfunding platform
              </div>

              <h1 className="mt-8 max-w-2xl text-balance">
                Raise funds for meaningful causes with transparency and trust.
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-text-muted">
                Support medical emergencies, education, social initiatives, startups,
                and community-driven campaigns through a platform built around
                credibility and human impact.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button onClick={handleStartFundraiser} className="btn-primary">
                  Start Fundraiser
                </button>
                <Link to="/campaigns" className="btn-secondary">
                  Explore Campaigns
                </Link>
              </div>

              {/* STATS */}
              <div className="mt-14 flex flex-wrap gap-10 border-t border-border pt-8">
                <div>
                  <p className="text-3xl font-semibold text-text">2K+</p>
                  <p className="mt-2 text-sm text-text-muted">Active donors</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-text">₹12M+</p>
                  <p className="mt-2 text-sm text-text-muted">Funds raised</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-text">850+</p>
                  <p className="mt-2 text-sm text-text-muted">Campaigns supported</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative">
              <div className="card overflow-hidden">
                <img
                  src={
                    featuredCampaign?.media?.coverImage ||
                    "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt="Crowdfunding"
                  className="h-[500px] w-full object-cover"
                />
              </div>

              {/* FLOATING CARD — real featured campaign */}
              <div className="absolute -bottom-8 -left-8 hidden max-w-xs rounded-2xl border border-border bg-surface p-5 shadow-md md:block">
                <p className="text-sm text-text-muted">
                  {featuredCampaign
                    ? (featuredCampaign.raisedAmount >= featuredCampaign.goalAmount
                        ? "Completed Campaign"
                        : "Featured Campaign")
                    : "Featured Campaign"}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-text">
                  {featuredCampaign?.title || "Help build a rural healthcare center"}
                </h3>
                <div className="mt-5 campaign-progress">
                  <div className="campaign-progress-bar" style={{ width: `${pct}%` }} />
                </div>
                <div className="campaign-stats mt-3">
                  <span>
                    {featuredCampaign
                      ? `₹${(featuredCampaign.raisedAmount / 100000).toFixed(1)}L raised`
                      : "₹6.8L raised"}
                  </span>
                  <span>{pct}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPLETED CAMPAIGNS SECTION */}
      {!loading && completedCampaigns.length > 0 && (
        <section className="section-container">
          <div className="page-container">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-text-muted">
                  Success Stories
                </p>
                <h2 className="mt-2">Completed Campaigns</h2>
              </div>
              <Link to="/campaigns" className="btn-secondary hidden sm:inline-flex">
                View All
              </Link>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {completedCampaigns.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>

            <div className="mt-8 flex justify-center sm:hidden">
              <Link to="/campaigns" className="btn-secondary">
                View All Campaigns
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default Home;
