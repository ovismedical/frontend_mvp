/**
 * Shared triage alert-level configuration utility.
 * Returns i18n keys (not translated strings) so consumers call t() themselves.
 */

export const getAlertLevelConfig = (level) => {
  switch (level) {
    case "GREEN":
      return {
        icon: "check_circle",
        color: "success",
        titleKey: "all_good",
        descriptionKey: "symptoms_within_normal",
      };
    case "YELLOW":
      return {
        icon: "info",
        color: "info",
        titleKey: "monitor_closely",
        descriptionKey: "keep_tracking_symptoms",
      };
    case "ORANGE":
      return {
        icon: "warning",
        color: "warning",
        titleKey: "attention_needed",
        descriptionKey: "consider_followup",
      };
    case "RED":
      return {
        icon: "error",
        color: "error",
        titleKey: "urgent_care",
        descriptionKey: "contact_healthcare_provider",
      };
    default:
      return {
        icon: "help",
        color: "info",
        titleKey: "assessment_pending",
        descriptionKey: "assessment_being_reviewed",
      };
  }
};
