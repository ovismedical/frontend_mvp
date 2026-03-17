import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StepperProgress from "../../components/questionnaire/StepperProgress";
import QuestionSection from "../../components/questionnaire/QuestionSection";
import QuestionnaireNavigation from "../../components/questionnaire/QuestionnaireNavigation";
import SaveModal from "../../components/questionnaire/SaveModal";
import ExitModal from "../../components/questionnaire/ExitModal";
import { useToast } from "../../components/ui/Toast";
import { symptomQuestionnaire, conditionalLogic } from "../../fixtures/symptomQuestionnaire";
import { symptomQuestionnaireAPI } from "../../utils/api";
import "../../styles/questionnaire.css";

export default function SymptomQuestionnaire() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast, ToastContainer } = useToast();

  // State management
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [slideDirection, setSlideDirection] = useState("next");

  const sections = symptomQuestionnaire;
  const progress = conditionalLogic.calculateProgress(sections, answers);
  const bodyRef = useRef(null);

  // Handle answer updates
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    setIsDirty(true);
    // Clear validation error for this question when answered
    setValidationErrors(prev => prev.filter(id => id !== questionId));
  };

  // Validation
  const validateCurrentSection = useCallback(() => {
    const errors = conditionalLogic.getUnansweredRequired(sections[currentSection], answers);
    setValidationErrors(errors);
    return errors.length === 0;
  }, [currentSection, answers, sections]);

  // Navigation
  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCompletedSections(prev => new Set([...prev, currentSection]));
      setSlideDirection("next");
      setCurrentSection(prev => prev + 1);
      setValidationErrors([]);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setSlideDirection("prev");
      setCurrentSection(prev => prev - 1);
      setValidationErrors([]);
    }
  };

  const handleSectionClick = (index) => {
    setSlideDirection(index > currentSection ? "next" : "prev");
    setCurrentSection(index);
    setValidationErrors([]);
  };

  // Scroll to top when section changes
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentSection]);

  const handleSave = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const isComplete = currentSection === sections.length - 1;

      if (isComplete) {
        const submissionData = {
          answers,
          sections_completed: sections.length,
          total_sections: sections.length,
          completion_percentage: progress
        };

        await symptomQuestionnaireAPI.submitQuestionnaire(submissionData);
        await symptomQuestionnaireAPI.deleteDraft().catch(() => {});

        localStorage.removeItem('questionnaire_draft');
        setShowSaveModal(true);
        setIsDirty(false);
      } else {
        const draftData = { answers, current_section: currentSection };
        await symptomQuestionnaireAPI.saveDraft(draftData);
        showToast("Draft saved");
        setIsDirty(false);
      }
    } catch (error) {
      showToast(error.message || "Failed to save. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    if (isDirty) {
      setShowExitModal(true);
    } else {
      navigate("/home");
    }
  };

  // Auto-save
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (isDirty && !isSubmitting) {
        const draftData = { answers, current_section: currentSection };

        symptomQuestionnaireAPI.saveDraft(draftData)
          .then(() => {
            localStorage.setItem('questionnaire_draft', JSON.stringify({
              answers, currentSection
            }));
            showToast("Draft saved");
            setIsDirty(false);
          })
          .catch(() => {
            localStorage.setItem('questionnaire_draft', JSON.stringify({
              answers, currentSection
            }));
          });
      }
    }, 3000);

    return () => clearTimeout(autoSave);
  }, [answers, isDirty, currentSection, isSubmitting]);

  // Load draft on mount (or pre-fill from edit mode)
  useEffect(() => {
    // Priority 1: Edit mode — pre-fill from navigation state
    const editData = location.state;
    if (editData?.answers && editData?.isEdit) {
      setAnswers(editData.answers);
      setCurrentSection(0);
      return;
    }

    // Priority 2: Load saved draft
    const loadDraft = async () => {
      try {
        const backendDraft = await symptomQuestionnaireAPI.getDraft();
        if (backendDraft?.answers) {
          setAnswers(backendDraft.answers);
          if (backendDraft.current_section !== undefined) {
            setCurrentSection(backendDraft.current_section);
          }
          return;
        }
      } catch {
        // Fall through to localStorage
      }

      const localDraft = localStorage.getItem('questionnaire_draft');
      if (localDraft) {
        try {
          const parsed = JSON.parse(localDraft);
          if (parsed.answers) {
            setAnswers(parsed.answers);
            if (parsed.currentSection !== undefined) {
              setCurrentSection(parsed.currentSection);
            }
          }
        } catch {
          // Ignore parse errors
        }
      }
    };

    loadDraft();
  }, []);

  return (
    <div className="questionnaire-container">
      <ToastContainer />

      {/* Header */}
      <div className="questionnaire-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={handleExit}
        >
          chevron_backward
        </span>
        <h4>Symptom Questionnaire</h4>
        <div className="questionnaire-actions">
          <button
            className="caption save-draft"
            onClick={handleSave}
            disabled={!isDirty || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </div>

      {/* Stepper Progress */}
      <StepperProgress
        currentSection={currentSection}
        totalSections={sections.length}
        completedSections={completedSections}
        onSectionClick={handleSectionClick}
      />

      {/* Question Section */}
      <div
        className="questionnaire-body"
        ref={bodyRef}
        data-direction={slideDirection}
      >
        <QuestionSection
          key={currentSection}
          section={sections[currentSection]}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          validationErrors={validationErrors}
        />
      </div>

      {/* Navigation */}
      <QuestionnaireNavigation
        currentSection={currentSection}
        totalSections={sections.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSave={handleSave}
        canProceed={!isSubmitting}
        isSubmitting={isSubmitting}
        onValidate={validateCurrentSection}
      />

      {/* Modals */}
      {showSaveModal && (
        <SaveModal
          onClose={() => setShowSaveModal(false)}
          onConfirm={() => {
            setShowSaveModal(false);
            navigate("/dashboard");
          }}
        />
      )}

      {showExitModal && (
        <ExitModal
          onClose={() => setShowExitModal(false)}
          onExit={() => {
            setShowExitModal(false);
            navigate("/home");
          }}
        />
      )}
    </div>
  );
}
