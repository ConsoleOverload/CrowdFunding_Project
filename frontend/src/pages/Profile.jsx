import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import {
  getMyProfile,
  updateMyProfile,
  updateProfileImage,
  getMyDonations,
  changePassword,
} from "../api/adminApi";
// FIX: Use getMyCampaigns (all statuses) not getCampaigns (public only)
import { getMyCampaigns } from "../api/campaignApi";

const TABS = ["Overview", "My Donations", "My Campaigns", "Settings"];

function Profile() {
  const { user, fetchUser } = useAuth();

  const [tab,          setTab]          = useState("Overview");
  const [profileData,  setProfileData]  = useState(null);
  const [donations,    setDonations]    = useState([]);
  const [myCampaigns,  setMyCampaigns]  = useState([]);
  const [loading,      setLoading]      = useState(true);

  const [editName,     setEditName]     = useState("");
  const [saving,       setSaving]       = useState(false);
  const [imgUploading, setImgUploading] = useState(false);

  const [passwords,    setPasswords]    = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [pwSaving,     setPwSaving]     = useState(false);

  // ── FETCH ALL DATA ────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [profRes, donRes, campRes] = await Promise.all([
          getMyProfile(),
          getMyDonations().catch(() => ({ data: [] })),
          // FIX: use getMyCampaigns which hits /campaign-api/my-campaigns
          // and returns ALL campaigns owned by user (pending, approved, etc.)
          getMyCampaigns().catch(() => ({ data: [] })),
        ]);

        const prof = profRes.data.payload || profRes.data;
        setProfileData(prof);
        setEditName(prof?.name || "");

        const donData = donRes.data;
        setDonations(Array.isArray(donData) ? donData : []);

        const campData = campRes.data;
        setMyCampaigns(Array.isArray(campData) ? campData : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── UPDATE NAME ───────────────────────────────────────────
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateMyProfile({ name: editName });
      await fetchUser();
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ── UPDATE PROFILE IMAGE ──────────────────────────────────
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setImgUploading(true);
      const fd = new FormData();
      fd.append("image", file);
      await updateProfileImage(fd);
      await fetchUser();
      toast.success("Profile image updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload image");
    } finally {
      setImgUploading(false);
    }
  };

  // ── CHANGE PASSWORD ───────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    try {
      setPwSaving(true);
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword:     passwords.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  };

  const displayUser = profileData || user;

  const statusColors = {
    approved:  "bg-success/10 text-success",
    rejected:  "bg-danger/10 text-danger",
    pending:   "bg-warning/10 text-warning",
    completed: "bg-primary/10 text-primary",
    deleted:   "bg-surface-2 text-text-muted",
    draft:     "bg-surface-2 text-text-muted",
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="section-container">
        <div className="page-container">

          {loading ? (
            <Loader />
          ) : (
            <>
              {/* PROFILE HEADER */}
              <div className="card mb-8 p-6 sm:p-8">
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {displayUser?.profileImageURL ? (
                      <img
                        src={displayUser.profileImageURL}
                        alt={displayUser.name}
                        className="h-20 w-20 rounded-2xl object-cover sm:h-24 sm:w-24"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-bold text-primary sm:h-24 sm:w-24">
                        {displayUser?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    {/* Image upload button */}
                    <label className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary-hover transition-colors">
                      {imgUploading ? (
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>

                  {/* User info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-text">{displayUser?.name}</h1>
                    <p className="mt-1 text-text-muted">{displayUser?.email}</p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                      <span className="badge">
                        {displayUser?.role === "ADMIN" ? "🛡️ Admin" : "👤 User"}
                      </span>
                      <span className="badge">🇮🇳 {displayUser?.Country || "India"}</span>
                      <span className="badge">
                        Member since{" "}
                        {new Date(displayUser?.createdAt).toLocaleDateString("en-IN", {
                          month: "short", year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 sm:flex-col sm:gap-3 sm:text-right">
                    <div>
                      <p className="text-xl font-bold text-text">
                        {displayUser?.numberOfDonations || 0}
                      </p>
                      <p className="text-xs text-text-muted">Donations</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-text">
                        ₹{Number(displayUser?.totalAmountDonated || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-text-muted">Total Given</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* TABS */}
              <div className="mb-8 flex gap-1 overflow-x-auto border-b border-border">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors -mb-px ${
                      tab === t
                        ? "border-primary text-primary"
                        : "border-transparent text-text-muted hover:text-text"
                    }`}
                  >
                    {t}
                    {t === "My Campaigns" && myCampaigns.length > 0 && (
                      <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                        {myCampaigns.length}
                      </span>
                    )}
                    {t === "My Donations" && donations.length > 0 && (
                      <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                        {donations.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── OVERVIEW ── */}
              {tab === "Overview" && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: "Total Donations",    value: displayUser?.numberOfDonations || 0,    icon: "💝" },
                    { label: "Amount Donated",     value: `₹${Number(displayUser?.totalAmountDonated || 0).toLocaleString("en-IN")}`, icon: "💰" },
                    { label: "Campaigns Created",  value: myCampaigns.length,                     icon: "📋" },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="card p-6 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                        {icon}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-text">{value}</p>
                        <p className="text-sm text-text-muted">{label}</p>
                      </div>
                    </div>
                  ))}
                  {/* Quick actions */}
                  <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap gap-3 mt-2">
                    <Link to="/campaigns" className="btn-secondary text-sm">
                      Browse Campaigns
                    </Link>
                    <Link to="/create" className="btn-primary text-sm">
                      Start Fundraiser
                    </Link>
                  </div>
                </div>
              )}

              {/* ── MY DONATIONS ── */}
              {tab === "My Donations" && (
                <div>
                  {donations.length === 0 ? (
                    <div className="card p-12 text-center">
                      <p className="text-4xl mb-3">💝</p>
                      <h3 className="text-lg font-semibold text-text">No donations yet</h3>
                      <p className="mt-2 text-text-muted">Start supporting campaigns you care about.</p>
                      <Link to="/campaigns" className="btn-primary mt-5 inline-flex">
                        Browse Campaigns
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {donations.map((d) => (
                        <div key={d._id} className="card flex items-center justify-between p-4">
                          <div>
                            <p className="font-medium text-text">
                              {d.campaignId?.title || "Campaign"}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5">
                              {new Date(d.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                              })}
                              {" · "}{d.isAnonymous ? "Anonymous" : "Public"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">
                              ₹{Number(d.amount).toLocaleString("en-IN")}
                            </p>
                            <span className={`text-xs font-medium ${
                              d.status === "success" ? "text-success" : "text-warning"
                            }`}>
                              {d.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── MY CAMPAIGNS ── */}
              {tab === "My Campaigns" && (
                <div>
                  {myCampaigns.length === 0 ? (
                    <div className="card p-12 text-center">
                      <p className="text-4xl mb-3">📋</p>
                      <h3 className="text-lg font-semibold text-text">No campaigns yet</h3>
                      <p className="mt-2 text-text-muted">Start a fundraiser and make a difference.</p>
                      <Link to="/create" className="btn-primary mt-5 inline-flex">
                        Create Campaign
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myCampaigns.map((c) => {
                        const pct = Math.min(
                          Math.round(((c.raisedAmount || 0) / (c.goalAmount || 1)) * 100),
                          100
                        );
                        return (
                          <div key={c._id} className="card p-4">
                            <div className="flex items-center gap-4">
                              {c.media?.coverImage ? (
                                <img
                                  src={c.media.coverImage}
                                  alt={c.title}
                                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-xl">
                                  📋
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-semibold text-text truncate">{c.title}</p>
                                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[c.status] || ""}`}>
                                    {c.status}
                                  </span>
                                </div>
                                <p className="text-xs text-text-muted mt-1">
                                  ₹{Number(c.raisedAmount || 0).toLocaleString("en-IN")} raised
                                  of ₹{Number(c.goalAmount || 0).toLocaleString("en-IN")}
                                </p>
                                {/* Mini progress bar */}
                                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                                  <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            {c.status === "approved" && (
                              <div className="mt-3 border-t border-border pt-3">
                                <Link
                                  to={`/campaigns/${c._id}`}
                                  className="text-xs font-medium text-primary hover:underline"
                                >
                                  View Campaign →
                                </Link>
                              </div>
                            )}
                            {c.status === "pending" && (
                              <p className="mt-3 border-t border-border pt-3 text-xs text-warning">
                                ⏳ Awaiting admin approval
                              </p>
                            )}
                            {c.status === "rejected" && (
                              <p className="mt-3 border-t border-border pt-3 text-xs text-danger">
                                ❌ Campaign was rejected. You may create a new one.
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── SETTINGS ── */}
              {tab === "Settings" && (
                <div className="grid gap-8 lg:grid-cols-2">

                  {/* Update Profile */}
                  <div className="card p-6">
                    <h3 className="mb-5 text-lg font-semibold text-text">Update Profile</h3>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <label className="label">Full Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label className="label">Email</label>
                        <input
                          type="email"
                          value={displayUser?.email || ""}
                          className="input opacity-60 cursor-not-allowed"
                          disabled
                        />
                        <p className="mt-1 text-xs text-text-muted">Email cannot be changed.</p>
                      </div>
                      <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary w-full disabled:opacity-60"
                      >
                        {saving ? "Saving…" : "Save Changes"}
                      </button>
                    </form>
                  </div>

                  {/* Change Password */}
                  <div className="card p-6">
                    <h3 className="mb-5 text-lg font-semibold text-text">Change Password</h3>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      {[
                        { label: "Current Password", key: "currentPassword" },
                        { label: "New Password",     key: "newPassword"     },
                        { label: "Confirm Password", key: "confirm"         },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label className="label">{label}</label>
                          <input
                            type="password"
                            value={passwords[key]}
                            onChange={(e) =>
                              setPasswords({ ...passwords, [key]: e.target.value })
                            }
                            className="input"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      ))}
                      <button
                        type="submit"
                        disabled={pwSaving}
                        className="btn-secondary w-full disabled:opacity-60"
                      >
                        {pwSaving ? "Changing…" : "Change Password"}
                      </button>
                    </form>
                  </div>

                </div>
              )}

            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
