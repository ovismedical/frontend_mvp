import React, { useState, useEffect, useRef } from "react";
import "../../styles/components/picker/weightPicker.css";

const convertKgToLbs = (kg) => Math.round(kg * 2.20462);
const convertLbsToKg = (lbs) => Math.round(lbs / 2.20462);

const WeightPicker = ({ unit, onChange }) => {
  const [weight, setWeight] = useState(null);
  const [currentUnit, setCurrentUnit] = useState(unit);
  const scrollRef = useRef(null);

  const rulerStep = 5;
  const sliderStep = 1;

  const min = unit === "kg" ? 30 : 66;
  const max = unit === "kg" ? 150 : 330;

  const rulerMarksCount = Math.floor((max - min) / rulerStep) + 1;
  const RULER_MARK_WIDTH = 30;

  useEffect(() => {
    if (unit !== currentUnit) {
      if (weight !== null) {
        const newWeight =
          unit === "kg" ? convertLbsToKg(weight) : convertKgToLbs(weight);
        setWeight(newWeight);
        onChange(newWeight);
      } else {
        setWeight(null);
        onChange(null);
      }
      setCurrentUnit(unit);
    }
  }, [unit]);

  useEffect(() => {
    if (scrollRef.current && weight !== null) {
      const pxPerUnit = RULER_MARK_WIDTH / rulerStep;
      const index = weight - min;
      const scrollTo =
        index * pxPerUnit - scrollRef.current.clientWidth / 2 + pxPerUnit / 2;
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  }, [weight]);

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setWeight(val);
    onChange(val);
  };

  return (
    <div className="weight-picker">
      <div className="weight-display display">
        <span className="weight-value">{weight !== null ? weight : "--"}</span>
        <span className="weight-unit">{unit}</span>
      </div>

      <div className="scroll-container" ref={scrollRef}>
        <input
          type="range"
          className="weight-slider"
          style={{ width: rulerMarksCount * RULER_MARK_WIDTH }}
          min={min}
          max={max}
          step={sliderStep}
          value={weight !== null ? weight : min}
          onChange={handleSliderChange}
        />

        <div
          className="weight-ruler"
          style={{ width: rulerMarksCount * RULER_MARK_WIDTH }}
        >
          {[...Array(rulerMarksCount)].map((_, i) => {
            const val = min + i * rulerStep;
            return (
              <div
                key={val}
                className={`ruler-mark ${val === weight ? "selected" : ""}`}
              >
                <div className="ruler-line" />
                <div className="ruler-label">{val}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeightPicker;
