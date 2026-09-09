import React from "react";
import { useTranslation } from "react-i18next";
import "../../styles/components/backButton.css";

/**
 * The back affordance appears on nearly every screen. It used to be a bare
 * `<span onClick>`: unreachable by keyboard, announced by screen readers as the raw
 * ligature "chevron_backward", and only as large as the 26px glyph. This renders a real
 * button with an accessible name and a 44px target, while keeping each screen's existing
 * class so the per-page sizing/colour rules still apply.
 */
export default function BackButton({ onClick, className = "", label, ...props }) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className={`back-button ${className}`.trim()}
      onClick={onClick}
      aria-label={label || t("back")}
      {...props}
    >
      <span className="material-symbols-rounded" aria-hidden="true">
        chevron_backward
      </span>
    </button>
  );
}
