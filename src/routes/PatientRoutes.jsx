import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/protectedRoute";
import BottomNavLayout from "../components/layout/bottomNavLayout.jsx";

// Patient Pages
import Home from "../pages/patient/home.jsx";
import Chatbot from "../pages/patient/chatbot.jsx";
import VoiceInputChatbot from "../pages/patient/chatbot_voice.jsx";
import Dashboard from "../pages/patient/dashboards/dashboard.jsx";
import MedicationList from "../pages/patient/medication/medication.jsx";
import MedicationDetails from "../pages/patient/medication/medication_details.jsx";
import HelpCenter from "../pages/patient/help_center.jsx";
import Article from "../pages/patient/articles/articles.jsx";
import ArticleDetails from "../pages/patient/articles/articles_details.jsx";
import Achievements from "../pages/patient/achievements/achievements.jsx";
import AchievementsLibrary from "../pages/patient/achievements/achievements_library.jsx";
import BadgeDetails from "../pages/patient/achievements/badge_details.jsx";
import Settings from "../pages/patient/settings/settings.jsx";
import HealthCareProvider from "../pages/patient/settings/healthcare_provider.jsx";
import PasswordSecurity from "../pages/patient/settings/password.jsx";
import DisplayLanguage from "../pages/patient/settings/display_language.jsx";
import ProfileManagement from "../pages/patient/settings/profile_management.jsx";
import Appointments from "../pages/patient/appointments/appointment.jsx";
import AppointmentScheduler from "../pages/patient/appointments/appointment_scheduler.jsx";
import SymptomQuestionnaire from "../pages/patient/symptom-questionnaire.jsx";
import QuestionnaireDetail from "../pages/patient/questionnaire-detail.jsx";

export const getPatientRoutes = () => [
  // Public patient routes (no bottom nav)
  <Route key="chatbot" path="/chatbot" element={<Chatbot />} />,
  <Route
    key="chatbot_voice"
    path="/chatbot_voice"
    element={<VoiceInputChatbot />}
  />,
  <Route key="medication" path="/medication" element={<MedicationList />} />,
  <Route
    key="medication_details"
    path="/medication_details"
    element={<MedicationDetails />}
  />,
  <Route key="help_center" path="/help_center" element={<HelpCenter />} />,
  <Route key="articles" path="/articles" element={<Article />} />,
  <Route
    key="articles_details"
    path="/articles_details"
    element={<ArticleDetails />}
  />,
  <Route
    key="achievements_library"
    path="/achievements_library"
    element={<AchievementsLibrary />}
  />,
  <Route
    key="badge_details"
    path="/badge_details/:variant"
    element={<BadgeDetails />}
  />,
  <Route
    key="healthcare_provider"
    path="/healthcare_provider"
    element={<HealthCareProvider />}
  />,
  <Route
    key="password_security"
    path="/password_security"
    element={<PasswordSecurity />}
  />,
  <Route
    key="display_language"
    path="/display_language"
    element={<DisplayLanguage />}
  />,
  <Route
    key="profile_management"
    path="/profile_management"
    element={<ProfileManagement />}
  />,
  <Route
    key="appointment_scheduler"
    path="/appointment_scheduler"
    element={<AppointmentScheduler />}
  />,
  <Route
    key="symptom_quiz"
    path="/symptom-quiz"
    element={<SymptomQuestionnaire />}
  />,
  <Route
    key="questionnaire_detail"
    path="/questionnaire-detail"
    element={<QuestionnaireDetail />}
  />,

  // Protected routes with bottom navigation
  <Route
    key="protected_routes"
    element={
      <ProtectedRoute>
        <BottomNavLayout isPatient={true} />
      </ProtectedRoute>
    }
  >
    <Route path="/home" element={<Home />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/achievements" element={<Achievements />} />
    <Route path="/appointments" element={<Appointments />} />
    <Route path="/settings" element={<Settings />} />
  </Route>,
];
