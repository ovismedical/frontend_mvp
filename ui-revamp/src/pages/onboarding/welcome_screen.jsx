import React from "react";
import Button from "../../components/ui/button.jsx";
import welcomeImg from "../../assets/images/welcome_screen.png";

const WelcomeScreen = () => {
  return (
    <div className="welcome-container" data-scale="large">
      <img src={welcomeImg} alt="Welcome" className="welcome-image" />

      <h1 className="welcome-title display">Welcome to Ovis!</h1>

      <p className="welcome-subtitle body">
        We bring all of your care information together on one app, with the
        power of AI
      </p>

      <Button
        variant="filled"
        iconName="arrow_forward"
        iconPosition="right"
        iconFill={1}
        onClick={() => console.log("Get Started")}
        className="welcome-button body"
      >
        Get Started
      </Button>

      <p className="welcome-footer caption">
        Already have an account{" "}
        <a href="/login" className="login-link caption">
          Log in
        </a>
      </p>
    </div>
  );
};

export default WelcomeScreen;
