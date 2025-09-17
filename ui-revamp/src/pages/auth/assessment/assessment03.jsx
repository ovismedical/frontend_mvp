import React, { useState } from "react";
import ProgressBar from "../../../components/ui/progressbar";
import SelectionOption from "../../../components/ui/selectionOption";
import Button from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Assessment03 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selected, setSelected] = useState(null); // No selection initially
  const [error, setError] = useState(false);

  const options = [
    { label: "Male", icon: "male" },
    { label: "Female", icon: "female" },
    { label: "Other", icon: "transgender" },
  ];

  const handleContinue = () => {
    if (!selected) {
      setError(true);
      return;
    }

  setError(false);
  // Backend Handling: Push assessment data (gender) to backend API if needed
  // Example: await api.saveAssessmentStep({ gender: selected })
  console.log("Selected Gender:", selected); // Save/print the value
  navigate("/assessment04");
  };

  const handleSkip = () => {
  setSelected("N/A");
  // Backend Handling: Push assessment data (gender: N/A) to backend API if needed
  // Example: await api.saveAssessmentStep({ gender: "N/A" })
  console.log("Selected Gender: N/A");
  navigate("/assessment04");
  };

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
          <ProgressBar currentStep={3} totalSteps={9} />
        </div>
      </div>

      <div className="assessment-content">
        <h1 className="assessment-title display">{t("assessment03_title")}</h1>
        <p className="assessment-subtitle h4">{t("assessment03_subtitle")}</p>

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
              selected={selected === label}
              onClick={() => {
                setSelected(label);
                setError(false);
              }}
            />
          ))}
        </div>

        {error && (
          <p className="error-message caption">
            Please select an option to continue.
          </p>
        )}

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

        <Button
          variant="outline"
          iconName="close"
          iconPosition="left"
          iconFill={1}
          onClick={handleSkip}
          className="assessment-button2 body"
        >
          {t("assessment03_button2")}
        </Button>
      </div>
    </div>
  );
};

export default Assessment03;
