import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { rateLimit } from '@/lib/rate-limit'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('rateLimit', () => {
  it('allows first request', () => {
    expect(rateLimit('allows-first', 3, 60_000)).toBe(true)
  })

  it('allows requests within limit', () => {
    const k = 'within-limit'
    expect(rateLimit(k, 3, 60_000)).toBe(true)
    expect(rateLimit(k, 3, 60_000)).toBe(true)
    expect(rateLimit(k, 3, 60_000)).toBe(true)
  })

  it('blocks requests exceeding limit', () => {
    const k = 'blocking'
    expect(rateLimit(k, 3, 60_000)).toBe(true)
    expect(rateLimit(k, 3, 60_000)).toBe(true)
    expect(rateLimit(k, 3, 60_000)).toBe(true)
    expect(rateLimit(k, 3, 60_000)).toBe(false)
  })

  it('resets after the window expires', () => {
    const k = 'reset-test'
    expect(rateLimit(k, 2, 60_000)).toBe(true)
    expect(rateLimit(k, 2, 60_000)).toBe(true)
    expect(rateLimit(k, 2, 60_000)).toBe(false)

    vi.advanceTimersByTime(60_001)

    expect(rateLimit(k, 2, 60_000)).toBe(true)
  })

  it('tracks different keys independently', () => {
    const a = 'independent-a'
    const b = 'independent-b'
    expect(rateLimit(a, 2, 60_000)).toBe(true)
    expect(rateLimit(a, 2, 60_000)).toBe(true)
    expect(rateLimit(a, 2, 60_000)).toBe(false)

    expect(rateLimit(b, 2, 60_000)).toBe(true)
    expect(rateLimit(b, 2, 60_000)).toBe(true)
    expect(rateLimit(b, 2, 60_000)).toBe(false)
  })

  it('uses default maxAttempts of 5', () => {
    const k = 'default-5'
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(k)).toBe(true)
    }
    expect(rateLimit(k)).toBe(false)
  })
})
