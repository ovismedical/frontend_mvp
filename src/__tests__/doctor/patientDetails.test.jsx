/** Doctor patient-details reads the real record, not fixtures. */
import { describe, test, expect, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { server } from '../mocks/server.js'
import { doctorUser } from '../mocks/handlers.js'
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
