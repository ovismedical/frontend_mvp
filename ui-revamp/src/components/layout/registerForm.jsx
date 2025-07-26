import React from "react";
import InputField from "../ui/inputfield.jsx";
import "../../styles/pages/register.css";

const RegisterForm = ({
  email,
  username,
  password,
  confirmPassword,
  accessCode,
  onEmailChange,
  onUsernameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onAccessCodeChange,
  showPassword,
  showConfirm,
  toggleShowPassword,
  toggleShowConfirm,
}) => {
  return (
    <div className="register-form">
      <InputField
        placeholder="Email Address"
        leftIcon={<span className="material-symbols-rounded">mail</span>}
        value={email}
        onChange={onEmailChange}
      />

      <InputField
        placeholder="Access Code"
        leftIcon={<span className="material-symbols-rounded">vpn_key</span>}
        value={accessCode}
        onChange={onAccessCodeChange}
      />

      <InputField
        placeholder="Username"
        leftIcon={<span className="material-symbols-rounded">person</span>}
        value={username}
        onChange={onUsernameChange}
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
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={onPasswordChange}
        onRightIconClick={toggleShowPassword}
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
        type={showConfirm ? "text" : "password"}
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        onRightIconClick={toggleShowConfirm}
      />
    </div>
  );
};

export default RegisterForm;
