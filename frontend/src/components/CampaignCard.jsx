import { Link } from "react-router-dom";

const CATEGORY_STYLES = {
  medical:     "background:hsl(2 72% 54%/0.12);color:hsl(2 72% 44%)",
  education:   "background:hsl(210 80% 52%/0.12);color:hsl(210 80% 42%)",
  community:   "background:hsl(142 52% 38%/0.12);color:hsl(142 52% 30%)",
  startup:     "background:hsl(34 90% 45%/0.12);color:hsl(34 90% 36%)",
  social:      "background:hsl(280 60% 50%/0.12);color:hsl(280 60% 40%)",
  environment: "background:hsl(160 44% 32%/0.12);color:hsl(160 44% 25%)",
};

function CampaignCard({ campaign }) {
  // ── Correct field names from backend model ─────────────
  const raised     = campaign.raisedAmount || 0;
  const goal       = campaign.goalAmount   || 1;
  const percentage = Math.min(Math.round((raised / goal) * 100), 100);
  const coverImage = campaign.media?.coverImage || "";

  const catStyle = CATEGORY_STYLES[campaign.category?.toLowerCase()] || "";

  const daysLeft = campaign.deadline
    ? Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / 86_400_000))
    : null;

  return (
    <Link
      to={`/campaigns/${campaign._id}`}
      className="card card-hover group block overflow-hidden"
    >
      {/* IMAGE */}
      <div className="relative h-52 overflow-hidden bg-surface-2">
        {coverImage ? (
          <img
            src={coverImage}
            alt={campaign.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-2">
            <svg className="h-12 w-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Category badge */}
        {campaign.category && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold capitalize"
            style={{ background: "hsl(var(--surface)/0.9)", backdropFilter: "blur(4px)", color: "hsl(var(--text))" }}
          >
            {campaign.category}
          </span>
        )}

        {/* Days left */}
        {daysLeft !== null && (
          <span
            className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ background: "hsl(var(--surface)/0.9)", backdropFilter: "blur(4px)", color: "hsl(var(--text-muted))" }}
          >
            {daysLeft > 0 ? `${daysLeft}d left` : "Ended"}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* Title */}
        <h3
          className="line-clamp-2 font-semibold leading-snug text-text"
          style={{ fontSize: "1.05rem" }}
        >
          {campaign.title}
        </h3>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-muted">
          {campaign.description}
        </p>

        {/* Stats row */}
        <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
          {campaign.stats?.donorCount > 0 && (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
              </svg>
              {campaign.stats.donorCount} donors
            </span>
          )}
          {campaign.location && (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {campaign.location}
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="campaign-progress">
            <div
              className="campaign-progress-bar"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="campaign-stats mt-2">
            <span>
              <span className="font-semibold text-text">
                ₹{Number(raised).toLocaleString("en-IN")}
              </span>
              {" "}raised
            </span>
            <span
              className="font-semibold"
              style={{ color: percentage >= 100 ? "var(--color-success)" : "var(--color-primary)" }}
            >
              {percentage}%
            </span>
          </div>
          <p className="mt-1 text-xs text-text-muted">
            Goal: ₹{Number(goal).toLocaleString("en-IN")}
          </p>
        </div>

        {/* CTA */}
        <div className="btn-primary mt-5 w-full">
          Donate Now
        </div>

      </div>
    </Link>
  );
}

export default CampaignCard;
