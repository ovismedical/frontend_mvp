import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSeverityConfig, getSectionIcon } from "../../utils/severityUtils";
import ResponseValue from "../../components/ui/responseValue";
import "../../styles/pages/patient/questionnaire_detail.css";
import BackButton from "../../components/ui/backButton";
const QuestionnaireDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const record = location.state?.record;
  const [expandedSections, setExpandedSections] = useState({});

  if (!record) {
    return (
      <div className="qd-container">
        <div className="qd-header">
          <BackButton className="qd-back" onClick={() => navigate(-1)} />
          <h4 className="qd-header-title h4">Symptom Report</h4>
          <div style={{ width: 24 }} />
        </div>
        <div className="qd-content qd-empty">
          <span className="material-symbols-rounded qd-empty-icon">description</span>
          <p className="body">No questionnaire data available.</p>
          <button className="qd-back-btn body-semibold" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const sections = record.sections || [];
  const clinical = record.clinical_summary || {};
  const alertFlags = clinical.alert_flags || [];
  const areasOfConcern = clinical.areas_of_concern || [];
  const completion = record.completion_percentage || 0;
  const sectionsCompleted = record.sections_completed || sections.length;
  const totalSections = record.total_sections || sections.length;
  const questionsAnswered = record.completion?.questions_answered
    || Object.keys(record.answers || record.raw_answers || {}).length;

  const formattedDate = record.timestamp
    ? new Date(record.timestamp).toLocaleDateString(
        i18n.language === "zh" ? "zh-CN" : "en-US",
        { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }
      )
    : record.date || "Unknown";

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleEdit = () => {
    navigate("/symptom-quiz", {
      state: {
        answers: record.raw_answers || record.answers,
        isEdit: true,
      },
    });
  };

  return (
    <div className="qd-container">
      {/* Header */}
      <div className="qd-header">
        <BackButton className="qd-back" onClick={() => navigate(-1)} />
        <h4 className="qd-header-title h4">Symptom Report</h4>
        <span
          className="material-symbols-rounded qd-edit-icon"
          onClick={handleEdit}
        >
          edit
        </span>
      </div>

      <div className="qd-content">
        {/* Summary Card */}
        <div className="qd-summary-card">
          <div className="qd-summary-top">
            <div className="qd-summary-date">
              <span className="material-symbols-rounded">calendar_today</span>
              <span className="body">{formattedDate}</span>
            </div>
            <div className="qd-completion-badge">
              <span className="body-semibold">{completion}%</span>
            </div>
          </div>
          <div className="qd-summary-stats">
            <div className="qd-stat">
              <span className="qd-stat-value h4">{sectionsCompleted}/{totalSections}</span>
              <span className="qd-stat-label caption">Sections</span>
            </div>
            <div className="qd-stat">
              <span className="qd-stat-value h4">{questionsAnswered}</span>
              <span className="qd-stat-label caption">Answered</span>
            </div>
            <div className="qd-stat">
              <span className="qd-stat-value h4">{areasOfConcern.length}</span>
              <span className="qd-stat-label caption">Concerns</span>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        {alertFlags.length > 0 && (
          <div className="qd-alert-banner">
            <div className="qd-alert-header">
              <span className="material-symbols-rounded qd-alert-icon">warning</span>
              <span className="body-semibold">
                {alertFlags.length} Alert{alertFlags.length > 1 ? "s" : ""} Detected
              </span>
            </div>
            <ul className="qd-alert-list">
              {alertFlags.map((flag, i) => (
                <li key={i} className="caption">{flag}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Severity Overview Grid */}
        {sections.length > 0 && (
          <div className="qd-section-block">
            <h3 className="qd-section-title h4">Overview</h3>
            <div className="qd-severity-grid">
              {sections.map((section) => {
                const severity = getSeverityConfig(section.severity_score);
                const icon = getSectionIcon(section.section_id);
                return (
                  <div
                    key={section.section_id}
                    className="qd-severity-card"
                    onClick={() => toggleSection(section.section_id)}
                  >
                    <span className="material-symbols-rounded qd-severity-card-icon">
                      {icon}
                    </span>
                    <div className="qd-severity-card-info">
                      <span className="qd-severity-card-title caption">
                        {section.title}
                      </span>
                      <span
                        className={`qd-severity-pill ${severity.semantic}`}
                      >
                        {severity.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Responses - Accordions */}
        {sections.length > 0 && (
          <div className="qd-section-block">
            <h3 className="qd-section-title h4">Detailed Responses</h3>
            {sections.map((section) => {
              const severity = getSeverityConfig(section.severity_score);
              const icon = getSectionIcon(section.section_id);
              const isExpanded = expandedSections[section.section_id];
              const responses = (section.responses || []).filter(
                (r) => r.was_shown !== false
              );

              return (
                <div key={section.section_id} className="qd-accordion">
                  <div
                    className="qd-accordion-header"
                    onClick={() => toggleSection(section.section_id)}
                  >
                    <div className="qd-accordion-left">
                      <span className="material-symbols-rounded qd-accordion-icon">
                        {icon}
                      </span>
                      <span className="body-semibold">{section.title}</span>
                    </div>
                    <div className="qd-accordion-right">
                      <span className={`qd-severity-pill ${severity.semantic}`}>
                        {severity.label}
                      </span>
                      <span
                        className={`material-symbols-rounded qd-accordion-chevron${
                          isExpanded ? " expanded" : ""
                        }`}
                      >
                        chevron_right
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="qd-accordion-body">
                      {responses.length === 0 ? (
                        <p className="caption qd-no-responses">No responses recorded</p>
                      ) : (
                        responses.map((response) => (
                          <div key={response.question_id} className="qd-response-item">
                            <p className="qd-response-question caption">
                              {response.question_text}
                            </p>
                            <ResponseValue response={response} />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Button */}
        <button className="qd-edit-btn" onClick={handleEdit}>
          <span className="material-symbols-rounded">edit</span>
          <span>Edit Responses</span>
        </button>
      </div>
    </div>
  );
};

export default QuestionnaireDetail;
