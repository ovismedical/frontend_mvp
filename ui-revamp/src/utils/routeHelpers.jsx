import { Navigate } from "react-router-dom";
import WelcomeScreen from "../pages/onboarding/welcome_screen.jsx";

export const renderRootRedirect = (isAuthenticated) => {
  if (isAuthenticated) {
    // Check user role from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = JSON.parse(token);
        if (userData.user?.role === "doctor") {
          return <Navigate to="/doctor_home" replace />;
        }
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
    return <Navigate to="/home" replace />;
  } else {
    const isFirstVisit = !localStorage.getItem("hasVisited");
    if (isFirstVisit) {
      localStorage.setItem("hasVisited", "true");
      return <WelcomeScreen />;
    }
    return <Navigate to="/login" replace />;
  }
};
