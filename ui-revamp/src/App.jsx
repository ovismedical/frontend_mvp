import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomeScreen from "./pages/onboarding/welcome_screen.jsx";
import Onboarding01 from "./pages/onboarding/onboarding01.jsx";
import Onboarding02 from "./pages/onboarding/onboarding02.jsx";
import Onboarding03 from "./pages/onboarding/onboarding03.jsx";
import Onboarding04 from "./pages/onboarding/onboarding04.jsx";
import Register from "./pages/auth/register.jsx";
import Login from "./pages/auth/login.jsx";
import ForgotPassword from "./pages/auth/forgotpassword.jsx";
import PasswordLink from "./pages/auth/password_link.jsx";
import Assessment01 from "./pages/auth/assessment/assessment01.jsx";
import Assessment02 from "./pages/auth/assessment/assessment02.jsx";
import Assessment03 from "./pages/auth/assessment/assessment03.jsx";
import Assessment04 from "./pages/auth/assessment/assessment04.jsx";
import Assessment05 from "./pages/auth/assessment/assessment05.jsx";
import Assessment06 from "./pages/auth/assessment/assessment06.jsx";
import Assessment07 from "./pages/auth/assessment/assessment07.jsx";
import Assessment08 from "./pages/auth/assessment/assessment08.jsx";
import Assessment09 from "./pages/auth/assessment/assessment09.jsx";
import Home from "./pages/home.jsx";

function App() {
  const location = useLocation();

  useEffect(() => {
    const isHome = location.pathname === "/home";

    document.body.classList.toggle("no-body-padding", isHome);
    document.body.classList.toggle("body-centered", !isHome);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/onboarding01" element={<Onboarding01 />} />
      <Route path="/onboarding02" element={<Onboarding02 />} />
      <Route path="/onboarding03" element={<Onboarding03 />} />
      <Route path="/onboarding04" element={<Onboarding04 />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/passwordLink" element={<PasswordLink />} />
      <Route path="/assessment01" element={<Assessment01 />} />
      <Route path="/assessment02" element={<Assessment02 />} />
      <Route path="/assessment03" element={<Assessment03 />} />
      <Route path="/assessment04" element={<Assessment04 />} />
      <Route path="/assessment05" element={<Assessment05 />} />
      <Route path="/assessment06" element={<Assessment06 />} />
      <Route path="/assessment07" element={<Assessment07 />} />
      <Route path="/assessment08" element={<Assessment08 />} />
      <Route path="/assessment09" element={<Assessment09 />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
