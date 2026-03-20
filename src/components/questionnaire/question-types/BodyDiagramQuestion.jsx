import React, { useState } from "react";
import { vibrate } from "../../../utils/mobile";

// Anatomically proportioned body outline — front view
const BODY_OUTLINE_FRONT = (
  <g className="body-outline" fill="none" stroke="var(--neutral-300)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Head */}
    <ellipse cx="150" cy="38" rx="22" ry="28" />
    {/* Neck */}
    <path d="M140 65 L140 78 L160 78 L160 65" />
    {/* Shoulders + Torso */}
    <path d="M100 88 Q120 78 140 78 L160 78 Q180 78 200 88 L200 95 Q195 92 190 92 L190 175 Q190 192 175 195 L125 195 Q110 192 110 175 L110 92 Q105 92 100 95 Z" />
    {/* Left arm */}
    <path d="M100 95 Q92 100 88 115 L78 155 Q75 165 72 172" />
    <path d="M100 88 Q95 92 92 100 L82 140 Q78 152 76 160" />
    {/* Left hand */}
    <ellipse cx="73" cy="172" rx="7" ry="10" />
    {/* Right arm */}
    <path d="M200 95 Q208 100 212 115 L222 155 Q225 165 228 172" />
    <path d="M200 88 Q205 92 208 100 L218 140 Q222 152 224 160" />
    {/* Right hand */}
    <ellipse cx="227" cy="172" rx="7" ry="10" />
    {/* Hip divider */}
    <line x1="150" y1="195" x2="150" y2="210" stroke="var(--neutral-200)" strokeWidth="1" />
    {/* Left leg */}
    <path d="M125 195 Q122 220 120 245 L118 280 Q116 300 115 315" />
    <path d="M140 195 Q138 220 136 245 L134 280 Q130 300 128 315" />
    {/* Left foot */}
    <path d="M115 315 Q112 325 108 328 Q105 330 108 332 L126 332 Q130 330 128 315" />
    {/* Right leg */}
    <path d="M160 195 Q162 220 164 245 L166 280 Q170 300 172 315" />
    <path d="M175 195 Q178 220 180 245 L182 280 Q184 300 185 315" />
    {/* Right foot */}
    <path d="M172 315 Q170 330 172 332 L192 332 Q195 330 192 328 Q188 325 185 315" />
  </g>
);

// Body outline — back view
const BODY_OUTLINE_BACK = (
  <g className="body-outline" fill="none" stroke="var(--neutral-300)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Head (back) */}
    <ellipse cx="150" cy="38" rx="22" ry="28" />
    {/* Neck */}
    <path d="M140 65 L140 78 L160 78 L160 65" />
    {/* Shoulders + Torso */}
    <path d="M100 88 Q120 78 140 78 L160 78 Q180 78 200 88 L200 95 Q195 92 190 92 L190 175 Q190 192 175 195 L125 195 Q110 192 110 175 L110 92 Q105 92 100 95 Z" />
    {/* Spine */}
    <line x1="150" y1="90" x2="150" y2="175" stroke="var(--neutral-200)" strokeWidth="1" strokeDasharray="4 3" />
    {/* Shoulder blades */}
    <path d="M126 102 Q136 97 141 108 Q136 119 126 121 Q118 115 120 107 Z" fill="none" stroke="var(--neutral-200)" strokeWidth="1" />
    <path d="M174 102 Q164 97 159 108 Q164 119 174 121 Q182 115 180 107 Z" fill="none" stroke="var(--neutral-200)" strokeWidth="1" />
    {/* Left arm */}
    <path d="M100 95 Q92 100 88 115 L78 155 Q75 165 72 172" />
    <path d="M100 88 Q95 92 92 100 L82 140 Q78 152 76 160" />
    {/* Left hand */}
    <ellipse cx="73" cy="172" rx="7" ry="10" />
    {/* Right arm */}
    <path d="M200 95 Q208 100 212 115 L222 155 Q225 165 228 172" />
    <path d="M200 88 Q205 92 208 100 L218 140 Q222 152 224 160" />
    {/* Right hand */}
    <ellipse cx="227" cy="172" rx="7" ry="10" />
    {/* Hip divider */}
    <line x1="150" y1="195" x2="150" y2="210" stroke="var(--neutral-200)" strokeWidth="1" />
    {/* Left leg */}
    <path d="M125 195 Q122 220 120 245 L118 280 Q116 300 115 315" />
    <path d="M140 195 Q138 220 136 245 L134 280 Q130 300 128 315" />
    {/* Left foot */}
    <path d="M115 315 Q112 325 108 328 Q105 330 108 332 L126 332 Q130 330 128 315" />
    {/* Right leg */}
    <path d="M160 195 Q162 220 164 245 L166 280 Q170 300 172 315" />
    <path d="M175 195 Q178 220 180 245 L182 280 Q184 300 185 315" />
    {/* Right foot */}
    <path d="M172 315 Q170 330 172 332 L192 332 Q195 330 192 328 Q188 325 185 315" />
  </g>
);

