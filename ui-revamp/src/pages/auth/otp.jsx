import React, { useState, useEffect } from "react";
import OTPInput from "../../components/ui/otpInput.jsx";
import maskEmail from "../../utils/maskEmail.js";
import otpImg from "../../assets/images/otp.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const OTP = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const email_address = location.state?.email_address || "";

  const [enteredCode, setEnteredCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetOtp, setResetOtp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const handleCompleteCode = async (code) => {
    setEnteredCode(code);
    setError("");
    
    try {
      const response = await fetch(
        'https://ovis-backend-mvp.onrender.com/otp/verify',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: localStorage.getItem("username"),
            email: email_address || localStorage.getItem("email"),
            otp_code: code,
            purpose: "registration",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Invalid OTP code. Please try again.");
        setResetOtp(true);
        setTimeout(() => setResetOtp(false), 50);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError("Network error. Please check your connection and try again.");
      setResetOtp(true);
      setTimeout(() => setResetOtp(false), 50);
    }
  };

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleResend = async () => {
    try {
      const response = await fetch(
        'https://ovis-backend-mvp.onrender.com/otp/resend',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: localStorage.getItem("username"),
            email: email_address || localStorage.getItem("email"),
            purpose: "registration",
          }),
        }
      );

      if (response.ok) {
        setTimeLeft(30);
        setCanResend(false);
        setError("");
        setResetOtp(true);
        setTimeout(() => setResetOtp(false), 50);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="otp-container">
      <div className="backIcon-container">
        <span
          className="material-symbols-rounded chevronB_icon"
          onClick={() => navigate(-1)}
        >
          chevron_backward
        </span>
      </div>

      <img
        src={otpImg}
        alt="Forgot Password Illustration"
        className="otp-image"
      />

      <h1 className="otp-title display">{t("otp_title")}</h1>

      <p className="otp-subtitle body">
        {t("otp_subtitle01")}
        {maskEmail(email_address)}
        {"."}
        <br />
        {t("otp_subtitle02")}
      </p>

      <div className="otp-input-container">
        <OTPInput onComplete={handleCompleteCode} resetTrigger={resetOtp} />
      </div>

      {error && <p className="otp-error caption">{error}</p>}
      {success && (
        <p className="otp-success caption">Code verified successfully!</p>
      )}

      <div className="otp-footer caption">
        {canResend ? (
          <p>
            Didn't receive the code?{" "}
            <a className="resend-link" onClick={handleResend}>
              Resend Code
            </a>
          </p>
        ) : (
          <p>
            Resend code in{" "}
            <span className="countdown-time">{`00:${timeLeft
              .toString()
              .padStart(2, "0")}`}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default OTP;
