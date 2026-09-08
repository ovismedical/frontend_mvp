import React, { useState, useEffect } from "react";
import RegisterForm from "../../components/layout/registerForm.jsx";
import Button from "../../components/ui/button.jsx";
import blueLogo from "../../assets/images/logo_blue.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authAPI } from "../../utils/api.js";

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
  // Whether the server wants an email OTP step (Twilio configured) or accepts direct sign-up
  const [otpRequired, setOtpRequired] = useState(true);

  useEffect(() => {
    let cancelled = false;
    authAPI
      .getConfig()
      .then((cfg) => { if (!cancelled) setOtpRequired(cfg?.registration?.otp_required !== false); })
      .catch(() => { if (!cancelled) setOtpRequired(true); });
    return () => { cancelled = true; };
  }, []);

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

    try {
      if (!otpRequired) {
        await authAPI.registerDirect({
          username,
          access_code: accessCode.toUpperCase(),
          password,
          email,
        });
        setMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const data = await authAPI.register({
        username,
        access_code: accessCode,
        password,
        email,
      });

      if (data) {
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
      setMessage(error?.message && !/HTTP error/.test(error.message) ? error.message : "Network error or backend not running.");
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
