import React, { useState } from "react";
import Body from "react-muscle-highlighter";
import { vibrate } from "../../../utils/mobile";

// Map our question region values → library slug + optional side
const REGION_MAP = {
  // Front view
  left_neck:         { slug: "neck",        side: "left"  },
  right_neck:        { slug: "neck",        side: "right" },
  left_chest:        { slug: "chest",       side: "left"  },
  right_chest:       { slug: "chest",       side: "right" },
  left_abdomen:      { slug: "abs",         side: "left"  },
  right_abdomen:     { slug: "abs",         side: "right" },
  left_shoulder:     { slug: "deltoids",    side: "left"  },
  right_shoulder:    { slug: "deltoids",    side: "right" },
  left_bicep:        { slug: "biceps",      side: "left"  },
  right_bicep:       { slug: "biceps",      side: "right" },
  left_lower_arm:    { slug: "forearm",     side: "left"  },
  right_lower_arm:   { slug: "forearm",     side: "right" },
  left_hand:         { slug: "hands",       side: "left"  },
  right_hand:        { slug: "hands",       side: "right" },
  left_oblique:      { slug: "obliques",    side: "left"  },
  right_oblique:     { slug: "obliques",    side: "right" },
  left_adductor:     { slug: "adductors",   side: "left"  },
  right_adductor:    { slug: "adductors",   side: "right" },
  left_quadriceps:   { slug: "quadriceps",  side: "left"  },
  right_quadriceps:  { slug: "quadriceps",  side: "right" },
  left_lower_leg:    { slug: "tibialis",    side: "left"  },
  right_lower_leg:   { slug: "tibialis",    side: "right" },
  left_foot:         { slug: "feet",        side: "left"  },
  right_foot:        { slug: "feet",        side: "right" },
  // Back view
  left_trapezius:    { slug: "trapezius",   side: "left"  },
  right_trapezius:   { slug: "trapezius",   side: "right" },
  left_upper_back:   { slug: "upper-back",  side: "left"  },
  right_upper_back:  { slug: "upper-back",  side: "right" },
  left_lower_back:   { slug: "lower-back",  side: "left"  },
  right_lower_back:  { slug: "lower-back",  side: "right" },
  left_buttock:      { slug: "gluteal",     side: "left"  },
  right_buttock:     { slug: "gluteal",     side: "right" },
  left_tricep:       { slug: "triceps",     side: "left"  },
  right_tricep:      { slug: "triceps",     side: "right" },
  left_hamstrings:   { slug: "hamstring",   side: "left"  },
  right_hamstrings:  { slug: "hamstring",   side: "right" },
  left_calf:         { slug: "calves",      side: "left"  },
  right_calf:        { slug: "calves",      side: "right" },
};

// Reverse map: "slug_side" or "slug" → our regionKey
const SLUG_TO_REGION = Object.fromEntries(
  Object.entries(REGION_MAP).map(([regionKey, { slug, side }]) => [
    side ? `${slug}_${side}` : slug,
    regionKey,
  ])
);

const DISABLED_SLUGS = ["head", "hair", "knees", "ankles"];

const PRIMARY       = "#926df8";
const PRIMARY_LIGHT = "#e8dcfd";

export default function MuscleHighlighterQuestion({ question, value, onChange }) {
  const selectedAreas = value || [];
  const regions = question.bodyRegions || [];
  const [activeView, setActiveView] = useState("front");

  // Regions not supported by the library (e.g. jaw) — rendered as chip toggles
  const extraRegions = regions.filter(r => !REGION_MAP[r.value]);

  // Build the library's data prop — consolidate per slug so both sides can highlight.
  // The library uses data.find(slug) so duplicate slugs cause only the first to apply.
  const libraryData = (() => {
    const slugSides = {};
    for (const key of selectedAreas) {
      const mapping = REGION_MAP[key];
      if (!mapping) continue;
      if (!slugSides[mapping.slug]) slugSides[mapping.slug] = new Set();
      if (mapping.side) slugSides[mapping.slug].add(mapping.side);
    }
    return Object.entries(slugSides).map(([slug, sides]) =>
      sides.size >= 2
        ? { slug, intensity: 1 }
        : { slug, side: [...sides][0], intensity: 1 }
    );
  })();

  const handleBodyPartPress = (part, side) => {
    vibrate(5);
    const key = side ? `${part.slug}_${side}` : part.slug;
    const regionKey = SLUG_TO_REGION[key];
    if (!regionKey) return; // unmapped slug — ignore
    const newSelection = selectedAreas.includes(regionKey)
      ? selectedAreas.filter(v => v !== regionKey)
      : [...selectedAreas, regionKey];
    onChange(newSelection);
  };

  const handleExtraToggle = (regionValue) => {
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
        <div className="muscle-highlighter-wrapper">
          <Body
            data={libraryData}
            side={activeView}
            gender="male"
            scale={1.4}
            colors={[PRIMARY_LIGHT, PRIMARY]}
            defaultFill="#3f3f3f"
            border="#c4c4c4"
            onBodyPartPress={handleBodyPartPress}
            disabledParts={DISABLED_SLUGS}
          />
        </div>

        <p className="body-diagram-hint">
          Tap a muscle group to select it.
          {selectedAreas.length > 0 && ` ${selectedAreas.length} selected.`}
        </p>

        {/* Regions not in the library (jaw) — rendered as chip-style toggles */}
        {extraRegions.length > 0 && (
          <div className="muscle-extra-regions">
            <div className="options-container">
              {extraRegions.map(region => (
                <button
                  key={region.value}
                  className={`option-button ${selectedAreas.includes(region.value) ? "selected" : ""}`}
                  onClick={() => handleExtraToggle(region.value)}
                  aria-pressed={selectedAreas.includes(region.value)}
                >
                  <span className="material-symbols-rounded option-icon">
                    {selectedAreas.includes(region.value) ? "check_box" : "check_box_outline_blank"}
                  </span>
                  <span className="option-label">{region.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected chips — all selections across both views */}
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
