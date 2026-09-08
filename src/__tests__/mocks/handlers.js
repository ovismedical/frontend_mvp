import { http, HttpResponse } from 'msw'

const API = 'http://localhost:8000'

export const doctorUser = {
  username: 'testdoctor',
  full_name: 'Dr. Test Doctor',
  specialty: 'Oncology',
  hospital: 'Test Hospital',
  isDoctor: true,
  code: 'ABCD',
  patients: ['testpatient'],
}

export const patientUser = {
  username: 'testpatient',
  full_name: 'Test Patient',
  birthdate: '01/01/1990',
  gender: 'male',
  isDoctor: false,
  doctor: 'testdoctor',
  doctor_name: 'Dr. Test Doctor',
  streak: 6,
  longest_streak: 9,
  last_completion: '09/08/2026',
}

const nowIso = (daysAgo = 0) => new Date(Date.now() - daysAgo * 86400000).toISOString()

export const sampleAssessment = (overrides = {}) => ({
  _id: 'a1',
  session_id: 'testpatient_1',
  user_id: 'testpatient',
  created_at: nowIso(0),
  assessment_type: 'florence_conversation_with_triage',
  alert_level: 'RED',
  oncologist_notification_level: 'red',
  flag_for_oncologist: true,
  structured_assessment: {
    symptoms: {
      fatigue: { frequency_rating: 5, severity_rating: 5, key_indicators: [] },
      nausea: { frequency_rating: 2, severity_rating: 2, key_indicators: [] },
    },
    mood_assessment: 'Tired but positive',
  },
  triage_assessment: {
    alert_level: 'RED',
    alert_rationale: 'Highest urgency driven by fatigue severity 5/5.',
    recommended_timeline: 'Immediate attention',
    key_symptoms: ['fatigue'],
    confidence_level: 'medium',
    diagnosis_predictions: [
      { suspected_diagnosis: 'Treatment-related fatigue', probability: 'high', urgency: 4, reasoning: 'Consistent with therapy.' },
    ],
  },
  ...overrides,
})

export const sampleQuestionnaire = (overrides = {}) => ({
  user_id: 'testpatient',
  timestamp: nowIso(0),
  submitted_at: nowIso(0),
  alert_level: 'YELLOW',
  completion: { questions_answered: 22, sections_completed: 13, total_sections: 13 },
  clinical_summary: {
    symptom_count: 2,
    max_severity: 4,
    max_severity_area: 'Appetite Loss',
    areas_of_concern: [
      { section_id: 'SN001', area: 'Appetite Loss', clinical_area: 'nutrition', severity_score: 4, severity_label: 'Poor', details: [] },
      { section_id: 'SN006', area: 'Insomnia', clinical_area: 'sleep', severity_score: 3, severity_label: 'Poor', details: [] },
    ],
    alert_flags: ['Appetite Loss: rated Poor (4/5)'],
  },
  sections: [
    {
      section_id: 'SN001', title: 'Appetite Loss', clinical_area: 'nutrition', severity_score: 4, severity_label: 'Poor',
      responses: [{ question_id: 'appetite_rating', question_text: 'How is your appetite?', type: 'rating', was_shown: true, raw_value: 4, display_value: 'Poor' }],
    },
  ],
  answers: { appetite_rating: 4 },
  ...overrides,
})

