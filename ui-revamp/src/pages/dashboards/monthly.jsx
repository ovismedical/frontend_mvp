import React from "react";
import { useTranslation } from "react-i18next";
import MonthlyCalendar from "../../components/ui/monthlyCalendar";
import SmartInsightCard from "../../components/ui/smartInsightCard";
import EventItem from "../../components/ui/notableEvents";
import SymptomTrendCard from "../../components/ui/symptomTrendCard";

const MonthlyDashboard = () => {
  const { t, i18n } = useTranslation();

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

  return (
    <div className="monthly-dashboard-content">
      <MonthlyCalendar />

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

      <div className="monthly-smart-insight">
        <h2 className="monthly-insights-title h4">{t("smart_insights")}</h2>
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
