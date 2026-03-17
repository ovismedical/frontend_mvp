import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import "../../styles/components/patientHeader.css";

const PatientHeader = () => {
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
    <div className="user-header">
      <div className="user-header__text h4">
        <div className="greeting">
          {getGreeting()},{" "}
          <span className="username">{user?.name || t("user")}</span>
        </div>
        <div className="datetime caption">{currentDateTime()}</div>
      </div>
      <button className="bell-button" aria-label={t("notifications")}>
        <span className="material-symbols-rounded notify">notifications</span>
      </button>
    </div>
  );
};

export default PatientHeader;
