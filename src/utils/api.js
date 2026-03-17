// API utility functions for OVIS Medical App

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const tokenData = localStorage.getItem("token");

  let token = null;
  try {
    if (tokenData) {
      const parsed = JSON.parse(tokenData);
      token = parsed?.access_token;
    }
  } catch (e) {
    // Token parsing failed — proceed without auth
  }

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  };

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
  },

  getStreak: async (username) => {
    const response = await fetch(`${API_BASE_URL}/getstreak?username=${encodeURIComponent(username)}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Achievements API calls
export const achievementsAPI = {
  getMyAchievements: async () => {
    const response = await fetch(`${API_BASE_URL}/achievements/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Calendar API calls
export const calendarAPI = {
  getEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/calendar/events`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/calendar/createevent`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    return handleResponse(response);
  },

  getAuthStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/calendar/auth/status`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  startAuth: async () => {
    const response = await fetch(`${API_BASE_URL}/calendar/auth/start`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getDoctorFreeBlocks: async (blockData) => {
    const response = await fetch(`${API_BASE_URL}/calendar/doctor/free-blocks`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(blockData),
    });
    return handleResponse(response);
  },

  // Keep old names as aliases for backward compatibility
  getAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/calendar/events`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createAppointment: async (appointmentData) => {
    const response = await fetch(`${API_BASE_URL}/calendar/createevent`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(appointmentData),
    });
    return handleResponse(response);
  }
};

// Analytics API calls
export const analyticsAPI = {
  getUnifiedAssessments: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/unified_assessments`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getWeeklyAnalytics: async (weekOffset = 0) => {
    const response = await fetch(`${API_BASE_URL}/analytics/weekly?week_offset=${weekOffset}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getMonthlyAnalytics: async (monthOffset = 0) => {
    const response = await fetch(`${API_BASE_URL}/analytics/monthly?month_offset=${monthOffset}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAssessmentById: async (assessmentId) => {
    const response = await fetch(`${API_BASE_URL}/analytics/assessment/${assessmentId}`, {
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

// Symptom Questionnaire API calls
export const symptomQuestionnaireAPI = {
  submitQuestionnaire: async (questionnaireData) => {
    const response = await fetch(`${API_BASE_URL}/symptom-questionnaire/submit`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(questionnaireData),
    });
    return handleResponse(response);
  },

  saveDraft: async (draftData) => {
    const response = await fetch(`${API_BASE_URL}/symptom-questionnaire/save-draft`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(draftData),
    });
    return handleResponse(response);
  },

  getDraft: async () => {
    const response = await fetch(`${API_BASE_URL}/symptom-questionnaire/draft`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  deleteDraft: async () => {
    const response = await fetch(`${API_BASE_URL}/symptom-questionnaire/draft`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getHistory: async (limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/symptom-questionnaire/history?limit=${limit}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getLatest: async () => {
    const response = await fetch(`${API_BASE_URL}/symptom-questionnaire/latest`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Doctor API calls
export const doctorAPI = {
  getPatients: async () => {
    const response = await fetch(`${API_BASE_URL}/doctor/patients`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getPatientDetails: async () => {
    const response = await fetch(`${API_BASE_URL}/doctor/patients/details`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAlerts: async (limit = 50) => {
    const response = await fetch(`${API_BASE_URL}/doctor/alerts?limit=${limit}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getPatientAssessments: async (patientId) => {
    const response = await fetch(`${API_BASE_URL}/doctor/patient/${patientId}/assessments`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getPatientAssessmentDetail: async (patientId, sessionId) => {
    const response = await fetch(`${API_BASE_URL}/doctor/patient/${patientId}/assessment/${sessionId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getPatientQuestionnaires: async (patientId) => {
    const response = await fetch(`${API_BASE_URL}/doctor/patient/${patientId}/questionnaires`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};
