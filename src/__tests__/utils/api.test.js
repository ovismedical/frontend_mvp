/**
 * Tests for src/utils/api.js — all 9 API namespaces.
 * MSW intercepts real fetch calls, so we test the full API layer.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server.js'
import { setAuthToken, clearAuthToken } from '../factories.js'

import {
  authAPI,
  florenceAPI,
  questionsAPI,
  achievementsAPI,
  calendarAPI,
  analyticsAPI,
  triageAPI,
  symptomQuestionnaireAPI,
  doctorAPI,
} from '../../utils/api.js'

beforeEach(() => {
  localStorage.clear()
  setAuthToken()
})

// ===================================================================
// authAPI
// ===================================================================
describe('authAPI', () => {
  it('login sends form-urlencoded data', async () => {
    const result = await authAPI.login('testuser', 'testpass')
    expect(result.access_token).toBe('fake-jwt-token-for-testing')
  })

  it('getUserInfo returns user data', async () => {
    const result = await authAPI.getUserInfo()
    expect(result.username).toBe('testpatient')
  })

  it('register sends JSON body', async () => {
    const result = await authAPI.register({ username: 'new', email: 'a@b.com' })
    expect(result.message).toBe('OTP sent')
  })

  it('throws on HTTP error', async () => {
    server.use(
      http.get('*/userinfo', () => {
        return new HttpResponse(JSON.stringify({ detail: 'Unauthorized' }), { status: 401 })
      })
    )
    await expect(authAPI.getUserInfo()).rejects.toThrow('Unauthorized')
  })
})

// ===================================================================
// florenceAPI
// ===================================================================
describe('florenceAPI', () => {
  it('startSession returns session data', async () => {
    const result = await florenceAPI.startSession({ language: 'en' })
    expect(result.session_id).toBe('test_session_123')
    expect(result.status).toBe('active')
  })

  it('sendMessage returns AI response', async () => {
    const result = await florenceAPI.sendMessage({
      session_id: 'test_session_123',
      message: 'I feel tired',
    })
    expect(result.success).toBe(true)
    expect(result.response).toBeTruthy()
  })

  it('endSession returns completion', async () => {
    const result = await florenceAPI.endSession('test_session_123')
    expect(result.alert_level).toBe('GREEN')
  })

  it('getSessionHistory returns session', async () => {
    const result = await florenceAPI.getSessionHistory('test_session_123')
    expect(result.session_id).toBe('test_session_123')
  })
})

// ===================================================================
// achievementsAPI
// ===================================================================
describe('achievementsAPI', () => {
  it('getMyAchievements returns achievement data', async () => {
    const result = await achievementsAPI.getMyAchievements()
    expect(result.success).toBe(true)
    expect(result.current_streak).toBe(5)
  })
})

// ===================================================================
// symptomQuestionnaireAPI
// ===================================================================
describe('symptomQuestionnaireAPI', () => {
  it('submitQuestionnaire sends data', async () => {
    const result = await symptomQuestionnaireAPI.submitQuestionnaire({ answers: {} })
    expect(result.success).toBe(true)
  })

  it('saveDraft sends draft data', async () => {
    const result = await symptomQuestionnaireAPI.saveDraft({ answers: {}, section: 1 })
    expect(result.success).toBe(true)
  })

  it('getDraft returns null when no draft', async () => {
    const result = await symptomQuestionnaireAPI.getDraft()
    expect(result).toBeNull()
  })

  it('deleteDraft succeeds', async () => {
    const result = await symptomQuestionnaireAPI.deleteDraft()
    expect(result.success).toBe(true)
  })
})

// ===================================================================
// doctorAPI
// ===================================================================
describe('doctorAPI', () => {
  it('getPatients returns the backend { patients: [...] } shape', async () => {
    const result = await doctorAPI.getPatients()
    expect(Array.isArray(result.patients)).toBe(true)
  })

  it('getPatientDetails returns enriched patients with latest alert', async () => {
    const result = await doctorAPI.getPatientDetails()
    expect(result.patients[0]).toMatchObject({ username: 'testpatient', latest_alert_level: 'RED' })
  })

  it('getPatientAssessments is scoped to assigned patients', async () => {
    const ok = await doctorAPI.getPatientAssessments('testpatient')
    expect(ok.count).toBe(1)
    await expect(doctorAPI.getPatientAssessments('stranger')).rejects.toThrow(/not assigned/)
  })
})

// ===================================================================
// Auth headers
// ===================================================================
describe('auth headers', () => {
  it('includes Bearer token when set', async () => {
    let capturedHeaders
    server.use(
      http.get('*/userinfo', ({ request }) => {
        capturedHeaders = Object.fromEntries(request.headers.entries())
        return HttpResponse.json({ username: 'test' })
      })
    )
    await authAPI.getUserInfo()
    expect(capturedHeaders.authorization).toContain('Bearer')
  })

  it('omits Authorization when no token', async () => {
    clearAuthToken()
    let capturedHeaders
    server.use(
      http.get('*/userinfo', ({ request }) => {
        capturedHeaders = Object.fromEntries(request.headers.entries())
        return HttpResponse.json({ username: 'test' })
      })
    )
    await authAPI.getUserInfo()
    expect(capturedHeaders.authorization).toBeUndefined()
  })
})
