import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./pages/onboarding/welcome_screen.jsx";
import Onboarding01 from "./pages/onboarding/onboarding01.jsx";
import Onboarding02 from "./pages/onboarding/onboarding02.jsx";
import Onboarding03 from "./pages/onboarding/onboarding03.jsx";
import Onboarding04 from "./pages/onboarding/onboarding04.jsx";
import Register from "./pages/auth/register.jsx";
import Login from "./pages/auth/login.jsx";
import ForgotPassword from "./pages/auth/forgotpassword.jsx";
import PasswordLink from "./pages/auth/password_link.jsx";

function App() {
  return (
    <Router>
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
      </Routes>
    </Router>
  );
}

export default App;
