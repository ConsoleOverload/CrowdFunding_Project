import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {

  const navigate = useNavigate();

  const { user, setUser } = useAuth();

  const handleLogout = () => {

    // CLEAR AUTH STATE

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

          {/* HOME */}

          <Link
            to="/"
            className="btn-ghost"
          >
            Home
          </Link>

          {/* CAMPAIGNS */}

          <Link
            to="/campaigns"
            className="btn-ghost"
          >
            Campaigns
          </Link>

          {/* IF USER NOT LOGGED IN */}

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
              {/* START FUNDRAISER */}

              <Link
                to="/create"
                className="btn-ghost"
              >
                Start Fundraiser
              </Link>

              {/* PROFILE */}

              <Link
                to="/profile"
                className="btn-ghost"
              >
                Profile
              </Link>

              {/* ADMIN */}

              <Link
                to="/admin"
                className="btn-ghost"
              >
                Admin
              </Link>

              {/* LOGOUT */}

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
