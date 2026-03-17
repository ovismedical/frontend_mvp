import React from "react";
import { useTranslation } from "react-i18next";
import "../../styles/components/symptomDetailModal.css";

const SymptomDetailModal = ({ symptom, isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen || !symptom) return null;

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

  return (
    <div className="symptom-modal-overlay" onClick={onClose}>
      <div className="symptom-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="symptom-modal-header">
          <h2 className="symptom-modal-title h4">
            {formatValue(symptom.symptom || 'Symptom Details')}
          </h2>
          <button className="symptom-modal-close" onClick={onClose}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        <div className="symptom-modal-body">
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
                  {symptom.associated_symptoms.map((symptom, index) => (
                    <span key={index} className="symptom-tag">
                      {formatValue(symptom)}
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
        </div>
      </div>
    </div>
  );
};

export default SymptomDetailModal;
