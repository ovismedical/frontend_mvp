import React, { useState, useEffect, useRef } from "react";
import BotMessage from "../ui/botMessage";
import UserMessage from "../ui/userMessage";
import OptionsList from "../ui/optionsList";
import { florenceAPI } from "../../utils/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const FlorenceChat = ({ onClose }) => {
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
        { label: "1 - Very Mild", value: "1" },
        { label: "2 - Mild", value: "2" },
        { label: "3 - Moderate", value: "3" },
        { label: "4 - Severe", value: "4" },
        { label: "5 - Very Severe", value: "5" }
      ];
    }
    
    // Frequency questions (1-5 scale)
    if (message.includes("frequency") || message.includes("often") ||
        message.includes("how many times") || message.includes("how frequently")) {
      return [
        { label: "1 - Rarely", value: "1" },
        { label: "2 - Occasionally", value: "2" },
        { label: "3 - Sometimes", value: "3" },
        { label: "4 - Often", value: "4" },
        { label: "5 - Very Often", value: "5" }
      ];
    }
    
    // Yes/No questions
    if (message.includes("do you") || message.includes("have you") ||
        message.includes("are you") || message.includes("is it") ||
        message.includes("yes") || message.includes("no")) {
      return [
        { label: "✅ Yes", value: "Yes" },
        { label: "❌ No", value: "No" },
        { label: "🤔 Not sure", value: "I'm not sure" },
        { label: "🔄 Sometimes", value: "Sometimes" }
      ];
    }
    
    // Duration/time questions
    if (message.includes("how long") || message.includes("duration") ||
        message.includes("when did") || message.includes("since when")) {
      return [
        { label: "🕐 Just now", value: "Just now" },
        { label: "⏰ A few hours", value: "A few hours" },
        { label: "📅 A day", value: "A day" },
        { label: "📆 A few days", value: "A few days" },
        { label: "🗓️ A week or more", value: "A week or more" }
      ];
    }
    
    // Pain/symptom questions
    if (message.includes("pain") || message.includes("hurt") ||
        message.includes("ache") || message.includes("symptom")) {
      return [
        { label: "😷 Headache", value: "I have a headache" },
        { label: "🤒 Fever", value: "I have a fever" },
        { label: "🤢 Nausea", value: "I feel nauseous" },
        { label: "😴 Fatigue", value: "I feel tired" },
        { label: "💊 Other", value: "I have other symptoms" }
      ];
    }
    
    // Default options
    return getDefaultOptions();
  };
  
  const getDefaultOptions = () => [
    { label: "😷 I have a headache", value: "I have a headache" },
    { label: "🤒 I feel feverish", value: "I feel feverish" },
    { label: "🤢 I feel nauseous", value: "I feel nauseous" },
    { label: "💪 I feel great!", value: "I feel great!" },
    { label: "😴 I'm tired", value: "I'm tired" },
    { label: "💊 Medication questions", value: "I have questions about my medication" }
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

  const initializeSession = async () => {
    try {
      setIsLoading(true);
      const response = await florenceAPI.startSession({
        language: "en",
        input_mode: "keyboard",
        treatment_status: "undergoing_treatment"
      });

      setSessionId(response.session_id);
      setIsSessionActive(true);
      
      // Add welcome message
      setMessages([
        {
          sender: "bot",
          text: response.message || "Hello! I'm Florence, your AI health assistant. How can I help you today?",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      console.error("Failed to initialize Florence session:", error);
      setMessages([
        {
          sender: "bot",
          text: "I'm having trouble connecting right now. Please try again later.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
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
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
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
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message to Florence:", error);
      const errorMessage = {
        sender: "bot",
        text: "I'm sorry, I'm having trouble responding right now. Please try again.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
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
        text: "Thank you for chatting with me! Your assessment is being processed and will be available in your dashboard shortly.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
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
        <div className="chatbot-header h4">Florence AI</div>
        <div className="more_vert_container" style={{ position: "relative" }}>
          <div className="header-actions">
            <button 
              onClick={restartConversation}
              className="ai-toggle"
              title="Restart Conversation"
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
              title="End Chat & Get Assessment"
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
            text="Florence is thinking..." 
            time={new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            isLoading={true}
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Response Options */}
      {isSessionActive && !isLoading && (
        <div className="chatbot-options">
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
            placeholder={isSessionActive ? "Message" : "Connecting to Florence..."}
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
            🔄 Connecting to Florence AI...
          </div>
        )}
      </div>

      {/* End Chat Confirmation Modal */}
      {showEndChatModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="h3">End Chat & Generate Assessment</h3>
            <p className="modal-subtext body">
              Are you sure you want to end this conversation? Florence will analyze our chat and generate a comprehensive health assessment for you.
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
                {isEndingSession ? 'Processing...' : 'End Chat'}
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
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlorenceChat;
