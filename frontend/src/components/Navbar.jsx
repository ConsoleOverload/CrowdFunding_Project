import { Link } from "react-router-dom";

function Navbar() {
return ( <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white">

  <h1 className="text-2xl font-bold text-blue-600">
    CrowdFund
  </h1>

  <div className="flex gap-6">
    <Link to="/">Home</Link>
    <Link to="/campaigns">Campaigns</Link>
    <Link to="/create">Start Fundraiser</Link>
    <Link to="/login">Login</Link>
  </div>

</nav>


);
}

export default Navbar;
