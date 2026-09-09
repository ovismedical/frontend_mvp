import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ModeToggle from "../../components/ui/ModeToggle";
import FlorenceChat from "./florence_chat";
import QuestionnaireInline from "../../components/questionnaire/QuestionnaireInline";
import "../../styles/questionnaire.css";
import BackButton from "../../components/ui/backButton";
const STORAGE_KEY = "checkin_mode_preference";

export default function Chatbot() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  // Determine initial mode from URL param > localStorage > default "ai"
  const initialMode = searchParams.get("mode") ||
    localStorage.getItem(STORAGE_KEY) || "ai";

  const [mode, setMode] = useState(initialMode);
  const [aiSessionActive, setAiSessionActive] = useState(false);
  const [showSwitchWarning, setShowSwitchWarning] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  // Save preference when mode changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const handleModeChange = (newMode) => {
    if (newMode === mode) return;

    // Warn if switching away from AI with active session
    if (mode === "ai" && aiSessionActive) {
      setPendingMode(newMode);
      setShowSwitchWarning(true);
      return;
    }

    setMode(newMode);
  };

  const confirmSwitch = () => {
    setShowSwitchWarning(false);
    if (pendingMode) {
      setMode(pendingMode);
      setPendingMode(null);
    }
  };

  const cancelSwitch = () => {
    setShowSwitchWarning(false);
    setPendingMode(null);
  };

  return (
    <div className="checkin-container">
      {/* Header */}
      <div className="checkin-header">
        <BackButton className="chevron_backward" onClick={() => navigate("/home")} />
        <h4>Daily Check-In</h4>
        <div style={{ width: 40 }} />
      </div>

      {/* Mode Toggle */}
      <ModeToggle mode={mode} onChange={handleModeChange} />

      {/* Content */}
      <div className="checkin-content">
        {mode === "ai" ? (
          <FlorenceChat
            embedded={true}
            onClose={() => navigate("/home")}
            onSessionChange={setAiSessionActive}
          />
        ) : (
          <QuestionnaireInline />
        )}
      </div>

      {/* Switch Warning Modal */}
      {showSwitchWarning && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <span className="material-symbols-rounded" style={{ color: "var(--on-warning-tint)", fontSize: 28 }}>
                warning
              </span>
              <h3>Switch Mode?</h3>
            </div>
            <div className="modal-content">
              You have an active AI conversation. Switching to the questionnaire will end the current session. Your questionnaire draft will be preserved.
            </div>
            <div className="modal-actions">
              <button className="caption secondary" onClick={cancelSwitch}>
                Stay in AI Chat
              </button>
              <button className="caption primary" onClick={confirmSwitch}>
                Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
