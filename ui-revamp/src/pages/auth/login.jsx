import React, { useState } from "react";
import LoginForm from "../../components/layout/loginForm.jsx";
import Button from "../../components/ui/button.jsx";
import blueLogo from "../../assets/images/logo_blue.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.details === "Invalid credentials") {
        setMessage("Login failed. Please check your username or password.");
      } else {
        localStorage.setItem("token", JSON.stringify(data));
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" data-scale="large">
      <img src={blueLogo} alt="Logo" className="login-image" />

      <h1 className="login-title display">{t("login_title")}</h1>

      <p className="login-subtitle body">{t("login_subtitle")}</p>

      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        showPassword={showPassword}
        toggleShowPassword={toggleShowPassword}
      />

      {message && <p className="login-error caption">{message}</p>}

      <Button
        variant="filled"
        className="login-button body"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : t("log_in")}
      </Button>

      <a href="/forgotPassword" className="login-forgot-password caption">
        {t("forgotPassword")}
      </a>

      <p className="login-footer caption">
        <span>{t("alreadyHaveAnAccount")}</span>
        <a href="/register" className="login-link caption">
          {t("register")}
        </a>
      </p>
    </div>
  );
};

export default Login;
