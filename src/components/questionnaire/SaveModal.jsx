import React, { useEffect, useRef } from "react";

export default function SaveModal({ onClose, onConfirm }) {
  const boxRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    // Focus trap
    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      const focusable = boxRef.current?.querySelectorAll("button");
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleTab);
    boxRef.current?.querySelector("button")?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleTab);
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div
        className="modal-box"
        ref={boxRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="save-modal-title"
        aria-describedby="save-modal-desc"
      >
        <div className="modal-header">
          <span className="material-symbols-rounded success-icon" aria-hidden="true">check_circle</span>
          <h3 className="h3" id="save-modal-title">Questionnaire Saved Successfully!</h3>
        </div>

        <div className="modal-content" id="save-modal-desc">
          <p className="body">
            Your symptom questionnaire has been saved and submitted.
            You can view your report in the dashboard.
          </p>
        </div>

        <div className="modal-actions">
          <button className="caption secondary" onClick={onClose}>
            Close
          </button>
          <button className="caption primary" onClick={onConfirm}>
            View Report
          </button>
        </div>
      </div>
    </div>
  );
}
