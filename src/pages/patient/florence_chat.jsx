import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import BotMessage from "../../components/ui/botMessage";
import UserMessage from "../../components/ui/userMessage";
import OptionsList from "../../components/ui/optionsList";
import { florenceAPI } from "../../utils/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import BackButton from "../../components/ui/backButton";
const FlorenceChat = ({ onClose, embedded = false, onSessionChange }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [customOptions, setCustomOptions] = useState([]);
  const [showEndChatModal, setShowEndChatModal] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);
  // Latest session for the unmount cleanup (effects with [] deps would otherwise see the initial null)
  const sessionIdRef = useRef(null);
  const sessionActiveRef = useRef(false);
  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);
  useEffect(() => { sessionActiveRef.current = isSessionActive; }, [isSessionActive]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get current language code for API calls and locale formatting
  const currentLanguage = i18n.language === "zh" ? "zh-HK" : "en";
  const locale = i18n.language === "zh" ? "zh-HK" : "en-US";

  // Get dynamic quick response options based on last bot message
  const getQuickResponseOptions = () => {
    if (messages.length === 0) return getDefaultOptions();
    
    const lastBotMessage = messages.filter(msg => msg.sender === "bot").pop();
    if (!lastBotMessage) return getDefaultOptions();
    
    const message = lastBotMessage.text.toLowerCase();
    
    // Severity questions (1-5 scale)
    if (message.includes("severity") || message.includes("scale") || 
        message.includes("rate") || message.includes("level") ||
        message.includes("how bad") || message.includes("how severe")) {
      return [
        { label: t("quick_responses_very_mild"), value: "1" },
        { label: t("quick_responses_mild"), value: "2" },
        { label: t("quick_responses_moderate"), value: "3" },
        { label: t("quick_responses_severe"), value: "4" },
        { label: t("quick_responses_very_severe"), value: "5" }
      ];
    }
    
    // Frequency questions (1-5 scale)
    if (message.includes("frequency") || message.includes("often") ||
        message.includes("how many times") || message.includes("how frequently")) {
      return [
        { label: t("quick_responses_rarely"), value: "1" },
        { label: t("quick_responses_occasionally"), value: "2" },
        { label: t("quick_responses_moderate"), value: "3" },
        { label: t("quick_responses_often"), value: "4" },
        { label: t("quick_responses_very_often"), value: "5" }
      ];
    }
    
    // Yes/No questions
    if (message.includes("do you") || message.includes("have you") ||
        message.includes("are you") || message.includes("is it") ||
        message.includes("yes") || message.includes("no")) {
      return [
        { icon: "check", label: t("quick_responses_yes"), value: t("quick_responses_yes") },
        { icon: "close", label: t("quick_responses_no"), value: t("quick_responses_no") },
        { icon: "help", label: t("quick_responses_not_sure"), value: t("quick_responses_not_sure") },
        { icon: "sync", label: t("quick_responses_sometimes"), value: t("quick_responses_sometimes") }
      ];
    }
    
    // Duration/time questions
    if (message.includes("how long") || message.includes("duration") ||
        message.includes("when did") || message.includes("since when")) {
      return [
        { icon: "schedule", label: t("quick_responses_just_now"), value: t("quick_responses_just_now") },
        { icon: "hourglass_top", label: t("quick_responses_few_hours"), value: t("quick_responses_few_hours") },
        { icon: "today", label: t("quick_responses_a_day"), value: t("quick_responses_a_day") },
        { icon: "date_range", label: t("quick_responses_few_days"), value: t("quick_responses_few_days") },
        { icon: "calendar_month", label: t("quick_responses_week_or_more"), value: t("quick_responses_week_or_more") }
      ];
    }
    
    // Pain/symptom questions
    if (message.includes("pain") || message.includes("hurt") ||
        message.includes("ache") || message.includes("symptom")) {
      return [
        { icon: "neurology", label: t("quick_responses_headache_symptom"), value: t("quick_responses_have_headache") },
        { icon: "thermostat", label: t("quick_responses_fever_symptom"), value: t("quick_responses_have_fever") },
        { icon: "sick", label: t("quick_responses_nausea_symptom"), value: t("quick_responses_feel_nauseous") },
        { icon: "bedtime", label: t("quick_responses_fatigue_symptom"), value: t("quick_responses_feel_tired") },
        { icon: "more_horiz", label: t("quick_responses_other_symptoms"), value: t("quick_responses_other_symptoms_text") }
      ];
    }
    
    // Default options
    return getDefaultOptions();
  };
  
  const getDefaultOptions = () => [
    { icon: "neurology", label: t("quick_responses_headache"), value: t("quick_responses_have_headache") },
    { icon: "thermostat", label: t("quick_responses_feverish"), value: t("quick_responses_have_fever") },
    { icon: "sick", label: t("quick_responses_nauseous"), value: t("quick_responses_feel_nauseous") },
    { icon: "sentiment_very_satisfied", label: t("quick_responses_great"), value: t("quick_responses_great") },
    { icon: "bedtime", label: t("quick_responses_tired"), value: t("quick_responses_feel_tired") },
    { icon: "medication", label: t("quick_responses_medication_questions"), value: t("quick_responses_medication_questions") }
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize Florence session
  useEffect(() => {
    initializeSession();
    return () => {
      // Leaving the page finishes the session: the conversation is saved and analysed in the background
      if (sessionIdRef.current && sessionActiveRef.current) {
        florenceAPI.endSession(sessionIdRef.current).catch(() => {});
      }
    };
  }, []);

  // Reinitialize session when language changes
  useEffect(() => {
    if (sessionId && isSessionActive) {
      // End current session and start new one with new language
      endSession().then(() => {
        initializeSession();
      });
    }
  }, [i18n.language]);

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      const response = await florenceAPI.startSession({
        language: currentLanguage,
        input_mode: "keyboard",
        treatment_status: "undergoing_treatment"
      });

      setSessionId(response.session_id);
      setIsSessionActive(true);
      onSessionChange?.(true);
      
      // Add welcome message
      setMessages([
        {
          sender: "bot",
          text: response.message || t("welcome_message"),
          time: new Date().toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        },
      ]);
    } catch (error) {
      setMessages([
        {
          sender: "bot",
          text: t("trouble_connecting"),
          time: new Date().toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !sessionId || isLoading) return;

    const userMessage = {
      sender: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await florenceAPI.sendMessage({
        session_id: sessionId,
        message: input.trim()
      });

      const botMessage = {
        sender: "bot",
        text: response.response || response.message,
        time: new Date().toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        sender: "bot",
        text: t("trouble_responding"),
        time: new Date().toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async () => {
    if (!sessionId) return;
    
    try {
      await florenceAPI.endSession(sessionId);
      setIsSessionActive(false);
      onSessionChange?.(false);
    } catch (error) {
      console.error("Failed to end Florence session:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const restartConversation = () => {
    setMessages([]);
    setSessionId(null);
    setIsSessionActive(false);
    setShowOptions(false);
    setCustomOptions([]);
    initializeSession();
  };

  const handleQuickResponse = (value) => {
    setInput(value);
    setShowOptions(false);
    setCustomOptions([]);
    // Auto-send the quick response
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const handleEndChat = () => {
    setShowEndChatModal(true);
  };

  const stamp = () =>
    new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false });

  const pushBotMessage = (text) => setMessages((prev) => [...prev, { sender: "bot", text, time: stamp() }]);

  // The server saves the chat instantly and runs assessment + triage in the background;
  // poll for the result so the patient sees the outcome without waiting on the model.
  const waitForResult = async (id, { intervalMs = 2000, maxWaitMs = 90000 } = {}) => {
    const deadline = Date.now() + maxWaitMs;
    while (Date.now() < deadline) {
      const result = await florenceAPI.getResult(id);
      if (result.triage_status !== "generating") return result;
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    return null;
  };

  // What to tell the patient about a finished session's outcome, or null when there
  // is nothing to announce yet. A refused AI assessment is saved for the care team
  // ("pending_clinician_review") and must never surface as a raw PENDING_REVIEW level.
  const describeResult = (result) => {
    if (!result) return t("assessment_still_processing");
    if (result.triage_status === "pending_clinician_review") return t("assessment_needs_review");
    if (result.alert_level && result.alert_level !== "PENDING_REVIEW") {
      return t("assessment_ready", { level: result.alert_level, description: result.alert_description });
    }
    return null;
  };

  const confirmEndChat = async () => {
    if (!sessionId) return;

    setIsEndingSession(true);
    try {
      const finished = await florenceAPI.endSession(sessionId);
      setShowEndChatModal(false);
      setIsSessionActive(false);
      pushBotMessage(t("thank_you_chat"));

      if (finished.triage_status === "generating") {
        const result = await waitForResult(sessionId);
        pushBotMessage(describeResult(result) ?? t("assessment_still_processing"));
      } else {
        const outcome = describeResult(finished);
        if (outcome) pushBotMessage(outcome);
      }

      setTimeout(() => onClose(), 3500);
    } catch (error) {
      console.error("Failed to end Florence session:", error);
      setIsEndingSession(false);
    }
  };

  const cancelEndChat = () => {
    setShowEndChatModal(false);
  };

  return (
    <div className={`chatbot-container ${embedded ? "chatbot-embedded" : ""}`}>
      {/* Chat Header — hidden in embedded mode (parent provides it) */}
      {!embedded && (
        <div className="chatbot-header">
          <BackButton className="chevron_backward" onClick={onClose} />
          <div className="chatbot-header h4">
            {t("florence_ai")}
            <span className="language-indicator" style={{
              fontSize: '0.8rem',
              marginLeft: '0.5rem',
              opacity: 0.7,
              fontWeight: 'normal'
            }}>
              {i18n.language === "zh" ? "中文" : "EN"}
            </span>
          </div>
          <div className="more_vert_container" style={{ position: "relative" }}>
            <div className="header-actions">
              <button
                onClick={restartConversation}
                className="ai-toggle florence-icon-button"
                title={t("restart_conversation")}
                aria-label={t("restart_conversation")}
                disabled={isLoading}
              >
                <span className="material-symbols-rounded" aria-hidden="true">
                  refresh
                </span>
              </button>
              <button
                onClick={handleEndChat}
                className="ai-toggle florence-icon-button"
                title={t("end_chat_assessment")}
                aria-label={t("end_chat_assessment")}
                disabled={isLoading || !isSessionActive}
              >
                <span className="material-symbols-rounded" aria-hidden="true">
                  task_alt
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="chatbot-messages">
        {messages.map((msg, idx) =>
          msg.sender === "bot" ? (
            <BotMessage key={idx} text={msg.text} time={msg.time} />
          ) : (
            <UserMessage key={idx} text={msg.text} time={msg.time} />
          )
        )}
        
        {isLoading && (
          <BotMessage 
            text={t("florence_thinking")} 
            time={new Date().toLocaleTimeString(locale, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
            isLoading={true}
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Response Options */}
      {isSessionActive && !isLoading && (
        <div className="chatbot-options">
          <div className="options-title caption-semibold">
            {t("quick_responses_title")}
          </div>
          <OptionsList 
            options={getQuickResponseOptions()} 
            onSelect={handleQuickResponse}
          />
        </div>
      )}

      {/* Embedded mode has no header, so the session actions live above the input */}
      {embedded && isSessionActive && (
        <div className="chatbot-embedded-actions">
          <button type="button" className="chatbot-embedded-action caption" onClick={restartConversation} disabled={isLoading || isEndingSession}>
            <span className="material-symbols-rounded">refresh</span>
            {t("restart_conversation")}
          </button>
          <button type="button" className="chatbot-embedded-action caption primary" onClick={handleEndChat} disabled={isLoading || isEndingSession}>
            <span className="material-symbols-rounded">task_alt</span>
            {t("end_chat_assessment")}
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="chatbot-input-wrapper">
        <div className="chatbot-input-field">
          <input
            ref={inputRef}
            className="chatbot-input body"
            type="text"
            placeholder={isSessionActive ? t("message") : t("connecting_to_florence_placeholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={!isSessionActive || isLoading}
          />
          <span
            className="material-symbols-rounded send-icon"
            onClick={sendMessage}
            style={{
              opacity: (!input.trim() || !isSessionActive || isLoading) ? 0.5 : 1,
              cursor: (!input.trim() || !isSessionActive || isLoading) ? 'not-allowed' : 'pointer'
            }}
          >
            send
          </span>
        </div>
        
        {!isSessionActive && (
          <div className="florence-connecting caption" role="status" aria-live="polite">
            <span className="florence-connecting-spinner" aria-hidden="true" />
            {t("connecting_to_florence")}
          </div>
        )}

        {/* Second row of the wrapper (flex-wrap): Florence does not need identifying details */}
        <p className="florence-privacy-hint caption">{t("florence_privacy_hint")}</p>
      </div>

      {/* End Chat Confirmation Modal */}
      {showEndChatModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="h3">{t("end_chat_generate_assessment")}</h3>
            <p className="modal-subtext body">
              {t("end_chat_confirmation")}
            </p>
            <div className="modal-actions">
              <button
                className="caption"
                onClick={confirmEndChat}
                disabled={isEndingSession}
                style={{
                  backgroundColor: isEndingSession ? '#6c757d' : '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: isEndingSession ? 'not-allowed' : 'pointer'
                }}
              >
                {isEndingSession ? t("processing") : t("end_chat")}
              </button>
              <button 
                className="caption" 
                onClick={cancelEndChat}
                disabled={isEndingSession}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: isEndingSession ? 'not-allowed' : 'pointer'
                }}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlorenceChat;
