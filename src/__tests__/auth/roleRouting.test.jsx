/**
 * Role-aware routing: login sends doctors and patients to their own homes, and
 * guarded routes bounce the wrong role instead of looping to /login.
 */
import { describe, test, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server.js'
import { doctorUser, patientUser } from '../mocks/handlers.js'
import { AuthProvider } from '../../context/AuthContext.jsx'
import { ScaleProvider } from '../../context/ScaleContext.jsx'
import App from '../../App.jsx'
import { normalizeUser, homeFor } from '../../utils/auth.js'

const API = 'http://localhost:8000'

function renderApp(route, { authenticated = false } = {}) {
  if (authenticated) {
    localStorage.setItem('token', JSON.stringify({ access_token: 'fake-jwt', token_type: 'Bearer' }))
  }
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ScaleProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ScaleProvider>
    </MemoryRouter>
  )
}

const asDoctor = () => server.use(http.get(`${API}/userinfo`, () => HttpResponse.json(doctorUser)))

describe('normalizeUser / homeFor', () => {
  test('derives role from isDoctor', () => {
    expect(normalizeUser(doctorUser).role).toBe('doctor')
    expect(normalizeUser(patientUser).role).toBe('patient')
    expect(normalizeUser(null)).toBeNull()
  })

  test('maps dob/sex from either field naming', () => {
    expect(normalizeUser({ username: 'x', birthdate: '01/01/1990', gender: 'male' })).toMatchObject({ dob: '01/01/1990', sex: 'male' })
    expect(normalizeUser({ username: 'x', dob: '02/02/1980', sex: 'female' })).toMatchObject({ dob: '02/02/1980', sex: 'female' })
  })

  test('homeFor routes by role', () => {
    expect(homeFor(normalizeUser(doctorUser))).toBe('/doctor_home')
    expect(homeFor(normalizeUser(patientUser))).toBe('/home')
    expect(homeFor(null)).toBe('/home')
  })
})

describe('Login redirects by role', () => {
  beforeEach(() => localStorage.clear())

  test('a patient lands on /home', async () => {
    renderApp('/login')
    const user = userEvent.setup()
    await user.type(await screen.findByPlaceholderText(/username/i), 'testpatient')
    await user.type(screen.getByPlaceholderText(/password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /log in/i }))
    await waitFor(() => expect(document.querySelector('.home-page-container')).toBeTruthy())
  })

  test('a doctor lands on /doctor_home', async () => {
    asDoctor()
    renderApp('/login')
    const user = userEvent.setup()
    await user.type(await screen.findByPlaceholderText(/username/i), 'testdoctor')
    await user.type(screen.getByPlaceholderText(/password/i), 'secret')
    await user.click(screen.getByRole('button', { name: /log in/i }))
    await waitFor(() => expect(document.querySelector('.doctor-home-container')).toBeTruthy())
  })

  test('bad credentials show an error and keep the user on login', async () => {
    server.use(http.post(`${API}/token`, () => HttpResponse.json({ detail: 'Invalid credentials' }, { status: 401 })))
    renderApp('/login')
    const user = userEvent.setup()
    await user.type(await screen.findByPlaceholderText(/username/i), 'nobody')
    await user.type(screen.getByPlaceholderText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /log in/i }))
    expect(await screen.findByText(/invalid username or password/i)).toBeTruthy()
    expect(localStorage.getItem('token')).toBeNull()
  })
})

describe('Route guards', () => {
  beforeEach(() => localStorage.clear())

  test('a signed-in patient opening a doctor route is sent to /home', async () => {
    renderApp('/doctor_home', { authenticated: true })
    await waitFor(() => expect(document.querySelector('.home-page-container')).toBeTruthy())
    expect(document.querySelector('.doctor-home-container')).toBeNull()
  })

  test('a signed-in doctor opening a patient route is sent to /doctor_home', async () => {
    asDoctor()
    renderApp('/home', { authenticated: true })
    await waitFor(() => expect(document.querySelector('.doctor-home-container')).toBeTruthy())
  })

  test('root redirect follows the role', async () => {
    asDoctor()
    renderApp('/', { authenticated: true })
    await waitFor(() => expect(document.querySelector('.doctor-home-container')).toBeTruthy())
  })

  test('unauthenticated users hit login', async () => {
    renderApp('/patient_details/testpatient')
    await waitFor(() => expect(document.querySelector('.login-container')).toBeTruthy())
  })
})

describe('Non-nav patient routes are guarded too', () => {
  beforeEach(() => localStorage.clear())

  test('/chatbot without a token goes to login', async () => {
    renderApp('/chatbot')
    await waitFor(() => expect(document.querySelector('.login-container')).toBeTruthy())
  })

  test('/chatbot as a doctor goes to the doctor home', async () => {
    asDoctor()
    renderApp('/chatbot', { authenticated: true })
    await waitFor(() => expect(document.querySelector('.doctor-home-container')).toBeTruthy())
  })
})
