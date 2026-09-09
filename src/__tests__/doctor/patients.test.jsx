/** Doctor patient list: alert labels, the pending-review state and the reviewed marker. */
import { describe, test, expect, beforeEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server.js'
import { doctorUser, patientUser } from '../mocks/handlers.js'
import { render } from '../test-utils.jsx'
import DoctorPatients from '../../pages/doctor/patients.jsx'

const API = 'http://localhost:8000'

const patients = [
  // Legacy shape from a backend without reviews: no latest_review key at all
  { ...patientUser, latest_alert_level: 'RED', last_assessment_date: new Date().toISOString() },
  {
    username: 'pendingpatient', full_name: 'Pending Patient', isDoctor: false, doctor: 'testdoctor',
    latest_alert_level: 'PENDING_REVIEW', latest_review: null, last_assessment_date: new Date().toISOString(),
  },
  {
    username: 'reviewedpatient', full_name: 'Reviewed Patient', isDoctor: false, doctor: 'testdoctor',
    latest_alert_level: 'YELLOW', latest_review: { agrees: false, alert_level_override: 'YELLOW' },
    last_assessment_date: new Date().toISOString(),
  },
]

function renderList() {
  localStorage.setItem('token', JSON.stringify({ access_token: 'fake-jwt', token_type: 'Bearer' }))
  server.use(
    http.get(`${API}/userinfo`, () => HttpResponse.json(doctorUser)),
    http.get(`${API}/doctor/patients/details`, () => HttpResponse.json({ patients }))
  )
  return render(<DoctorPatients />, { route: '/doctor_patients' })
}

const rowFor = (name) => screen.getByText(name).closest('.patient-item')

describe('DoctorPatients', () => {
  beforeEach(() => localStorage.clear())

  test('renders the effective level as sent, "Needs review" for pending, and a reviewed marker', async () => {
    renderList()
    await screen.findByText('Test Patient')

    expect(within(rowFor('Test Patient')).getByText('Critical')).toBeTruthy()
    expect(within(rowFor('Test Patient')).queryByText('Reviewed')).toBeNull()

    expect(within(rowFor('Pending Patient')).getByText('Needs review')).toBeTruthy()
    expect(within(rowFor('Pending Patient')).queryByText('Reviewed')).toBeNull()

    expect(within(rowFor('Reviewed Patient')).getByText('Caution')).toBeTruthy()
    expect(within(rowFor('Reviewed Patient')).getByText('Reviewed')).toBeTruthy()

    expect(screen.queryByText(/PENDING_REVIEW/)).toBeNull()
    expect(screen.queryByText('No Data')).toBeNull()
  })

  test('pending patients are filterable', async () => {
    renderList()
    await screen.findByText('Test Patient')
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /filter_list/ }))
    await user.click(document.querySelector('.filter-section-header'))
    await user.click(screen.getByLabelText('Needs review'))

    expect(screen.getByText('Pending Patient')).toBeTruthy()
    expect(screen.queryByText('Test Patient')).toBeNull()
    expect(screen.queryByText('Reviewed Patient')).toBeNull()
  })
})
