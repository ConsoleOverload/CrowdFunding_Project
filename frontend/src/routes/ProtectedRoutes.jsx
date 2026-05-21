import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

/**
 * ProtectedRoutes
 * @param {string|string[]} roles - optional required role(s), e.g. "ADMIN" or ["ADMIN"]
 *
 * FIX: Added authLoading guard so we don't redirect to /login
 * before the initial auth check completes (caused flash/flicker).
 */
function ProtectedRoutes({ children, roles }) {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  // Still checking authentication — show spinner, not redirect
  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role
  if (roles) {
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (!allowed.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoutes;
