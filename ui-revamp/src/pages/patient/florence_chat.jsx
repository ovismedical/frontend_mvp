import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import BotMessage from "../../components/ui/botMessage";
import UserMessage from "../../components/ui/userMessage";
import OptionsList from "../../components/ui/optionsList";
import { florenceAPI } from "../../utils/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const FlorenceChat = ({ onClose }) => {
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
        { label: `✅ ${t("quick_responses_yes")}`, value: t("quick_responses_yes") },
        { label: `❌ ${t("quick_responses_no")}`, value: t("quick_responses_no") },
        { label: `🤔 ${t("quick_responses_not_sure")}`, value: t("quick_responses_not_sure") },
        { label: `🔄 ${t("quick_responses_sometimes")}`, value: t("quick_responses_sometimes") }
      ];
    }
    
    // Duration/time questions
    if (message.includes("how long") || message.includes("duration") ||
        message.includes("when did") || message.includes("since when")) {
      return [
        { label: `🕐 ${t("quick_responses_just_now")}`, value: t("quick_responses_just_now") },
        { label: `⏰ ${t("quick_responses_few_hours")}`, value: t("quick_responses_few_hours") },
        { label: `📅 ${t("quick_responses_a_day")}`, value: t("quick_responses_a_day") },
        { label: `📆 ${t("quick_responses_few_days")}`, value: t("quick_responses_few_days") },
        { label: `🗓️ ${t("quick_responses_week_or_more")}`, value: t("quick_responses_week_or_more") }
      ];
    }
    
    // Pain/symptom questions
    if (message.includes("pain") || message.includes("hurt") ||
        message.includes("ache") || message.includes("symptom")) {
      return [
        { label: `😷 ${t("quick_responses_headache_symptom")}`, value: t("quick_responses_have_headache") },
        { label: `🤒 ${t("quick_responses_fever_symptom")}`, value: t("quick_responses_have_fever") },
        { label: `🤢 ${t("quick_responses_nausea_symptom")}`, value: t("quick_responses_feel_nauseous") },
        { label: `😴 ${t("quick_responses_fatigue_symptom")}`, value: t("quick_responses_feel_tired") },
        { label: `💊 ${t("quick_responses_other_symptoms")}`, value: t("quick_responses_other_symptoms_text") }
      ];
    }
    
    // Default options
    return getDefaultOptions();
  };
  
  const getDefaultOptions = () => [
    { label: `😷 ${t("quick_responses_headache")}`, value: t("quick_responses_have_headache") },
    { label: `🤒 ${t("quick_responses_feverish")}`, value: t("quick_responses_have_fever") },
    { label: `🤢 ${t("quick_responses_nauseous")}`, value: t("quick_responses_feel_nauseous") },
    { label: `💪 ${t("quick_responses_great")}`, value: t("quick_responses_great") },
    { label: `😴 ${t("quick_responses_tired")}`, value: t("quick_responses_feel_tired") },
    { label: `💊 ${t("quick_responses_medication_questions")}`, value: t("quick_responses_medication_questions") }
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize Florence session
  useEffect(() => {
    initializeSession();
    return () => {
      if (sessionId) {
        endSession();
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
      console.error("Failed to initialize Florence session:", error);
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

      console.log("Florence API Response:", response);

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
      console.error("Failed to send message to Florence:", error);
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

  const confirmEndChat = async () => {
    if (!sessionId) return;
    
    setIsEndingSession(true);
    try {
      await florenceAPI.endSession(sessionId);
      setShowEndChatModal(false);
      setIsSessionActive(false);
      
      // Show completion message
      const completionMessage = {
        sender: "bot",
        text: t("thank_you_chat"),
        time: new Date().toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };
      setMessages(prev => [...prev, completionMessage]);
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Failed to end Florence session:", error);
      setIsEndingSession(false);
    }
  };

  const cancelEndChat = () => {
    setShowEndChatModal(false);
  };

  return (
    <div className="chatbot-container">
      {/* Chat Header */}
      <div className="chatbot-header">
        <span
          className="material-symbols-rounded chevron_backward"
          onClick={onClose}
        >
          chevron_backward
        </span>
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
              className="ai-toggle"
              title={t("restart_conversation")}
              disabled={isLoading}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '50%',
                transition: 'background-color 0.2s'
              }}
            >
              🔄
            </button>
            <button 
              onClick={handleEndChat}
              className="ai-toggle"
              title={t("end_chat_assessment")}
              disabled={isLoading || !isSessionActive}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '50%',
                transition: 'background-color 0.2s',
                opacity: (!isSessionActive || isLoading) ? 0.5 : 1
              }}
            >
              ✅
            </button>
          </div>
        </div>
      </div>

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
          <div className="options-title" style={{
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            color: '#6c757d',
            fontWeight: '500'
          }}>
            {t("quick_responses_title")}
          </div>
          <OptionsList 
            options={getQuickResponseOptions()} 
            onSelect={handleQuickResponse}
          />
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
          <div style={{ 
            textAlign: 'center', 
            padding: '0.5rem',
            color: '#6c757d',
            fontSize: '0.9rem'
          }}>
            🔄 {t("connecting_to_florence")}
          </div>
        )}
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
