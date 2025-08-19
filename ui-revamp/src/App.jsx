import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNavLayout from "./components/layout/bottomNavLayout.jsx";

// Screens
import WelcomeScreen from "./pages/onboarding/welcome_screen.jsx";
import Onboarding01 from "./pages/onboarding/onboarding01.jsx";
import Onboarding02 from "./pages/onboarding/onboarding02.jsx";
import Onboarding03 from "./pages/onboarding/onboarding03.jsx";
import Onboarding04 from "./pages/onboarding/onboarding04.jsx";
import Register from "./pages/auth/register.jsx";
import Login from "./pages/auth/login.jsx";
import ForgotPassword from "./pages/auth/forgotpassword.jsx";
import OTP from "./pages/auth/otp.jsx";
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
import Chatbot from "./pages/chatbot.jsx";
import VoiceInputChatbot from "./pages/chatbot_voice.jsx";
import Dashboard from "./pages/dashboards/dashboard.jsx";
import MedicationList from "./pages/medication/medication.jsx";
import MedicationDetails from "./pages/medication/medication_details.jsx";
import HelpCenter from "./pages/help_center.jsx";
import Article from "./pages/articles/articles.jsx";
import ArticleDetails from "./pages/articles/articles_details.jsx";
import Achievements from "./pages/achievements/achievements.jsx";
import AchievementsLibrary from "./pages/achievements/achievements_library.jsx";
import BadgeDetails from "./pages/achievements/badge_details.jsx";
import Settings from "./pages/settings/settings.jsx";
import HealthCareProvider from "./pages/settings/healthcare_provider.jsx";
import PasswordSecurity from "./pages/settings/password.jsx";
import DisplayLanguage from "./pages/settings/display_language.jsx";
import ProfileManagement from "./pages/settings/profile_management.jsx";

function App() {
  const location = useLocation();
  const { isAuthenticated, isAuthLoading } = useAuth();

  useEffect(() => {
    const isHome = location.pathname === "/home";
    const isChatbot = location.pathname === "/chatbot";
    const isChatbotVoice = location.pathname === "/chatbot_voice";
    const isDashboard = location.pathname === "/dashboard";
    const isMedicationList = location.pathname === "/medication";
    const isMedicationDetails = location.pathname === "/medication_details";
    const isHelpCenter = location.pathname === "/help_center";
    const isArticle = location.pathname === "/articles";
    const isArticleDetails = location.pathname === "/articles_details";
    const isAchievements = location.pathname === "/achievements";
    const isAchievementsLibrary = location.pathname === "/achievements_library";
    const isBadgeDetails = location.pathname.startsWith("/badge_details/");
    const isSettings = location.pathname === "/settings";
    const isHealthCareProvider = location.pathname === "/healthcare_provider";
    const isPasswordSecurity = location.pathname === "/password_security";
    const isDisplayLanguage = location.pathname === "/display_language";
    const isProfileManagement = location.pathname === "/profile_management";

    document.body.classList.toggle(
      "no-body-padding",
      isHome ||
        isChatbot ||
        isChatbotVoice ||
        isDashboard ||
        isMedicationList ||
        isMedicationDetails ||
        isHelpCenter ||
        isArticle ||
        isArticleDetails ||
        isAchievements ||
        isAchievementsLibrary ||
        isBadgeDetails ||
        isSettings ||
        isHealthCareProvider ||
        isPasswordSecurity ||
        isDisplayLanguage ||
        isProfileManagement
    );
    document.body.classList.toggle(
      "body-centered",
      !isHome &&
        !isChatbot &&
        !isChatbotVoice &&
        !isDashboard &&
        !isMedicationList &&
        !isMedicationDetails &&
        !isHelpCenter &&
        !isArticle &&
        !isArticleDetails &&
        !isAchievements &&
        !isAchievementsLibrary &&
        !isBadgeDetails &&
        !isSettings &&
        !isHealthCareProvider &&
        !isPasswordSecurity &&
        !isDisplayLanguage &&
        !isProfileManagement
    );
  }, [location.pathname]);

  if (isAuthLoading) return null; // or show loading spinner

  const isFirstVisit = !localStorage.getItem("hasVisited");

  const renderRootRedirect = () => {
    if (isAuthenticated) {
      return <Navigate to="/home" replace />;
    } else if (isFirstVisit) {
      localStorage.setItem("hasVisited", "true");
      return <WelcomeScreen />;
    } else {
      return <Navigate to="/login" replace />;
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={renderRootRedirect()} />
        <Route path="/welcome_screen" element={<WelcomeScreen />} />
        <Route path="/onboarding01" element={<Onboarding01 />} />
        <Route path="/onboarding02" element={<Onboarding02 />} />
        <Route path="/onboarding03" element={<Onboarding03 />} />
        <Route path="/onboarding04" element={<Onboarding04 />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/otp" element={<OTP />} />
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
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/chatbot_voice" element={<VoiceInputChatbot />} />
        <Route path="/medication" element={<MedicationList />} />
        <Route path="/medication_details" element={<MedicationDetails />} />
        <Route path="/help_center" element={<HelpCenter />} />
        <Route path="/articles" element={<Article />} />
        <Route path="/articles_details" element={<ArticleDetails />} />
        <Route path="/achievements_library" element={<AchievementsLibrary />} />
        <Route path="/badge_details/:variant" element={<BadgeDetails />} />
        <Route path="/healthcare_provider" element={<HealthCareProvider />} />
        <Route path="/password_security" element={<PasswordSecurity />} />
        <Route path="/display_language" element={<DisplayLanguage />} />
        <Route path="/profile_management" element={<ProfileManagement />} />

        <Route
          element={
            <ProtectedRoute>
              <BottomNavLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
