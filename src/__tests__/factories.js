/**
 * Test data factories for OVIS frontend tests.
 */

export function makeUser(overrides = {}) {
  return {
    username: 'testpatient',
    full_name: 'Test Patient',
    birthdate: '01/01/1990',
    gender: 'male',
    isDoctor: false,
    height: 170,
    weight: 70,
    bloodtype: 'O+',
    fitness_level: 3,
    exercises: ['walking'],
    checkups: 'monthly',
    ...overrides,
  }
}

export function makeDoctor(overrides = {}) {
  return {
    username: 'testdoctor',
    full_name: 'Dr. Test',
    isDoctor: true,
    code: 'ABCD',
    patients: ['testpatient'],
    ...overrides,
  }
}

export function makeToken(overrides = {}) {
  return {
    access_token: 'fake-jwt-token-for-testing',
    token_type: 'Bearer',
    ...overrides,
  }
}

export function makeAssessment(overrides = {}) {
  return {
    session_id: 'test_session_123',
    user_id: 'testpatient',
    alert_level: 'GREEN',
    created_at: '2026-03-17T00:00:00+00:00',
    completed_at: '2026-03-17T00:10:00+00:00',
    ...overrides,
  }
}

export function makeTriageResult(overrides = {}) {
  return {
    alert_level: 'GREEN',
    alert_rationale: 'Symptoms within normal range.',
    diagnosis_predictions: [
      {
        suspected_diagnosis: 'Treatment side effects',
        probability: 'medium',
        urgency: 2,
      },
    ],
    recommended_timeline: 'Routine follow-up',
    ...overrides,
  }
}

export function makeAppointment(overrides = {}) {
  return {
    id: 'appt_1',
    title: 'Check-up',
    date: '2026-03-20',
    time: '10:00',
    doctor: 'Dr. Test',
    ...overrides,
  }
}

export function makeMedication(overrides = {}) {
  return {
    id: 'med_1',
    name: 'Paracetamol',
    dosage: '500mg',
    frequency: 'twice daily',
    ...overrides,
  }
}

/**
 * Set up localStorage with a valid auth token.
 */
export function setAuthToken(token = 'fake-jwt-token-for-testing') {
  localStorage.setItem('token', JSON.stringify({ access_token: token }))
}

/**
 * Clear auth token from localStorage.
 */
export function clearAuthToken() {
  localStorage.removeItem('token')
}
