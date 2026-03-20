import React, { useCallback } from "react";
import { vibrate } from "../../../utils/mobile";

export default function SliderQuestion({ question, value, onChange }) {
  const { min = 0, max = 10, step = 1, unit = "", minLabel, maxLabel } = question.sliderConfig || {};

  const edgeLabel = (v) => {
    if (v === min && minLabel) return minLabel;
    if (v === max && maxLabel) return maxLabel;
    return `${v}${unit}`;
  };
  const isActivated = value !== undefined;

  const handleActivate = useCallback((e) => {
    let ratio = 0.5; // default to midpoint for keyboard activation
    if (e.clientX !== undefined && e.clientX !== 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    }
    const raw = min + ratio * (max - min);
    const snapped = Math.round(raw / step) * step;
    const clamped = Math.max(min, Math.min(max, parseFloat(snapped.toFixed(10))));
    vibrate(5);
    onChange(clamped);
  }, [min, max, step, onChange]);

  const handleSliderChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (newValue !== value) {
      vibrate(2);
      onChange(newValue);
    }
  };

  const handlePlaceholderKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate(e);
    }
  };

  return (
    <div className="slider-question">
      <div className={`slider-container${!isActivated ? " unactivated" : ""}`}>
        {!isActivated ? (
          <>
            <div
              className="slider-placeholder"
              onClick={handleActivate}
              onKeyDown={handlePlaceholderKeyDown}
              role="button"
              tabIndex={0}
              aria-label="Tap to set slider value"
            >
              <div className="slider-placeholder-track" />
            </div>
            <div className="slider-activate-prompt">
              Tap to set value
            </div>
          </>
        ) : (
          <>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={handleSliderChange}
              className="slider"
              aria-valuetext={edgeLabel(value)}
            />
            <div className="slider-value-display">
              {edgeLabel(value)}
            </div>
          </>
        )}
        <div className="slider-labels">
          <span className="slider-min">{minLabel || `${min}${unit}`}</span>
          <span className="slider-max">{maxLabel || `${max}${unit}`}</span>
        </div>
      </div>
    </div>
  );
}
