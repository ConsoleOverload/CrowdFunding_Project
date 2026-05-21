import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getSingleCampaign } from "../api/campaignApi";
// FIX: Import from correct files — NOT from adminApi
import {
  getCampaignDonations,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../api/adminApi";

// Load Razorpay script dynamically (better than inline <script> tag in JSX)
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CampaignDetails() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [campaign,  setCampaign]  = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [amount,    setAmount]    = useState("");
  const [paying,    setPaying]    = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // ── FETCH CAMPAIGN + DONATIONS ────────────────────────────
  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setError("");
      const [campRes, donRes] = await Promise.all([
        getSingleCampaign(id),
        getCampaignDonations(id).catch(() => ({ data: [] })),
      ]);
      const campData = campRes.data;
      setCampaign(Array.isArray(campData) ? campData[0] : campData);
      const donData = donRes.data;
      setDonations(Array.isArray(donData) ? donData : []);
    } catch (err) {
      if (err.response?.status === 404)      setError("Campaign not found.");
      else if (err.response?.status === 403) setError("This campaign is not approved yet.");
      else                                   setError("Failed to load campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaign(); }, [id]);

  // ── DONATE VIA RAZORPAY ───────────────────────────────────
  const handleDonate = async () => {
    if (!user) {
      toast.error("Please login to donate.");
      navigate("/login");
      return;
    }

    const amt = Number(amount);
    if (!amt || amt < 1) {
      toast.error("Enter a valid amount (min ₹1).");
      return;
    }

    try {
      setPaying(true);

      // Load Razorpay SDK if not already loaded
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Check your connection.");
        setPaying(false);
        return;
      }

      // Create order on backend
      const orderRes = await createRazorpayOrder({ amount: amt, campaignId: id });
      const { order, donationId } = orderRes.data;

      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      order.amount,
        currency:    "INR",
        name:        "CrowdFund",
        description: `Donating to: ${campaign?.title}`,
        order_id:    order.id,
        handler: async (response) => {
          try {
            await verifyRazorpayPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              donationId,
            });
            toast.success("🎉 Donation successful! Thank you for your support.");
            setAmount("");
            fetchCampaign(); // refresh campaign data
          } catch (verifyErr) {
            toast.error(
              verifyErr.response?.data?.message ||
              "Payment verification failed. Contact support."
            );
          } finally {
            setPaying(false);
          }
        },
        prefill: {
          name:  user?.name  || "",
          email: user?.email || "",
        },
        theme: { color: "#2d7a67" },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled.");
            setPaying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not initiate payment.");
      setPaying(false);
    }
  };

  // ── DERIVED VALUES ────────────────────────────────────────
  const raised     = campaign?.raisedAmount || 0;
  const goal       = campaign?.goalAmount   || 1;
  const percentage = Math.min(Math.round((raised / goal) * 100), 100);
  const coverImage = campaign?.media?.coverImage || "";
  const gallery    = campaign?.media?.gallery    || [];
  const allImages  = coverImage
    ? [coverImage, ...gallery.filter((g) => g !== coverImage)]
    : gallery;

  const isGoalMet = raised >= goal;
  const isEnded   = campaign?.deadline && new Date(campaign.deadline) < new Date();
  const canDonate = !isGoalMet && !isEnded && campaign?.status === "approved";

  const quickAmounts = [100, 500, 1000, 5000];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="section-container">
        <div className="page-container">

          {/* BREADCRUMB */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-text-muted">
            <Link to="/" className="hover:text-text transition-colors">Home</Link>
            <span>/</span>
            <Link to="/campaigns" className="hover:text-text transition-colors">Campaigns</Link>
            <span>/</span>
            <span className="text-text truncate max-w-[200px]">
              {campaign?.title || "Loading…"}
            </span>
          </nav>

          {loading && <Loader />}

          {error && (
            <div className="card p-12 text-center">
              <div className="mb-4 text-5xl">😕</div>
              <h2 className="text-2xl font-semibold text-text">{error}</h2>
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={fetchCampaign} className="btn-secondary">Retry</button>
                <Link to="/campaigns" className="btn-primary">Browse Campaigns</Link>
              </div>
            </div>
          )}

          {!loading && !error && campaign && (
            <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">

              {/* ── LEFT COLUMN ── */}
              <div>

                {/* MAIN IMAGE + GALLERY */}
                <div className="card overflow-hidden">
                  {allImages.length > 0 ? (
                    <>
                      <img
                        src={allImages[activeImg]}
                        alt={campaign.title}
                        className="h-[420px] w-full object-cover"
                      />
                      {allImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto p-3">
                          {allImages.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImg(i)}
                              className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                                activeImg === i ? "border-primary" : "border-transparent opacity-60"
                              }`}
                            >
                              <img src={img} alt="" className="h-full w-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex h-[300px] items-center justify-center bg-surface-2 text-6xl">
                      📸
                    </div>
                  )}
                </div>

                {/* CAMPAIGN INFO */}
                <div className="mt-8">

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {campaign.category && (
                      <span className="badge capitalize">{campaign.category}</span>
                    )}
                    {campaign.location && (
                      <span className="badge flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {campaign.location}
                      </span>
                    )}
                    {isGoalMet && (
                      <span className="badge" style={{ background: "hsl(142 52% 38%/0.12)", color: "hsl(142 52% 32%)" }}>
                        🎯 Goal Met!
                      </span>
                    )}
                    {isEnded && !isGoalMet && (
                      <span className="badge" style={{ background: "hsl(2 72% 54%/0.12)", color: "hsl(2 72% 44%)" }}>
                        Ended
                      </span>
                    )}
                  </div>

                  <h1 className="mt-4 text-3xl font-bold leading-tight text-text">
                    {campaign.title}
                  </h1>

                  {/* Stats row */}
                  <div className="mt-4 flex flex-wrap gap-6 border-b border-border pb-6">
                    <div>
                      <p className="text-2xl font-bold text-text">
                        ₹{Number(raised).toLocaleString("en-IN")}
                      </p>
                      <p className="text-sm text-text-muted">raised</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-text">
                        {campaign.stats?.donorCount || 0}
                      </p>
                      <p className="text-sm text-text-muted">donors</p>
                    </div>
                    {campaign.deadline && (
                      <div>
                        <p className="text-2xl font-bold text-text">
                          {Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / 86400000))}
                        </p>
                        <p className="text-sm text-text-muted">days left</p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-text">About this campaign</h2>
                    <p className="mt-3 leading-relaxed text-text-muted whitespace-pre-wrap">
                      {campaign.description}
                    </p>
                  </div>

                  <p className="mt-6 text-xs text-text-muted">
                    Campaign started on{" "}
                    {new Date(campaign.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>

                  {/* DONOR LIST */}
                  {donations.length > 0 && (
                    <div className="mt-10">
                      <h2 className="text-lg font-semibold text-text">
                        Recent Donors ({donations.length})
                      </h2>
                      <div className="mt-4 space-y-3">
                        {donations
                          .filter((d) => d.status === "success")
                          .slice(0, 8)
                          .map((d) => (
                            <div
                              key={d._id}
                              className="flex items-center justify-between rounded-xl bg-surface-2 px-4 py-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                  {d.isAnonymous ? "?" : d.userId?.name?.[0]?.toUpperCase() || "?"}
                                </div>
                                <span className="text-sm font-medium text-text">
                                  {d.isAnonymous ? "Anonymous" : (d.userId?.name || "Donor")}
                                </span>
                              </div>
                              <span className="text-sm font-semibold text-primary">
                                ₹{Number(d.amount).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                        {donations.filter((d) => d.status === "success").length > 8 && (
                          <p className="text-center text-sm text-text-muted">
                            +{donations.filter((d) => d.status === "success").length - 8} more donors
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* ── RIGHT COLUMN – DONATION CARD ── */}
              <div className="lg:sticky lg:top-24">
                <div className="card p-6">

                  {/* Progress */}
                  <div className="mb-5">
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <p className="text-2xl font-bold text-text">
                          ₹{Number(raised).toLocaleString("en-IN")}
                        </p>
                        <p className="text-sm text-text-muted">
                          raised of ₹{Number(goal).toLocaleString("en-IN")} goal
                        </p>
                      </div>
                      <span
                        className="text-xl font-bold"
                        style={{ color: percentage >= 100 ? "var(--color-success)" : "var(--color-primary)" }}
                      >
                        {percentage}%
                      </span>
                    </div>
                    <div className="campaign-progress">
                      <div
                        className="campaign-progress-bar transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <p className="mb-5 text-sm text-text-muted">
                    <span className="font-semibold text-text">{campaign.stats?.donorCount || 0}</span>{" "}
                    people have donated
                  </p>

                  {canDonate ? (
                    <>
                      {/* Quick amounts */}
                      <p className="mb-2 text-sm font-medium text-text">Quick select:</p>
                      <div className="mb-4 grid grid-cols-4 gap-2">
                        {quickAmounts.map((q) => (
                          <button
                            key={q}
                            onClick={() => setAmount(String(q))}
                            className={`rounded-xl border py-2 text-sm font-medium transition-all ${
                              amount === String(q)
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-surface text-text-muted hover:border-primary hover:text-primary"
                            }`}
                          >
                            ₹{q}
                          </button>
                        ))}
                      </div>

                      {/* Custom amount */}
                      <div className="relative mb-4">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted">₹</span>
                        <input
                          type="number"
                          placeholder="Enter custom amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          min="1"
                          className="input pl-8"
                        />
                      </div>

                      <button
                        onClick={handleDonate}
                        disabled={paying || !amount}
                        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {paying ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Processing…
                          </span>
                        ) : (
                          `Donate ${amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "Now"}`
                        )}
                      </button>

                      <p className="mt-3 text-center text-xs text-text-muted">
                        🔒 Secure payment via Razorpay
                      </p>
                    </>
                  ) : (
                    <div className="rounded-xl bg-surface-2 p-5 text-center">
                      <p className="text-2xl">
                        {isGoalMet ? "🎯" : isEnded ? "⏰" : "⚠️"}
                      </p>
                      <p className="mt-2 font-semibold text-text">
                        {isGoalMet
                          ? "Funding goal reached!"
                          : isEnded
                          ? "Campaign has ended"
                          : "Donations not accepted"}
                      </p>
                      <p className="mt-1 text-sm text-text-muted">
                        {isGoalMet
                          ? "This campaign has been fully funded."
                          : isEnded
                          ? "This campaign is no longer accepting donations."
                          : "This campaign is not currently accepting donations."}
                      </p>
                    </div>
                  )}

                  {/* Share */}
                  <div className="mt-5 border-t border-border pt-5">
                    <p className="mb-3 text-sm font-medium text-text">Share this campaign:</p>
                    <div className="flex gap-2">
                      {[
                        {
                          label: "WhatsApp",
                          icon: "💬",
                          href: `https://wa.me/?text=Support+this+campaign:+${encodeURIComponent(window.location.href)}`,
                        },
                        {
                          label: "Twitter",
                          icon: "🐦",
                          href: `https://twitter.com/intent/tweet?text=Support+this+campaign:+${encodeURIComponent(window.location.href)}`,
                        },
                      ].map(({ label, icon, href }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary flex-1 justify-center text-sm"
                        >
                          {icon} {label}
                        </a>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CampaignDetails;
