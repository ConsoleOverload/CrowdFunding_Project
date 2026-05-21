import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function NotFound() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-5">
        <p className="text-8xl font-black text-text/10 select-none">404</p>
        <h1 className="mt-4 text-3xl font-bold text-text">Page not found</h1>
        <p className="mt-3 text-text-muted max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/campaigns" className="btn-secondary">Browse Campaigns</Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
