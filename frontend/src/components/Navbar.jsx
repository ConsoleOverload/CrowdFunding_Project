import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../api/authApi";

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {/* ignore */}
    setUser(null);
    setMenuOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-text-muted hover:bg-surface-2 hover:text-text"
    }`;

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md"
      style={{ boxShadow: scrolled ? "var(--shadow-sm)" : "none", transition: "box-shadow 0.2s ease" }}
    >
      <div className="page-container h-16 flex items-center justify-between gap-4">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-heading text-xl font-bold text-text shrink-0"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white text-xs font-bold">
            CF
          </span>
          CrowdFund
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/campaigns" className={navLinkClass}>Campaigns</NavLink>
          {user && <NavLink to="/create" className={navLinkClass}>Start Fundraiser</NavLink>}
          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
          )}
        </nav>

        {/* DESKTOP AUTH */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {!user ? (
            <>
              <Link to="/login" className="btn-ghost text-sm">Login</Link>
              <Link to="/signup" className="btn-primary text-sm">Sign Up</Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-text-muted transition-all hover:bg-surface-2 hover:text-text"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>
                {user.name?.split(" ")[0] || "Profile"}
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-2 rounded-lg text-text-muted hover:bg-surface-2 hover:text-text transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="page-container py-4 flex flex-col gap-1">
            <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/campaigns" className={navLinkClass} onClick={() => setMenuOpen(false)}>Campaigns</NavLink>

            {user && (
              <>
                <NavLink to="/create" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Start Fundraiser
                </NavLink>
                <NavLink to="/profile" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Profile
                </NavLink>
              </>
            )}

            {user?.role === "ADMIN" && (
              <NavLink to="/admin" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                Admin Panel
              </NavLink>
            )}

            <div className="my-2 border-t border-border" />

            {!user ? (
              <>
                <Link to="/login"  className="btn-ghost  justify-start text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="btn-primary text-sm mt-1" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn-secondary text-sm text-left">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
