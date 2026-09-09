/** Doctor patient-details reads the real record, not fixtures. */
import { describe, test, expect, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { server } from '../mocks/server.js'
import { doctorUser, sampleAssessment, legacyAssessment, pendingAssessment } from '../mocks/handlers.js'
import { render } from '../test-utils.jsx'
import PatientDetails from '../../pages/doctor/patient_details/patient_details.jsx'

const API = 'http://localhost:8000'

function renderDetails(patientId = 'testpatient') {
  localStorage.setItem('token', JSON.stringify({ access_token: 'fake-jwt', token_type: 'Bearer' }))
  server.use(http.get(`${API}/userinfo`, () => HttpResponse.json(doctorUser)))
  return render(
    <Routes>
      <Route path="/patient_details/:patientId" element={<PatientDetails />} />
    </Routes>,
    { route: `/patient_details/${patientId}` }
  )
}

/** Newest first, as the backend sorts them. */
function useAssessments(list) {
  server.use(http.get(`${API}/doctor/patient/:patientId/assessments`, () => HttpResponse.json({ assessments: list, count: list.length })))
}

/** The Assessments-tab card whose level pill reads `pillText`. */
function cardWithPill(pillText) {
  const pill = screen.getAllByText(pillText, { selector: '.alert-pill' })[0]
  return pill.closest('.patient-record-item')
}

async function openAssessments(user) {
  await screen.findByText('Test Patient')
  await user.click(screen.getByText('Assessments'))
}

describe('PatientDetails', () => {
  beforeEach(() => localStorage.clear())

  test('shows the real patient with latest alert, streak and concerns', async () => {
    renderDetails()
    expect(await screen.findByText('Test Patient')).toBeTruthy()
    expect(screen.getAllByText(/RED/).length).toBeGreaterThan(0)
    expect(screen.getByText(/6 days/)).toBeTruthy()
    expect(screen.getByText('Appetite Loss')).toBeTruthy()
    expect(screen.getByText(/Immediate attention/)).toBeTruthy()
    // smart insight from /triage/insights
    expect(document.querySelector('.smart-insight-card.error')).toBeTruthy()
  })

  test('assessments tab lists Florence records and loads the transcript on demand', async () => {
    renderDetails()
    await screen.findByText('Test Patient')
    const user = userEvent.setup()
    await user.click(screen.getByText('Assessments'))
    expect(await screen.findByText(/Highest urgency driven by fatigue/)).toBeTruthy()
    await user.click(screen.getByText(/view conversation/i))
    expect(await screen.findByText('Very tired today.')).toBeTruthy()
  })

  test('check-ins tab shows questionnaire concerns and answers', async () => {
    renderDetails()
    await screen.findByText('Test Patient')
    const user = userEvent.setup()
    await user.click(screen.getByText('Check-ins'))
    expect(await screen.findByText(/Appetite Loss \(Poor\)/)).toBeTruthy()
    await user.click(screen.getByText(/view answers/i))
    expect(await screen.findByText('How is your appetite?')).toBeTruthy()
  })

  test('an unassigned patient shows a not-found state instead of crashing', async () => {
    renderDetails('stranger')
    expect(await screen.findByText(/not found or not assigned/i)).toBeTruthy()
  })
})

describe('PatientDetails — clinician review', () => {
  beforeEach(() => localStorage.clear())

  test('a reviewed-aware backend: effective level drives header and card; legacy record still renders its own level', async () => {
    // Newest record overridden to ORANGE by a clinician, older legacy record has no review fields at all
    useAssessments([
      sampleAssessment({
        review: { agrees: false, alert_level_override: 'ORANGE', note: 'Stable on review', florence_alert_level: 'RED' },
        effective_alert_level: 'ORANGE',
      }),
      legacyAssessment(),
    ])
    renderDetails()
    await screen.findByText('Test Patient')

    // Header chip follows the override, not Florence's RED
    expect(screen.getByText('At Risk · ORANGE')).toBeTruthy()
    expect(screen.queryByText('Critical · RED')).toBeNull()
    // Overview title uses the same effective level
    expect(screen.getByText('ORANGE', { selector: '.daily-health-summary-card-title' })).toBeTruthy()

    const user = userEvent.setup()
    await user.click(screen.getByText('Assessments'))
    const overridden = cardWithPill('ORANGE')
    expect(within(overridden).getByText('Reviewed · set to ORANGE')).toBeTruthy()
    expect(within(overridden).getByRole('button', { name: 'Change' })).toBeTruthy()
    expect(within(overridden).queryByRole('button', { name: 'Agree' })).toBeNull()

    // Legacy record (no review / effective_alert_level): level from alert_level, review buttons offered
    const legacy = cardWithPill('YELLOW')
    expect(within(legacy).getByText(/Mild nausea after treatment/)).toBeTruthy()
    expect(within(legacy).getByRole('button', { name: 'Agree' })).toBeTruthy()
    expect(within(legacy).getByRole('button', { name: 'Override' })).toBeTruthy()
  })

  test('Agree posts agrees=true and shows the agreed chip; the header level is unchanged', async () => {
    const posted = []
    server.use(
      http.post(`${API}/doctor/assessments/:sessionId/review`, async ({ request, params }) => {
        const body = await request.json()
        posted.push({ sessionId: params.sessionId, body })
        return HttpResponse.json({
          review: { ...body, session_id: params.sessionId, doctor: 'testdoctor', florence_alert_level: 'RED', reviewed_at: new Date().toISOString() },
          effective_alert_level: 'RED',
        })
      })
    )
    renderDetails()
    const user = userEvent.setup()
    await openAssessments(user)

    const card = cardWithPill('RED')
    await user.click(within(card).getByRole('button', { name: 'Agree' }))

    expect(await within(card).findByText('Reviewed · Agreed')).toBeTruthy()
    expect(within(card).queryByRole('button', { name: 'Agree' })).toBeNull()
    expect(posted).toEqual([{ sessionId: 'testpatient_1', body: { agrees: true, alert_level_override: null, note: null } }])
    expect(screen.getByText('Critical · RED')).toBeTruthy()
  })

  test('Override opens the level picker; saving changes the header level and shows the override chip', async () => {
    const posted = []
    server.use(
      http.post(`${API}/doctor/assessments/:sessionId/review`, async ({ request, params }) => {
        const body = await request.json()
        posted.push(body)
        return HttpResponse.json({
          review: { ...body, session_id: params.sessionId, doctor: 'testdoctor', florence_alert_level: 'RED', reviewed_at: new Date().toISOString() },
          effective_alert_level: body.alert_level_override,
        })
      })
    )
    renderDetails()
    const user = userEvent.setup()
    await openAssessments(user)
    expect(screen.getByText('Critical · RED')).toBeTruthy()

    const card = cardWithPill('RED')
    await user.click(within(card).getByRole('button', { name: 'Override' }))

    // Picker with the four clinical levels, save disabled until one is chosen
    const picker = within(card).getByRole('group', { name: 'Set alert level' })
    expect(within(picker).getAllByRole('button').map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'false', 'false', 'false'])
    const save = within(card).getByRole('button', { name: 'Save review' })
    expect(save).toBeDisabled()

    await user.click(within(picker).getByRole('button', { name: 'ORANGE' }))
    expect(within(picker).getByRole('button', { name: 'ORANGE' })).toHaveAttribute('aria-pressed', 'true')
    await user.type(within(card).getByPlaceholderText(/Add a note/), 'Spoke to patient, symptoms settling')
    await user.click(save)

    expect(await within(card).findByText('Reviewed · set to ORANGE')).toBeTruthy()
    expect(posted).toEqual([{ agrees: false, alert_level_override: 'ORANGE', note: 'Spoke to patient, symptoms settling' }])
    // Header and Overview follow the clinician's level
    await waitFor(() => expect(screen.getByText('At Risk · ORANGE')).toBeTruthy())
    expect(screen.queryByText('Critical · RED')).toBeNull()
    expect(within(card).getByText('ORANGE', { selector: '.alert-pill' })).toBeTruthy()
  })

  test('a failed save rolls back the optimistic update and shows the error', async () => {
    server.use(
      http.post(`${API}/doctor/assessments/:sessionId/review`, () => HttpResponse.json({ detail: 'boom' }, { status: 500 }))
    )
    renderDetails()
    const user = userEvent.setup()
    await openAssessments(user)

    const card = cardWithPill('RED')
    await user.click(within(card).getByRole('button', { name: 'Agree' }))

    expect(await within(card).findByRole('alert')).toHaveTextContent(/Couldn't save the review/)
    expect(within(card).queryByText('Reviewed · Agreed')).toBeNull()
    expect(within(card).getByRole('button', { name: 'Agree' })).toBeTruthy()
    expect(screen.getByText('Critical · RED')).toBeTruthy()
  })

  test('a pending record shows "Needs review" everywhere, never the raw code, and offers only the level picker', async () => {
    useAssessments([pendingAssessment(), sampleAssessment()])
    renderDetails()
    await screen.findByText('Test Patient')

    // Header chip: label alone, no " · CODE" suffix; Overview title translated
    expect(screen.queryByText(/PENDING_REVIEW/)).toBeNull()
    expect(screen.getByText('Needs review', { selector: '.patient-card-status' })).toBeTruthy()
    expect(screen.getByText('Needs review', { selector: '.daily-health-summary-card-title' })).toBeTruthy()

    const user = userEvent.setup()
    await user.click(screen.getByText('Assessments'))
    expect(screen.queryByText(/PENDING_REVIEW/)).toBeNull()

    const pending = cardWithPill('Needs review')
    // No Florence level to agree with: picker only, headed "Set alert level"
    expect(within(pending).queryByRole('button', { name: 'Agree' })).toBeNull()
    expect(within(pending).queryByRole('button', { name: 'Override' })).toBeNull()
    expect(within(pending).getByText('Set alert level', { selector: 'p' })).toBeTruthy()
    expect(within(pending).getByRole('group', { name: 'Set alert level' })).toBeTruthy()

    // The triaged RED card still has the normal Agree / Override pair
    const triaged = cardWithPill('RED')
    expect(within(triaged).getByRole('button', { name: 'Agree' })).toBeTruthy()
  })

  test('assigning a level to a pending record posts agrees=null with the override and replaces "Needs review"', async () => {
    useAssessments([pendingAssessment(), sampleAssessment()])
    const posted = []
    server.use(
      http.post(`${API}/doctor/assessments/:sessionId/review`, async ({ request, params }) => {
        const body = await request.json()
        posted.push({ sessionId: params.sessionId, body })
        return HttpResponse.json({
          review: { ...body, agrees: null, session_id: params.sessionId, doctor: 'testdoctor', florence_alert_level: null, reviewed_at: new Date().toISOString() },
          effective_alert_level: body.alert_level_override,
        })
      })
    )
    renderDetails()
    const user = userEvent.setup()
    await openAssessments(user)

    const pending = cardWithPill('Needs review')
    const picker = within(pending).getByRole('group', { name: 'Set alert level' })
    await user.click(within(picker).getByRole('button', { name: 'YELLOW' }))
    await user.click(within(pending).getByRole('button', { name: 'Save review' }))

    expect(await within(pending).findByText('Reviewed · set to YELLOW')).toBeTruthy()
    expect(posted).toEqual([{ sessionId: 'testpatient_pending', body: { agrees: null, alert_level_override: 'YELLOW', note: null } }])
    // Header and card no longer say "Needs review"
    await waitFor(() => expect(screen.getByText('At Risk · YELLOW')).toBeTruthy())
    expect(screen.queryByText('Needs review')).toBeNull()
    expect(screen.queryByText(/PENDING_REVIEW/)).toBeNull()
    expect(within(pending).getByText('YELLOW', { selector: '.alert-pill' })).toBeTruthy()
  })
})