// Head outline — larger, front view
const HEAD_OUTLINE = (
  <g className="body-outline" fill="none" stroke="var(--neutral-300)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Head shape */}
    <path d="M150 30 Q220 30 220 120 Q220 190 180 220 Q165 230 150 232 Q135 230 120 220 Q80 190 80 120 Q80 30 150 30Z" />
    {/* Hairline hint */}
    <path d="M95 80 Q120 55 150 50 Q180 55 205 80" stroke="var(--neutral-200)" strokeWidth="1" />
    {/* Eyes */}
    <ellipse cx="122" cy="125" rx="14" ry="7" />
    <circle cx="122" cy="125" r="4" fill="var(--neutral-200)" />
    <ellipse cx="178" cy="125" rx="14" ry="7" />
    <circle cx="178" cy="125" r="4" fill="var(--neutral-200)" />
    {/* Nose */}
    <path d="M150 135 L146 160 Q148 164 150 164 Q152 164 154 160 Z" />
    {/* Mouth */}
    <path d="M135 180 Q142 188 150 188 Q158 188 165 180" />
    {/* Ears */}
    <path d="M78 110 Q68 120 68 140 Q68 155 78 160" />
    <path d="M222 110 Q232 120 232 140 Q232 155 222 160" />
    {/* Neck */}
    <path d="M130 232 L130 265 L170 265 L170 232" />
  </g>
);

// Full body region positions — dots placed on anatomical landmarks
const FULL_BODY_POSITIONS = {
  left_shoulder:     { x: 105, y: 90 },
  right_shoulder:    { x: 195, y: 90 },
  left_upper_arm:    { x: 92,  y: 115 },
  right_upper_arm:   { x: 208, y: 115 },
  left_elbow:        { x: 85,  y: 138 },
  right_elbow:       { x: 215, y: 138 },
  left_lower_arm:    { x: 80,  y: 152 },
  right_lower_arm:   { x: 220, y: 152 },
  left_wrist:        { x: 75,  y: 165 },
  right_wrist:       { x: 225, y: 165 },
  left_fingers:      { x: 71,  y: 180 },
  right_fingers:     { x: 229, y: 180 },
  upper_back:        { x: 150, y: 110 },
  lower_back:        { x: 150, y: 165 },
  abdomen:           { x: 150, y: 140 },
  neck:              { x: 150, y: 72 },
  left_chest_male:   { x: 130, y: 108 },
  right_chest_male:  { x: 170, y: 108 },
  left_breast_female:  { x: 130, y: 108 },
  right_breast_female: { x: 170, y: 108 },
  left_hip:          { x: 128, y: 195 },
  right_hip:         { x: 172, y: 195 },
  left_upper_leg:    { x: 130, y: 228 },
  right_upper_leg:   { x: 170, y: 228 },
  left_knee:         { x: 126, y: 265 },
  right_knee:        { x: 174, y: 265 },
  left_lower_leg:    { x: 122, y: 295 },
  right_lower_leg:   { x: 178, y: 295 },
  left_ankle:        { x: 118, y: 318 },
  right_ankle:       { x: 180, y: 318 },
  left_toes:         { x: 112, y: 332 },
  right_toes:        { x: 186, y: 332 },
  left_buttock:      { x: 132, y: 200 },
  right_buttock:     { x: 168, y: 200 },
  left_jaw:          { x: 134, y: 50 },
  right_jaw:         { x: 166, y: 50 },
  left_chest:        { x: 130, y: 108 },
  right_chest:       { x: 170, y: 108 },
  left_bicep:        { x: 92,  y: 115 },
  right_bicep:       { x: 208, y: 115 },
  left_tricep:       { x: 92,  y: 115 },
  right_tricep:      { x: 208, y: 115 },
  left_quadriceps:   { x: 130, y: 228 },
  right_quadriceps:  { x: 170, y: 228 },
  left_hamstrings:   { x: 130, y: 228 },
  right_hamstrings:  { x: 170, y: 228 },
};

