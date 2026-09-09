import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MonthlyCalendar from "../../../components/ui/monthlyCalendar";
import SmartInsightCard from "../../../components/ui/smartInsightCard";
import EventItem from "../../../components/ui/notableEvents";
import SymptomTrendCard from "../../../components/ui/symptomTrendCard";
import { triageAPI, symptomQuestionnaireAPI, analyticsAPI } from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";
import StatusBanner from "../../../components/ui/statusBanner";

const MonthlyDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [smartInsights, setSmartInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionnaireHistory, setQuestionnaireHistory] = useState([]);
  const [monthlyData, setMonthlyData] = useState(null);

  // Backend Handling: Fetch monthly events from backend & symptoms, and insights from backend
  const events = [
    {
      iconName: "stethoscope",
      title: t("oncology_visit"),
      subtitle: t("oncology_visit_subtitle"),
      date: new Date(2025, 5, 15).toLocaleDateString(
        i18n.language === "zh" ? "zh-CN" : "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      ),
    },
    {
      iconName: "pill",
      title: t("medication_change"),
      subtitle: t("medication_change_subtitle"),
      date: new Date(2025, 5, 9).toLocaleDateString(
        i18n.language === "zh" ? "zh-CN" : "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      ),
    },
    {
      iconName: "labs",
      title: t("lab_results"),
      subtitle: t("lab_results_subtitle"),
      date: new Date(2025, 5, 3).toLocaleDateString(
        i18n.language === "zh" ? "zh-CN" : "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      ),
    },
  ];

  // Derive symptom trends from monthly analytics data
  const getSymptomTrend = (symptomName) => {
    if (!monthlyData?.symptomsByDay?.[symptomName]) return "stable";
    const dayData = monthlyData.symptomsByDay[symptomName];
    const days = Object.keys(dayData).map(Number).sort((a, b) => a - b);
    if (days.length < 2) return "stable";
    const mid = Math.floor(days.length / 2);
    const firstHalf = days.slice(0, mid).map((d) => dayData[d]);
    const secondHalf = days.slice(mid).map((d) => dayData[d]);
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    if (avgSecond < avgFirst - 0.3) return "down";
    if (avgSecond > avgFirst + 0.3) return "up";
    return "stable";
  };

  const availableSymptoms = monthlyData?.availableSymptoms ?? [];
  const symptomIconMap = {
    cough: "respiratory",
    nausea: "sick",
    lack_of_appetite: "no_meals",
    fatigue: "battery_alert",
    pain: "favorite",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.username) {
          const [insightsResponse, historyResponse, monthlyResponse] = await Promise.all([
            triageAPI.getSmartInsights(user.username),
            symptomQuestionnaireAPI.getHistory(30),
            analyticsAPI.getMonthlyAnalytics(0).catch(err => {
              console.error("Failed to fetch monthly analytics:", err);
              return null;
            })
          ]);

          if (insightsResponse.success && insightsResponse.insights) {
            setSmartInsights(insightsResponse.insights);
          }

          if (historyResponse && historyResponse.history) {
            setQuestionnaireHistory(historyResponse.history);
          }

          if (monthlyResponse?.success && monthlyResponse.data) {
            setMonthlyData(monthlyResponse.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user !== null) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="monthly-dashboard-content">
      <MonthlyCalendar />

      {/* Questionnaire Summary */}
      {questionnaireHistory.length > 0 && (
        <div className="monthly-questionnaire-summary">
          <h2 className="monthly-summary-title h4">Symptom Questionnaire Summary</h2>
          <div className="monthly-summary-stats">
            <div className="summary-stat-card">
              <div className="stat-icon-wrapper">
                <span className="material-symbols-rounded">assignment_turned_in</span>
              </div>
              <div className="stat-content">
                <h3 className="h3">{questionnaireHistory.length}</h3>
                <p className="caption">Completed</p>
              </div>
            </div>
            <div className="summary-stat-card">
              <div className="stat-icon-wrapper">
                <span className="material-symbols-rounded">trending_up</span>
              </div>
              <div className="stat-content">
                <h3 className="h3">
                  {Math.round(
                    questionnaireHistory.reduce((sum, q) => sum + (q.completion_percentage || 0), 0) / 
                    questionnaireHistory.length
                  )}%
                </h3>
                <p className="caption">Avg Completion</p>
              </div>
            </div>
            <div className="summary-stat-card">
              <div className="stat-icon-wrapper">
                <span className="material-symbols-rounded">calendar_month</span>
              </div>
              <div className="stat-content">
                <h3 className="h3">{new Set(questionnaireHistory.map(q => q.date)).size}</h3>
                <p className="caption">Unique Days</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="monthly-symptom-trend">
        <h2 className="monthly-symptom-trend-title h4">
          {t("symptom_trends")}
        </h2>
        {availableSymptoms.length > 0 ? (
          availableSymptoms.map((symptom) => (
            <SymptomTrendCard
              key={symptom}
              iconName={symptomIconMap[symptom] || "monitor_heart"}
              title={symptom.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              trend={getSymptomTrend(symptom)}
            />
          ))
        ) : (
          <>
            <SymptomTrendCard iconName="mood" title={t("mood")} trend="stable" />
            <SymptomTrendCard iconName="battery_alert" title={t("energy_level")} trend="stable" />
            <SymptomTrendCard iconName="bedtime" title={t("sleep_quality")} trend="stable" />
            <SymptomTrendCard iconName="favorite" title={t("pain_level")} trend="stable" />
          </>
        )}
      </div>

      {smartInsights && smartInsights.length > 0 && (
        <div className="monthly-smart-insight">
          <h2 className="monthly-insights-title h4">{t("smart_insights")}</h2>
          {smartInsights.map((insight, index) => (
            <SmartInsightCard
              key={index}
              icon={insight.icon}
              title={t(insight.title)}
              description={t(insight.description)}
              insightType={insight.insightType}
            />
          ))}
        </div>
      )}

      <div className="monthly-notable-events">
        <h2 className="monthly-notable-events-title h4">
          {t("notable_events")}
        </h2>
        <StatusBanner variant="coming-soon" message={t("notable_events_coming_soon")} />
        <div>
          {events.map((event, index) => (
            <EventItem
              key={index}
              index={index}
              iconName={event.iconName}
              title={event.title}
              subtitle={event.subtitle}
              date={event.date}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyDashboard;
