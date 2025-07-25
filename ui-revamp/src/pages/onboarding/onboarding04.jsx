import React from "react";
import Button from "../../components/ui/button.jsx";
import onboarding04Img from "../../assets/images/onboarding04.png";
import { useNavigate } from "react-router-dom";

const Onboarding04 = () => {
  const navigate = useNavigate();

  return (
    <div className="onboarding-container" data-scale="large">
      <div className="onboarding-progress-bar">
        <div
          className="step active"
          onClick={() => navigate("/onboarding01")}
        />
        <div
          className="step active"
          onClick={() => navigate("/onboarding02")}
        />
        <div
          className="step active"
          onClick={() => navigate("/onboarding03")}
        />
        <div className="step active" />
      </div>

      <div className="onboarding-middle-section">
        <h1 className="onboarding-title display">Trusted Wellness Companion</h1>
        <p className="onboarding-subtitle body">
          Empowering millions to live healthier lives and happier lives, backed
          with our LLMs.
        </p>

        <img
          src={onboarding04Img}
          alt="Trusted Wellness Companion"
          className="onboarding-image"
        />
      </div>

      <div className="onboarding-bottom-section">
        <div className="onboarding-button-row">
          <Button variant="outline">Skip</Button>
          <Button
            variant="filled"
            iconName="arrow_forward"
            iconPosition="right"
            iconFill={1}
          >
            Next
          </Button>
        </div>

        <p className="onboarding-footer caption">
          Got a question? Visit our{" "}
          <a href="#" className="helpCenter-link caption">
            Help Center!
          </a>
        </p>
      </div>
    </div>
  );
};

export default Onboarding04;
