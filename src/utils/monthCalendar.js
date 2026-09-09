/** Severity 1-5 (avg per day) -> legend bucket. */
export const severityBucket = (avg) => {
  if (avg == null || avg <= 0) return "not-logged";
  if (avg < 2) return "mild";
  if (avg < 3.5) return "moderate";
  return "severe";
};

/** Whole months between the shown month and now (0 = this month, 1 = last month, ...). */
export const monthOffsetFrom = (date, now = new Date()) =>
  (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
