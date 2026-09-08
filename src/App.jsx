import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useBodyClasses } from "./hooks/useBodyClasses";
import { renderRootRedirect } from "./utils/routeHelpers.jsx";

// Route Components
import { getAuthRoutes } from "./routes/AuthRoutes.jsx";
import { getPatientRoutes } from "./routes/PatientRoutes.jsx";
import { getDoctorRoutes } from "./routes/DoctorRoutes.jsx";

function App() {
  const { isAuthenticated, isAuthLoading, user } = useAuth();

  // Apply body classes based on current route
  useBodyClasses();

  if (isAuthLoading) return null;

  return (
    <Routes>
      <Route path="/" element={renderRootRedirect(isAuthenticated, user)} />

      {/* Auth & Onboarding Routes */}
      {getAuthRoutes()}

      {/* Patient Routes */}
      {getPatientRoutes()}

      {/* Doctor Routes */}
      {getDoctorRoutes()}
    </Routes>
  );
}

export default App;
