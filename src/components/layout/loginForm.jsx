import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <div className="login-form">
      <InputField
        placeholder={t("username")}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        leftIcon={<span className="material-symbols-rounded">person</span>}
        autoComplete="username"
      />

      <InputField
        placeholder={t("password")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        leftIcon={<span className="material-symbols-rounded">fingerprint</span>}
        rightIcon={
          <span className="material-symbols-rounded">
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        }
        rightIconLabel={showPassword ? t("hide_password") : t("show_password")}
        onRightIconClick={toggleShowPassword}
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
      />
    </div>
  );
};

export default LoginForm;
