/** What Florence remembers: the patient sees every note, can forget one or all, and can switch it off. */
import { describe, test, expect, beforeEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server.js'
import { render } from '../test-utils.jsx'
import FlorenceMemory from '../../pages/patient/settings/florence_memory.jsx'

const API = 'http://localhost:8000'

function renderPage() {
  localStorage.setItem('token', JSON.stringify({ access_token: 'fake-jwt', token_type: 'Bearer' }))
  return render(<FlorenceMemory />)
}

describe('FlorenceMemory', () => {
  beforeEach(() => localStorage.clear())

  test('lists what Florence remembers', async () => {
    renderPage()
    expect(await screen.findByText('Has a dog called Biscuit')).toBeInTheDocument()
    expect(screen.getByText('Had congee for dinner')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Let Florence remember' })).toBeChecked()
  })

  test('forgetting one note removes just that note', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText('Has a dog called Biscuit')
    await user.click(screen.getByRole('button', { name: 'Forget "Has a dog called Biscuit"' }))
    expect(await screen.findByText('Had congee for dinner')).toBeInTheDocument()
    expect(screen.queryByText('Has a dog called Biscuit')).not.toBeInTheDocument()
  })

  test('forgetting everything asks for a second tap', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText('Has a dog called Biscuit')
    await user.click(screen.getByRole('button', { name: 'Forget everything' }))
    expect(screen.getByText('Has a dog called Biscuit')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tap again to forget everything' }))
    expect(await screen.findByText(/Nothing yet/)).toBeInTheDocument()
  })

  test('switching it off tells the patient Florence is not remembering', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText('Has a dog called Biscuit')
    await user.click(screen.getByRole('checkbox', { name: 'Let Florence remember' }))
    expect(await screen.findByText("Florence isn't remembering anything right now.")).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Let Florence remember' })).not.toBeChecked()
  })

  test('a failed change is reported and the list is kept', async () => {
    server.use(http.delete(`${API}/memories/:memoryId`, () => HttpResponse.json({ detail: 'nope' }, { status: 500 })))
    const user = userEvent.setup()
    renderPage()
    const item = (await screen.findByText('Has a dog called Biscuit')).closest('li')
    await user.click(within(item).getByRole('button'))
    expect(await screen.findByRole('alert')).toHaveTextContent("Couldn't save that change. Please try again.")
    expect(screen.getByText('Has a dog called Biscuit')).toBeInTheDocument()
  })
})
