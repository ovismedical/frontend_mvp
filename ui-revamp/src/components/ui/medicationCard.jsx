import React, { use } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/components/medicationCard.css";

const MedicationCard = ({
  image,
  name = "Medication Name",
  description = "Description",
  progress = 0,
  status = "default",
  medicationData = null,
}) => {
  const navigate = useNavigate();
  const {t} = useTranslation();

  const handleCardClick = () => {
    if (medicationData && status !== "archived") {
      navigate("/medication_details", {
        state: { medication: medicationData },
      });
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case "nearExpiry":
        return {
          icon: "warning",
          text: t("expiring"),
          showProgress: true,
          progressColor: "var(--secondary-500)",
          progressBG: "var(--secondary-100)",
          statusColor: "var(--secondary-500)",
          showChevron: true,
        };
      case "expired":
        return {
          icon: "cancel",
          text: t("expired"),
          showProgress: true,
          progressColor: "var(--error-400)",
          progressBG: "var(--error-100)",
          statusColor: "var(--error-400)",
          showChevron: true,
        };
      case "archived":
        return {
          icon: null,
          text: null,
          showProgress: false,
          progressColor: null,
          statusColor: null,
          showChevron: false,
        };
      default:
        return {
          icon: null,
          text: null,
          showProgress: true,
          progressColor: "var(--blue-700)",
          progressBG: "var(--blue-100)",
          statusColor: null,
          showChevron: true,
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div
      className="med-card"
      onClick={handleCardClick}
      style={{ cursor: statusConfig.showChevron ? "pointer" : "default" }}
    >
      <div className="med-card-content">
        <div className="med-card-img-wrap">
          <img src={image} alt="Medication" className="med-card-img" />
        </div>

        <div className="med-card-info">
          <div className="med-card-text-group">
            <h4 className="med-card-name body">{name}</h4>
            <div className="med-card-row">
              <p className="med-card-description caption">{description}</p>
              {statusConfig.icon && (
                <div
                  className="med-card-status"
                  style={{ color: statusConfig.statusColor }}
                >
                  <span
                    className={`material-symbols-rounded ${
                      statusConfig.icon === "warning" ? "warning" : "cancel"
                    }`}
                  >
                    {statusConfig.icon}
                  </span>
                  <span className="med-card-status-text caption">
                    {statusConfig.text}
                  </span>
                </div>
              )}
            </div>
          </div>
          {statusConfig.showChevron && (
            <span className="material-symbols-rounded chevron_right">
              chevron_right
            </span>
          )}
        </div>
      </div>

      {statusConfig.showProgress && (
        <div className="med-card-progress">
          <div
            className="med-card-progress-bar"
            style={{
              backgroundColor: statusConfig.progressBG,
            }}
          >
            <div
              className="med-card-progress-fill"
              style={{
                width: `${progress}%`,
                backgroundColor: statusConfig.progressColor,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationCard;
