import React, { useState } from "react";
import { florenceAPI } from "../utils/api.js";

const ConnectionTest = () => {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setStatus("Testing connection...");
    
    try {
      // Test basic backend connection
      const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
      const healthData = await response.json();
      
      if (healthData.status === "healthy") {
        setStatus("✅ Backend is running and healthy!");
        
        // Test Florence AI
        const florenceResponse = await fetch(`${import.meta.env.VITE_API_URL}/florence/test`);
        const florenceData = await florenceResponse.json();
        
        if (florenceData.status === "ok") {
          setStatus(prev => prev + "\n🤖 Florence AI is ready and working!");
        } else {
          setStatus(prev => prev + "\n❌ Florence AI has issues");
        }
      } else {
        setStatus("❌ Backend is not healthy");
      }
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>🔗 Backend Connection Test</h2>
      <p>This will test if your frontend can connect to the backend and Florence AI.</p>
      
      <button 
        onClick={testConnection}
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        {isLoading ? "Testing..." : "Test Connection"}
      </button>
      
      {status && (
        <div style={{
          backgroundColor: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: "5px",
          padding: "15px",
          whiteSpace: "pre-line",
          fontFamily: "monospace"
        }}>
          {status}
        </div>
      )}
      
      <div style={{ marginTop: "20px", fontSize: "14px", color: "#6c757d" }}>
        <strong>Current Configuration:</strong><br/>
        Frontend URL: {window.location.origin}<br/>
        Backend URL: {import.meta.env.VITE_API_URL}<br/>
        API Endpoints: /florence/start_session, /florence/send_message, /florence/finish_session
      </div>
    </div>
  );
};

export default ConnectionTest;
