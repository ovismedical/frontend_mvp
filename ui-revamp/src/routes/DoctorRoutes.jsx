import React from "react";
import { Route } from "react-router-dom";
import BottomNavLayout from "../components/layout/bottomNavLayout.jsx";
import ProtectedRoute from "../components/ProtectedRoute";

// Doctor Pages
import DoctorHome from "../pages/doctor/home.jsx";
import DoctorPatients from "../pages/doctor/patients.jsx";
import DoctorNotifications from "../pages/doctor/notifications.jsx";
import DoctorSettings from "../pages/doctor/settings/settings.jsx";
import PatientDetails from "../pages/doctor/patient_details/patient_details.jsx";
import AddMedications from "../pages/doctor/patient_details/add_medication.jsx";

export const getDoctorRoutes = () => [
  // Protected routes with bottom navigation
  <Route
    key="protected_routes"
    element={
      <ProtectedRoute>
        <BottomNavLayout isPatient={false} />
      </ProtectedRoute>
    }
  >
    <Route path="/doctor_home" element={<DoctorHome />} />
    <Route path="/doctor_patients" element={<DoctorPatients />} />
    <Route path="/doctor_notifications" element={<DoctorNotifications />} />
    <Route path="/doctor_settings" element={<DoctorSettings />} />
  </Route>,
  <Route path="/patient_details/:patientId" element={<PatientDetails />} />,
  <Route path="/add_medication/:patientId" element={<AddMedications />} />,
];
