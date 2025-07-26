import React, { useState } from "react";
import InputField from "../ui/inputfield.jsx";
import "../../styles/pages/login.css";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-form">
      <InputField
        placeholder="Username"
        leftIcon={<span className="material-symbols-rounded">person</span>}
      />

      <InputField
        placeholder="Password"
        leftIcon={<span className="material-symbols-rounded">fingerprint</span>}
        rightIcon={
          <span className="material-symbols-rounded">
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        }
        isPassword
        onRightIconClick={() => setShowPassword(!showPassword)}
      />
    </div>
  );
};

export default LoginForm;
