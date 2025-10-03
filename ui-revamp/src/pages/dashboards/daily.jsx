import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SmartInsightCard from "../../components/ui/smartInsightCard";
import SymptomTrackCard from "../../components/ui/symptomTrackCard";
import TriageAlertCard from "../../components/ui/triageAlertCard";
import DiagnosisInsightCard from "../../components/ui/diagnosisInsightCard";
import SymptomDetailModal from "../../components/ui/symptomDetailModal";
import { triageAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { getSymptomIcon, getSeverityIntensity, formatSymptomName } from "../../utils/symptomUtils";

const DailyDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [triageData, setTriageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [smartInsights, setSmartInsights] = useState([]);

  const formattedDate = new Date().toLocaleDateString(
    i18n.language === "zh" ? "zh-CN" : "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  const handleSymptomClick = (symptomData) => {
    setSelectedSymptom(symptomData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSymptom(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        console.log("🔍 Debug - Auth context user:", user);
        console.log("🔍 Debug - Is authenticated:", isAuthenticated);
        
        if (user && user.username) {
          const patientId = user.username;
          console.log("🔍 Debug - Fetching data for:", patientId);
          
          // Fetch triage data and smart insights in parallel
          const [latestTriage, insightsResponse] = await Promise.all([
            triageAPI.getLatestTriage(patientId),
            triageAPI.getSmartInsights(patientId)
          ]);
          
          console.log("🔍 Debug - Triage API response:", latestTriage);
          console.log("🔍 Debug - Insights API response:", insightsResponse);
          
          if (latestTriage.success && latestTriage.triage_assessment) {
            console.log("✅ Debug - Setting triage data:", latestTriage.triage_assessment);
            setTriageData({
              ...latestTriage.triage_assessment,
              structured_assessment: latestTriage.structured_assessment
            });
          } else {
            console.log("❌ Debug - No triage data found");
          }
          
          if (insightsResponse.success && insightsResponse.insights) {
            console.log("✅ Debug - Setting smart insights:", insightsResponse.insights);
            setSmartInsights(insightsResponse.insights);
          } else {
            console.log("❌ Debug - No insights data found");
          }
        } else {
          console.log("❌ Debug - No user data available - not authenticated");
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have user data
    if (user !== null) {
      fetchData();
    }
  }, [user, isAuthenticated]);

  return (
    <div className="daily-dashboard-content">
      <div className="daily-health-summary">
        <div className="daily-health-summary-top">
          <h2 className="daily-health-summary-title h4">
            {t("daily_health_summary")}
          </h2>
          <p className="daily-health-summary-date caption">{formattedDate}</p>
        </div>
        <div className="daily-health-summary-cards">
          <div className="daily-health-summary-card">
            <div className="daily-health-summary-card-info">
              <span className="material-symbols-rounded assignment_turned_in">
                assignment_turned_in
              </span>
              <h3 className="daily-health-summary-card-title body">
                {t("stable_health")}
              </h3>
            </div>
            <p className="daily-health-summary-card-subtext caption">
              {t("all_within_normal_range")}
            </p>
          </div>
          <div className="daily-health-summary-card">
            <div className="daily-health-summary-card-info">
              <span className="material-symbols-rounded local_fire_department">
                local_fire_department
              </span>
              <h3 className="daily-health-summary-card-title body">
                {t("day_streak", { count: 12 })}
              </h3>
            </div>
            <p className="daily-health-summary-card-subtext caption">
              {t("tracking_consistently")}
            </p>
          </div>
        </div>
      </div>
      {/* Combined Health Insights Section */}
      <div className="daily-health-insights">
        <h2 className="daily-insights-title h4">{t("health_insights")}</h2>
        
        {/* Triage Assessment - Priority Section */}
        {(triageData || error) && (
          <div className="triage-priority-section">
            {error ? (
              <div className="error-card">
                <span className="material-symbols-rounded error-icon">error</span>
                <div className="error-content">
                  <h3 className="error-title body-semibold">Assessment Error</h3>
                  <p className="error-message caption">{error}</p>
                </div>
              </div>
            ) : triageData ? (
              <TriageAlertCard
                alertLevel={triageData.alert_level}
                alertRationale={triageData.alert_rationale}
                recommendedTimeline={triageData.recommended_timeline}
                confidenceLevel={triageData.confidence_level}
                keySymptoms={triageData.key_symptoms || []}
              />
            ) : null}
          </div>
        )}

        {/* Symptoms Tracked Today */}
        <div className="symptoms-section">
          <h3 className="section-subtitle body-semibold">{t("symptoms_tracked_today")}</h3>
          <div className="symptoms-grid">
            {triageData && triageData.structured_assessment && triageData.structured_assessment.symptoms && triageData.structured_assessment.symptoms.length > 0 ? (
              // Use real symptoms from conversation assessment
              triageData.structured_assessment.symptoms.map((symptom, index) => {
                const iconName = getSymptomIcon(symptom.symptom);
                const intensity = getSeverityIntensity(symptom.severity);
                const title = formatSymptomName(symptom.symptom);
                
                return (
                  <SymptomTrackCard
                    key={index}
                    iconName={iconName}
                    title={title}
                    intensity={intensity}
                    symptomData={symptom}
                    onClick={handleSymptomClick}
                  />
                );
              })
            ) : (
              // Show message when no symptoms data available
              <div className="no-symptoms-message">
                <span className="material-symbols-rounded">info</span>
                <p className="body">{t("no_symptoms_tracked")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Diagnosis Predictions from Triage */}
        {triageData && triageData.diagnosis_predictions && triageData.diagnosis_predictions.length > 0 && (
          <div className="diagnosis-section">
            <h3 className="section-subtitle body-semibold">{t("potential_conditions")}</h3>
            <div className="diagnosis-grid">
              {triageData.diagnosis_predictions.slice(0, 2).map((diagnosis, index) => (
                <DiagnosisInsightCard
                  key={index}
                  suspectedDiagnosis={diagnosis.suspected_diagnosis}
                  probability={diagnosis.probability}
                  urgency={diagnosis.urgency}
                  reasoning={diagnosis.reasoning}
                />
              ))}
            </div>
          </div>
        )}

        {/* Smart Insights */}
        {smartInsights && smartInsights.length > 0 && (
          <div className="smart-insights-section">
            <h3 className="section-subtitle body-semibold">{t("smart_insights")}</h3>
            <div className="insights-grid">
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
          </div>
        )}
      </div>

      {/* Symptom Detail Modal */}
      <SymptomDetailModal
        symptom={selectedSymptom}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default DailyDashboard;