// Head region positions
const HEAD_POSITIONS = {
  forehead:     { x: 150, y: 75 },
  top_head:     { x: 150, y: 45 },
  left_head:    { x: 88,  y: 135 },
  right_head:   { x: 212, y: 135 },
  back_head:    { x: 150, y: 185 },
  left_temple:  { x: 88,  y: 110 },
  right_temple: { x: 212, y: 110 },
  behind_eyes:  { x: 150, y: 130 },
};

function isHeadDiagram(bodyRegions) {
  const headRegions = new Set(Object.keys(HEAD_POSITIONS));
  return bodyRegions.every(r => headRegions.has(r.value));
}

export default function BodyDiagramQuestion({ question, value, onChange }) {
  const selectedAreas = value || [];
  const regions = question.bodyRegions || [];
  const isHead = isHeadDiagram(regions);

  const hasFrontBack = regions.some(r => r.side === "front" || r.side === "back");
  const [activeView, setActiveView] = useState("front");

  const visibleRegions = hasFrontBack ? regions.filter(r => r.side === activeView) : regions;
  const positionMap = isHead ? HEAD_POSITIONS : FULL_BODY_POSITIONS;
  const outlineSvg = isHead ? HEAD_OUTLINE : (hasFrontBack && activeView === "back" ? BODY_OUTLINE_BACK : BODY_OUTLINE_FRONT);
  const viewBox = isHead ? "0 0 300 280" : "0 0 300 350";

  const handleAreaClick = (areaValue) => {
    vibrate(5);
    const newSelection = selectedAreas.includes(areaValue)
      ? selectedAreas.filter(v => v !== areaValue)
      : [...selectedAreas, areaValue];
    onChange(newSelection);
  };

  return (
    <div className="body-diagram-question">
      {hasFrontBack && (
        <div className="body-view-toggle">
          <button
            className={`body-view-btn${activeView === "front" ? " active" : ""}`}
            onClick={() => setActiveView("front")}
          >
            Front
          </button>
          <button
            className={`body-view-btn${activeView === "back" ? " active" : ""}`}
            onClick={() => setActiveView("back")}
          >
            Back
          </button>
        </div>
      )}
      <div className="body-diagram-container">
        <div className="body-diagram-svg-wrapper">
          <svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
            {outlineSvg}

            {/* Clickable region dots */}
            {visibleRegions.map((region) => {
              const pos = positionMap[region.value];
              if (!pos) return null;
              const isSelected = selectedAreas.includes(region.value);

              return (
                <g
                  key={region.value}
                  onClick={() => handleAreaClick(region.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleAreaClick(region.value); } }}
                  style={{ cursor: "pointer" }}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={region.label}
                  tabIndex={0}
                >
                  {/* Larger invisible hit area */}
                  <circle cx={pos.x} cy={pos.y} r={18} fill="transparent" />
                  {/* Visible dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 10 : 7}
                    className={`body-region-dot ${isSelected ? "selected" : ""}`}
                  />
                  {isSelected && (
                    <text
                      x={pos.x}
                      y={pos.y + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize="9"
                      fontWeight="700"
                    >
                      ✓
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Instruction */}
        <p className="body-diagram-hint">
          Tap the dots on the body to select areas. {selectedAreas.length > 0 && `${selectedAreas.length} selected.`}
        </p>

        {/* Selected chips — show all selected across both views */}
        {selectedAreas.length > 0 && (
          <div className="body-selected-chips">
            {selectedAreas.map((areaValue) => {
              const region = regions.find(r => r.value === areaValue);
              return (
                <button
                  key={areaValue}
                  className="body-chip"
                  onClick={() => handleAreaClick(areaValue)}
                >
                  {region?.label || areaValue}
                  <span className="material-symbols-rounded">close</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
