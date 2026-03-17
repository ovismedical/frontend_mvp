import React, { useState } from "react";
import ProgressBar from "../../../components/ui/progressbar";
import AssessmentTab from "../../../components/ui/assessment_tab";
import WeightPicker from "../../../components/picker/weightPicker";
import Button from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Assessment05 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [weight, setWeight] = useState(null); // no default
  const [selected, setSelected] = useState("kg");
  const [showError, setShowError] = useState(false);

  const options = ["kg", "lbs"];

  const handleSelect = (option) => {
    setSelected(option);
    setWeight(null); // reset weight when switching unit
    setShowError(false); // reset error
  };

  const handleWeightChange = (val) => {
    setWeight(val);
    if (val !== null) setShowError(false);
  };

  const handleContinue = () => {
    if (weight !== null) {
      // Backend Handling: Push assessment data (weight) to backend API if needed
      // Example: await api.saveAssessmentStep({ weight, unit: selected })
      navigate("/assessment06");
    } else {
      setShowError(true);
    }
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
          <ProgressBar currentStep={5} totalSteps={9} />
        </div>

        <button className="skip-button" onClick={() => navigate("/home")}>
          {t("skip")}
        </button>
      </div>

      <div className="assessment-content">
        <h1 className="assessment-title display">{t("assessment05_title")}</h1>
        <p className="assessment-subtitle h4">{t("assessment05_subtitle")}</p>

        <div className="assessment-tabs">
          <AssessmentTab options={options} onSelect={handleSelect} />
        </div>

        <div className="weight-picker-container">
          <WeightPicker unit={selected} onChange={handleWeightChange} />
        </div>

        {showError && (
          <p className="error-message body">Please select your weight.</p>
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
      </div>
    </div>
  );
};

export default Assessment05;
