/**
 * Questionnaire severity score utilities.
 * Maps enriched section severity scores (0–4) to design system tokens.
 */

export const getSeverityConfig = (score) => {
  if (score === null || score === undefined)
    return { color: "var(--text-300)", bg: "var(--neutral-100)", label: "N/A", semantic: "neutral" };
  if (score <= 1)
    return { color: "var(--success-600)", bg: "var(--success-50)", label: score === 0 ? "None" : "Mild", semantic: "success" };
  if (score === 2)
    return { color: "var(--warning-600)", bg: "var(--warning-50)", label: "Moderate", semantic: "warning" };
  if (score === 3)
    return { color: "var(--warning-700)", bg: "var(--warning-50)", label: "Significant", semantic: "warning" };
  return { color: "var(--error-600)", bg: "var(--error-50)", label: "Severe", semantic: "error" };
};

const SECTION_ICONS = {
  SN001: "restaurant",
  SN002: "wc",
  SN003: "coronavirus",
  SN004: "lungs",
  SN005: "water_drop",
  SN006: "bedtime",
  SN007: "battery_alert",
  SN008: "sick",
  SN009: "heat",
  SN010: "female",
  SN011: "sentiment_stressed",
  SN012: "rheumatology",
  SN013: "accessibility_new",
};

export const getSectionIcon = (sectionId) =>
  SECTION_ICONS[sectionId] || "health_and_safety";
