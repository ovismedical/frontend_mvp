import React from "react";
import { useTranslation } from "react-i18next";
import "../../styles/components/patientCards.css";

const PatientCard = ({
  image,
  name,
  cancerType,
  stage,
  subtitle,
  status,
  onEditStage,
  onGenerateReport,
}) => {
  const { t } = useTranslation();
  const initials = (name || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || "").join("") || "?";

  // Always use the English value for logic
  const getStatusMeta = (stageObj) => {
    const s =
      typeof stageObj === "object"
        ? (stageObj.en || "").toLowerCase()
        : (stageObj || "").toLowerCase();

    if (!s) return { label: t("status_unknown"), icon: "help", color: "gray" };

    if (s === "ned" || s.includes("remission") || s.includes("survivorship")) {
      return {
        label: t("status_completed"),
        icon: "check_circle",
        color: "var(--neutral-500)",
        backgroundColor: "var(--neutral-100)",
      };
    }

    if (
      s.includes("stage iv") ||
      s.includes("refractory") ||
      s.includes("end-of-life") ||
      s.includes("palliative")
    ) {
      return {
        label: t("status_critical"),
        icon: "emergency",
        color: "var(--error-700)",
        backgroundColor: "var(--error-100)",
      };
    }

    if (
      s.includes("stage iii") ||
      s.includes("progressive") ||
      s.includes("relapse") ||
      s.includes("recurrence")
    ) {
      return {
        label: t("status_at_risk"),
        icon: "warning",
        color: "var(--on-secondary-tint)",
        backgroundColor: "var(--secondary-100)",
      };
    }

    if (
      s.includes("stage 0") ||
      s.includes("stage i") ||
      s.includes("stage ii") ||
      s.includes("diagnostic") ||
      s.includes("staging phase")
    ) {
      return {
        label: t("status_active_treatment"),
        icon: "timeline",
        color: "var(--success-700)",
        backgroundColor: "var(--success-100)",
      };
    }

    if (
      s.includes("acute phase") ||
      s.includes("chronic phase") ||
      s.includes("maintenance") ||
      s.includes("follow-up")
    ) {
      return {
        label: t("status_ongoing_care"),
        icon: "autorenew",
        color: "var(--blue-700)",
        backgroundColor: "var(--blue-100)",
      };
    }

    return {
      label: t("status_unknown"),
      icon: "help",
      color: "var(--neutral-500)",
      backgroundColor: "var(--neutral-100)",
    };
  };

  // Use the English value for status logic (unless the caller supplies a ready-made status)
  const { label, icon, color, backgroundColor } = status || getStatusMeta(stage);

  // For display, show translated value if available
  const displayStage =
    typeof stage === "object"
      ? stage[window.i18next?.language] || stage.en
      : stage;

  return (
    <div className="patient-card">
      {/* Left Section */}
      <div className="patient-card-left">
        {image ? (
          <img src={image} alt={name} className="patient-card-image" />
        ) : (
          <div className="patient-card-image patient-card-image--initials" aria-hidden="true">{initials}</div>
        )}
        <div className="patient-card-info">
          <h3 className="patient-card-name h4">{name}</h3>
          <p className="patient-card-diagnosis body">
            {subtitle ?? `${cancerType} - ${displayStage}`}
          </p>
          <p className="patient-card-status caption" style={{ color }}>
            {label}
            <span
              className="material-symbols-rounded status-icon"
              style={{ color, backgroundColor }}
            >
              {icon}
            </span>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="patient-card-actions">
        {onGenerateReport && (
          <button className="action-btn" onClick={onGenerateReport}>
            <span className="material-symbols-rounded">file_save</span>
          </button>
        )}
        {onEditStage && (
          <button className="action-btn" onClick={onEditStage}>
            <span className="material-symbols-rounded">person_edit</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientCard;
