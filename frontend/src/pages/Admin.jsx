import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import {
  getPendingCampaigns,
  approveCampaign,
  rejectCampaign,
} from "../api/adminApi";
import axiosInstance from "../api/axios";

// ── Stat Card ────────────────────────────────────────────────
function StatCard({ label, value, icon, color = "primary", loading = false }) {
  const colors = {
    primary: { bg: "bg-primary/10", text: "text-primary" },
    success: { bg: "bg-success/10", text: "text-success" },
    warning: { bg: "bg-warning/10", text: "text-warning" },
    danger:  { bg: "bg-danger/10",  text: "text-danger"  },
  };
  const c = colors[color] || colors.primary;
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${c.bg}`}>
        {icon}
      </div>
      <div>
        <p className={`text-2xl font-bold ${loading ? "animate-pulse text-text-muted" : "text-text"}`}>
          {loading ? "…" : value}
        </p>
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    </div>
  );
}

// ── Campaign Row ─────────────────────────────────────────────
function CampaignRow({ campaign, onApprove, onReject, processing, showActions = true }) {
  const isProcessing = processing === campaign._id;
  const raised  = campaign.raisedAmount || 0;
  const goal    = campaign.goalAmount   || 0;
  const cover   = campaign.media?.coverImage;

  const statusColors = {
    pending:   "bg-warning/10 text-warning border-warning/20",
    approved:  "bg-success/10 text-success border-success/20",
    rejected:  "bg-danger/10 text-danger border-danger/20",
    completed: "bg-primary/10 text-primary border-primary/20",
    deleted:   "bg-surface-2 text-text-muted border-border",
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col sm:flex-row">

        {/* Thumbnail */}
        <div className="h-40 w-full shrink-0 overflow-hidden bg-surface-2 sm:h-auto sm:w-36">
          {cover ? (
            <img
              src={cover}
              alt={campaign.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl">📋</div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between gap-4 p-5">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-text">{campaign.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                  {campaign.category && (
                    <span className="badge capitalize">{campaign.category}</span>
                  )}
                  {campaign.location && (
                    <span className="flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {campaign.location}
                    </span>
                  )}
                  <span>
                    Submitted {new Date(campaign.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[campaign.status] || ""}`}>
                  {campaign.status}
                </span>
                <p className="text-sm font-semibold text-text">
                  Goal: ₹{Number(goal).toLocaleString("en-IN")}
                </p>
                {raised > 0 && (
                  <p className="text-xs text-text-muted">
                    Raised: ₹{Number(raised).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="mt-3 line-clamp-2 text-sm text-text-muted">
              {campaign.description}
            </p>

            {campaign.deadline && (
              <p className="mt-2 text-xs text-text-muted">
                Deadline: {new Date(campaign.deadline).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
            {showActions && campaign.status === "pending" && (
              <>
                <button
                  onClick={() => onApprove(campaign._id)}
                  disabled={isProcessing}
                  className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  Approve
                </button>

                <button
                  onClick={() => onReject(campaign._id)}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm font-medium text-danger transition-all hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
              </>
            )}

            {campaign.status === "approved" && (
              <a
                href={`/campaigns/${campaign._id}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-sm"
              >
                View Live
              </a>
            )}

            <a
              href={`/campaigns/${campaign._id}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary text-sm"
            >
              Preview
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ──────────────────────────────────────────
function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pendingCampaigns,  setPendingCampaigns]  = useState([]);
  const [allCampaigns,      setAllCampaigns]      = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [statsLoading,      setStatsLoading]      = useState(true);
  const [error,             setError]             = useState("");
  const [processing,        setProcessing]        = useState(null);
  const [tab,               setTab]               = useState("pending");

  // Derived stats from allCampaigns
  const totalCampaigns   = allCampaigns.length;
  const approvedCount    = allCampaigns.filter((c) => c.status === "approved").length;
  const rejectedCount    = allCampaigns.filter((c) => c.status === "rejected").length;
  const completedCount   = allCampaigns.filter((c) => c.status === "completed").length;

  const approvedCampaigns = allCampaigns.filter((c) => c.status === "approved" || c.status === "completed");
  const rejectedCampaigns = allCampaigns.filter((c) => c.status === "rejected");

  // ── ADMIN ROLE GUARD ──────────────────────────────────────
  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      toast.error("Access denied. Admins only.");
      navigate("/");
    }
  }, [user, navigate]);

  // ── FETCH ALL CAMPAIGNS FOR STATS ─────────────────────────
  const fetchAllStats = async () => {
    try {
      setStatsLoading(true);
      // Fetch all campaigns (admin sees all statuses)
      const res = await axiosInstance.get("/admin-api/campaigns/all");
      const data = res.data;
      setAllCampaigns(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Stats fetch error:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  // ── FETCH PENDING ─────────────────────────────────────────
  const fetchPending = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getPendingCampaigns();
      const data = res.data;
      setPendingCampaigns(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load pending campaigns.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchPending();
      fetchAllStats();
    }
  }, [user]);

  // ── APPROVE ───────────────────────────────────────────────
  const handleApprove = async (id) => {
    try {
      setProcessing(id);
      await approveCampaign(id);
      setPendingCampaigns((prev) => prev.filter((c) => c._id !== id));
      fetchAllStats(); // refresh stats
      toast.success("Campaign approved ✓");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve campaign");
    } finally {
      setProcessing(null);
    }
  };

  // ── REJECT ────────────────────────────────────────────────
  const handleReject = async (id) => {
    try {
      setProcessing(id);
      await rejectCampaign(id);
      setPendingCampaigns((prev) => prev.filter((c) => c._id !== id));
      fetchAllStats(); // refresh stats
      toast.success("Campaign rejected");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject campaign");
    } finally {
      setProcessing(null);
    }
  };

  const handleRefresh = () => {
    fetchPending();
    fetchAllStats();
  };

  // ── RENDER ────────────────────────────────────────────────
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  const TABS = [
    { id: "pending",  label: `Pending Review (${pendingCampaigns.length})` },
    { id: "approved", label: `Approved (${approvedCount})` },
    { id: "rejected", label: `Rejected (${rejectedCount})` },
  ];

  const currentList =
    tab === "pending"  ? pendingCampaigns  :
    tab === "approved" ? approvedCampaigns :
    rejectedCampaigns;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="section-container">
        <div className="page-container">

          {/* PAGE HEADER */}
          <div className="section-heading">
            <div className="badge">Admin Panel</div>
            <h1 className="section-title mt-6">Campaign Management</h1>
            <p className="section-subtitle">
              Review, approve, or reject submitted campaigns before they go live to the public.
            </p>
          </div>

          {/* STATS CARDS */}
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Pending Review"
              value={pendingCampaigns.length}
              icon="⏳"
              color="warning"
              loading={loading}
            />
            <StatCard
              label="Approved"
              value={approvedCount}
              icon="✅"
              color="success"
              loading={statsLoading}
            />
            <StatCard
              label="Total Campaigns"
              value={totalCampaigns}
              icon="📋"
              color="primary"
              loading={statsLoading}
            />
            <StatCard
              label="Admin"
              value={user?.name?.split(" ")[0] || "Admin"}
              icon="🛡️"
              color="primary"
            />
          </div>

          {/* TABS */}
          <div className="mb-8 flex items-center gap-1 border-b border-border">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors duration-200 border-b-2 -mb-px ${
                  tab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                {t.label}
              </button>
            ))}
            <button
              onClick={handleRefresh}
              className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-text-muted hover:bg-surface-2 hover:text-text transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="card mb-6 border-danger/30 bg-danger/5 p-5 text-center text-danger">
              <p className="font-medium">{error}</p>
              <button onClick={fetchPending} className="btn-secondary mt-3 text-sm">
                Retry
              </button>
            </div>
          )}

          {/* LOADING */}
          {loading && tab === "pending" ? (
            <Loader />
          ) : currentList.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="mb-4 text-5xl">
                {tab === "pending" ? "🎉" : tab === "approved" ? "📋" : "🚫"}
              </div>
              <h2 className="text-2xl font-semibold text-text">
                {tab === "pending"
                  ? "All caught up!"
                  : tab === "approved"
                  ? "No approved campaigns"
                  : "No rejected campaigns"}
              </h2>
              <p className="mt-3 text-text-muted">
                {tab === "pending"
                  ? "No campaigns are pending review right now."
                  : tab === "approved"
                  ? "No campaigns have been approved yet."
                  : "No campaigns have been rejected."}
              </p>
              <button onClick={handleRefresh} className="btn-secondary mt-6 text-sm">
                Refresh
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentList.map((campaign) => (
                <CampaignRow
                  key={campaign._id}
                  campaign={campaign}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  processing={processing}
                  showActions={tab === "pending"}
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

export default Admin;
