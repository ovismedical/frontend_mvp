/** Doctor home stats and recent activity follow the clinician-reviewed (effective) level. */
import { describe, test, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server.js'
import { doctorUser } from '../mocks/handlers.js'
import { render } from '../test-utils.jsx'
import DoctorHome from '../../pages/doctor/home.jsx'

const API = 'http://localhost:8000'
const iso = (minutesAgo) => new Date(Date.now() - minutesAgo * 60000).toISOString()

const alertFor = (username, minutesAgo, fields) => ({
  session_id: `s_${username}`,
  patient_id: username,
  assessment_type: 'florence_conversation_with_triage',
  created_at: iso(minutesAgo),
  ...fields,
})

// One patient per review outcome so each recent-activity row can be checked on its own.
// last_assessment_date is null so the only activity rows are the alerts under test.
const patientFor = (username, full_name) => ({ username, full_name, isDoctor: false, doctor: 'testdoctor', last_assessment_date: null })

function renderHome(patients, alerts) {
  localStorage.setItem('token', JSON.stringify({ access_token: 'fake-jwt', token_type: 'Bearer' }))
  server.use(
    http.get(`${API}/userinfo`, () => HttpResponse.json(doctorUser)),
    http.get(`${API}/doctor/patients/details`, () => HttpResponse.json({ patients })),
    http.get(`${API}/doctor/alerts`, () => HttpResponse.json({ alerts, count: alerts.length }))
  )
  return render(<DoctorHome />, { route: '/doctor_home' })
}

const statValue = (title) =>
  screen.getByText(title).closest('.doctor-home-overview-card').querySelector('.doctor-home-overview-card-value').textContent
const activityTitleFor = (name) =>
  screen.getByText(name).closest('.recent-activity-card').querySelector('.activity-title').textContent

describe('DoctorHome — reviewed alert levels', () => {
  beforeEach(() => localStorage.clear())

  test('critical count and activity titles use the effective level, with alert_level as fallback', async () => {
    renderHome(
      [patientFor('escalated', 'Escalated Patient'), patientFor('downgraded', 'Downgraded Patient'), patientFor('legacy', 'Legacy Patient')],
      [
        // Clinician escalated Florence's YELLOW to RED
        alertFor('escalated', 1, { alert_level: 'YELLOW', effective_alert_level: 'RED', review: { agrees: false, alert_level_override: 'RED' } }),
        // Clinician downgraded Florence's RED to GREEN
        alertFor('downgraded', 2, { alert_level: 'RED', effective_alert_level: 'GREEN', review: { agrees: false, alert_level_override: 'GREEN' } }),
        // Backend without the review feature: level comes from alert_level
        alertFor('legacy', 3, { alert_level: 'RED' }),
      ]
    )
    expect(await screen.findByText('Escalated Patient')).toBeTruthy()

    expect(activityTitleFor('Escalated Patient')).toBe('Critical Alert')
    expect(activityTitleFor('Downgraded Patient')).toBe('New Florence Assessment')
    expect(activityTitleFor('Legacy Patient')).toBe('Critical Alert')

    expect(statValue('Critical Alerts')).toBe('2')
    expect(statValue('Flagged This Week')).toBe('3')
    expect(statValue('Total Patients')).toBe('3')
  })

  test('a clinician-assigned RED on a record awaiting review counts as critical; an unreviewed one does not', async () => {
    renderHome(
      [patientFor('assigned', 'Assigned Patient'), patientFor('waiting', 'Waiting Patient')],
      [
        alertFor('assigned', 1, {
          alert_level: 'PENDING_REVIEW', triage_status: 'pending_clinician_review',
          effective_alert_level: 'RED', review: { agrees: null, alert_level_override: 'RED' },
        }),
        alertFor('waiting', 2, {
          alert_level: 'PENDING_REVIEW', triage_status: 'pending_clinician_review',
          effective_alert_level: 'PENDING_REVIEW', review: null,
        }),
      ]
    )
    expect(await screen.findByText('Assigned Patient')).toBeTruthy()

    expect(activityTitleFor('Assigned Patient')).toBe('Critical Alert')
    expect(activityTitleFor('Waiting Patient')).toBe('New Florence Assessment')
    expect(statValue('Critical Alerts')).toBe('1')
  })
})
