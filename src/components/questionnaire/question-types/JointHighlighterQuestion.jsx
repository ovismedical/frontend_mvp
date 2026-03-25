import React, { useState } from "react";
import Body from "react-muscle-highlighter";
import { vibrate } from "../../../utils/mobile";

// All 23 library slugs — disable everything so the body is just a silhouette
const ALL_SLUGS = [
  "abs", "adductors", "ankles", "biceps", "calves", "chest", "deltoids",
  "feet", "forearm", "gluteal", "hamstring", "hands", "hair", "head",
  "knees", "lower-back", "neck", "obliques", "quadriceps", "tibialis",
  "trapezius", "triceps", "upper-back",
];

// Joint positions as percentages of the Body SVG container (724×1448 viewBox)
// Scaled from FULL_BODY_POSITIONS (300×350) then fine-tuned
const JOINT_POSITIONS = {
  front: {
    left_shoulder:  { left: "35.1%", top: "25.7%" },
    right_shoulder: { left: "64.9%", top: "25.7%" },
    left_elbow:     { left: "27.5%", top: "37.0%" },
    right_elbow:    { left: "72.5%", top: "37.0%" },
    left_wrist:     { left: "22.5%", top: "47.0%" },
    right_wrist:    { left: "77.5%", top: "47.0%" },
    left_fingers:   { left: "20.0%", top: "53.0%" },
    right_fingers:  { left: "80.0%", top: "53.0%" },
    left_hip:       { left: "40.5%", top: "56.0%" },
    right_hip:      { left: "59.5%", top: "56.0%" },
    left_knee:      { left: "39.0%", top: "73.5%" },
    right_knee:     { left: "61.0%", top: "73.5%" },
    left_ankle:     { left: "37.5%", top: "89.5%" },
    right_ankle:    { left: "62.5%", top: "89.5%" },
    left_toes:      { left: "35.5%", top: "95.0%" },
    right_toes:     { left: "64.5%", top: "95.0%" },
  },
  back: {
    upper_back:     { left: "50.0%", top: "30.0%" },
    lower_back:     { left: "50.0%", top: "47.0%" },
  },
};

// Simple skeleton SVG — front view
const SKELETON_FRONT = (
  <svg
    viewBox="0 0 724 1448"
    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
  >
    <g fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeLinecap="round">
      {/* Skull */}
      <ellipse cx="362" cy="180" rx="55" ry="65" />
      <line x1="362" y1="245" x2="362" y2="280" />

      {/* Clavicles */}
      <line x1="260" y1="330" x2="362" y2="310" />
      <line x1="464" y1="330" x2="362" y2="310" />

      {/* Spine */}
      <line x1="362" y1="280" x2="362" y2="780" strokeDasharray="8 6" />

      {/* Ribcage */}
      <ellipse cx="362" cy="420" rx="95" ry="120" strokeDasharray="6 4" />

      {/* Pelvis */}
      <path d="M295 750 Q330 810 362 800 Q394 810 429 750" />
      <line x1="295" y1="750" x2="310" y2="810" />
      <line x1="429" y1="750" x2="414" y2="810" />

      {/* Left arm: humerus */}
      <line x1="260" y1="330" x2="210" y2="520" />
      {/* Left arm: radius/ulna */}
      <line x1="210" y1="520" x2="170" y2="680" />
      <line x1="210" y1="520" x2="160" y2="670" />
      {/* Left hand */}
      <ellipse cx="155" cy="720" rx="20" ry="30" />

      {/* Right arm: humerus */}
      <line x1="464" y1="330" x2="514" y2="520" />
      {/* Right arm: radius/ulna */}
      <line x1="514" y1="520" x2="554" y2="680" />
      <line x1="514" y1="520" x2="564" y2="670" />
      {/* Right hand */}
      <ellipse cx="569" cy="720" rx="20" ry="30" />

      {/* Left leg: femur */}
      <line x1="310" y1="810" x2="300" y2="1050" />
      {/* Left leg: tibia/fibula */}
      <line x1="300" y1="1050" x2="285" y2="1290" />
      <line x1="300" y1="1050" x2="295" y2="1290" />
      {/* Left foot */}
      <path d="M275 1310 L285 1290 L295 1290 L305 1350 L265 1350 Z" />

      {/* Right leg: femur */}
      <line x1="414" y1="810" x2="424" y2="1050" />
      {/* Right leg: tibia/fibula */}
      <line x1="424" y1="1050" x2="429" y2="1290" />
      <line x1="424" y1="1050" x2="439" y2="1290" />
      {/* Right foot */}
      <path d="M449 1310 L439 1290 L429 1290 L419 1350 L459 1350 Z" />

      {/* Kneecaps */}
      <circle cx="300" cy="1050" r="18" />
      <circle cx="424" cy="1050" r="18" />
    </g>
  </svg>
);

