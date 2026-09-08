import React, { useEffect, useState } from "react";
import { symptomQuestionnaireAPI, analyticsAPI } from "../../utils/api";
import { checkedInDays, mondayIndex } from "../../utils/weekProgress";
import "../../styles/components/weekly_progressRow.css";

const DAYS = [
  { labelShort: "M", labelFull: "Mon" },
  { labelShort: "T", labelFull: "Tue" },
  { labelShort: "W", labelFull: "Wed" },
  { labelShort: "T", labelFull: "Thu" },
  { labelShort: "F", labelFull: "Fri" },
  { labelShort: "S", labelFull: "Sat" },
  { labelShort: "S", labelFull: "Sun" },
];

const ProgressRow = ({ labelFormat = "short", labelPosition = "below", checkedIndexes = null }) => {
  const [fetched, setFetched] = useState(new Set());

  useEffect(() => {
    if (checkedIndexes) return undefined;
    let cancelled = false;
    (async () => {
      const [history, unified] = await Promise.allSettled([
        symptomQuestionnaireAPI.getHistory(30),
        analyticsAPI.getUnifiedAssessments(),
      ]);
      if (cancelled) return;
      const timestamps = [];
      if (history.status === "fulfilled") {
        (history.value?.history || []).forEach((h) => timestamps.push(h.timestamp || h.submitted_at));
      }
      if (unified.status === "fulfilled") {
        (unified.value?.assessments || []).forEach((a) => timestamps.push(a.date));
      }
      setFetched(checkedInDays(timestamps));
    })();
    return () => { cancelled = true; };
  }, [checkedIndexes]);

  const checked = checkedIndexes ? new Set(checkedIndexes) : fetched;
  const todayIndex = mondayIndex(new Date());
  const getLabel = (day) => (labelFormat === "short" ? day.labelShort : day.labelFull);

  return (
    <div className="progress-row">
      {DAYS.map((day, index) => {
        const isChecked = checked.has(index);
        const isToday = index === todayIndex;
        const isPast = index < todayIndex;

        let statusClass = "upcoming";
        if (isChecked) statusClass = "checked";
        else if (isToday) statusClass = "today";
        else if (isPast) statusClass = "missed";

        return (
          <div key={index} className="day-card">
            {labelPosition === "above" && <span className="day-label overline">{getLabel(day)}</span>}
            <span className={`material-symbols-rounded day-icon ${statusClass}`}>
              {isChecked ? "check_circle" : "circle"}
            </span>
            {labelPosition === "below" && <span className="day-label overline">{getLabel(day)}</span>}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressRow;
