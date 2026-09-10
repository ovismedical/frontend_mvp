/** Florence chat: the privacy hint and what the patient is told when a chat ends. */
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server.js'
import { render } from '../test-utils.jsx'
import FlorenceChat from '../../pages/patient/florence_chat.jsx'

const API = 'http://localhost:8000'
const WELCOME = 'Hello! How are you feeling today?'
const HINT = "You don't need to share names, addresses or ID numbers with Florence."
const NEEDS_REVIEW = /Florence couldn't run the AI assessment this time, so your care team will review it/

function renderChat(props = {}) {
  localStorage.setItem('token', JSON.stringify({ access_token: 'fake-jwt', token_type: 'Bearer' }))
  return render(<FlorenceChat embedded onClose={vi.fn()} {...props} />)
}

/** Finish the session through the embedded actions and the confirmation modal. */
async function endChat(user) {
  await screen.findByText(WELCOME)
  await user.click(screen.getByRole('button', { name: /End Chat & Get Assessment/ }))
  await user.click(screen.getByRole('button', { name: 'End Chat' }))
}

const finishWith = (body) => http.post(`${API}/florence/finish_session/:sessionId`, () => HttpResponse.json(body))
const resultWith = (body, seen = []) =>
  http.get(`${API}/florence/result/:sessionId`, ({ params }) => {
    seen.push(params.sessionId)
    return HttpResponse.json({ session_id: params.sessionId, ...body })
  })

describe('FlorenceChat — privacy hint', () => {
  beforeEach(() => localStorage.clear())

  test('the hint is rendered inside the input wrapper, in both the connecting and active states', async () => {
    renderChat()
    const hint = screen.getByText(HINT)
    expect(hint).toHaveClass('florence-privacy-hint')
    expect(hint.closest('.chatbot-input-wrapper')).not.toBeNull()

    await screen.findByText(WELCOME)
    expect(screen.getByText(HINT).closest('.chatbot-input-wrapper')).not.toBeNull()
  })
})

describe('FlorenceChat — end-of-chat outcome', () => {
  beforeEach(() => localStorage.clear())

  test('a refused AI assessment (pending clinician review) is explained, never shown as a raw level', async () => {
    const polled = []
    server.use(
      finishWith({ message: 'Session completed', triage_status: 'generating' }),
      resultWith({ triage_status: 'pending_clinician_review', alert_level: null }, polled)
    )
    renderChat()
    const user = userEvent.setup()
    await endChat(user)

    expect(await screen.findByText(NEEDS_REVIEW)).toBeTruthy()
    expect(screen.getByText(/Your check-in is saved/)).toBeTruthy()
    expect(screen.queryByText(/PENDING_REVIEW/)).toBeNull()
    expect(screen.queryByText(/Your assessment is ready/)).toBeNull()
    expect(screen.queryByText(/taking a little longer/)).toBeNull()
    // Exactly one poll: a second request would mean we kept polling a non-generating record
    expect(polled).toEqual(['test_session_123'])
  })

  test('a completed background assessment announces its level', async () => {
    server.use(finishWith({ message: 'Session completed', triage_status: 'generating' }))
    renderChat()
    const user = userEvent.setup()
    await endChat(user)

    expect(await screen.findByText(/alert level GREEN: No concerning symptoms were reported\./)).toBeTruthy()
    expect(screen.queryByText(NEEDS_REVIEW)).toBeNull()
  })

  test('a finish response that is already pending is explained without polling', async () => {
    const polled = []
    server.use(
      finishWith({ message: 'Session completed', triage_status: 'pending_clinician_review', alert_level: null }),
      resultWith({ triage_status: 'completed', alert_level: 'GREEN' }, polled)
    )
    renderChat()
    const user = userEvent.setup()
    await endChat(user)

    expect(await screen.findByText(NEEDS_REVIEW)).toBeTruthy()
    expect(screen.queryByText(/PENDING_REVIEW/)).toBeNull()
    expect(polled).toEqual([])
  })

  test('a legacy synchronous finish response with a level still announces it', async () => {
    // Default handler: { message, alert_level: 'GREEN' } with no triage_status
    renderChat()
    const user = userEvent.setup()
    await endChat(user)

    expect(await screen.findByText(/Your assessment is ready — alert level GREEN/)).toBeTruthy()
    expect(screen.queryByText(NEEDS_REVIEW)).toBeNull()
  })
})
