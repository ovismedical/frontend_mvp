/** Relative time ("Just now", "5 min ago", "2 days ago") via the shared i18n keys. */
export const timeAgo = (timestamp, t) => {
  if (!timestamp) return t("no_data");
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return String(timestamp);
  const diffMins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMins < 1) return t("just_now");
  if (diffMins < 60) return t("min_ago", { count: diffMins });
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return t(diffHrs === 1 ? "hour_ago" : "hours_ago", { count: diffHrs });
  const diffDays = Math.floor(diffHrs / 24);
  return t(diffDays === 1 ? "day_ago" : "days_ago", { count: diffDays });
};

/** "MM/DD/YYYY" for today in the browser's timezone, matching the backend's last_completion format. */
export const todayKey = () => {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
};

export const initialsOf = (name = "") =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?";
