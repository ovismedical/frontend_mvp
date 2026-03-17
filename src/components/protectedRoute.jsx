import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) return null; // or show a loader

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
