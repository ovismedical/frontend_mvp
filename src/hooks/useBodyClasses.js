import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useBodyClasses = () => {
  const location = useLocation();

  useEffect(() => {
    const noBodyPaddingRoutes = [
      "/home",
      "/chatbot",
      "/chatbot_voice",
      "/dashboard",
      "/medication",
      "/medication_details",
      "/help_center",
      "/articles",
      "/articles_details",
      "/achievements",
      "/achievements_library",
      "/settings",
      "/healthcare_provider",
      "/password_security",
      "/display_language",
      "/profile_management",
      "/appointments",
      "/appointment_scheduler",
      "/doctor_home",
      "/doctor_patients",
      "/doctor_notifications",
      "/doctor_settings",
      "/symptom-quiz",
    ];

    const isBadgeDetails = location.pathname.startsWith("/badge_details/");
    const isPatientDetails = location.pathname.startsWith("/patient_details/");
    const isAddMedication = location.pathname.startsWith("/add_medication/");

    const shouldHaveNoPadding =
      noBodyPaddingRoutes.includes(location.pathname) ||
      isBadgeDetails ||
      isPatientDetails ||
      isAddMedication;

    document.body.classList.toggle("no-body-padding", shouldHaveNoPadding);
    document.body.classList.toggle("body-centered", !shouldHaveNoPadding);
  }, [location.pathname]);
};
