import React from "react";
import Button from "../../components/ui/button.jsx";
import onboarding01Img from "../../assets/images/onboarding01.png";
import { useNavigate } from "react-router-dom";

const Onboarding01 = () => {
  const navigate = useNavigate();

  return (
    <div className="onboarding-container" data-scale="large">
      <div className="onboarding-progress-bar">
        <div className="step active" />
        <div className="step" />
        <div className="step" />
        <div className="step" />
      </div>

      <div className="onboarding-middle-section">
        <h1 className="onboarding-title display">
          Personalized Health That You Can Control
        </h1>
        <p className="onboarding-subtitle body">
          Begin your wellness journey with confidence, easy to manage and always
          in your hands.
        </p>

        <img
          src={onboarding01Img}
          alt="Wellness Score"
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
            onClick={() => navigate("/onboarding02")}
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

export default Onboarding01;