// Simple skeleton SVG — back view
const SKELETON_BACK = (
  <svg
    viewBox="0 0 724 1448"
    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
  >
    <g fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeLinecap="round">
      {/* Skull */}
      <ellipse cx="362" cy="180" rx="55" ry="65" />
      <line x1="362" y1="245" x2="362" y2="280" />

      {/* Clavicles (back) */}
      <line x1="260" y1="330" x2="362" y2="310" />
      <line x1="464" y1="330" x2="362" y2="310" />

      {/* Spine — prominent vertebrae from back */}
      {[310, 340, 370, 400, 430, 460, 490, 520, 550, 580, 610, 640, 670, 700, 730, 760].map(y => (
        <line key={y} x1="355" y1={y} x2="369" y2={y} strokeWidth="4" />
      ))}
      <line x1="362" y1="280" x2="362" y2="780" />

      {/* Scapulae */}
      <path d="M280 350 Q310 380 310 430 Q280 420 270 380 Z" />
      <path d="M444 350 Q414 380 414 430 Q444 420 454 380 Z" />

      {/* Pelvis */}
      <path d="M295 750 Q330 810 362 800 Q394 810 429 750" />
      <line x1="295" y1="750" x2="310" y2="810" />
      <line x1="429" y1="750" x2="414" y2="810" />

      {/* Left arm: humerus */}
      <line x1="260" y1="330" x2="210" y2="520" />
      {/* Left arm: radius/ulna */}
      <line x1="210" y1="520" x2="170" y2="680" />
      <line x1="210" y1="520" x2="160" y2="670" />
      <ellipse cx="155" cy="720" rx="20" ry="30" />

      {/* Right arm: humerus */}
      <line x1="464" y1="330" x2="514" y2="520" />
      {/* Right arm: radius/ulna */}
      <line x1="514" y1="520" x2="554" y2="680" />
      <line x1="514" y1="520" x2="564" y2="670" />
      <ellipse cx="569" cy="720" rx="20" ry="30" />

      {/* Left leg: femur */}
      <line x1="310" y1="810" x2="300" y2="1050" />
      <line x1="300" y1="1050" x2="285" y2="1290" />
      <line x1="300" y1="1050" x2="295" y2="1290" />
      <path d="M275 1310 L285 1290 L295 1290 L305 1350 L265 1350 Z" />

      {/* Right leg: femur */}
      <line x1="414" y1="810" x2="424" y2="1050" />
      <line x1="424" y1="1050" x2="429" y2="1290" />
      <line x1="424" y1="1050" x2="439" y2="1290" />
      <path d="M449 1310 L439 1290 L429 1290 L419 1350 L459 1350 Z" />
    </g>
  </svg>
);

export default function JointHighlighterQuestion({ question, value, onChange }) {
  const selectedAreas = value || [];
  const regions = question.bodyRegions || [];
  const [activeView, setActiveView] = useState("front");

  const positions = JOINT_POSITIONS[activeView] || {};
  const visibleRegions = regions.filter(r => r.side === activeView);

  const handleJointClick = (regionValue) => {
    vibrate(5);
    const newSelection = selectedAreas.includes(regionValue)
      ? selectedAreas.filter(v => v !== regionValue)
      : [...selectedAreas, regionValue];
    onChange(newSelection);
  };

  return (
    <div className="body-diagram-question">
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

      <div className="body-diagram-container">
        <div className="joint-highlighter-wrapper">
          {/* Base layer: body silhouette */}
          <div className="joint-highlighter-body">
            <Body
              data={[]}
              side={activeView}
              gender="male"
              scale={1.4}
              colors={[]}
              defaultFill="#3f3f3f"
              border="#c4c4c4"
              disabledParts={ALL_SLUGS}
            />
          </div>

          {/* Middle layer: skeleton */}
          {activeView === "front" ? SKELETON_FRONT : SKELETON_BACK}

          {/* Top layer: joint dots */}
          <div className="joint-overlay-container">
            {visibleRegions.map((region) => {
              const pos = positions[region.value];
              if (!pos) return null;
              const isSelected = selectedAreas.includes(region.value);
              return (
                <button
                  key={region.value}
                  className={`joint-dot${isSelected ? " selected" : ""}`}
                  style={{ left: pos.left, top: pos.top }}
                  onClick={() => handleJointClick(region.value)}
                  aria-pressed={isSelected}
                  aria-label={region.label}
                >
                  <span className="joint-dot-inner" />
                </button>
              );
            })}
          </div>
        </div>

        <p className="body-diagram-hint">
          Tap a joint to select it.
          {selectedAreas.length > 0 && ` ${selectedAreas.length} selected.`}
        </p>

        {/* Selected chips */}
        {selectedAreas.length > 0 && (
          <div className="body-selected-chips">
            {selectedAreas.map((areaValue) => {
              const region = regions.find(r => r.value === areaValue);
              return (
                <button
                  key={areaValue}
                  className="body-chip"
                  onClick={() => onChange(selectedAreas.filter(v => v !== areaValue))}
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
