import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/components/monthlyCalendar.css";
import { analyticsAPI } from "../../utils/api";
import { severityBucket, monthOffsetFrom } from "../../utils/monthCalendar";

const MonthlyCalendar = ({ onMonthData }) => {
  const { t, i18n } = useTranslation();
  const [activeMonth, setActiveMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [monthData, setMonthData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch analytics for whichever month is on screen
  useEffect(() => {
    let cancelled = false;
    const offset = monthOffsetFrom(activeMonth);
    setLoading(true);
    if (offset < 0) {
      setMonthData(null);
      setLoading(false);
      return undefined;
    }
    analyticsAPI
      .getMonthlyAnalytics(offset)
      .then((res) => {
        if (cancelled) return;
        setMonthData(res?.data || null);
        onMonthData?.(res?.data || null);
      })
      .catch(() => { if (!cancelled) setMonthData(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeMonth, onMonthData]);

  const dayBuckets = useMemo(() => {
    const buckets = {};
    const severity = monthData?.severityByDay || {};
    const alerts = monthData?.alertsByDay || {};
    Object.entries(severity).forEach(([day, avg]) => { buckets[Number(day)] = severityBucket(avg); });
    Object.keys(alerts).forEach((day) => { if (alerts[day] > 0) buckets[Number(day)] = "severe"; });
    return buckets;
  }, [monthData]);

  const getTileClass = ({ date, view }) => {
    if (view !== "month") return "";
    const sameMonth = date.getMonth() === activeMonth.getMonth() && date.getFullYear() === activeMonth.getFullYear();
    if (!sameMonth) return "not-logged outside-month";
    return dayBuckets[date.getDate()] || "not-logged";
  };

  const calendarLocale = i18n.language === "zh" ? "zh-HK" : "en-GB";

  return (
    <div className={`calendar-container${loading ? " is-loading" : ""}`}>
      <Calendar
        value={null}
        activeStartDate={activeMonth}
        onActiveStartDateChange={({ activeStartDate, view }) => {
          if (view === "month" && activeStartDate) setActiveMonth(activeStartDate);
        }}
        maxDate={new Date()}
        tileClassName={getTileClass}
        locale={calendarLocale}
        navigationLabel={({ label }) => <span className="calendar-label h4">{label}</span>}
        prev2Label={<span className="icon-sm">«</span>}
        prevLabel={<span className="icon-sm">‹</span>}
        nextLabel={<span className="icon-sm">›</span>}
        next2Label={<span className="icon-sm">»</span>}
      />

      <div className="legend caption">
        <div><span className="legend-box mild"></span> {t("mild_symptoms")}</div>
        <div><span className="legend-box moderate"></span> {t("moderate_symptoms")}</div>
        <div><span className="legend-box severe"></span> {t("severe_symptoms")}</div>
        <div><span className="legend-box not-logged"></span> {t("not_logged")}</div>
      </div>
      {monthData && (
        <p className="caption calendar-summary">
          {t("month_calendar_summary", { count: monthData.totalAssessments || 0, alerts: monthData.totalAlerts || 0 })}
        </p>
      )}
    </div>
  );
};

export default MonthlyCalendar;
