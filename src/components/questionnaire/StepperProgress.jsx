import React from "react";

export default function StepperProgress({
  currentSection,
  totalSections,
  completedSections,
  onSectionClick
}) {
  return (
    <div className="stepper-progress">
      <div className="stepper-track">
        {Array.from({ length: totalSections }, (_, i) => {
          const isCompleted = completedSections?.has(i) || false;
          const isCurrent = i === currentSection;
          const className = [
            "stepper-dot",
            isCurrent && "current",
            isCompleted && !isCurrent && "completed"
          ].filter(Boolean).join(" ");

          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <div className={`stepper-line${completedSections?.has(i - 1) ? " filled" : ""}`} />
              )}
              <button
                className={className}
                onClick={() => isCompleted && onSectionClick?.(i)}
                disabled={!isCompleted && !isCurrent}
                aria-label={`Section ${i + 1}${isCompleted ? " (completed)" : isCurrent ? " (current)" : ""}`}
              >
                {isCompleted && !isCurrent && (
                  <span className="material-symbols-rounded stepper-check">check</span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>
      <div className="stepper-label">
        <span>Section {currentSection + 1} of {totalSections}</span>
      </div>
    </div>
  );
}
