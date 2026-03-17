import { useState, useEffect, useRef, useCallback } from "react";
import { symptomQuestionnaire, conditionalLogic } from "../fixtures/symptomQuestionnaire";
import { symptomQuestionnaireAPI } from "../utils/api";

export function useQuestionnaireState({ onToast } = {}) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [slideDirection, setSlideDirection] = useState("next");
  const [showSaveModal, setShowSaveModal] = useState(false);

  const sections = symptomQuestionnaire;
  const progress = conditionalLogic.calculateProgress(sections, answers);
  const bodyRef = useRef(null);

  const handleAnswerChange = useCallback((questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setIsDirty(true);
    setValidationErrors(prev => prev.filter(id => id !== questionId));
  }, []);

  const validateCurrentSection = useCallback(() => {
    const errors = conditionalLogic.getUnansweredRequired(sections[currentSection], answers);
    setValidationErrors(errors);
    return errors.length === 0;
  }, [currentSection, answers, sections]);

  const handleNext = useCallback(() => {
    if (currentSection < sections.length - 1) {
      setCompletedSections(prev => new Set([...prev, currentSection]));
      setSlideDirection("next");
      setCurrentSection(prev => prev + 1);
      setValidationErrors([]);

    }
  }, [currentSection, sections.length]);

  const handlePrevious = useCallback(() => {
    if (currentSection > 0) {
      setSlideDirection("prev");
      setCurrentSection(prev => prev - 1);
      setValidationErrors([]);

    }
  }, [currentSection]);

  const handleSectionClick = useCallback((index) => {
    setSlideDirection(index > currentSection ? "next" : "prev");
    setCurrentSection(index);
    setValidationErrors([]);
  }, [currentSection]);

  // Reset scroll position when section changes
  useEffect(() => {
    const el = bodyRef.current;
    if (el) {
      el.scrollTop = 0;
      // Ensure reset after React finishes rendering new content
      requestAnimationFrame(() => { el.scrollTop = 0; });
    }
  }, [currentSection]);

  const handleSave = useCallback(async () => {
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
        // Fire-and-forget: don't block UI waiting for draft cleanup
        symptomQuestionnaireAPI.deleteDraft().catch(() => {});
        localStorage.removeItem('questionnaire_draft');
        setShowSaveModal(true);
        setIsDirty(false);
      } else {
        await symptomQuestionnaireAPI.saveDraft({ answers, current_section: currentSection });
        onToast?.("Draft saved", "success");
        setIsDirty(false);
      }
    } catch (error) {
      onToast?.(error.message || "Failed to save. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, currentSection, sections.length, answers, progress, onToast]);

  // Auto-save
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (isDirty && !isSubmitting) {
        const draftData = { answers, current_section: currentSection };
        symptomQuestionnaireAPI.saveDraft(draftData)
          .then(() => {
            localStorage.setItem('questionnaire_draft', JSON.stringify({ answers, currentSection }));
            onToast?.("Draft saved", "success");
            setIsDirty(false);
          })
          .catch(() => {
            localStorage.setItem('questionnaire_draft', JSON.stringify({ answers, currentSection }));
          });
      }
    }, 3000);
    return () => clearTimeout(autoSave);
  }, [answers, isDirty, currentSection, isSubmitting]);

  // Load draft on mount
  useEffect(() => {
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
        // Fall through
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
          // Ignore
        }
      }
    };
    loadDraft();
  }, []);

  return {
    currentSection,
    answers,
    isDirty,
    isSubmitting,
    validationErrors,
    completedSections,
    slideDirection,
    showSaveModal,
    setShowSaveModal,
    sections,
    progress,
    bodyRef,
    handleAnswerChange,
    validateCurrentSection,
    handleNext,
    handlePrevious,
    handleSectionClick,
    handleSave,
  };
}
