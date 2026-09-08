import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { homeFor } from "../utils/auth";

/**
 * Gate a route on authentication and, optionally, on role ("patient" | "doctor").
 * A signed-in user of the other role is sent to their own home instead of a login loop.
 */
const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) return null; // or show a loader
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={homeFor(user)} replace />;

  return children;
};

export default ProtectedRoute;
