import React, { useState } from "react";
import ProgressBar from "../../../components/ui/progressbar";
import FrequencyPicker from "../../../components/picker/frequencyPicker.jsx";
import Button from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackButton from "../../../components/ui/backButton";
const Assessment09 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selected, setSelected] = useState("");
  const [error, setError] = useState(false);

  const handleContinue = () => {
    if (!selected || selected.trim() === "") {
      setError(true);
      return;
    }
    // Backend Handling: Push assessment data (frequency) to backend API if needed
    // Example: await api.saveAssessmentStep({ frequency: selected })
    navigate("/home");
  };

  const handleNotSure = () => {
  setSelected("N/A");
  // Backend Handling: Push assessment data (frequency: N/A) to backend API if needed
  // Example: await api.saveAssessmentStep({ frequency: "N/A" })
  navigate("/home");
  };

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <BackButton className="chevronB_icon" onClick={() => navigate(-1)} />

        <div className="progress-bar-container">
          <ProgressBar currentStep={9} totalSteps={9} />
        </div>

        <button className="skip-button" onClick={() => navigate("/home")}>
          {t("skip")}
        </button>
      </div>

      <div className="assessment-content">
        <h1 className="assessment-title display">{t("assessment09_title")}</h1>

        <FrequencyPicker
          selected={selected}
          onChange={(val) => {
            setSelected(val);
            setError(false);
          }}
        />

        {error && (
          <div className="error-message caption">
            Please select a frequency.
          </div>
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
          onClick={handleNotSure}
          className="assessment-button2 body"
        >
          {t("assessment09_button2")}
        </Button>
      </div>
    </div>
  );
};

export default Assessment09;
