import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { initialsOf } from "../../utils/timeAgo";
import "../../styles/components/doctorHeader.css";

const DoctorHeader = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="doctor-header">
      <div className="doctor-header-left">
        <div className="doctor-header-avatar doctor-header-avatar--initials" aria-hidden="true">
          {initialsOf(user?.name)}
        </div>
        <div className="doctor-header-info">
          <div className="doctor-header-name h4">{user?.name || t("doctor")}</div>
          <div className="doctor-header-department caption">
            {[user?.specialty, user?.hospital].filter(Boolean).join(" · ") || t("clinician")}
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
