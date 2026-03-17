import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MonthlyCalendar from "../../../components/ui/monthlyCalendar";
import SmartInsightCard from "../../../components/ui/smartInsightCard";
import EventItem from "../../../components/ui/notableEvents";
import SymptomTrendCard from "../../../components/ui/symptomTrendCard";
import { triageAPI, symptomQuestionnaireAPI } from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

const MonthlyDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [smartInsights, setSmartInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionnaireHistory, setQuestionnaireHistory] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.username) {
          const [insightsResponse, historyResponse] = await Promise.all([
            triageAPI.getSmartInsights(user.username),
            symptomQuestionnaireAPI.getHistory(30) // Get last 30 submissions
          ]);
          
          if (insightsResponse.success && insightsResponse.insights) {
            setSmartInsights(insightsResponse.insights);
          }
          
          if (historyResponse && historyResponse.history) {
            setQuestionnaireHistory(historyResponse.history);
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
        <SymptomTrendCard iconName="mood" title={t("mood")} trend="up" />
        <SymptomTrendCard
          iconName="battery_alert"
          title={t("energy_level")}
          trend="down"
        />
        <SymptomTrendCard
          iconName="bedtime"
          title={t("sleep_quality")}
          trend="stable"
        />
        <SymptomTrendCard
          iconName="favorite"
          title={t("pain_level")}
          trend="down"
        />
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
