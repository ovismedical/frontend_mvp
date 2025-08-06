import React from "react";
import MonthlyCalendar from "../../components/ui/monthlyCalendar";
import SmartInsightCard from "../../components/ui/smartInsightCard";
import EventItem from "../../components/ui/notableEvents";
import SymptomTrendCard from "../../components/ui/symptomTrendCard";

const MonthlyDashboard = () => {
  const events = [
    {
      iconName: "stethoscope",
      title: "Oncology Visit",
      subtitle: "Dr. Smith - Routine checkup",
      date: "Jun 15, 2025",
    },
    {
      iconName: "pill",
      title: "Medication Change",
      subtitle: "Dosage reduced to 5mg",
      date: "Jun 9, 2025",
    },
    {
      iconName: "labs",
      title: "Lab Results",
      subtitle: "Blood work - empty stomach",
      date: "Jun 3, 2025",
    },
  ];

  return (
    <div className="monthly-dashboard-content">
      <MonthlyCalendar />

      <div className="monthly-symptom-trend">
        <h2 className="monthly-symptom-trend-title h4"> Symptom Trends</h2>
        <SymptomTrendCard iconName="mood" title="Mood" trend="up" />
        <SymptomTrendCard
          iconName="battery_alert"
          title="Energy Level"
          trend="down"
        />
        <SymptomTrendCard
          iconName="bedtime"
          title="Sleep Quality"
          trend="stable"
        />
        <SymptomTrendCard iconName="favorite" title="Pain Level" trend="down" />
      </div>

      <div className="monthly-smart-insight">
        <h2 className="monthly-insights-title h4"> Smart Insights</h2>
        <SmartInsightCard
          icon="sentiment_satisfied"
          title="Mood & Sleep Link Detected"
          description="Your mood tends to improve on nights with 7+ hours of sleep."
          insightType="info"
        />
        <SmartInsightCard
          icon="warning"
          title="Low Activity Detected"
          description="Your activity levels dropped below your weekly average."
          insightType="warning"
        />
        <SmartInsightCard
          icon="celebration"
          title="Mood Boost"
          description="You report better mood scores on Saturdays compared to weekdays."
          insightType="success"
        />
        <SmartInsightCard
          icon="error"
          title="Missed Medication"
          description="You missed your medication on Tuesday. Try to set a reminder."
          insightType="error"
        />
      </div>

      <div className="monthly-notable-events">
        <h2 className="monthly-notable-events-title h4"> Notable Events</h2>
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
