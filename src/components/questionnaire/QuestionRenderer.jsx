import React from "react";
import RatingQuestion from "./question-types/RatingQuestion";
import SingleSelectQuestion from "./question-types/SingleSelectQuestion";
import MultiSelectQuestion from "./question-types/MultiSelectQuestion";
import TextInputQuestion from "./question-types/TextInputQuestion";
import SliderQuestion from "./question-types/SliderQuestion";
import BodyDiagramQuestion from "./question-types/BodyDiagramQuestion";
import ColorChartQuestion from "./question-types/ColorChartQuestion";

export default function QuestionRenderer({ question, value, onChange, answers, hasError }) {
  // Check conditional logic
  if (question.conditional) {
    const dependentValue = answers[question.conditional.dependsOn];
    if (!question.conditional.showIf(dependentValue)) {
      return null;
    }
  }

  const renderQuestion = () => {
    switch (question.type) {
      case "rating":
        return (
          <RatingQuestion
            question={question}
            value={value}
            onChange={onChange}
          />
        );
      case "single-select":
        return (
          <SingleSelectQuestion
            question={question}
            value={value}
            onChange={onChange}
          />
        );
      case "multi-select":
        return (
          <MultiSelectQuestion
            question={question}
            value={value}
            onChange={onChange}
          />
        );
      case "text":
        return (
          <TextInputQuestion
            question={question}
            value={value}
            onChange={onChange}
          />
        );
      case "slider":
        return (
          <SliderQuestion
            question={question}
            value={value}
            onChange={onChange}
          />
        );
      case "body-diagram":
        return (
          <BodyDiagramQuestion
            question={question}
            value={value}
            onChange={onChange}
          />
        );
      case "color-chart":
        return (
          <ColorChartQuestion
            question={question}
            value={value}
            onChange={onChange}
          />
        );
      default:
        return <div>Unsupported question type: {question.type}</div>;
    }
  };

  return (
    <div
      className={`question-wrapper ${hasError ? "has-error" : ""}`}
      aria-required={question.required || undefined}
    >
      <div className="question-header">
        <h3 className="h3" id={`question-${question.id}`}>{question.text}</h3>
        {question.required && (
          <span className="required-indicator" aria-hidden="true">*</span>
        )}
      </div>
      {renderQuestion()}
      {hasError && (
        <div className="validation-error" role="alert">
          <span className="material-symbols-rounded" aria-hidden="true">error</span>
          <span>This field is required</span>
        </div>
      )}
    </div>
  );
}






