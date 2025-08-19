import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/lockedBadgeModal.css";
import Button from "./button";

const LockedBadgeModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

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
        <h2 className="locked-modal-title h3">Locked!</h2>
        <p className="locked-modal-text body">
          Not all badges are available right away. As you make progress and
          reach higher ranks, new badges will unlock, giving you fresh goals to
          aim for and new milestones to celebrate.
        </p>
        <Button
          className="locked-modal-button caption"
          onClick={() => navigate("/help_center")}
        >
          How to Rank Up?
        </Button>
      </div>
    </div>
  );
};

export default LockedBadgeModal;
