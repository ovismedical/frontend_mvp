/** Shared alert-level helpers used by the clinician views. */
import { describe, test, expect } from 'vitest'
import {
  ALERT_LEVELS,
  ALERT_STYLE,
  PENDING_REVIEW,
  UNKNOWN_STYLE,
  alertStyle,
  effectiveLevel,
  isPendingReview,
  levelText,
} from '../../utils/alertLevels.js'

const t = (key) => (key === 'needs_review' ? 'Needs review' : `<${key}>`)

describe('effectiveLevel', () => {
  test('prefers the backend effective level over the raw Florence level', () => {
    expect(effectiveLevel({ effective_alert_level: 'ORANGE', alert_level: 'RED' })).toBe('ORANGE')
  })

  test('falls back to alert_level on a backend without the review feature', () => {
    expect(effectiveLevel({ alert_level: 'RED' })).toBe('RED')
  })

  test('falls back to the nested triage level', () => {
    expect(effectiveLevel({ triage_assessment: { alert_level: 'RED' } })).toBe('RED')
  })

  test('is null for an empty or missing record', () => {
    expect(effectiveLevel({})).toBeNull()
    expect(effectiveLevel(null)).toBeNull()
    expect(effectiveLevel(undefined)).toBeNull()
  })

  test('a pending record reports PENDING_REVIEW until a clinician assigns a level', () => {
    expect(effectiveLevel({ alert_level: 'PENDING_REVIEW', triage_assessment: null })).toBe(PENDING_REVIEW)
    expect(effectiveLevel({ effective_alert_level: 'YELLOW', alert_level: 'PENDING_REVIEW', triage_assessment: null })).toBe('YELLOW')
  })
})

describe('levelText', () => {
  test('translates PENDING_REVIEW and never shows the raw code', () => {
    expect(levelText(PENDING_REVIEW, t)).toBe('Needs review')
    expect(levelText(PENDING_REVIEW, t)).not.toMatch(/PENDING_REVIEW/)
  })

  test('returns the code itself for clinical levels and passes null through', () => {
    for (const level of ALERT_LEVELS) expect(levelText(level, t)).toBe(level)
    expect(levelText(null, t)).toBeNull()
    expect(levelText(undefined, t)).toBeUndefined()
  })
})

describe('alertStyle', () => {
  test('has a neutral entry for PENDING_REVIEW with the needs_review label', () => {
    expect(ALERT_STYLE.PENDING_REVIEW).toMatchObject({ icon: 'pending', labelKey: 'needs_review' })
    expect(ALERT_STYLE.PENDING_REVIEW.backgroundColor).toMatch(/neutral/)
    expect(alertStyle(PENDING_REVIEW)).toBe(ALERT_STYLE.PENDING_REVIEW)
  })

  test('covers every clinical level and falls back to the unknown style', () => {
    for (const level of ALERT_LEVELS) expect(alertStyle(level)).toBe(ALERT_STYLE[level])
    expect(alertStyle('BOGUS')).toBe(UNKNOWN_STYLE)
    expect(alertStyle(null)).toBe(UNKNOWN_STYLE)
  })

  test('picker order is lowest to highest urgency', () => {
    expect(ALERT_LEVELS).toEqual(['GREEN', 'YELLOW', 'ORANGE', 'RED'])
  })
})

describe('isPendingReview', () => {
  test('keys off triage_status only', () => {
    expect(isPendingReview({ triage_status: 'pending_clinician_review' })).toBe(true)
    expect(isPendingReview({ triage_status: 'completed', alert_level: 'PENDING_REVIEW' })).toBe(false)
    expect(isPendingReview({})).toBe(false)
    expect(isPendingReview(null)).toBe(false)
  })
})