export const handlers = [
  // Auth capability flags (direct registration by default in tests)
  http.get(`${API}/auth/config`, () => {
    return HttpResponse.json({ registration: { otp_required: false, direct_endpoint: '/register' }, florence_available: false })
  }),

  http.post(`${API}/register`, async ({ request }) => {
    const body = await request.json()
    if (body.access_code === 'ZZZZ') return HttpResponse.json({ detail: 'Invalid access code' }, { status: 400 })
    return HttpResponse.json({ message: 'Account created successfully', username: body.username, role: 'patient' }, { status: 201 })
  }),

  // Auth
  http.post(`${API}/token`, async () => {
    return HttpResponse.json({
      access_token: 'fake-jwt-token-for-testing',
      token_type: 'Bearer',
    })
  }),

  http.get(`${API}/userinfo`, () => {
    return HttpResponse.json(patientUser)
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
    return HttpResponse.json({ patients: ['testpatient'] })
  }),

  http.get(`${API}/doctor/patients/details`, () => {
    return HttpResponse.json({
      patients: [{ ...patientUser, latest_alert_level: 'RED', last_assessment_date: nowIso(0) }],
    })
  }),

  http.get(`${API}/doctor/alerts`, () => {
    return HttpResponse.json({
      alerts: [{
        session_id: 'testpatient_1', patient_id: 'testpatient', alert_level: 'RED',
        alert_rationale: 'Highest urgency driven by fatigue severity 5/5.', key_symptoms: ['fatigue'],
        recommended_timeline: 'Immediate attention', created_at: nowIso(0), assessment_type: 'florence_conversation_with_triage',
      }],
      count: 1,
    })
  }),

  http.get(`${API}/doctor/patient/:patientId/assessments`, ({ params }) => {
    if (params.patientId !== 'testpatient') return HttpResponse.json({ detail: 'Patient not assigned to you' }, { status: 403 })
    return HttpResponse.json({ assessments: [sampleAssessment()], count: 1 })
  }),

  http.get(`${API}/doctor/patient/:patientId/assessment/:sessionId`, () => {
    return HttpResponse.json({ ...sampleAssessment(), conversation_history: [
      { role: 'assistant', content: 'Hello, how are you feeling?' },
      { role: 'user', content: 'Very tired today.' },
    ] })
  }),

  http.get(`${API}/doctor/patient/:patientId/questionnaires`, ({ params }) => {
    if (params.patientId !== 'testpatient') return HttpResponse.json({ detail: 'Patient not assigned to you' }, { status: 403 })
    return HttpResponse.json({ questionnaires: [sampleQuestionnaire()], count: 1 })
  }),

  http.get(`${API}/triage/insights/:patientId`, () => {
    return HttpResponse.json({ success: true, insights: [
      { icon: 'error', title: 'attention_needed', description: 'attention_needed_description', insightType: 'error' },
    ] })
  }),

  http.get(`${API}/getstreak`, () => {
    return HttpResponse.json({ streak: 6, longest_streak: 9, last_completion: '09/08/2026' })
  }),

  http.get(`${API}/symptom-questionnaire/history`, () => {
    return HttpResponse.json({ history: [sampleQuestionnaire()], count: 1 })
  }),

  http.get(`${API}/analytics/unified_assessments`, () => {
    return HttpResponse.json({
      success: true, total_assessments: 2, daily_checkins: 1, florence_conversations: 1,
      assessments: [
        { id: 'q1', type: 'daily_checkin', date: nowIso(0), title: 'Daily Symptom Check-in', summary: 'Concerns: Appetite Loss (Poor)', data: {}, oncologist_notification_level: 'amber', flag_for_oncologist: true },
        { id: 'a1', type: 'florence_conversation', date: nowIso(1), title: 'Florence AI Chat', summary: 'Notable symptoms: Fatigue 5/5', data: {}, oncologist_notification_level: 'red', flag_for_oncologist: true },
      ],
    })
  }),

  http.get(`${API}/analytics/weekly`, ({ request }) => {
    const offset = new URL(request.url).searchParams.get('week_offset')
    const severity = offset === '1' ? 2 : 3
    return HttpResponse.json({ success: true, data: {
      totalAssessments: 2, totalAlerts: 1, sources: { florence: 1, questionnaire: 1 },
      dailyData: Array.from({ length: 7 }, (_, i) => ({ date: '2026-09-0' + (i + 1), avgSeverity: i < 2 ? severity : 0, assessmentCount: i < 2 ? 1 : 0, hasData: i < 2 })),
      symptomTrends: {}, avgSeverityBySymptom: { fatigue: severity }, alertDistribution: { none: 1, amber: 1, red: 0 },
      insights: [{ id: 'x', type: 'info', icon: 'fa-info-circle', title: 'T', description: 'D' }],
      weekRange: { start: '2026-09-07', end: '2026-09-13' }, weekLabel: 'This Week', weekOffset: Number(offset || 0),
    } })
  }),

  http.get(`${API}/analytics/monthly`, () => {
    return HttpResponse.json({ success: true, data: {
      totalAssessments: 3, totalAlerts: 1, sources: { florence: 2, questionnaire: 1 },
      alertsByDay: { 4: 1 }, severityByDay: { 2: 2.5, 4: 3.5, 12: 1.5 }, symptomsByDay: { fatigue: { 2: 3 } },
      availableSymptoms: ['fatigue'], monthRange: { start: '2026-09-01', end: '2026-09-30' }, monthLabel: 'September 2026',
      monthOffset: 0, year: 2026, month: 9, daysInMonth: 30,
    } })
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
