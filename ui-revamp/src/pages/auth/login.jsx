import React, { useState } from "react";
import LoginForm from "../../components/layout/loginForm.jsx";
import Button from "../../components/ui/button.jsx";
import blueLogo from "../../assets/images/logo_blue.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authAPI } from "../../utils/api.js";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth(); // Get login function from context

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Demo users
  const demoUsers = {
    patient: { username: "patient", password: "patient123", role: "patient" },
    doctor: { username: "doctor", password: "doctor123", role: "doctor" },
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const data = await authAPI.login(username, password);
      
      if (data && data.access_token) {
        // Store token in localStorage
        localStorage.setItem("token", JSON.stringify(data));
        
        // Update auth context - this is the key part!
        login({
          username: username, // Use the username from the form
          role: "patient", // Default to patient, we'll get the actual role from userinfo
        });

        // Navigate to home first, then we can determine role from userinfo
        navigate("/home");
      } else {
        setMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
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
