import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">

      <h1 className="text-3xl font-bold text-blue-600">
        CrowdFund
      </h1>

      <div className="flex gap-6 items-center">

        {/* HOME */}
        <Link to="/home">Home</Link>

        {/* CAMPAIGNS */}
        <Link to="/campaigns">Campaigns</Link>

        {/* NORMAL USER ONLY */}
        {currentUser?.role === "user" && (
          <Link to="/create">
            Start Fundraiser
          </Link>
        )}

        {/* ADMIN ONLY */}
        {currentUser?.role === "admin" && (
          <Link to="/admin">
            Admin
          </Link>
        )}

        {/* PROFILE */}
        <Link to="/profile">Profile</Link>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
