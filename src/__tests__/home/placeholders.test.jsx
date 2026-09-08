/** Placeholder surfaces are labelled honestly: sample data vs. coming soon. */
import { describe, test, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server.js'
import { doctorUser } from '../mocks/handlers.js'
import { render } from '../test-utils.jsx'
import TodaysMedication from '../../components/layout/todaysMedication.jsx'
import Appointments from '../../pages/patient/appointments/appointment.jsx'
import ForgotPassword from '../../pages/auth/forgotpassword.jsx'
import DoctorHome from '../../pages/doctor/home.jsx'

const API = 'http://localhost:8000'
const authed = () => localStorage.setItem('token', JSON.stringify({ access_token: 'fake-jwt', token_type: 'Bearer' }))

describe('placeholder labelling', () => {
  beforeEach(() => { localStorage.clear(); authed() })

  test("today's medication card is marked as sample data", () => {
    render(<TodaysMedication />)
    expect(screen.getByTestId('status-banner-sample')).toBeTruthy()
    expect(screen.getByText(/connected to your clinical record/i)).toBeTruthy()
  })

  test('appointments are marked coming soon', () => {
    render(<Appointments />, { route: '/appointments' })
    expect(screen.getByTestId('status-banner-coming-soon')).toBeTruthy()
    expect(screen.getByText(/connected to your clinic's calendar/i)).toBeTruthy()
  })

  test('forgot password is marked coming soon', () => {
    render(<ForgotPassword />, { route: '/forgotPassword' })
    expect(screen.getByTestId('status-banner-coming-soon')).toBeTruthy()
  })

  test('doctor quick actions are tagged coming soon and show live stats', async () => {
    server.use(http.get(`${API}/userinfo`, () => HttpResponse.json(doctorUser)))
    render(<DoctorHome />, { route: '/doctor_home' })
    await waitFor(() => expect(screen.getByText('Dr. Test Doctor')).toBeTruthy())
    expect(screen.getAllByText(/coming soon/i).length).toBe(4)
    await waitFor(() => expect(screen.getByText('Total Patients').previousSibling.textContent).toBe('1'))
    expect(document.querySelectorAll('.quick-action-card.is-coming-soon').length).toBe(4)
  })
})
