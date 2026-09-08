import { Navigate } from "react-router-dom";
import WelcomeScreen from "../pages/onboarding/welcome_screen.jsx";
import { homeFor } from "./auth";

export const renderRootRedirect = (isAuthenticated, user = null) => {
  if (isAuthenticated) {
    return <Navigate to={homeFor(user)} replace />;
  }

  const isFirstVisit = !localStorage.getItem("hasVisited");
  if (isFirstVisit) {
    localStorage.setItem("hasVisited", "true");
    return <WelcomeScreen />;
  }
  return <Navigate to="/login" replace />;
};
