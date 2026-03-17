import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../styles/components/lockedBadgeModal.css";
import Button from "./button";

const LockedBadgeModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="locked-modal-overlay">
      <div className="locked-modal-content">
        <button className="locked-modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="locked-modal-icon">
          <span className="material-symbols-rounded lock-icon">lock</span>
        </div>
        <h2 className="locked-modal-title h3">{t("locked")}</h2>
        <p className="locked-modal-text body">
          {t("locked_badge_description")}
        </p>
        <Button
          className="locked-modal-button caption"
          onClick={() => navigate("/help_center")}
        >
          {t("how_to_rank_up")}
        </Button>
      </div>
    </div>
  );
};

export default LockedBadgeModal;
