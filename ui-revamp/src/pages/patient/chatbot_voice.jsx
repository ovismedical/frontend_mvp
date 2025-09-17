import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";
import AudioWaveVisualizer from "../../components/ui/audioWaveVisualizer";

export default function VoiceInputChatbot() {
  const navigate = useNavigate();

  const [transcript, setTranscript] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const transcriptRef = useRef("");
  const [showMenu, setShowMenu] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);


  // Backend Handling: Fetch previous voice conversation history from backend (if needed)
  // useEffect(() => { /* fetch voice conversation history */ }, [])
  const [conversation, setConversation] = useState([
    {
      sender: "bot",
      text: "Hello! I'm here to help you track and manage your symptoms. How are you feeling today?",
    },
  ]);

  const steps = [
    "Can you describe your symptoms?",
    "How long have you felt this way?",
    "Anything else you'd like to share before saving?",
  ];

  const statusMessages = ["Saving Data...", "Generating Report..."];

  const { start, stop, isListening } = useSpeechRecognition({
    onResult: (text) => {
      setTranscript(text);
      transcriptRef.current = text;
    },
    onEnd: () => {
      const finalText = transcriptRef.current.trim();
      if (!finalText) return;

      // Backend Handling: Save user voice input to backend

      setConversation((prev) => [
        ...prev,
        { sender: "user", text: finalText },
        stepIndex < steps.length
          ? { sender: "bot", text: steps[stepIndex] }
          : { sender: "bot", text: "Thank you. Your check-in is complete." },
      ]);

      setTranscript("");
      transcriptRef.current = "";
      setStepIndex((i) => i + 1);
    },
  });

  const handleMicClick = () => {
    if (isListening) stop();
    else start();
  };

  const handleRestartConversation = () => {
    setConversation([
      {
        sender: "bot",
        text: "Hello! I'm here to help you track and manage your symptoms. How are you feeling today?",
      },
    ]);
    setStepIndex(0);
    setShowMenu(false);
  };

  const handleHelp = () => {
    setShowMenu(false);
    navigate("/helpCenter");
  };

  const handleReport = () => {
    setShowMenu(false);
    setShowReportModal(true);
  };

  const handleSaveClick = () => {
  // Backend Handling: Save completed voice check-in/report to backend
  setShowLoadingModal(true);
    setCurrentStatusIndex(0);
    let index = 0;

    const interval = setInterval(() => {
      index += 1;
      if (index < statusMessages.length) {
        setCurrentStatusIndex(index);
      } else {
        clearInterval(interval);
        setShowLoadingModal(false);
        setShowConfirmationModal(true);
      }
    }, 2000);
  };

  const handleExit = () => {
    setShowExitModal(true);
  };

  const isConversationComplete = stepIndex >= steps.length;

  const [recordingTime, setRecordingTime] = useState(0);
  useEffect(() => {
    let timer;
    if (isListening) {
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
      setRecordingTime(0);
    }
    return () => clearInterval(timer);
  }, [isListening]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".more_vert_container") && showMenu) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="voicechatbot-container">
      <div className="voicechatbot-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={handleExit}
        >
          chevron_backward
        </span>
        <div className="voicechatbot-header h4">Florence - AI Nurse</div>
        <div className="more_vert_container" style={{ position: "relative" }}>
          <span
            className="material-symbols-rounded more_vert"
            onClick={() => setShowMenu(!showMenu)}
          >
            more_vert
          </span>
          {showMenu && (
            <ul className="more_vert_menu">
              <li className="body" onClick={handleRestartConversation}>
                <span className="material-symbols-rounded">refresh</span>{" "}
                Restart Conversation
              </li>
              <li className="body" onClick={handleHelp}>
                <span className="material-symbols-rounded">help_outline</span>{" "}
                Help / Info
              </li>
              <li className="body" onClick={handleReport}>
                <span className="material-symbols-rounded">bug_report</span>{" "}
                Report an Issue
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="voicechatbot-body">
        <div className="voicechatbot-content">
          {conversation.map((msg, i) => (
            <div key={i} className={`voicechatbot-${msg.sender}-message`}>
              <span className={msg.sender === "bot" ? "h2" : "h1"}>
                {msg.text}
              </span>
            </div>
          ))}

          {isListening && (
            <div className="voicechatbot-user-message h1">
              <span>{transcript || "Listening..."}</span>
              <span className="ongoing-text">|</span>
            </div>
          )}

          <AudioWaveVisualizer isListening={isListening} />
        </div>

        <div className="voice-recording-footer">
          <div className="mic-float" onClick={handleMicClick}>
            <div className={`mic-circle ${isListening ? "recording" : ""}`}>
              <span className="material-symbols-rounded mic-icon">
                {isListening ? "stop" : "mic"}
              </span>
            </div>
          </div>

          <button className="action-button exit" onClick={handleExit}>
            <span className="material-symbols-rounded">close</span>
            <span className="exit-label overline">Exit</span>
          </button>

          <div className="recording-timer h4">{formatTime(recordingTime)}</div>

          <button className="action-button save" onClick={handleSaveClick}>
            <span className="material-symbols-rounded">check</span>
            <span className="save-label overline">Save</span>
          </button>
        </div>
      </div>

      {/* Loading Modal */}
      {showLoadingModal && (
        <div className="modal-overlay">
          {/* Backend Handling: Process voice assessment and save results to backend */}
          <div className="modal-box">
            <div className="spinner" />
            <h3 className="h3">{statusMessages[currentStatusIndex]}</h3>
            <p className="body">
              Please wait while we process your check-in...
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="h3">Check-In Complete 🎉</h3>
            <p className="body">
              Your check-in has been saved. Thanks for sharing with Florence!
            </p>
            <div className="modal-actions">
              <button
                className="caption"
                onClick={() => navigate("/dashboard")}
              >
                See Report
              </button>
              <button className="caption" onClick={() => navigate("/home")}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Warning Modal */}
      {showExitModal && (
        <div className="modal-overlay" onClick={() => setShowExitModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="h3">Leave Check-In?</h3>
            <p className="body">
              You haven’t saved your check-in yet. If you exit now, your
              progress will be lost. Don’t worry, you can always come back later
              to start a new check-in.
            </p>
            <div className="modal-actions">
              <button
                className="caption"
                onClick={() => {
                  setShowExitModal(false);
                  navigate("/home");
                }}
              >
                Exit
              </button>
              <button
                className="caption"
                onClick={() => setShowExitModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report an Issue Modal */}
      {showReportModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowReportModal(false)}
        >
          {/* Backend Handling: Save/send reported issue to backend */}
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="h3">Report an Issue</h3>
            <p className="body">
              Please describe the issue you're experiencing.
            </p>
            <textarea
              rows={5}
              placeholder="Type your message here..."
              style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
            />
            <div className="modal-actions">
              <button
                className="caption"
                onClick={() => {
                  alert("Report submitted! Thank you.");
                  setShowReportModal(false);
                }}
              >
                Submit
              </button>
              <button
                className="caption"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
