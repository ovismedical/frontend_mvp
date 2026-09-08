/** Home screen widgets read live data: flagged notifications, wellness score, week dots. */
import { describe, test, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server.js'
import { render } from '../test-utils.jsx'
import HomeNotifications from '../../components/layout/homeNotifications.jsx'
import WellnessScoreCard from '../../components/layout/wellnessCard.jsx'
import ProgressRow from '../../components/ui/weekly_ProgressRow.jsx'
import { checkedInDays, mondayIndex } from '../../utils/weekProgress.js'

const API = 'http://localhost:8000'
const authed = () => localStorage.setItem('token', JSON.stringify({ access_token: 'fake-jwt', token_type: 'Bearer' }))

describe('HomeNotifications', () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.clear(); authed() })

  test('shows the most recent flagged record addressed to the care team', async () => {
    render(<HomeNotifications />)
    expect(await screen.findByText(/Flagged for Dr. Test Doctor/)).toBeTruthy()
    expect(screen.getByText(/Appetite Loss \(Poor\)/)).toBeTruthy()
    expect(screen.getByText(/\+ 1 more/)).toBeTruthy()
  })

  test('renders nothing when there are no flags', async () => {
    server.use(http.get(`${API}/analytics/unified_assessments`, () => HttpResponse.json({ success: true, assessments: [] })))
    const { container } = render(<HomeNotifications />)
    await new Promise((r) => setTimeout(r, 50))
    expect(container.querySelector('.home-notifications-container')).toBeNull()
  })
})

describe('WellnessScoreCard', () => {
  beforeEach(() => { localStorage.clear(); authed() })

  test('derives the score from weekly severity and shows the change vs last week', async () => {
    render(<WellnessScoreCard />)
    // avg severity 3 -> 40; last week severity 2 -> 60; delta -20
    await waitFor(() => expect(screen.getByText('40')).toBeTruthy())
    expect(screen.getByText('-20')).toBeTruthy()
  })

  test('shows an empty-state hint when there is no data', async () => {
    server.use(http.get(`${API}/analytics/weekly`, () => HttpResponse.json({ success: true, data: { totalAssessments: 0, dailyData: [], insights: [{ id: 'no_data' }] } })))
    render(<WellnessScoreCard />)
    expect(await screen.findByText(/complete a check-in to start your score/i)).toBeTruthy()
  })
})

describe('week progress', () => {
  test('checkedInDays only counts timestamps inside the current Monday-Sunday week', () => {
    const now = new Date(2026, 8, 9, 12) // Wednesday 9 Sep 2026 local
    const days = checkedInDays([
      new Date(2026, 8, 7, 9).toISOString(),   // Mon
      new Date(2026, 8, 9, 8).toISOString(),   // Wed
      new Date(2026, 8, 6, 8).toISOString(),   // previous Sunday -> excluded
      new Date(2026, 8, 14, 8).toISOString(),  // next Monday -> excluded
      'not a date',
    ], now)
    expect([...days].sort()).toEqual([0, 2])
    expect(mondayIndex(new Date(2026, 8, 13))).toBe(6) // Sunday
  })

  test('ProgressRow renders checked days from the record', async () => {
    localStorage.clear(); authed()
    render(<ProgressRow />)
    await waitFor(() => expect(document.querySelectorAll('.day-icon.checked').length).toBeGreaterThan(0))
  })
})
