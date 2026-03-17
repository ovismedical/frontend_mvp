import React, { useState } from "react";
import ProgressBar from "../../../components/ui/progressbar";
import SelectionOption from "../../../components/ui/selectionOption";
import Button from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Assessment08 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");

  const handleSelect = (label) => {
    if (label === "None") {
      setSelected((prev) => (prev.includes("None") ? [] : ["None"]));
    } else {
      setSelected((prev) => {
        const newSelection = prev.includes(label)
          ? prev.filter((item) => item !== label)
          : [...prev.filter((item) => item !== "None"), label];
        return newSelection;
      });
    }
    setError("");
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      setError("Please select at least one option.");
    } else {
      // Backend Handling: Push assessment data (activities) to backend API if needed
      // Example: await api.saveAssessmentStep({ activities: selected })
      navigate("/assessment09");
    }
  };

  const options = [
    { label: "Jogging", icon: "directions_run" },
    { label: "Rowing", icon: "rowing" },
    { label: "Staking", icon: "skateboarding" },
    { label: "Swimming", icon: "pool" },
    { label: "Cycling", icon: "pedal_bike" },
    { label: "Walking", icon: "steps" },
    { label: "Other", icon: "fitness_center" },
    { label: "None", icon: "block" },
  ];

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <span
          className="material-symbols-rounded chevronB_icon"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>

        <div className="progress-bar-container">
          <ProgressBar currentStep={8} totalSteps={9} />
        </div>

        <button className="skip-button" onClick={() => navigate("/home")}>
          {t("skip")}
        </button>
      </div>

      <div className="assessment-content">
        <h1 className="assessment-title display">{t("assessment08_title")}</h1>
        <p className="assessment-subtitle h4">{t("assessment08_subtitle")}</p>

        <div className="selection-options-group">
          {options.map(({ label, icon }) => (
            <SelectionOption
              key={label}
              label={label}
              icon={
                <span className="material-symbols-rounded gender_icons">
                  {icon}
                </span>
              }
              selected={selected.includes(label)}
              onClick={() => handleSelect(label)}
              disabled={selected.includes("None") && label !== "None"}
            />
          ))}
        </div>

        {error && <p className="error-message caption">{error}</p>}

        <Button
          variant="filled"
          iconName="arrow_forward"
          iconPosition="right"
          iconFill={1}
          onClick={handleContinue}
          className="assessment-button body"
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
};

export default Assessment08;
