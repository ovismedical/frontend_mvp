import React from "react";
import { useTranslation } from "react-i18next";
import ResponseValue from "./responseValue";
import { getSeverityConfig } from "../../utils/severityUtils";
import "../../styles/components/symptomDetailModal.css";

const SymptomDetailModal = ({ symptom, isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen || !symptom) return null;

  const isQuestionnaireSection = symptom.section_id && symptom.responses;

  const formatValue = (value) => {
    if (typeof value === 'string') {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  };

  const getSeverityColor = (severity) => {
    const severityLower = severity?.toLowerCase();
    if (severityLower === 'severe' || severityLower === 'high') return 'var(--error-600)';
    if (severityLower === 'moderate' || severityLower === 'medium') return 'var(--warning-600)';
    if (severityLower === 'mild' || severityLower === 'low') return 'var(--success-600)';
    return 'var(--text-500)';
  };

  const modalTitle = isQuestionnaireSection
    ? symptom.title
    : formatValue(symptom.symptom || 'Symptom Details');

  return (
    <div className="symptom-modal-overlay" onClick={onClose}>
      <div className="symptom-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="symptom-modal-header">
          <div className="symptom-modal-header-left">
            <h2 className="symptom-modal-title h4">{modalTitle}</h2>
            {isQuestionnaireSection && (() => {
              const sev = getSeverityConfig(symptom.severity_score);
              return (
                <span className={`qs-severity-pill ${sev.semantic}`}>
                  {sev.label}
                </span>
              );
            })()}
          </div>
          <button className="symptom-modal-close" onClick={onClose}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        <div className="symptom-modal-body">
          {isQuestionnaireSection ? (
            <div className="qs-modal-responses">
              {(symptom.responses || [])
                .filter((r) => r.was_shown !== false)
                .map((response) => (
                  <div key={response.question_id} className="qs-modal-response-item">
                    <p className="qs-modal-question caption">{response.question_text}</p>
                    <ResponseValue response={response} />
                  </div>
                ))}
              {(symptom.responses || []).filter((r) => r.was_shown !== false).length === 0 && (
                <p className="caption" style={{ color: 'var(--text-300)' }}>No responses recorded</p>
              )}
            </div>
          ) : (
            <div className="symptom-detail-grid">
              {symptom.severity && (
                <div className="symptom-detail-item">
                  <label className="symptom-detail-label caption">Severity</label>
                  <div
                    className="symptom-detail-value body-semibold"
                    style={{ color: getSeverityColor(symptom.severity) }}
                  >
                    {formatValue(symptom.severity)}
                  </div>
                </div>
              )}

              {symptom.duration && (
                <div className="symptom-detail-item">
                  <label className="symptom-detail-label caption">Duration</label>
                  <div className="symptom-detail-value body">
                    {formatValue(symptom.duration)}
                  </div>
                </div>
              )}

              {symptom.frequency && (
                <div className="symptom-detail-item">
                  <label className="symptom-detail-label caption">Frequency</label>
                  <div className="symptom-detail-value body">
                    {formatValue(symptom.frequency)}
                  </div>
                </div>
              )}

              {symptom.location && (
                <div className="symptom-detail-item">
                  <label className="symptom-detail-label caption">Location</label>
                  <div className="symptom-detail-value body">
                    {formatValue(symptom.location)}
                  </div>
                </div>
              )}

              {symptom.quality && (
                <div className="symptom-detail-item">
                  <label className="symptom-detail-label caption">Quality</label>
                  <div className="symptom-detail-value body">
                    {formatValue(symptom.quality)}
                  </div>
                </div>
              )}

              {symptom.associated_symptoms && symptom.associated_symptoms.length > 0 && (
                <div className="symptom-detail-item full-width">
                  <label className="symptom-detail-label caption">Associated Symptoms</label>
                  <div className="symptom-detail-value body">
                    {symptom.associated_symptoms.map((s, index) => (
                      <span key={index} className="symptom-tag">
                        {formatValue(s)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {symptom.notes && (
                <div className="symptom-detail-item full-width">
                  <label className="symptom-detail-label caption">Notes</label>
                  <div className="symptom-detail-value body">
                    {symptom.notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomDetailModal;
