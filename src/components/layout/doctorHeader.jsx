import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import "../../styles/components/doctorHeader.css";

const DoctorHeader = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 4 && hour < 12) {
      return t("good_morning");
    } else if (hour >= 12 && hour < 17) {
      return t("good_afternoon");
    } else if (hour >= 17 && hour < 21) {
      return t("good_evening");
    } else {
      return t("good_night");
    }
  };

  const currentDateTime = () => {
    const now = new Date();
    const locale = i18n.language === "zh" ? "zh-HK" : "en-US";

    const options = { weekday: "long", month: "long", day: "numeric" };
    const datePart = now.toLocaleDateString(locale, options);
    const timePart = now.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return `${datePart} · ${timePart}`;
  };

  return (
    <div className="doctor-header">
      <div className="doctor-header-left">
        <img
          src="https://headshots-inc.com/wp-content/uploads/2021/01/Professional-Headshot-Examples-31-1.jpg"
          alt="Dr. Sarah Johnson"
          className="doctor-header-avatar"
        />
        <div className="doctor-header-info">
          <div className="doctor-header-name h4">Dr. Sarah Johnson </div>
          <div className="doctor-header-department caption">
            Cardiology Department
          </div>
        </div>
      </div>
      <button className="bell-button" aria-label={t("notifications")}>
        <span className="material-symbols-rounded notify">notifications</span>
      </button>
    </div>
  );
};

export default DoctorHeader;
