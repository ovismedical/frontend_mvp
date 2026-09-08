import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { analyticsAPI } from "../../utils/api";
import "../../styles/components/wellnessCard.css";

/** Wellness = 100 when no symptoms, down 20 points per severity point (1-5 scale). */
const wellnessFromSeverity = (avgSeverity) =>
  avgSeverity == null || avgSeverity <= 0 ? null : Math.max(0, Math.round((100 - avgSeverity * 20) * 10) / 10);

const meanOf = (values) => (values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : null);

const buildWeekly = (current, previous, t) => {
  const labels = [t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat"), t("sun")];
  const daily = current?.dailyData || [];
  const data = labels.map((day, i) => {
    const d = daily[i];
    const value = d?.hasData ? wellnessFromSeverity(d.avgSeverity) : null;
    return { day, value };
  });
  const score = meanOf(data.map((d) => d.value).filter((v) => v != null));
  const prevScore = meanOf((previous?.dailyData || []).map((d) => (d.hasData ? wellnessFromSeverity(d.avgSeverity) : null)).filter((v) => v != null));
  return { data, score, prevScore, insights: (current?.insights || []).filter((i) => i.id !== "no_data").length, total: current?.totalAssessments || 0 };
};

const buildMonthly = (current, previous, t) => {
  const severityByDay = current?.severityByDay || {};
  const weeks = [[], [], [], []];
  Object.entries(severityByDay).forEach(([day, severity]) => {
    const idx = Math.min(3, Math.floor((Number(day) - 1) / 7));
    const value = wellnessFromSeverity(severity);
    if (value != null) weeks[idx].push(value);
  });
  const data = weeks.map((values, i) => ({ day: t(`week_${i + 1}`), value: meanOf(values) }));
  const score = meanOf(data.map((d) => d.value).filter((v) => v != null));
  const prevScore = meanOf(Object.values(previous?.severityByDay || {}).map(wellnessFromSeverity).filter((v) => v != null));
  return { data, score, prevScore, insights: Object.keys(current?.alertsByDay || {}).length, total: current?.totalAssessments || 0 };
};

const WellnessScoreCard = () => {
  const { t } = useTranslation();
  const [selectedRange, setSelectedRange] = useState("Weekly");
  const [showDropdown, setShowDropdown] = useState(false);
  const [ranges, setRanges] = useState({ Weekly: null, Monthly: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [w0, w1, m0, m1] = await Promise.allSettled([
        analyticsAPI.getWeeklyAnalytics(0),
        analyticsAPI.getWeeklyAnalytics(1),
        analyticsAPI.getMonthlyAnalytics(0),
        analyticsAPI.getMonthlyAnalytics(1),
      ]);
      if (cancelled) return;
      const val = (r) => (r.status === "fulfilled" ? r.value?.data : null);
      setRanges({
        Weekly: buildWeekly(val(w0), val(w1), t),
        Monthly: buildMonthly(val(m0), val(m1), t),
      });
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [t]);

  const blueShades = ["--blue-400", "--blue-500", "--blue-600", "--blue-700", "--blue-800"];
  const timeRanges = [
    { key: "Weekly", label: t("weekly") },
    { key: "Monthly", label: t("monthly") },
  ];

  const current = ranges[selectedRange] || { data: [], score: null, prevScore: null, insights: 0, total: 0 };
  const { data, score, prevScore, insights, total } = current;
  const delta = score != null && prevScore != null ? Math.round((score - prevScore) * 10) / 10 : null;
  const maxValue = Math.max(...data.map((d) => d.value ?? 0), 1);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const handleSelect = (range) => {
    setSelectedRange(range);
    setShowDropdown(false);
  };

  return (
    <div className="wellness-card">
      <div className="wellness-header">
        <div className="score-container">
          <div className="score">
            <span className="material-symbols-rounded star-icon">stars_2</span>
            <span className="score-value h4">{loading ? "…" : score ?? "—"}</span>
          </div>
          <div className="score-subtitle body">{t("your_wellness_score")}</div>
        </div>

        <div className="dropdown-wrapper">
          <div className="dropdown" onClick={toggleDropdown}>
            <span className="material-symbols-rounded date_range">date_range</span>
            <span className="dropdown-text caption">
              {timeRanges.find((range) => range.key === selectedRange)?.label}
            </span>
            <span className="material-symbols-rounded expand_more">expand_more</span>
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              {timeRanges.map((range) => (
                <div
                  key={range.key}
                  className={`dropdown-item ${selectedRange === range.key ? "active" : ""}`}
                  onClick={() => handleSelect(range.key)}
                >
                  {range.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bar-chart">
        {data.map((item, index) => {
          const hasValue = item.value != null;
          const height = hasValue ? Math.max(8, (item.value / maxValue) * 100) : 6;
          const shadeVar = blueShades[Math.min(blueShades.length - 1, Math.floor((height / 100) * (blueShades.length - 1)))];
          return (
            <div key={index} className="bar-container" title={hasValue ? `${item.day}: ${item.value}` : `${item.day}: ${t("no_data")}`}>
              <div
                className="chart_bar"
                style={{
                  height: `${height}px`,
                  backgroundColor: hasValue ? `var(${shadeVar})` : "var(--neutral-200, #e2e8f0)",
                }}
              ></div>
              <span className="bar-label">{item.day}</span>
            </div>
          );
        })}
      </div>

      <div className="footer">
        <div className="change">
          {delta == null ? (
            <span className="percent-label caption">
              {total === 0 ? t("wellness_no_data") : t("wellness_need_more_data")}
            </span>
          ) : (
            <>
              <span className={`material-symbols-rounded ${delta < 0 ? "down-icon" : "up-icon"}`}>
                {delta < 0 ? "trending_down" : "trending_up"}
              </span>
              <span className="percent caption">
                {delta > 0 ? "+" : ""}
                {delta}
              </span>
              <span className="percent-label caption">
                {t("vs_last")} {timeRanges.find((range) => range.key === selectedRange)?.label.toLowerCase()}
              </span>
            </>
          )}
        </div>
        <div className="insights">
          <span className="material-symbols-rounded emoji-objects">emoji_objects</span>
          <span className="insight-count caption">
            {insights} {t("insights")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WellnessScoreCard;
