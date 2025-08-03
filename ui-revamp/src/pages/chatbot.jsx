import React, { useState, useEffect, useRef } from "react";
import BotMessage from "../components/ui/botMessage";
import UserMessage from "../components/ui/userMessage";
import OptionsList from "../components/ui/optionsList";
import { useNavigate } from "react-router-dom";

export default function Chatbot() {
  const navigate = useNavigate();

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm here to help you track and manage your symptoms. How are you feeling today?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [customOptions, setCustomOptions] = useState([]);
  const [conversationStep, setConversationStep] = useState(1);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const severityOptions = [
    { label: "😊 Mild (1-3)", value: "Mild (1-3)" },
    { label: "😐 Moderate (4-6)", value: "Moderate (4-6)" },
    { label: "😟 Severe (7-8)", value: "Severe (7-8)" },
    { label: "😫 Very Severe (9-10)", value: "Very Severe (9-10)" },
    { label: "🤔 Not Sure", value: "Not Sure" },
  ];

  const conversationFlow = [
    {
      type: "text",
      text: "Hello! I'm here to help you track and manage your symptoms. How are you feeling today?",
    },
    { type: "text", text: "Can you describe your symptoms in a few words?" },
    {
      type: "options",
      text: "How severe is it on a scale of 1-10?",
      options: severityOptions,
    },
    { type: "text", text: "How long have you been feeling this way?" },
    {
      type: "text",
      text: "Have you noticed any related symptoms like headache or dizziness?",
    },
    {
      type: "options",
      text: "Would you like to continue or end the check-in?",
      options: [
        { label: "📝 Continue", value: "Continue" },
        { label: "✅ End Check-In", value: "End Check-In" },
      ],
    },
    {
      type: "options",
      text: "Are your symptoms affecting daily activities?",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
        { label: "Not Sure", value: "Not Sure" },
      ],
    },
    {
      type: "options",
      text: "Thanks for sharing. You've completed today's check-in. Would you like to end the conversation or add anything else?",
      options: [
        { label: "➕ Add More", value: "Add More" },
        { label: "✅ End Conversation", value: "End Conversation" },
      ],
    },
  ];

  const statusMessages = [
    "Analysing Chat...",
    "Organising Assessment...",
    "Saving Data...",
    "Generating Report...",
  ];

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleRestartConversation = () => {
    setMessages([
      {
        sender: "bot",
        text: conversationFlow[0].text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setConversationStep(1);
    setShowOptions(false);
    setCustomOptions([]);
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

  const closeReportModal = () => {
    setShowReportModal(false);
  };

  const handleBackClick = () => {
    setShowLoadingModal(true);
    setTimeout(() => {
      setShowLoadingModal(false);
      setShowConfirmationModal(true);
    }, 10000);
  };

  useEffect(() => {
    if (!showLoadingModal) return;
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      if (index < statusMessages.length) {
        setCurrentStatusIndex(index);
      } else {
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [showLoadingModal]);

  const handleNextStep = (stepIndex = conversationStep) => {
    if (stepIndex >= conversationFlow.length) return;

    const step = conversationFlow[stepIndex];

    const botMessage = {
      sender: "bot",
      text: step.text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, botMessage]);

    if (step.type === "options") {
      setCustomOptions(step.options);
      setShowOptions(true);
    }

    setConversationStep(stepIndex + 1);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    inputRef.current?.blur();

    if (showOptions) {
      setShowOptions(false);
      setCustomOptions([]);
    }

    setTimeout(() => {
      handleNextStep();
    }, 600);
  };

  const handleOptionSelect = (value) => {
    const userMessage = {
      sender: "user",
      text: `You selected: ${value}`,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowOptions(false);

    setTimeout(() => {
      const prevStep = conversationFlow[conversationStep - 1];

      if (
        prevStep?.text?.includes("end the check-in") &&
        value === "End Check-In"
      ) {
        handleBackClick();
      } else if (
        prevStep?.text?.includes("completed today's check-in") &&
        prevStep?.type === "options"
      ) {
        if (value === "End Conversation") {
          handleBackClick();
        } else if (value === "Add More") {
          const newBotMessage = {
            sender: "bot",
            text: "Sure, what else would you like to add?",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prev) => [...prev, newBotMessage]);
        }
      } else {
        handleNextStep();
      }
    }, 600);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showOptions]);

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
    <div className="chatbot-container">
      <div className="chatbot-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={handleBackClick}
        >
          chevron_backward
        </span>
        <div className="chatbot-header h4">Florence - AI Nurse</div>
        <div className="more_vert_container" style={{ position: "relative" }}>
          <span
            className="material-symbols-rounded more_vert"
            onClick={toggleMenu}
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

      <div className="chatbot-messages">
        {messages.map((msg, idx) =>
          msg.sender === "bot" ? (
            <BotMessage key={idx} text={msg.text} time={msg.time} />
          ) : (
            <UserMessage key={idx} text={msg.text} time={msg.time} />
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {showOptions && (
        <div className="chatbot-options">
          <OptionsList options={customOptions} onSelect={handleOptionSelect} />
        </div>
      )}

      <div className="chatbot-input-wrapper">
        <div className="chatbot-input-field">
          <input
            ref={inputRef}
            className="chatbot-input body"
            type="text"
            placeholder="Message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <span
            className="material-symbols-rounded send-icon"
            onClick={handleSend}
          >
            send
          </span>
        </div>
        <div className="mic-button">
          <span
            className="material-symbols-rounded"
            onClick={() => navigate("/chatbot_voice")}
          >
            graphic_eq
          </span>
        </div>
      </div>

      {showLoadingModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="spinner" />
            <h3 className="h3">{statusMessages[currentStatusIndex]}</h3>
            <p className="body">
              Please wait while we process your assessment...
            </p>
          </div>
        </div>
      )}

      {showConfirmationModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="h3">Congratulations! 🎉</h3>
            <p className="modal-subtext body">
              You have completed your daily check-in and the report is ready to
              review. Feel free to return anytime if you experience any changes
              or want to update your symptoms.
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

      {showReportModal && (
        <div className="modal-overlay" onClick={closeReportModal}>
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
                  closeReportModal();
                }}
              >
                Submit
              </button>
              <button className="caption" onClick={closeReportModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
