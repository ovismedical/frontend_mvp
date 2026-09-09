import React, { useState } from "react";
import ProgressBar from "../../../components/ui/progressbar";
import DatePicker from "../../../components/picker/datePicker.jsx";
import Button from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackButton from "../../../components/ui/backButton";
const Assessment02 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [dob, setDob] = useState({
    month: "",
    day: "",
    year: "",
  });

  const [errorMsg, setErrorMsg] = useState(""); // for inline error

  const handleContinue = () => {
    const { month, day, year } = dob;
    if (!month || !day || !year) {
      setErrorMsg("Please select your date of birth.");
      return;
    }

  setErrorMsg(""); // clear error
  // Backend Handling: Push assessment data (DOB) to backend API if needed
  // Example: await api.saveAssessmentStep({ dob })
  navigate("/assessment03");
  };

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <BackButton className="chevronB_icon" onClick={() => navigate(-1)} />

        <div className="progress-bar-container">
          <ProgressBar currentStep={2} totalSteps={9} />
        </div>
      </div>

      <div className="assessment-content">
        <h1 className="assessment-title display">{t("assessment02_title")}</h1>

        <DatePicker value={dob} onChange={setDob} />

        {errorMsg && <p className="error-message caption">{errorMsg}</p>}

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

export default Assessment02;
