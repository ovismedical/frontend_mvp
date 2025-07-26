import React, { useState } from "react";
import InputField from "../ui/inputfield.jsx";
import "../../styles/pages/register.css";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="register-form">
      <InputField
        placeholder="Email Address"
        leftIcon={<span className="material-symbols-rounded">mail</span>}
      />

      <InputField
        placeholder="Access Code"
        leftIcon={<span className="material-symbols-rounded">vpn_key</span>}
      />

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

      <InputField
        placeholder="Confirm Password"
        leftIcon={<span className="material-symbols-rounded">fingerprint</span>}
        rightIcon={
          <span className="material-symbols-rounded">
            {showConfirm ? "visibility_off" : "visibility"}
          </span>
        }
        isPassword
        onRightIconClick={() => setShowConfirm(!showConfirm)}
      />
    </div>
  );
};

export default RegisterForm;
