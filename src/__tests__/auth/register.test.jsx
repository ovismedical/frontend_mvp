/** Registration picks the OTP flow or direct sign-up based on /auth/config. */
import { describe, test, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server.js'
import { render } from '../test-utils.jsx'
import Register from '../../pages/auth/register.jsx'

const API = 'http://localhost:8000'

async function fillForm(user, { code = 'ABCD' } = {}) {
  await user.type(screen.getByPlaceholderText(/email/i), 'new@example.com')
  await user.type(screen.getByPlaceholderText(/access code/i), code)
  await user.type(screen.getByPlaceholderText(/^username$/i), 'newbie')
  await user.type(screen.getByPlaceholderText(/^password$/i), 'pass1234')
  await user.type(screen.getByPlaceholderText(/confirm password/i), 'pass1234')
}

describe('Register', () => {
  beforeEach(() => localStorage.clear())

  test('uses direct registration when the server has no OTP configured', async () => {
    let directCalls = 0
    let otpCalls = 0
    server.use(
      http.post(`${API}/register`, async ({ request }) => {
        directCalls += 1
        const body = await request.json()
        expect(body.access_code).toBe('ABCD')
        return HttpResponse.json({ message: 'ok', username: body.username, role: 'patient' }, { status: 201 })
      }),
      http.post(`${API}/otp/register`, () => { otpCalls += 1; return HttpResponse.json({}) })
    )
    render(<Register />, { route: '/register' })
    const user = userEvent.setup()
    await waitFor(() => expect(screen.getByRole('button', { name: /sign up/i })).toBeTruthy())
    await fillForm(user, { code: 'abcd' })
    await user.click(screen.getByRole('button', { name: /sign up/i }))
    expect(await screen.findByText(/account created successfully/i)).toBeTruthy()
    expect(directCalls).toBe(1)
    expect(otpCalls).toBe(0)
  })

  test('falls back to the OTP flow when the server requires it', async () => {
    let otpCalls = 0
    server.use(
      http.get(`${API}/auth/config`, () => HttpResponse.json({ registration: { otp_required: true }, florence_available: false })),
      http.post(`${API}/otp/register`, () => { otpCalls += 1; return HttpResponse.json({ message: 'OTP sent' }) })
    )
    render(<Register />, { route: '/register' })
    const user = userEvent.setup()
    await waitFor(() => expect(screen.getByRole('button', { name: /sign up/i })).toBeTruthy())
    // wait for the config fetch to settle before submitting
    await new Promise((r) => setTimeout(r, 30))
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /sign up/i }))
    await waitFor(() => expect(otpCalls).toBe(1))
  })

  test('surfaces the server error for a bad access code', async () => {
    render(<Register />, { route: '/register' })
    const user = userEvent.setup()
    await waitFor(() => expect(screen.getByRole('button', { name: /sign up/i })).toBeTruthy())
    await new Promise((r) => setTimeout(r, 30))
    await fillForm(user, { code: 'ZZZZ' })
    await user.click(screen.getByRole('button', { name: /sign up/i }))
    expect(await screen.findByText(/invalid access code/i)).toBeTruthy()
  })
})
