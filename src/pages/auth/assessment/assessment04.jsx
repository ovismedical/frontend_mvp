import React, { useState } from "react";
import ProgressBar from "../../../components/ui/progressbar";
import HeightPicker from "../../../components/picker/heightPicker.jsx";
import AssessmentTab from "../../../components/ui/assessment_tab";
import Button from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Assessment04 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedUnit, setSelectedUnit] = useState("cm");
  const [heightValue, setHeightValue] = useState({});
  const [showError, setShowError] = useState(false);

  const options = ["cm", "inch"];

  const handleSelect = (option) => {
    setSelectedUnit(option);
    setHeightValue({});
    setShowError(false); // Reset error if switching unit
  };

  const handleHeightChange = (val) => {
    setHeightValue(val);
    if (val?.height) setShowError(false);
  };

  const handleContinue = () => {
    if (heightValue?.height) {
      // Backend Handling: Push assessment data (height) to backend API if needed
      // Example: await api.saveAssessmentStep({ height: heightValue.height, unit: selectedUnit })
      navigate("/assessment05");
    } else {
      setShowError(true);
    }
  };

  const isHeightSelected = !!heightValue?.height;

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
          <ProgressBar currentStep={4} totalSteps={9} />
        </div>

        <button className="skip-button" onClick={() => navigate("/home")}>
          {t("skip")}
        </button>
      </div>

      <div className="assessment-content">
        <h1 className="assessment-title display">{t("assessment04_title")}</h1>
        <p className="assessment-subtitle h4">{t("assessment04_subtitle")}</p>

        <div className="assessment-tabs">
          <AssessmentTab options={options} onSelect={handleSelect} />
        </div>

        <HeightPicker
          unit={selectedUnit}
          value={heightValue}
          onChange={handleHeightChange}
        />

        {showError && (
          <p className="error-message caption">Please select your height.</p>
        )}

        <Button
          variant="filled"
          iconName="arrow_forward"
          iconPosition="right"
          iconFill={1}
          onClick={handleContinue}
          className="assessment-button body"
          disabled={false} // allow click to trigger error
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
};

export default Assessment04;
