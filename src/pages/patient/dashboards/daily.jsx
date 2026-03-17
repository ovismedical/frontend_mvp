import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SmartInsightCard from "../../../components/ui/smartInsightCard";
import SymptomTrackCard from "../../../components/ui/symptomTrackCard";
import TriageAlertCard from "../../../components/ui/triageAlertCard";
import DiagnosisInsightCard from "../../../components/ui/diagnosisInsightCard";
import SymptomDetailModal from "../../../components/ui/symptomDetailModal";
import { triageAPI, symptomQuestionnaireAPI, questionsAPI } from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";
import { getSymptomIcon, getSeverityIntensity, formatSymptomName } from "../../../utils/symptomUtils";
import { getAlertLevelConfig } from "../../../utils/triageUtils";

const DailyDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [triageData, setTriageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [smartInsights, setSmartInsights] = useState([]);
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Backend Handling: Fetch daily health summary, symptoms, and insights from backend
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
          
          // Fetch triage data, smart insights, questionnaire data, and streak in parallel
          const [latestTriage, insightsResponse, questionnaireResponse, streakResponse] = await Promise.all([
            triageAPI.getLatestTriage(patientId),
            triageAPI.getSmartInsights(patientId),
            symptomQuestionnaireAPI.getLatest().catch(err => {
              console.log("No questionnaire data:", err);
              return null;
            }),
            questionsAPI.getStreak(patientId).catch(err => {
              console.log("No streak data:", err);
              return null;
            })
          ]);

          if (streakResponse) {
            setCurrentStreak(streakResponse.streak || 0);
          }
          
          console.log("🔍 Debug - Triage API response:", latestTriage);
          console.log("🔍 Debug - Insights API response:", insightsResponse);
          
          if (latestTriage.success && latestTriage.triage_assessment) {
            console.log("✅ Debug - Setting triage data:", latestTriage.triage_assessment);
            console.log("🔍 Debug - Structured assessment:", latestTriage.structured_assessment);
            
            // Convert symptoms object to array format for frontend compatibility
            let structuredAssessment = latestTriage.structured_assessment;
            if (structuredAssessment && structuredAssessment.symptoms && typeof structuredAssessment.symptoms === 'object' && !Array.isArray(structuredAssessment.symptoms)) {
              console.log("🔄 Converting symptoms object to array format");
              const symptomsArray = Object.entries(structuredAssessment.symptoms).map(([symptomName, symptomData]) => ({
                symptom: symptomName,
                ...symptomData
              }));
              structuredAssessment = {
                ...structuredAssessment,
                symptoms: symptomsArray
              };
              console.log("✅ Converted symptoms:", symptomsArray);
            }
            
            setTriageData({
              ...latestTriage.triage_assessment,
              structured_assessment: structuredAssessment
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
          
          if (questionnaireResponse) {
            console.log("✅ Debug - Setting questionnaire data:", questionnaireResponse);
            setQuestionnaireData(questionnaireResponse);
          } else {
            console.log("❌ Debug - No questionnaire data found");
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

  // Compute dynamic health status from triage data
  const hasTriageData = triageData && triageData.alert_level;
  const alertConfig = getAlertLevelConfig(hasTriageData ? triageData.alert_level : null);
  const summaryContainerClass = `daily-health-summary${hasTriageData ? ` daily-health-summary--${alertConfig.color}` : ''}`;
  const statusCardClass = `daily-health-summary-card${
    loading ? ' daily-health-summary-card--no-data' :
    hasTriageData ? ` daily-health-summary-card--${alertConfig.color}` :
    ' daily-health-summary-card--no-data'
  }`;
  const statusIcon = loading ? 'hourglass_empty' : hasTriageData ? alertConfig.icon : 'help_outline';
  const statusTitle = loading ? t('assessment_pending') : t(alertConfig.titleKey);
  const statusSubtext = loading ? t('assessment_being_reviewed') : t(alertConfig.descriptionKey);
  const statusIconColor = hasTriageData && !loading ? `var(--${alertConfig.color}-600)` : 'var(--text-300)';

  return (
    <div className="daily-dashboard-content">
      <div className={summaryContainerClass}>
        <div className="daily-health-summary-top">
          <h2 className="daily-health-summary-title h4">
            {t("daily_health_summary")}
          </h2>
          <p className="daily-health-summary-date caption">{formattedDate}</p>
        </div>
        <div className="daily-health-summary-cards">
          <div className={statusCardClass}>
            <div className="daily-health-summary-card-info">
              <span
                className="material-symbols-rounded summary-status-icon"
                style={{ color: statusIconColor }}
              >
                {statusIcon}
              </span>
              <h3 className="daily-health-summary-card-title body">
                {statusTitle}
              </h3>
            </div>
            <p className="daily-health-summary-card-subtext caption">
              {statusSubtext}
            </p>
          </div>
          <div className="daily-health-summary-card">
            <div className="daily-health-summary-card-info">
              <span className="material-symbols-rounded local_fire_department">
                local_fire_department
              </span>
              <h3 className="daily-health-summary-card-title body">
                {t("day_streak", { count: currentStreak })}
              </h3>
            </div>
            <p className="daily-health-summary-card-subtext caption">
              {t("tracking_consistently")}
            </p>
          </div>
        </div>
      </div>
      {/* Section 2: Triage Alert — standalone, no container bg */}
      {(triageData || error) && (
        <div className="daily-triage-section">
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

      {/* Section 3: Symptoms Tracked Today */}
      <div className="daily-symptoms-section">
        <h3 className="daily-section-title h4">{t("symptoms_tracked_today")}</h3>
        <div className="symptoms-grid">
          {triageData && triageData.structured_assessment && triageData.structured_assessment.symptoms && triageData.structured_assessment.symptoms.length > 0 ? (
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
            <div className="no-symptoms-message">
              <span className="material-symbols-rounded">info</span>
              <p className="body">{t("no_symptoms_tracked")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Section 4: Clinical Analysis (Diagnosis + Smart Insights) */}
      {((triageData && triageData.diagnosis_predictions && triageData.diagnosis_predictions.length > 0) ||
        (smartInsights && smartInsights.length > 0)) && (
        <div className="daily-clinical-section">
          {triageData && triageData.diagnosis_predictions && triageData.diagnosis_predictions.length > 0 && (
            <div className="daily-clinical-subsection">
              <h3 className="daily-section-title h4">{t("potential_conditions")}</h3>
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

          {smartInsights && smartInsights.length > 0 && (
            <div className="daily-clinical-subsection">
              <h3 className="daily-section-title h4">{t("smart_insights")}</h3>
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
      )}

      {/* Section 5: Symptom Questionnaire */}
      {questionnaireData && (
        <div className="daily-questionnaire-section">
          <h3 className="daily-section-title h4">Symptom Questionnaire</h3>
          <div className="questionnaire-record-card">
            <div className="questionnaire-header-info">
              <div className="questionnaire-icon-wrapper">
                <span className="material-symbols-rounded">description</span>
              </div>
              <div className="questionnaire-details">
                <h4 className="body-semibold">Daily Symptom Report</h4>
                <p className="caption">
                  {new Date(questionnaireData.timestamp).toLocaleDateString(
                    i18n.language === "zh" ? "zh-CN" : "en-US",
                    { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }
                  )}
                </p>
              </div>
            </div>

            <div className="questionnaire-stats">
              <div className="stat-item">
                <span className="stat-value">{questionnaireData.sections_completed || 0}/{questionnaireData.total_sections || 0}</span>
                <span className="stat-label caption">Sections</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{questionnaireData.completion_percentage || 0}%</span>
                <span className="stat-label caption">Complete</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{Object.keys(questionnaireData.answers || {}).length}</span>
                <span className="stat-label caption">Responses</span>
              </div>
            </div>

            <button
              className="questionnaire-view-btn"
              onClick={() => {
                console.log("View questionnaire details:", questionnaireData);
              }}
            >
              <span>View Details</span>
              <span className="material-symbols-rounded">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

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
