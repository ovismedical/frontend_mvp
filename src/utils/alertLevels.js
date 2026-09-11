// Shared alert-level presentation for the clinician views.
//
// Florence's triage produces GREEN / YELLOW / ORANGE / RED. A record whose AI
// assessment was refused by the inference gate carries PENDING_REVIEW until a
// clinician assigns a level; a clinician can also override a Florence level.
// The backend reports the level after any override as `effective_alert_level`.

export const PENDING_REVIEW = "PENDING_REVIEW";
export const PENDING_REVIEW_STATUS = "pending_clinician_review";

/** Clinical levels a clinician can assign, lowest to highest urgency. */
export const ALERT_LEVELS = ["GREEN", "YELLOW", "ORANGE", "RED"];

export const ALERT_STYLE = {
  RED: { color: "var(--error-700)", backgroundColor: "var(--error-100)", icon: "emergency", labelKey: "status_critical" },
  ORANGE: { color: "var(--on-secondary-tint)", backgroundColor: "var(--secondary-100)", icon: "warning", labelKey: "status_at_risk" },
  YELLOW: { color: "var(--warning-700, #b45309)", backgroundColor: "var(--warning-100, #fef3c7)", icon: "error_outline", labelKey: "status_at_risk" },
  GREEN: { color: "var(--success-700)", backgroundColor: "var(--success-100)", icon: "check_circle", labelKey: "status_completed" },
  PENDING_REVIEW: { color: "var(--on-neutral-tint, var(--neutral-800))", backgroundColor: "var(--neutral-100)", icon: "pending", labelKey: "needs_review" },
};

export const UNKNOWN_STYLE = { color: "var(--neutral-500)", backgroundColor: "var(--neutral-100)", icon: "help", labelKey: "status_unknown" };

export const alertStyle = (level) => ALERT_STYLE[level] || UNKNOWN_STYLE;

/**
 * Level to display for an assessment record. Prefers the backend's
 * `effective_alert_level` (Florence level after any clinician override) and
 * falls back to the legacy fields so a backend without the review feature
 * still renders its levels.
 */
export const effectiveLevel = (a) =>
  a?.effective_alert_level ?? a?.alert_level ?? a?.triage_assessment?.alert_level ?? null;

/** Visible text for a level code: the neutral "Needs review" label for PENDING_REVIEW, else the code itself. */
export const levelText = (level, t) => (level === PENDING_REVIEW ? t("needs_review") : level);

/** True when the record is waiting for a clinician to assign a level (no Florence triage to agree with). */
export const isPendingReview = (a) => a?.triage_status === PENDING_REVIEW_STATUS;
