import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {

  const navigate = useNavigate();

  const { user, setUser } = useAuth();

  const handleLogout = () => {

    // clear auth state

    setUser(null);

    navigate("/");
  };

  return (

    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">

      <div className="page-container h-16 flex items-center justify-between">

        {/* LOGO */}

        <Link
          to="/"
          className="font-heading text-2xl font-semibold text-text"
        >
          CrowdFund
        </Link>

        {/* NAVIGATION */}

        <nav className="flex items-center gap-2">

          <Link
            to="/"
            className="btn-ghost"
          >
            Home
          </Link>

          <Link
            to="/campaigns"
            className="btn-ghost"
          >
            Campaigns
          </Link>

          {!user ? (
            <>

              <Link
                to="/login"
                className="btn-ghost"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="btn-primary"
              >
                Sign Up
              </Link>

            </>
          ) : (
            <>

              <Link
                to="/create"
                className="btn-ghost"
              >
                Start Fundraiser
              </Link>

              <Link
                to="/profile"
                className="btn-ghost"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>

            </>
          )}

        </nav>

      </div>

    </header>
  );
}

export default Navbar;