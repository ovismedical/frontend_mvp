/** Monthly calendar reads real analytics for the month on screen. */
import { describe, test, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server.js'
import { render } from '../test-utils.jsx'
import MonthlyCalendar from '../../components/ui/monthlyCalendar.jsx'
import { severityBucket, monthOffsetFrom } from '../../utils/monthCalendar.js'

const API = 'http://localhost:8000'

describe('monthCalendar helpers', () => {
  test('buckets severity', () => {
    expect(severityBucket(null)).toBe('not-logged')
    expect(severityBucket(1.5)).toBe('mild')
    expect(severityBucket(2.5)).toBe('moderate')
    expect(severityBucket(4)).toBe('severe')
  })
  test('month offset counts whole months back from now', () => {
    const now = new Date(2026, 8, 9)
    expect(monthOffsetFrom(new Date(2026, 8, 1), now)).toBe(0)
    expect(monthOffsetFrom(new Date(2026, 6, 1), now)).toBe(2)
    expect(monthOffsetFrom(new Date(2025, 8, 1), now)).toBe(12)
  })
})

describe('MonthlyCalendar', () => {
  beforeEach(() => localStorage.setItem('token', JSON.stringify({ access_token: 'x' })))

  test('opens on the current month and colours days from severityByDay', async () => {
    const requested = []
    server.use(http.get(`${API}/analytics/monthly`, ({ request }) => {
      requested.push(new URL(request.url).searchParams.get('month_offset'))
      return HttpResponse.json({ success: true, data: { totalAssessments: 3, totalAlerts: 1, severityByDay: { 2: 1.2, 4: 3.8 }, alertsByDay: { 4: 1 }, symptomsByDay: {}, availableSymptoms: [] } })
    }))
    render(<MonthlyCalendar />)
    await waitFor(() => expect(requested).toEqual(['0']))
    const label = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    expect(screen.getByText(label)).toBeTruthy()
    await waitFor(() => expect(document.querySelector('.react-calendar__tile.severe')).toBeTruthy())
    expect(document.querySelector('.react-calendar__tile.mild')).toBeTruthy()
    expect(screen.getByText(/3 check-ins this month · 1 flagged days/)).toBeTruthy()
  })
})
