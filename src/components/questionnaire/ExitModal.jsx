import React, { useEffect, useRef } from "react";

export default function ExitModal({ onClose, onExit }) {
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
        aria-labelledby="exit-modal-title"
        aria-describedby="exit-modal-desc"
      >
        <div className="modal-header">
          <span className="material-symbols-rounded warning-icon" aria-hidden="true">warning</span>
          <h3 className="h3" id="exit-modal-title">Leave Questionnaire?</h3>
        </div>

        <div className="modal-content" id="exit-modal-desc">
          <p className="body">
            You have unsaved changes. If you exit now, your progress will be lost.
            Don't worry, you can always come back later to continue.
          </p>
        </div>

        <div className="modal-actions">
          <button className="caption secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="caption primary" onClick={onExit}>
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
