import React from "react";
import { Route } from "react-router-dom";

// Auth & Onboarding Pages
import WelcomeScreen from "../pages/onboarding/welcome_screen.jsx";
import Onboarding01 from "../pages/onboarding/onboarding01.jsx";
import Onboarding02 from "../pages/onboarding/onboarding02.jsx";
import Onboarding03 from "../pages/onboarding/onboarding03.jsx";
import Onboarding04 from "../pages/onboarding/onboarding04.jsx";
import Register from "../pages/auth/register.jsx";
import Login from "../pages/auth/login.jsx";
import ForgotPassword from "../pages/auth/forgotpassword.jsx";
import OTP from "../pages/auth/otp.jsx";
import PasswordLink from "../pages/auth/password_link.jsx";
import Assessment01 from "../pages/auth/assessment/assessment01.jsx";
import Assessment02 from "../pages/auth/assessment/assessment02.jsx";
import Assessment03 from "../pages/auth/assessment/assessment03.jsx";
import Assessment04 from "../pages/auth/assessment/assessment04.jsx";
import Assessment05 from "../pages/auth/assessment/assessment05.jsx";
import Assessment06 from "../pages/auth/assessment/assessment06.jsx";
import Assessment07 from "../pages/auth/assessment/assessment07.jsx";
import Assessment08 from "../pages/auth/assessment/assessment08.jsx";
import Assessment09 from "../pages/auth/assessment/assessment09.jsx";

export const getAuthRoutes = () => [
  <Route
    key="welcome_screen"
    path="/welcome_screen"
    element={<WelcomeScreen />}
  />,
  <Route key="onboarding01" path="/onboarding01" element={<Onboarding01 />} />,
  <Route key="onboarding02" path="/onboarding02" element={<Onboarding02 />} />,
  <Route key="onboarding03" path="/onboarding03" element={<Onboarding03 />} />,
  <Route key="onboarding04" path="/onboarding04" element={<Onboarding04 />} />,
  <Route key="register" path="/register" element={<Register />} />,
  <Route key="login" path="/login" element={<Login />} />,
  <Route
    key="forgotPassword"
    path="/forgotPassword"
    element={<ForgotPassword />}
  />,
  <Route key="otp" path="/otp" element={<OTP />} />,
  <Route key="passwordLink" path="/passwordLink" element={<PasswordLink />} />,
  <Route key="assessment01" path="/assessment01" element={<Assessment01 />} />,
  <Route key="assessment02" path="/assessment02" element={<Assessment02 />} />,
  <Route key="assessment03" path="/assessment03" element={<Assessment03 />} />,
  <Route key="assessment04" path="/assessment04" element={<Assessment04 />} />,
  <Route key="assessment05" path="/assessment05" element={<Assessment05 />} />,
  <Route key="assessment06" path="/assessment06" element={<Assessment06 />} />,
  <Route key="assessment07" path="/assessment07" element={<Assessment07 />} />,
  <Route key="assessment08" path="/assessment08" element={<Assessment08 />} />,
  <Route key="assessment09" path="/assessment09" element={<Assessment09 />} />,
];
