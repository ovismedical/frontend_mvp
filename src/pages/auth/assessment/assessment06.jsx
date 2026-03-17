import React, { useState } from "react";
import ProgressBar from "../../../components/ui/progressbar";
import AssessmentTab from "../../../components/ui/assessment_tab";
import Button from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Assessment06 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selected, setSelected] = useState("A");
  const [sign, setSign] = useState(null);
  const [showError, setShowError] = useState(false);

  const options = ["A", "B", "AB", "O"];

  const handleSelect = (option) => {
    setSelected(option);
    setShowError(false);
  };

  const handleSignSelect = (value) => {
    setSign(value);
    setShowError(false);
  };

  const handleContinue = () => {
    if (selected && sign) {
      // Backend Handling: Push assessment data (blood type) to backend API if needed
      // Example: await api.saveAssessmentStep({ bloodType: selected + (sign === "add" ? "+" : "-") })
      navigate("/assessment07");
    } else {
      setShowError(true);
    }
  };

  const handleSkip = () => {
  // Backend Handling: Push assessment data (blood type: N/A) to backend API if needed
  // Example: await api.saveAssessmentStep({ bloodType: "N/A" })
  navigate("/assessment07");
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
          <ProgressBar currentStep={6} totalSteps={9} />
        </div>

        <button className="skip-button" onClick={() => navigate("/home")}>
          {t("skip")}
        </button>
      </div>

      <div className="assessment-content">
        <h1 className="assessment-title display">{t("assessment06_title")}</h1>

        <div className="assessment-tabs">
          <AssessmentTab options={options} onSelect={handleSelect} />
        </div>

        <div className="blood-type-display">
          <span className="blood-type-group">{selected}</span>
          {sign && (
            <div
              className={`blood-type-sign ${
                sign === "add" ? "bg-green" : "bg-red"
              }`}
            >
              <span
                className={`material-symbols-rounded blood-type-sign-chosen ${
                  sign === "add" ? "text-green" : "text-red"
                }`}
              >
                {sign}
              </span>
            </div>
          )}
        </div>

        <div className="sign-options">
          <span
            className={`material-symbols-rounded sign-option ${
              sign === "remove" ? "sign-selected" : " "
            }`}
            onClick={() => handleSignSelect("remove")}
          >
            remove
          </span>
          <span
            className={`material-symbols-rounded sign-option ${
              sign === "add" ? "sign-selected" : " "
            }`}
            onClick={() => handleSignSelect("add")}
          >
            add
          </span>
        </div>

        {showError && (
          <p className="error-message body">
            {t("Please select your full blood type (group and Rh sign).")}
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
          {t("assessment06_buttton2")}
        </Button>
      </div>
    </div>
  );
};

export default Assessment06;
