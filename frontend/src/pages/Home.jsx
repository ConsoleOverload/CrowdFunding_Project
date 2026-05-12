import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Home() {

  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user);
  // HANDLE START FUNDRAISER
  const handleStartFundraiser = () => {

  if (!user) {

    navigate("/login");

  } else {

    navigate("/create");

  }
};

  return (

    <div className="min-h-screen bg-bg">

      <Navbar />
        {/* HERO SECTION */}

        <section className="section-container">

          <div className="page-container">

            <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

              {/* LEFT CONTENT */}

              <div>

                {/* BADGE */}

                <div className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-muted shadow-sm">

                  Community-driven crowdfunding platform

                </div>

                {/* HEADING */}

                <h1 className="mt-8 max-w-2xl text-balance">

                  Raise funds for meaningful causes with transparency and trust.

                </h1>

                {/* DESCRIPTION */}

                <p className="mt-8 max-w-xl text-lg leading-relaxed text-text-muted">

                  Support medical emergencies, education, social initiatives, startups,
                  and community-driven campaigns through a platform built around
                  credibility and human impact.

                </p>

                {/* CTA */}

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                  <button
                    onClick={handleStartFundraiser}
                    className="btn-primary"
                  >
                    Start Fundraiser
                  </button>

                  <Link
                    to="/campaigns"
                    className="btn-secondary"
                  >
                    Explore Campaigns
                  </Link>

                </div>

                {/* STATS */}

                <div className="mt-14 flex flex-wrap gap-10 border-t border-border pt-8">

                  <div>

                    <p className="text-3xl font-semibold text-text">

                      2K+

                    </p>

                    <p className="mt-2 text-sm text-text-muted">

                      Active donors

                    </p>

                  </div>

                  <div>

                    <p className="text-3xl font-semibold text-text">

                      ₹12M+

                    </p>

                    <p className="mt-2 text-sm text-text-muted">

                      Funds raised

                    </p>

                  </div>

                  <div>

                    <p className="text-3xl font-semibold text-text">

                      850+

                    </p>

                    <p className="mt-2 text-sm text-text-muted">

                      Campaigns supported

                    </p>

                  </div>

                </div>

              </div>

              {/* RIGHT SIDE */}

              <div className="relative">

                <div className="card overflow-hidden">

                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop"
                    alt="Crowdfunding"
                    className="h-[500px] w-full object-cover"
                  />

                </div>

                {/* FLOATING CARD */}

                <div className="absolute -bottom-8 -left-8 hidden max-w-xs rounded-2xl border border-border bg-surface p-5 shadow-md md:block">

                  <p className="text-sm text-text-muted">

                    Featured Campaign

                  </p>

                  <h3 className="mt-3 text-lg font-semibold text-text">

                    Help build a rural healthcare center

                  </h3>

                  <div className="mt-5 campaign-progress">

                    <div
                      className="campaign-progress-bar"
                      style={{ width: "68%" }}
                    />

                  </div>

                  <div className="campaign-stats mt-3">

                    <span>₹6.8L raised</span>

                    <span>68%</span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      <Footer />

    </div>
  );
}

export default Home;
