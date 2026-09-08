// Monday-first index (0 = Mon … 6 = Sun) of a date, in the browser's timezone
export const mondayIndex = (date) => (date.getDay() + 6) % 7;

export const startOfWeek = (now = new Date()) => {
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - mondayIndex(now));
  return monday;
};

/** Which weekdays (Mon-first indexes) of the current week have a check-in or Florence chat. */
export const checkedInDays = (timestamps, now = new Date()) => {
  const monday = startOfWeek(now);
  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);
  const days = new Set();
  for (const ts of timestamps) {
    const d = new Date(ts);
    if (!isNaN(d) && d >= monday && d < nextMonday) days.add(mondayIndex(d));
  }
  return days;
};
