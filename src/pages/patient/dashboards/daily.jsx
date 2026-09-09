import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SmartInsightCard from "../../../components/ui/smartInsightCard";
import SymptomTrackCard from "../../../components/ui/symptomTrackCard";
import TriageAlertCard from "../../../components/ui/triageAlertCard";
import DiagnosisInsightCard from "../../../components/ui/diagnosisInsightCard";
import SymptomDetailModal from "../../../components/ui/symptomDetailModal";
import QuestionnaireSectionCard from "../../../components/ui/questionnaireSectionCard";
import { triageAPI, symptomQuestionnaireAPI, questionsAPI } from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";
import { getSymptomIcon, getSeverityIntensity, formatSymptomName } from "../../../utils/symptomUtils";
import { getAlertLevelConfig } from "../../../utils/triageUtils";
import { getSectionIcon } from "../../../utils/severityUtils";

const DailyDashboard = () => {
  const navigate = useNavigate();
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
        
        if (user && user.username) {
          const patientId = user.username;
          
          // Fetch triage data, smart insights, questionnaire data, and streak in parallel
          const [latestTriage, insightsResponse, questionnaireResponse, streakResponse] = await Promise.all([
            triageAPI.getLatestTriage(patientId),
            triageAPI.getSmartInsights(patientId),
            symptomQuestionnaireAPI.getLatest().catch(() => null),
            questionsAPI.getStreak(patientId).catch(() => null)
          ]);

          if (streakResponse) {
            setCurrentStreak(streakResponse.streak || 0);
          }
          
          if (latestTriage.success && latestTriage.triage_assessment) {
            // Convert symptoms object to array format for frontend compatibility
            let structuredAssessment = latestTriage.structured_assessment;
            if (structuredAssessment && structuredAssessment.symptoms && typeof structuredAssessment.symptoms === 'object' && !Array.isArray(structuredAssessment.symptoms)) {
              const symptomsArray = Object.entries(structuredAssessment.symptoms).map(([symptomName, symptomData]) => ({
                symptom: symptomName,
                ...symptomData
              }));
              structuredAssessment = {
                ...structuredAssessment,
                symptoms: symptomsArray
              };
            }
            
            setTriageData({
              ...latestTriage.triage_assessment,
              structured_assessment: structuredAssessment,
              created_at: latestTriage.created_at
            });
          }

          if (insightsResponse.success && insightsResponse.insights) {
            setSmartInsights(insightsResponse.insights);
          }

          if (questionnaireResponse) {
            setQuestionnaireData(questionnaireResponse);
          }
        }
      } catch (err) {
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
  // This icon states the triage result, so it needs 3:1 against the card; the -600
  // levels sit at ~2.9:1 there.
  const statusIconColor = hasTriageData && !loading ? `var(--on-${alertConfig.color}-tint)` : 'var(--text-400)';

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

      {/* Combined Symptoms Section */}
      {(() => {
        const hasSymptoms = triageData?.structured_assessment?.symptoms?.length > 0;
        const hasSections = questionnaireData?.sections?.length > 0;
        let viewMode = 'empty';
        if (hasSymptoms && hasSections) {
          const triageTime = new Date(triageData.created_at || 0).getTime();
          const questionnaireTime = new Date(questionnaireData.timestamp || 0).getTime();
          viewMode = questionnaireTime >= triageTime ? 'questionnaire' : 'triage';
        } else if (hasSections) {
          viewMode = 'questionnaire';
        } else if (hasSymptoms) {
          viewMode = 'triage';
        }

        return (
          <div className="daily-symptoms-section">
            <div className="daily-symptoms-header">
              <h3 className="daily-section-title h4">{t("symptoms_tracked_today")}</h3>
              {viewMode === 'questionnaire' && questionnaireData && (
                <div className="daily-symptoms-stats">
                  <span className="caption">
                    {questionnaireData.sections_completed || 0}/{questionnaireData.total_sections || 0} sections
                  </span>
                  <span className="caption">{questionnaireData.completion_percentage || 0}%</span>
                </div>
              )}
            </div>

            <div className="symptoms-grid">
              {viewMode === 'triage' &&
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
                })}

              {viewMode === 'questionnaire' &&
                questionnaireData.sections.map((section) => (
                  <QuestionnaireSectionCard
                    key={section.section_id}
                    iconName={getSectionIcon(section.section_id)}
                    title={section.title}
                    severityScore={section.severity_score}
                    sectionData={section}
                    onClick={handleSymptomClick}
                  />
                ))}

              {viewMode === 'empty' && (
                <div className="no-symptoms-message">
                  <span className="material-symbols-rounded">info</span>
                  <p className="body">{t("no_symptoms_tracked")}</p>
                </div>
              )}
            </div>

            {viewMode === 'questionnaire' && questionnaireData && (
              <button
                className="questionnaire-view-btn"
                onClick={() => navigate("/questionnaire-detail", { state: { record: questionnaireData } })}
              >
                <span>View Full Report</span>
                <span className="material-symbols-rounded">arrow_forward</span>
              </button>
            )}
          </div>
        );
      })()}

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
