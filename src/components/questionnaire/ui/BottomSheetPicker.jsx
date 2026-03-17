import React, { useEffect, useRef } from 'react';
import { vibrate } from '../../../utils/mobile';

export default function BottomSheetPicker({ isOpen, onClose, options, value, onChange, label }) {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prevOverflow; };
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap + restore
  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement;
    const firstFocusable = containerRef.current?.querySelector('button');
    firstFocusable?.focus();

    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      const focusable = containerRef.current?.querySelectorAll(
        'button, [tabindex]:not([tabindex="-1"])'
      );
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
    document.addEventListener("keydown", handleTab);
    return () => {
      document.removeEventListener("keydown", handleTab);
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (val) => {
    vibrate(10);
    onChange(val);
    onClose();
  };

  return (
    <div className="picker-overlay" onClick={onClose}>
      <div
        className="picker-container"
        onClick={e => e.stopPropagation()}
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <div className="picker-header">
          <span className="picker-title">{label}</span>
          <button className="picker-confirm" onClick={onClose} aria-label="Close picker">
            <span className="material-symbols-rounded" aria-hidden="true">close</span>
          </button>
        </div>
        <div className="picker-list" role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              key={option.value}
              className={`picker-item ${value === option.value ? 'selected' : ''}`}
              role="option"
              aria-selected={value === option.value}
              onClick={() => handleSelect(option.value)}
            >
              <span className="picker-item-label">{option.label}</span>
              {value === option.value && (
                <span className="material-symbols-rounded picker-check" aria-hidden="true">check</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
