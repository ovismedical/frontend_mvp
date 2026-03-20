import React from "react";
import StepperProgress from "./StepperProgress";
import QuestionSection from "./QuestionSection";
import QuestionnaireNavigation from "./QuestionnaireNavigation";
import SaveModal from "./SaveModal";
import { useQuestionnaireState } from "../../hooks/useQuestionnaireState";
import { useToast } from "../ui/Toast";
import { useNavigate } from "react-router-dom";
import "../../styles/questionnaire.css";

export default function QuestionnaireInline() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();

  const state = useQuestionnaireState({
    onToast: showToast
  });

  return (
    <div className="questionnaire-inline">
      <ToastContainer />

      {/* Stepper Progress */}
      <StepperProgress
        currentSection={state.currentSection}
        totalSections={state.sections.length}
        completedSections={state.completedSections}
        onSectionClick={state.handleSectionClick}
      />

      {/* Question Section */}
      <div
        className="questionnaire-body"
        ref={state.bodyRef}
        data-direction={state.slideDirection}
      >
        <QuestionSection
          key={state.currentSection}
          section={state.sections[state.currentSection]}
          answers={state.answers}
          onAnswerChange={state.handleAnswerChange}
          validationErrors={state.validationErrors}
        />
      </div>

      {/* Navigation */}
      <QuestionnaireNavigation
        currentSection={state.currentSection}
        totalSections={state.sections.length}
        onPrevious={state.handlePrevious}
        onNext={state.handleNext}
        onSave={state.handleSave}
        canProceed={!state.isSubmitting}
        isSubmitting={state.isSubmitting}
        onValidate={state.validateCurrentSection}
      />

      {/* Save Modal */}
      {state.showSaveModal && (
        <SaveModal
          onClose={() => {
            state.setShowSaveModal(false);
            navigate("/home");
          }}
          onConfirm={() => {
            state.setShowSaveModal(false);
            navigate("/dashboard");
          }}
        />
      )}
    </div>
  );
}
