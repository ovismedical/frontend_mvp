import React, { useState, useEffect } from "react";
import OTPInput from "../../components/ui/otpInput.jsx";
import maskEmail from "../../utils/maskEmail.js";
import otpImg from "../../assets/images/otp.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { authAPI } from "../../utils/api.js";
import BackButton from "../../components/ui/backButton";
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
      const data = await authAPI.verifyOTP({
        user_id: localStorage.getItem("username"),
        email: email_address || localStorage.getItem("email"),
        otp_code: code,
        purpose: "registration",
      });

      localStorage.removeItem("username");
      localStorage.removeItem("email");
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setError(error.message || "Invalid OTP code. Please try again.");
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
      await authAPI.resendOTP({
        user_id: localStorage.getItem("username"),
        email: email_address || localStorage.getItem("email"),
        purpose: "registration",
      });

      setTimeLeft(30);
      setCanResend(false);
      setError("");
      setResetOtp(true);
      setTimeout(() => setResetOtp(false), 50);
    } catch (error) {
      setError(error.message || "Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="otp-container">
      <div className="backIcon-container">
        <BackButton className="chevronB_icon" onClick={() => navigate(-1)} />
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
