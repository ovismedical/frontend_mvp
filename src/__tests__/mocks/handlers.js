import { http, HttpResponse } from 'msw'

const API = 'http://localhost:8000'

export const handlers = [
  // Auth
  http.post(`${API}/token`, async () => {
    return HttpResponse.json({
      access_token: 'fake-jwt-token-for-testing',
      token_type: 'Bearer',
    })
  }),

  http.get(`${API}/userinfo`, () => {
    return HttpResponse.json({
      username: 'testpatient',
      full_name: 'Test Patient',
      birthdate: '01/01/1990',
      gender: 'male',
      isDoctor: false,
    })
  }),

  http.post(`${API}/updateinfo`, () => {
    return HttpResponse.json({ details: 'Succesfully updated user info' })
  }),

  // OTP
  http.post(`${API}/otp/register`, () => {
    return HttpResponse.json({ message: 'OTP sent' })
  }),

  http.post(`${API}/otp/verify`, () => {
    return HttpResponse.json({ access_token: 'fake-jwt', token_type: 'Bearer' })
  }),

  http.post(`${API}/otp/resend`, () => {
    return HttpResponse.json({ message: 'OTP resent' })
  }),

  // Florence
  http.post(`${API}/florence/start_session`, () => {
    return HttpResponse.json({
      session_id: 'test_session_123',
      status: 'active',
      message: 'Hello! How are you feeling today?',
    })
  }),

  http.post(`${API}/florence/send_message`, () => {
    return HttpResponse.json({
      success: true,
      response: 'I understand. Can you tell me more?',
      florence_state: 'assessing',
    })
  }),

  http.post(`${API}/florence/finish_session/:sessionId`, () => {
    return HttpResponse.json({
      message: 'Session completed',
      alert_level: 'GREEN',
    })
  }),

  http.get(`${API}/florence/session/:sessionId`, () => {
    return HttpResponse.json({
      session_id: 'test_session_123',
      status: 'active',
      conversation_history: [],
    })
  }),

  http.get(`${API}/florence/test`, () => {
    return HttpResponse.json({ status: 'ok', active_sessions: 0 })
  }),

  // Questions
  http.get(`${API}/getquestions`, () => {
    return HttpResponse.json({ questions: [] })
  }),

  http.post(`${API}/submitanswers`, () => {
    return HttpResponse.json({ success: true })
  }),

  // Achievements
  http.get(`${API}/achievements/me`, () => {
    return HttpResponse.json({
      success: true,
      current_streak: 5,
      longest_streak: 10,
      achievements: [],
    })
  }),

  // Analytics
  http.get(`${API}/analytics/unified-assessments`, () => {
    return HttpResponse.json([])
  }),

  // Triage
  http.get(`${API}/triage/history/:patientId`, () => {
    return HttpResponse.json([])
  }),

  http.get(`${API}/triage/latest/:patientId`, () => {
    return HttpResponse.json(null)
  }),

  // Symptom questionnaire
  http.post(`${API}/symptom-questionnaire/submit`, () => {
    return HttpResponse.json({ success: true })
  }),

  http.post(`${API}/symptom-questionnaire/save-draft`, () => {
    return HttpResponse.json({ success: true })
  }),

  http.get(`${API}/symptom-questionnaire/draft`, () => {
    return HttpResponse.json(null)
  }),

  http.delete(`${API}/symptom-questionnaire/draft`, () => {
    return HttpResponse.json({ success: true })
  }),

  // Doctor
  http.get(`${API}/doctor/patients`, () => {
    return HttpResponse.json([])
  }),

  // Calendar
  http.get(`${API}/calendar/events`, () => {
    return HttpResponse.json([])
  }),

  // Health
  http.get(`${API}/health`, () => {
    return HttpResponse.json({ status: 'healthy' })
  }),
]
