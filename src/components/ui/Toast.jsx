import React, { useState, useEffect, useCallback } from "react";

const TOAST_DURATION = 4000;

export default function Toast({ message, variant = "success", onDismiss }) {
  const [visible, setVisible] = useState(true);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(() => onDismiss?.(), 300); // wait for exit animation
  }, [onDismiss]);

  useEffect(() => {
    const timer = setTimeout(close, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [close]);

  const icon = variant === "success" ? "check_circle" : "error";

  return (
    <div className={`toast toast-${variant} ${visible ? "toast-enter" : "toast-exit"}`}>
      <span className="material-symbols-rounded toast-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="toast-message">{message}</span>
      <button type="button" className="toast-dismiss" onClick={close} aria-label="Dismiss">
        <span className="material-symbols-rounded" aria-hidden="true">
          close
        </span>
      </button>
    </div>
  );
}

/* The live region is rendered once and always present, so assistive tech is already
   observing it when a toast arrives. Errors are assertive; confirmations are polite. */
function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      <div aria-live="polite" aria-atomic="false" className="toast-live-region">
        {toasts
          .filter((t) => t.variant !== "error")
          .map((t) => (
            <Toast
              key={t.id}
              message={t.message}
              variant={t.variant}
              onDismiss={() => onDismiss(t.id)}
            />
          ))}
      </div>
      <div aria-live="assertive" aria-atomic="false" className="toast-live-region">
        {toasts
          .filter((t) => t.variant === "error")
          .map((t) => (
            <Toast
              key={t.id}
              message={t.message}
              variant={t.variant}
              onDismiss={() => onDismiss(t.id)}
            />
          ))}
      </div>
    </div>
  );
}

// Hook for managing toast state
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, variant = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Bound to state via props rather than closed over inside a new component identity —
  // defining the component inline remounted every toast on each render of the host.
  const BoundContainer = useCallback(
    () => <ToastContainer toasts={toasts} onDismiss={dismissToast} />,
    [toasts, dismissToast]
  );

  return { showToast, ToastContainer: BoundContainer };
}
