import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import WeeklyProgressRow from "../../../components/ui/weekly_ProgressRow";
import SmartInsightCard from "../../../components/ui/smartInsightCard";
import { symptomQuestionnaireAPI, questionsAPI, analyticsAPI } from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

const WeeklyDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [questionnaireHistory, setQuestionnaireHistory] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [weeklyData, setWeeklyData] = useState(null);

  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  // Derive display values from API data or use defaults
  const totalAssessments = weeklyData?.totalAssessments ?? 0;
  const overallTrend = weeklyData?.overallTrend ?? "No Data";

  // Build mood trend from dailyData (7 days of avgSeverity)
  const dailyData = weeklyData?.dailyData ?? [];
  const moodTrend = {};
  days.forEach((day, i) => {
    moodTrend[day] = dailyData[i]?.avgSeverity ?? 0;
  });
  const moodStatus = overallTrend === "Improving" ? "Improving"
    : overallTrend === "Concerning" ? "Declining"
    : "Stable";
  const maxMood = Math.max(...days.map((day) => moodTrend[day]), 1);

  const getMoodShade = (value) => {
    if (value === 0) return "shade-0";
    if (value <= 1) return "shade-1";
    if (value <= 2) return "shade-2";
    if (value <= 3) return "shade-3";
    if (value <= 4) return "shade-4";
    return "shade-5";
  };

  // Find best and most challenging days from dailyData
  const daysWithData = dailyData.filter((d) => d.hasData);
  const bestDay = daysWithData.length > 0
    ? daysWithData.reduce((a, b) => (a.avgSeverity <= b.avgSeverity ? a : b))
    : null;
  const challengingDay = daysWithData.length > 0
    ? daysWithData.reduce((a, b) => (a.avgSeverity >= b.avgSeverity ? a : b))
    : null;

  const formatDayDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr + "T12:00:00").toLocaleDateString(
      i18n.language === "zh" ? "zh-CN" : "en-US",
      { weekday: "long", month: "short", day: "numeric" }
    );
  };

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

  // Smart insights from backend
  const smartInsights = weeklyData?.insights ?? [];

  // Map backend insight types to SmartInsightCard insightType
  const mapInsightType = (type) => {
    switch (type) {
      case "critical": return "error";
      case "warning": return "warning";
      case "positive": return "success";
      default: return "info";
    }
  };

  // Map backend icon names (fa-*) to material icons
  const mapInsightIcon = (icon) => {
    if (icon?.includes("exclamation")) return "error";
    if (icon?.includes("heartbeat")) return "warning";
    if (icon?.includes("chart-line") || icon?.includes("trending")) return "trending_up";
    if (icon?.includes("check-circle")) return "check_circle";
    if (icon?.includes("calendar")) return "event";
    if (icon?.includes("info")) return "info";
    return "lightbulb";
  };

  // Fetch all weekly data in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyResponse, streakResponse, analyticsResponse] = await Promise.all([
          symptomQuestionnaireAPI.getHistory(7).catch(err => {
            console.error("Failed to fetch questionnaire history:", err);
            return null;
          }),
          user.username ? questionsAPI.getStreak(user.username).catch(err => {
            console.error("Failed to fetch streak:", err);
            return null;
          }) : Promise.resolve(null),
          analyticsAPI.getWeeklyAnalytics(0).catch(err => {
            console.error("Failed to fetch weekly analytics:", err);
            return null;
          })
        ]);

        if (historyResponse && historyResponse.history) {
          setQuestionnaireHistory(historyResponse.history);
        }
        if (streakResponse) {
          setCurrentStreak(streakResponse.streak || 0);
        }
        if (analyticsResponse?.success && analyticsResponse.data) {
          setWeeklyData(analyticsResponse.data);
        }
      } catch (err) {
        console.error("Failed to fetch weekly data:", err);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="weekly-dashboard-content">
      <div className="current-streak-container">
        <div className="current-streak-row">
          <h2 className="current-streak-title h4">{t("current_streak")}</h2>
          <div className="current-streak-value">
            <span className="material-symbols-rounded streak-icon">
              local_fire_department
            </span>
            <span className="streak-label body-semibold">{currentStreak} {t("days")}</span>
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
            <span className={`wellness-score-value h4 ${overallTrend === "Concerning" ? "downward" : "upward"}`}>
              {totalAssessments}
            </span>
            <h3 className="wellness-score-title body">{t("assessments")}</h3>
            <div className="wellness-score-caption-container">
              <span className={`material-symbols-rounded caption-icon ${overallTrend === "Concerning" ? "downward" : "upward"}`}>
                {overallTrend === "Concerning" ? "arrow_downward_alt" : "arrow_upward_alt"}
              </span>
              <span className="wellness-score-caption caption">
                {overallTrend}
              </span>
            </div>
          </div>

          <div className="engagement-level-card">
            <span className="engagement-level-value h4 upward">
              {weeklyData?.totalAlerts ?? 0}
            </span>
            <h3 className="engagement-level-title body">
              {t("alerts")}
            </h3>
            <div className="engagement-level-caption-container">
              {weeklyData?.mostConcerningSymptom ? (
                <span className="engagement-level-caption caption">
                  {weeklyData.mostConcerningSymptom.name}: {weeklyData.mostConcerningSymptom.avgSeverity}/5
                </span>
              ) : (
                <span className="engagement-level-caption caption">
                  {t("no_concerns")}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mood-trend-container">
          <div className="mood-trend-header">
            <span className="mood-trend-title h4">{t("mood_trend")}</span>
            <span className={`mood-trend-status ${moodStatus} caption`}>
              {getMoodStatus(moodStatus)}
              <span
                className={`material-symbols-rounded mood-trend-arrow ${
                  moodStatus === "Improving" ? "upward" : "downward"
                }`}
              >
                {moodStatus === "Improving"
                  ? "trending_up"
                  : "trending_down"}
              </span>
            </span>
          </div>
          <div className="mood-trend-bar-chart">
            {days.map((day) => {
              const value = moodTrend[day];
              const height = `${(value / maxMood) * 100}%`;
              return (
                <div key={day} className="mood-trend-bar-wrapper">
                  <div
                    className={`mood-trend-bar ${getMoodShade(value)}`}
                    style={{ height }}
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

      {(bestDay || challengingDay) && (
        <div className="weekly-summary-days">
          {bestDay && (
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
                  <p className="weekly-summary-bestDay-date body">{formatDayDate(bestDay.date)}</p>
                </div>
              </div>
              <p className="weekly-summary-bestDay-summary caption">
                {t("best_day_summary")}
              </p>
            </div>
          )}

          {challengingDay && challengingDay !== bestDay && (
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
                    {formatDayDate(challengingDay.date)}
                  </p>
                </div>
              </div>
              <p className="weekly-summary-challengingDay-summary caption">
                {t("challenging_day_summary")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Questionnaire History Section */}
      {questionnaireHistory.length > 0 && (
        <div className="questionnaire-history-section">
          <h2 className="weekly-insights-title h4">Symptom Questionnaire History</h2>
          <div className="questionnaire-history-list">
            {questionnaireHistory.map((record, index) => (
              <div key={index} className="questionnaire-history-item">
                <div className="history-item-header">
                  <div className="history-item-icon">
                    <span className="material-symbols-rounded">description</span>
                  </div>
                  <div className="history-item-info">
                    <h4 className="body-semibold">Daily Symptom Report</h4>
                    <p className="caption">
                      {new Date(record.timestamp).toLocaleDateString(
                        i18n.language === "zh" ? "zh-CN" : "en-US",
                        { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                      )}
                    </p>
                  </div>
                  <div className="history-item-completion">
                    <span className="completion-badge caption">
                      {record.completion_percentage || 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {smartInsights.length > 0 && (
        <div className="weekly-smart-insight">
          <h2 className="weekly-insights-title h4">{t("smart_insights")}</h2>
          {smartInsights.map((insight, index) => (
            <SmartInsightCard
              key={insight.id || index}
              icon={mapInsightIcon(insight.icon)}
              title={insight.title}
              description={insight.description}
              insightType={mapInsightType(insight.type)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeklyDashboard;
