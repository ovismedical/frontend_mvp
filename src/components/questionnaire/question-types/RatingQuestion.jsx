import React from "react";
import { vibrate } from "../../../utils/mobile";

// Maps option index (0-based) to a severity level 0–5 for face selection
function getSeverityLevel(index, totalOptions) {
  if (totalOptions <= 1) return 2;
  return Math.round((index / (totalOptions - 1)) * 5);
}

// Returns severity CSS class name based on level
function getSeverityStyle(level) {
  if (level <= 1) return "severity-good";
  if (level <= 2) return "severity-mild";
  if (level <= 3) return "severity-moderate";
  if (level <= 4) return "severity-warning";
  return "severity-danger";
}

// Simple SVG face expressions — Wong-Baker inspired
function FaceIcon({ level }) {
  const size = 40;
  const cx = size / 2;
  const cy = size / 2;
  const r = 17;

  const eyeY = cy - 4;
  const leftEyeX = cx - 6;
  const rightEyeX = cx + 6;

  let eyes;
  let mouth;
  let extras = null;

  switch (level) {
    case 0: // Big smile — happy eyes (arcs)
      eyes = (
        <>
          <path d={`M${leftEyeX - 3},${eyeY} Q${leftEyeX},${eyeY - 4} ${leftEyeX + 3},${eyeY}`}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d={`M${rightEyeX - 3},${eyeY} Q${rightEyeX},${eyeY - 4} ${rightEyeX + 3},${eyeY}`}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      );
      mouth = (
        <path d={`M${cx - 8},${cy + 4} Q${cx},${cy + 12} ${cx + 8},${cy + 4}`}
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      );
      break;

    case 1: // Gentle smile
      eyes = (
        <>
          <circle cx={leftEyeX} cy={eyeY} r="2" fill="currentColor" />
          <circle cx={rightEyeX} cy={eyeY} r="2" fill="currentColor" />
        </>
      );
      mouth = (
        <path d={`M${cx - 6},${cy + 4} Q${cx},${cy + 9} ${cx + 6},${cy + 4}`}
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      );
      break;

    case 2: // Neutral
      eyes = (
        <>
          <circle cx={leftEyeX} cy={eyeY} r="2" fill="currentColor" />
          <circle cx={rightEyeX} cy={eyeY} r="2" fill="currentColor" />
        </>
      );
      mouth = (
        <line x1={cx - 5} y1={cy + 6} x2={cx + 5} y2={cy + 6}
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      );
      break;

    case 3: // Slight frown
      eyes = (
        <>
          <circle cx={leftEyeX} cy={eyeY} r="2" fill="currentColor" />
          <circle cx={rightEyeX} cy={eyeY} r="2" fill="currentColor" />
        </>
      );
      mouth = (
        <path d={`M${cx - 6},${cy + 8} Q${cx},${cy + 3} ${cx + 6},${cy + 8}`}
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      );
      break;

    case 4: // Worried frown + brows
      eyes = (
        <>
          <circle cx={leftEyeX} cy={eyeY} r="2" fill="currentColor" />
          <circle cx={rightEyeX} cy={eyeY} r="2" fill="currentColor" />
        </>
      );
      extras = (
        <>
          <line x1={leftEyeX - 3} y1={eyeY - 6} x2={leftEyeX + 3} y2={eyeY - 8}
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={rightEyeX - 3} y1={eyeY - 8} x2={rightEyeX + 3} y2={eyeY - 6}
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      );
      mouth = (
        <path d={`M${cx - 7},${cy + 9} Q${cx},${cy + 3} ${cx + 7},${cy + 9}`}
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      );
      break;

    case 5: // Distressed — deep frown, brows, tear
    default:
      eyes = (
        <>
          <circle cx={leftEyeX} cy={eyeY} r="2" fill="currentColor" />
          <circle cx={rightEyeX} cy={eyeY} r="2" fill="currentColor" />
        </>
      );
      extras = (
        <>
          <line x1={leftEyeX - 3} y1={eyeY - 5} x2={leftEyeX + 3} y2={eyeY - 8}
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={rightEyeX - 3} y1={eyeY - 8} x2={rightEyeX + 3} y2={eyeY - 5}
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx={rightEyeX + 3} cy={eyeY + 3} rx="1.5" ry="2.5" fill="currentColor" opacity="0.5" />
        </>
      );
      mouth = (
        <path d={`M${cx - 7},${cy + 10} Q${cx},${cy + 2} ${cx + 7},${cy + 10}`}
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      );
      break;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rating-face" aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      {eyes}
      {mouth}
      {extras}
    </svg>
  );
}

export default function RatingQuestion({ question, value, onChange }) {
  const handleRatingClick = (rating) => {
    vibrate(5);
    onChange(rating);
  };

  const totalOptions = question.options.length;

  return (
    <div className="rating-question">
      <div className="rating-scale" role="radiogroup" aria-labelledby={`question-${question.id}`}>
        {question.options.map((option, index) => {
          const isSelected = value === option.value;
          const level = getSeverityLevel(index, totalOptions);
          const severityStyle = getSeverityStyle(level);

          return (
            <button
              key={option.value}
              className={`rating-option ${severityStyle} ${isSelected ? "selected" : ""}`}
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleRatingClick(option.value)}
            >
              <FaceIcon level={level} />
              <span className="rating-label">{option.label}</span>
              {isSelected && (
                <span className="material-symbols-rounded rating-check">check_circle</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
