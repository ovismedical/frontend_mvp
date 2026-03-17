import React from "react";
import QuestionRenderer from "./QuestionRenderer";
import { conditionalLogic } from "../../fixtures/symptomQuestionnaire";

export default function QuestionSection({ section, answers, onAnswerChange, validationErrors }) {
  const visibleQuestions = conditionalLogic.getVisibleQuestions(section, answers);

  return (
    <div className="question-section">
      <div className="section-header">
        <div className="section-title-container">
          <div className="section-icon">
            <span className="material-symbols-rounded">
              {section.icon || "health_and_safety"}
            </span>
          </div>
          <h2 className="h2">{section.title}</h2>
        </div>
      </div>

      <div className="questions-container">
        {visibleQuestions.length === 0 ? (
          <div className="section-empty-state">
            <span className="material-symbols-rounded">check_circle</span>
            <p>No questions in this section based on your previous answers. You can proceed to the next section.</p>
          </div>
        ) : (
          section.questions.map((question) => (
            <QuestionRenderer
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(value) => onAnswerChange(question.id, value)}
              answers={answers}
              hasError={validationErrors?.includes(question.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
