// API utility functions for connecting to the backend

const API_BASE_URL = 'http://127.0.0.1:8000';

// Get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Get auth headers with token
export const getAuthHeaders = () => {
  const token = getAuthToken();
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
  };
};

// Make authenticated API call
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();
  
  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('token_type');
      window.location.href = '/patientlogin';
      return null;
    }
    
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Register user
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/login/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response;
};

// Login user
export const loginUser = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/login/token`, {
    method: 'POST',
    body: formData,
  });
  return response;
};

// Get user personal info
export const getUserInfo = async () => {
  return await apiCall('/login/personalinfo');
};

// Test authentication
export const testAuth = async () => {
  return await apiCall('/login/test');
};

// Example: Make authenticated request to any endpoint
export const makeAuthenticatedRequest = async (endpoint, method = 'GET', data = null) => {
  const options = {
    method,
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  return await apiCall(endpoint, options);
}; 