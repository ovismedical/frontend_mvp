import React from "react";
import { useTranslation } from "react-i18next";
import WeeklyProgressRow from "../../components/ui/weekly_ProgressRow";
import SmartInsightCard from "../../components/ui/smartInsightCard";

const WeeklyDashboard = () => {
  const { t, i18n } = useTranslation();

  // Backend Handling: Fetch weekly summary data from backend (wellnessScore, engagementLevel, moodTrend, bestDay, challengingDay)
  const wellnessScore = {
    value: 4.2,
    trend: "downward", // or 'upward'
    change: 4.1,
  };

  const engagementLevel = {
    value: 8,
    trend: "upward", // or 'downward'
    change: 2.5,
  };

  const moodTrend = {
    mon: 1,
    tue: 2,
    wed: 4,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
    status: "Improving",
  };

  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const maxMood = Math.max(...days.map((day) => moodTrend[day]));

  const getMoodShade = (value) => {
    if (value === 0) return "shade-0";
    if (value <= 1) return "shade-1";
    if (value <= 2) return "shade-2";
    if (value <= 3) return "shade-3";
    if (value <= 4) return "shade-4";
    return "shade-5";
  };

  const bestDayDate = new Date(2025, 0, 15).toLocaleDateString(
    i18n.language === "zh" ? "zh-CN" : "en-US",
    { weekday: "long", month: "short", day: "numeric" }
  );

  const challengingDayDate = new Date(2025, 0, 13).toLocaleDateString(
    i18n.language === "zh" ? "zh-CN" : "en-US",
    { weekday: "long", month: "short", day: "numeric" }
  );

  const getMoodStatus = (status) => {
    switch (status) {
      case "Improving":
        return t("improving");
      case "Declining":
        return t("declining");
      default:
        return t("stable");
    }
  };

  return (
    <div className="weekly-dashboard-content">
      <div className="current-streak-container">
        <div className="current-streak-row">
          <h2 className="current-streak-title h4">{t("current_streak")}</h2>
          <div className="current-streak-value">
            <span className="material-symbols-rounded streak-icon">
              local_fire_department
            </span>
            <span className="streak-label body-semibold">2 {t("days")}</span>
          </div>
        </div>
        <div className="weekly-progress-row">
          <WeeklyProgressRow labelFormat="full" labelPosition="above" />
        </div>
        <div className="current-streak-caption caption">
          {t("keep_it_up_message")}
        </div>
      </div>

      <div className="weekly-summary-container">
        <h2 className="weekly-summary-title h4">{t("weekly_summary")}</h2>

        <div className="weekly-summary-row">
          <div className="wellness-score-card">
            <span
              className={`wellness-score-value h4 ${
                wellnessScore.trend === "downward" ? "downward" : "upward"
              }`}
            >
              {wellnessScore.value}
            </span>
            <h3 className="wellness-score-title body">{t("wellness_score")}</h3>
            <div className="wellness-score-caption-container">
              <span
                className={`material-symbols-rounded caption-icon ${
                  wellnessScore.trend === "downward" ? "downward" : "upward"
                }`}
              >
                {wellnessScore.trend === "downward"
                  ? "arrow_downward_alt"
                  : "arrow_upward_alt"}
              </span>
              <span className="wellness-score-caption caption">
                {t("vs_last_week", { value: wellnessScore.change })}
              </span>
            </div>
          </div>

          <div className="engagement-level-card">
            <span
              className={`engagement-level-value h4 ${
                engagementLevel.trend === "downward" ? "downward" : "upward"
              }`}
            >
              {engagementLevel.value}
            </span>
            <h3 className="engagement-level-title body">
              {t("engagement_level")}
            </h3>
            <div className="engagement-level-caption-container">
              <span
                className={`material-symbols-rounded caption-icon ${
                  engagementLevel.trend === "downward" ? "downward" : "upward"
                }`}
              >
                {engagementLevel.trend === "downward"
                  ? "arrow_downward_alt"
                  : "arrow_upward_alt"}
              </span>
              <span className="engagement-level-caption caption">
                {t("vs_last_week", { value: engagementLevel.change })}
              </span>
            </div>
          </div>
        </div>

        <div className="mood-trend-container">
          <div className="mood-trend-header">
            <span className="mood-trend-title h4">{t("mood_trend")}</span>
            <span className={`mood-trend-status ${moodTrend.status} caption`}>
              {getMoodStatus(moodTrend.status)}
              <span
                className={`material-symbols-rounded mood-trend-arrow ${
                  moodTrend.status === "Improving" ? "upward" : "downward"
                }`}
              >
                {moodTrend.status === "Improving"
                  ? "trending_up"
                  : "trending_down"}
              </span>
            </span>
          </div>
          <div className="mood-trend-bar-chart">
            {days.map((day) => {
              const value = moodTrend[day];
              const height = `${(value / (maxMood || 1)) * 100}%`;
              return (
                <div key={day} className="mood-trend-bar-wrapper">
                  <div
                    className={`mood-trend-bar ${getMoodShade(value)}`}
                    style={{
                      height,
                    }}
                  ></div>
                  <span className="mood-trend-day-label overline-timestamp">
                    {t(day)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="weekly-summary-days">
        <div className="weekly-summary-bestDay">
          <div className="weekly-summary-day-left">
            <span className="weekly-summary-bestDay-dayIcon">
              <span className="material-symbols-rounded family_star">
                family_star
              </span>
            </span>
            <div className="weekly-summary-day-text">
              <h4 className="weekly-summary-bestDay-title h4">
                {t("best_day")}
              </h4>
              <p className="weekly-summary-bestDay-date body">{bestDayDate}</p>
            </div>
          </div>
          <p className="weekly-summary-bestDay-summary caption">
            {t("best_day_summary")}
          </p>
        </div>

        <div className="weekly-summary-challengingDay">
          <div className="weekly-summary-day-left">
            <span className="weekly-summary-challengingDay-dayIcon">
              <span className="material-symbols-rounded swords">swords</span>
            </span>
            <div className="weekly-summary-day-text">
              <h4 className="weekly-summary-challengingDay-title h4">
                {t("challenging_day")}
              </h4>
              <p className="weekly-summary-challengingDay-date body">
                {challengingDayDate}
              </p>
            </div>
          </div>
          <p className="weekly-summary-challengingDay-summary caption">
            {t("challenging_day_summary")}
          </p>
        </div>
      </div>

      <div className="weekly-smart-insight">
        <h2 className="weekly-insights-title h4">{t("smart_insights")}</h2>
        <SmartInsightCard
          icon="sentiment_satisfied"
          title={t("mood_sleep_link_detected")}
          description={t("mood_sleep_link_description")}
          insightType="info"
        />
        <SmartInsightCard
          icon="warning"
          title={t("low_activity_detected")}
          description={t("low_activity_description")}
          insightType="warning"
        />
        <SmartInsightCard
          icon="celebration"
          title={t("mood_boost")}
          description={t("mood_boost_description")}
          insightType="success"
        />
        <SmartInsightCard
          icon="error"
          title={t("missed_medication")}
          description={t("missed_medication_description")}
          insightType="error"
        />
      </div>
    </div>
  );
};

export default WeeklyDashboard;
