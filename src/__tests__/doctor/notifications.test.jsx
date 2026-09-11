/** Follow-ups buckets records by the clinician-reviewed (effective) level, with its own "Needs review" bucket. */
import { describe, test, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server.js'
import { doctorUser, patientUser } from '../mocks/handlers.js'
import { render } from '../test-utils.jsx'
import DoctorNotifications from '../../pages/doctor/notifications.jsx'

const API = 'http://localhost:8000'
const iso = (minutesAgo) => new Date(Date.now() - minutesAgo * 60000).toISOString()

const base = { patient_id: 'testpatient', assessment_type: 'florence_conversation_with_triage' }

const alerts = [
  // Refused AI assessment, no clinician level yet: its own bucket, never "Info"
  { ...base, session_id: 'n_pending', created_at: iso(1), alert_level: 'PENDING_REVIEW', triage_status: 'pending_clinician_review', effective_alert_level: 'PENDING_REVIEW', review: null },
  // Same record after a clinician assigned RED: triage_status is still pending, the level is not
  { ...base, session_id: 'n_assigned', created_at: iso(2), alert_level: 'PENDING_REVIEW', triage_status: 'pending_clinician_review', effective_alert_level: 'RED', review: { agrees: null, alert_level_override: 'RED' }, alert_rationale: 'Clinician assigned RED' },
  // Clinician escalated Florence's YELLOW
  { ...base, session_id: 'n_escalated', created_at: iso(3), alert_level: 'YELLOW', effective_alert_level: 'RED', review: { agrees: false, alert_level_override: 'RED' }, alert_rationale: 'Escalated on review' },
  // Clinician downgraded Florence's RED
  { ...base, session_id: 'n_downgraded', created_at: iso(4), alert_level: 'RED', effective_alert_level: 'GREEN', review: { agrees: false, alert_level_override: 'GREEN' }, alert_rationale: 'Settled after a call' },
  // Backend without the review feature: Florence's RED is still critical
  { ...base, session_id: 'n_legacy', created_at: iso(5), alert_level: 'RED', alert_rationale: 'Legacy critical row' },
]

function renderFollowUps(list = alerts) {
  localStorage.setItem('token', JSON.stringify({ access_token: 'fake-jwt', token_type: 'Bearer' }))
  server.use(
    http.get(`${API}/userinfo`, () => HttpResponse.json(doctorUser)),
    http.get(`${API}/doctor/patients/details`, () => HttpResponse.json({ patients: [patientUser] })),
    http.get(`${API}/doctor/alerts`, () => HttpResponse.json({ alerts: list, count: list.length }))
  )
  return render(<DoctorNotifications />, { route: '/doctor_notifications' })
}

const sectionOf = (text) => screen.getByText(text).closest('.doctor-notifications-section')

describe('DoctorNotifications — reviewed alert levels', () => {
  beforeEach(() => localStorage.clear())

  test('buckets follow the effective level and a pending record gets its own section', async () => {
    renderFollowUps()
    // Clinician-assigned RED + escalated RED + legacy RED; the downgraded record is not critical
    expect(await screen.findByText(/Critical Alerts \(3\)/)).toBeTruthy()
    expect(screen.getByText(/Needs review \(1\)/)).toBeTruthy()
    expect(screen.getByText(/^Info \(1\)/)).toBeTruthy()
    expect(screen.queryByText(/Urgent Alerts/)).toBeNull()
    expect(screen.queryByText(/Caution Alerts/)).toBeNull()

    const critical = sectionOf(/Critical Alerts \(3\)/)
    expect(critical).toContain(screen.getByText('Clinician assigned RED'))
    expect(critical).toContain(screen.getByText('Escalated on review'))
    expect(critical).toContain(screen.getByText('Legacy critical row'))
    expect(sectionOf(/^Info \(1\)/)).toContain(screen.getByText('Settled after a call'))
  })

  test('a record with no rationale falls back to "Needs review" when pending, never the raw code', async () => {
    renderFollowUps()
    await screen.findByText(/Needs review \(1\)/)
    const pending = sectionOf(/Needs review \(1\)/)
    expect(pending).toContain(screen.getByText('Needs review', { selector: '.doctor-notifications-description' }))
    expect(screen.queryByText(/PENDING_REVIEW/)).toBeNull()
    expect(screen.queryByText('Flagged for review')).toBeNull()
  })

  test('a triaged record with no rationale and no symptoms still says "Flagged for review"', async () => {
    renderFollowUps([{ ...base, session_id: 'n_bare', created_at: iso(1), alert_level: 'ORANGE', effective_alert_level: 'ORANGE', review: null }])
    expect(await screen.findByText(/Urgent Alerts \(1\)/)).toBeTruthy()
    expect(screen.getByText('Flagged for review')).toBeTruthy()
    expect(screen.queryByText(/Needs review/)).toBeNull()
  })
})
