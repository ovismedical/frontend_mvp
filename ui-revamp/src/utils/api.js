// API utility functions for OVIS Medical App

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const tokenData = localStorage.getItem("token");
  console.log("🔍 Debug - Token data from localStorage:", tokenData);
  
  let token = null;
  try {
    if (tokenData) {
      const parsed = JSON.parse(tokenData);
      token = parsed?.access_token;
      console.log("🔍 Debug - Parsed token:", token ? `${token.substring(0, 20)}...` : "null");
    }
  } catch (e) {
    console.error("🔍 Debug - Error parsing token:", e);
  }
  
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  };
  
  console.log("🔍 Debug - Auth headers:", headers);
  return headers;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Auth API calls
export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/otp/register`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  verifyOTP: async (otpData) => {
    const response = await fetch(`${API_BASE_URL}/otp/verify`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(otpData),
    });
    return handleResponse(response);
  },

  resendOTP: async (resendData) => {
    const response = await fetch(`${API_BASE_URL}/otp/resend`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(resendData),
    });
    return handleResponse(response);
  },

  getUserInfo: async () => {
    const response = await fetch(`${API_BASE_URL}/userinfo`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateUserInfo: async (userInfo) => {
    const response = await fetch(`${API_BASE_URL}/updateinfo`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userInfo),
    });
    return handleResponse(response);
  }
};

// Florence AI API calls
export const florenceAPI = {
  startSession: async (sessionData) => {
    const response = await fetch(`${API_BASE_URL}/florence/start_session`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(sessionData),
    });
    return handleResponse(response);
  },

  sendMessage: async (messageData) => {
    const response = await fetch(`${API_BASE_URL}/florence/send_message`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(messageData),
    });
    return handleResponse(response);
  },

  endSession: async (sessionId) => {
    const response = await fetch(`${API_BASE_URL}/florence/finish_session/${sessionId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getSessionHistory: async (sessionId) => {
    const response = await fetch(`${API_BASE_URL}/florence/session/${sessionId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Questions API calls
export const questionsAPI = {
  getQuestions: async () => {
    const response = await fetch(`${API_BASE_URL}/getquestions`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  submitAnswers: async (answers) => {
    const response = await fetch(`${API_BASE_URL}/submit`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(answers),
    });
    return handleResponse(response);
  }
};

// Calendar API calls
export const calendarAPI = {
  getAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/calendar`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createAppointment: async (appointmentData) => {
    const response = await fetch(`${API_BASE_URL}/calendar`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(appointmentData),
    });
    return handleResponse(response);
  }
};

// Analytics API calls
export const analyticsAPI = {
  getAnalytics: async (timeframe = "week") => {
    const response = await fetch(`${API_BASE_URL}/analytics?timeframe=${timeframe}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Triage API calls
export const triageAPI = {
  getTriageHistory: async (patientId, limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/triage/history/${patientId}?limit=${limit}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getLatestTriage: async (patientId) => {
    const response = await fetch(`${API_BASE_URL}/triage/latest/${patientId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getTriageBySession: async (sessionId) => {
    const response = await fetch(`${API_BASE_URL}/triage/session/${sessionId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getSmartInsights: async (patientId) => {
    const response = await fetch(`${API_BASE_URL}/triage/insights/${patientId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};
