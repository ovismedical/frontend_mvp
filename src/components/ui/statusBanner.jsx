import React from "react";
import { useTranslation } from "react-i18next";
import "../../styles/components/statusBanner.css";

/**
 * Honest labelling for surfaces that aren't wired to the clinical record yet.
 *  - variant="sample"      : the screen shows illustrative placeholder data
 *  - variant="coming-soon" : the feature isn't built yet; controls are inert
 */
const StatusBanner = ({ variant = "coming-soon", title, message, messageKey, compact = false }) => {
  const { t } = useTranslation();
  const isSample = variant === "sample";
  return (
    <div
      className={`status-banner status-banner--${variant}${compact ? " status-banner--compact" : ""}`}
      role="note"
      data-testid={`status-banner-${variant}`}
    >
      <span className="material-symbols-rounded status-banner-icon" aria-hidden="true">
        {isSample ? "science" : "construction"}
      </span>
      <div className="status-banner-text">
        <strong className="caption">{title || t(isSample ? "sample_data" : "coming_soon")}</strong>
        {!compact && <p className="caption">{message || t(messageKey || (isSample ? "sample_data_message" : "coming_soon_message"))}</p>}
      </div>
    </div>
  );
};

export default StatusBanner;
