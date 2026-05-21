import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import CampaignCard from "../components/CampaignCard";
import { getCampaigns } from "../api/campaignApi";

const CATEGORIES = ["All", "Medical", "Education", "Community", "Startup", "Social", "Environment"];

const SORT_OPTIONS = [
  { value: "newest",      label: "Newest First"   },
  { value: "oldest",      label: "Oldest First"   },
  { value: "most-funded", label: "Most Funded"    },
  { value: "goal-high",   label: "Goal: High→Low" },
];

function Campaigns() {
  const [campaigns,   setCampaigns] = useState([]);
  const [loading,     setLoading]   = useState(true);
  const [error,       setError]     = useState("");
  const [search,      setSearch]    = useState("");
  const [sort,        setSort]      = useState("newest");
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") || "all";

  const setCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat.toLowerCase() === "all") next.delete("category");
    else next.set("category", cat.toLowerCase());
    setSearchParams(next, { replace: true });
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getCampaigns();
      // Backend returns array directly (not wrapped in payload for GET /)
      const data = res.data;
      setCampaigns(Array.isArray(data) ? data : data.payload || []);
    } catch (err) {
      setError("Failed to load campaigns. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const filtered = useMemo(() => {
    let list = [...campaigns];

    if (activeCategory && activeCategory !== "all") {
      list = list.filter(
        (c) => c.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }

    if (sort === "newest")      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "oldest")      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sort === "most-funded") list.sort((a, b) => (b.raisedAmount || 0) - (a.raisedAmount || 0));
    if (sort === "goal-high")   list.sort((a, b) => (b.goalAmount   || 0) - (a.goalAmount   || 0));

    return list;
  }, [campaigns, activeCategory, search, sort]);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="section-container">
        <div className="page-container">

          {/* HEADER */}
          <div className="section-heading">
            <div className="badge">Active Campaigns</div>
            <h1 className="section-title mt-6">Support meaningful causes</h1>
            <p className="section-subtitle">
              Discover verified fundraisers helping people, communities, and impactful social causes.
            </p>
          </div>

          {/* SEARCH + SORT */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            {/* Search input */}
            <div className="relative flex-1">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.65 16.65 7.5 7.5 0 0016.65 16.65z" />
              </svg>
              <input
                type="text"
                placeholder="Search campaigns…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input sm:w-48"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* CATEGORY PILLS */}
          <div className="mb-10 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive =
                (cat === "All" && (activeCategory === "all" || !activeCategory)) ||
                cat.toLowerCase() === activeCategory;

              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white border-primary"
                      : "bg-surface text-text-muted border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* RESULT COUNT */}
          {!loading && !error && (
            <p className="mb-6 text-sm text-text-muted">
              {filtered.length === 0
                ? "No campaigns found"
                : `Showing ${filtered.length} campaign${filtered.length !== 1 ? "s" : ""}`}
            </p>
          )}

          {/* ERROR */}
          {error && (
            <div className="card border-danger/30 bg-danger/5 p-6 text-center text-danger">
              <p className="font-medium">{error}</p>
              <button onClick={fetchCampaigns} className="btn-secondary mt-4 text-sm">
                Try Again
              </button>
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <Loader />
          ) : !error && filtered.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="mb-4 text-5xl">🔍</div>
              <h2 className="text-2xl font-semibold">No campaigns found</h2>
              <p className="mt-3 text-text-muted">
                {campaigns.length === 0
                  ? "No approved campaigns yet. Be the first to create one!"
                  : "Try adjusting your search or filter."}
              </p>
              {campaigns.length === 0 ? (
                <Link to="/create" className="btn-primary mt-6 inline-flex">
                  Start a Fundraiser
                </Link>
              ) : (
                <button
                  onClick={() => { setSearch(""); setCategory("All"); }}
                  className="btn-secondary mt-6"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            /* GRID */
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
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
