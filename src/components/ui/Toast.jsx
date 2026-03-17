import React, { useState, useEffect, useCallback } from "react";

const TOAST_DURATION = 3000;

export default function Toast({ message, variant = "success", onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss?.(), 300); // wait for exit animation
    }, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icon = variant === "success" ? "check_circle" : "error";

  return (
    <div className={`toast toast-${variant} ${visible ? "toast-enter" : "toast-exit"}`}>
      <span className="material-symbols-rounded toast-icon">{icon}</span>
      <span className="toast-message">{message}</span>
    </div>
  );
}

// Hook for managing toast state
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, variant = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, variant }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const ToastContainer = () => (
    <div className="toast-container">
      {toasts.map(t => (
        <Toast
          key={t.id}
          message={t.message}
          variant={t.variant}
          onDismiss={() => dismissToast(t.id)}
        />
      ))}
    </div>
  );

  return { showToast, ToastContainer };
}
