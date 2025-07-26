import React from "react";
import InputField from "../ui/inputfield.jsx";
import "../../styles/pages/login.css";

const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  showPassword,
  toggleShowPassword,
}) => {
  return (
    <div className="login-form">
      <InputField
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        leftIcon={<span className="material-symbols-rounded">person</span>}
      />

      <InputField
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        leftIcon={<span className="material-symbols-rounded">fingerprint</span>}
        rightIcon={
          <span
            className="material-symbols-rounded"
            onClick={toggleShowPassword}
          >
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        }
        type={showPassword ? "text" : "password"}
      />
    </div>
  );
};

export default LoginForm;
