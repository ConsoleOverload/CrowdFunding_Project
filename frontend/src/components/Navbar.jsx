import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const handleLogout = () => {

    localStorage.removeItem("loggedInUser");

    navigate("/");
  };

  return (

    <nav className="flex justify-between items-center px-8 py-5 bg-white shadow-md">

      {/* LOGO */}

      <Link
        to="/"
        className="text-4xl font-bold text-blue-600"
      >
        CrowdFund
      </Link>

      {/* NAV LINKS */}

      <div className="flex items-center gap-8 text-lg font-medium">

        <Link to="/home" className="hover:text-blue-600">
          Home
        </Link>

        <Link to="/campaigns" className="hover:text-blue-600">
          Campaigns
        </Link>

        {/* BEFORE LOGIN */}

        {!loggedInUser && (
          <>
            <Link to="/login" className="hover:text-blue-600">
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </>
        )}

        {/* AFTER LOGIN */}

        {loggedInUser && (
          <>
            <Link to="/profile" className="hover:text-blue-600">
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;
