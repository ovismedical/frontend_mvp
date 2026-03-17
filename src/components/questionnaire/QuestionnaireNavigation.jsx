import React from "react";

export default function QuestionnaireNavigation({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  onSave,
  canProceed,
  isSubmitting = false,
  onValidate
}) {
  const isFirstSection = currentSection === 0;
  const isLastSection = currentSection === totalSections - 1;

  const handleNext = () => {
    // If validation callback provided, check before proceeding
    if (onValidate && !onValidate()) {
      return;
    }
    onNext();
  };

  const handleSave = () => {
    if (onValidate && !onValidate()) {
      return;
    }
    onSave();
  };

  return (
    <div className="questionnaire-navigation">
      <div className="nav-buttons">
        <button
          className={`nav-button previous ${isFirstSection ? 'disabled' : ''}`}
          onClick={onPrevious}
          disabled={isFirstSection}
        >
          <span className="material-symbols-rounded">chevron_left</span>
          Previous
        </button>

        {isLastSection ? (
          <button
            className="nav-button save"
            onClick={handleSave}
            disabled={!canProceed || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-rounded">sync</span>
                Submitting...
              </>
            ) : (
              <>
                <span className="material-symbols-rounded">save</span>
                Save & Complete
              </>
            )}
          </button>
        ) : (
          <button
            className="nav-button next"
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
          >
            Next
            <span className="material-symbols-rounded">chevron_right</span>
          </button>
        )}
      </div>
    </div>
  );
}
