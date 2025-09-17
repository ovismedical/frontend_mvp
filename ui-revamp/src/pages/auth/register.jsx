import React, { useState } from "react";
import RegisterForm from "../../components/layout/registerForm.jsx";
import Button from "../../components/ui/button.jsx";
import blueLogo from "../../assets/images/logo_blue.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword || !accessCode) {
      setMessage("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    // Preset test values for fields not in form
    const full_name = "Test User";
    const dob = "01/01/1990";
    const sex = "male";

    try {
      // Backend Handling: Push registration data to backend API
      // Example: POST to /otp/register with user info
      
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/otp/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          access_code: accessCode,
          password,
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Account created successfully! Redirecting...");
        localStorage.setItem("email",email);
        setEmail("");
        localStorage.setItem("username",username)
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setAccessCode("");

        setTimeout(() => {
          navigate("/otp", { state: { email_address: email } });
        }, 1500);
      } else {
        setMessage(data.detail || "Account creation failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Network error or backend not running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <img src={blueLogo} alt="Logo" className="register-image" />

      <h1 className="register-title display">{t("register_title")}</h1>

      <p className="register-subtitle body">{t("register_subtitle")}</p>

      <RegisterForm
        email={email}
        username={username}
        password={password}
        confirmPassword={confirmPassword}
        accessCode={accessCode}
        onEmailChange={(e) => setEmail(e.target.value)}
        onUsernameChange={(e) => setUsername(e.target.value)}
        onPasswordChange={(e) => setPassword(e.target.value)}
        onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
        onAccessCodeChange={(e) => setAccessCode(e.target.value)}
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword(!showPassword)}
        showConfirm={showConfirm}
        toggleShowConfirm={() => setShowConfirm(!showConfirm)}
      />

      {message && <p className="register-message caption">{message}</p>}

      <Button
        variant="filled"
        className="register-button body"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Creating Account..." : t("sign_up")}
      </Button>

      <p className="register-footer caption">
        <span>{t("alreadyHaveAnAccount")}</span>
        <a href="/login" className="login-link caption">
          {t("login")}
        </a>
      </p>
    </div>
  );
};

export default Register;
