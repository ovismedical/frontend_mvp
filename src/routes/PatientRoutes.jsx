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
  // Patient routes without the bottom nav (still auth + role guarded)
  <Route key="chatbot" path="/chatbot" element={<ProtectedRoute role="patient"><Chatbot /></ProtectedRoute>} />,
  <Route
    key="chatbot_voice"
    path="/chatbot_voice"
    element={<ProtectedRoute role="patient"><VoiceInputChatbot /></ProtectedRoute>}
  />,
  <Route key="medication" path="/medication" element={<ProtectedRoute role="patient"><MedicationList /></ProtectedRoute>} />,
  <Route
    key="medication_details"
    path="/medication_details"
    element={<ProtectedRoute role="patient"><MedicationDetails /></ProtectedRoute>}
  />,
  <Route key="help_center" path="/help_center" element={<ProtectedRoute role="patient"><HelpCenter /></ProtectedRoute>} />,
  <Route key="articles" path="/articles" element={<ProtectedRoute role="patient"><Article /></ProtectedRoute>} />,
  <Route
    key="articles_details"
    path="/articles_details"
    element={<ProtectedRoute role="patient"><ArticleDetails /></ProtectedRoute>}
  />,
  <Route
    key="achievements_library"
    path="/achievements_library"
    element={<ProtectedRoute role="patient"><AchievementsLibrary /></ProtectedRoute>}
  />,
  <Route
    key="badge_details"
    path="/badge_details/:variant"
    element={<ProtectedRoute role="patient"><BadgeDetails /></ProtectedRoute>}
  />,
  <Route
    key="healthcare_provider"
    path="/healthcare_provider"
    element={<ProtectedRoute role="patient"><HealthCareProvider /></ProtectedRoute>}
  />,
  <Route
    key="password_security"
    path="/password_security"
    element={<ProtectedRoute role="patient"><PasswordSecurity /></ProtectedRoute>}
  />,
  <Route
    key="display_language"
    path="/display_language"
    element={<ProtectedRoute role="patient"><DisplayLanguage /></ProtectedRoute>}
  />,
  <Route
    key="profile_management"
    path="/profile_management"
    element={<ProtectedRoute role="patient"><ProfileManagement /></ProtectedRoute>}
  />,
  <Route
    key="appointment_scheduler"
    path="/appointment_scheduler"
    element={<ProtectedRoute role="patient"><AppointmentScheduler /></ProtectedRoute>}
  />,
  <Route
    key="symptom_quiz"
    path="/symptom-quiz"
    element={<ProtectedRoute role="patient"><SymptomQuestionnaire /></ProtectedRoute>}
  />,
  <Route
    key="questionnaire_detail"
    path="/questionnaire-detail"
    element={<ProtectedRoute role="patient"><QuestionnaireDetail /></ProtectedRoute>}
  />,

  // Protected routes with bottom navigation
  <Route
    key="protected_routes"
    element={
      <ProtectedRoute role="patient">
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
