import { describe, it, expect } from 'vitest'
import {
  signupSchema,
  createShopSchema,
  updateShopSchema,
  bookingRequestSchema,
  reviewSchema,
  badgeSchema,
  adminActionSchema,
  systemActionSchema,
  bookingStatusSchema,
  completionStatusSchema,
} from '@/lib/validations'

describe('signupSchema', () => {
  it('accepts valid signup data', () => {
    const result = signupSchema.safeParse({ email: 'test@example.com', password: 'password123' })
    expect(result.success).toBe(true)
  })

  it('accepts signup with role OWNER', () => {
    const result = signupSchema.safeParse({ email: 'owner@example.com', password: 'password123', role: 'OWNER' })
    expect(result.success).toBe(true)
  })

  it('defaults role to USER', () => {
    const result = signupSchema.parse({ email: 'test@example.com', password: 'password123' })
    expect(result.role).toBe('USER')
  })

  it('rejects invalid email', () => {
    const result = signupSchema.safeParse({ email: 'not-an-email', password: 'password123' })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = signupSchema.safeParse({ email: 'test@example.com', password: 'short' })
    expect(result.success).toBe(false)
  })

  it('rejects long password', () => {
    const result = signupSchema.safeParse({ email: 'test@example.com', password: 'a'.repeat(129) })
    expect(result.success).toBe(false)
  })

  it('rejects invalid role', () => {
    const result = signupSchema.safeParse({ email: 'test@example.com', password: 'password123', role: 'ADMIN' })
    expect(result.success).toBe(false)
  })
})

describe('createShopSchema', () => {
  it('accepts valid shop data', () => {
    const result = createShopSchema.safeParse({
      name: 'Test Shop',
      description: 'A test shop description',
      address: '123 Test St',
    })
    expect(result.success).toBe(true)
  })

  it('applies default currency and prices', () => {
    const result = createShopSchema.parse({
      name: 'Test Shop',
      description: 'A test shop description',
      address: '123 Test St',
    })
    expect(result.currency).toBe('USD')
    expect(result.minPrice).toBe(0)
    expect(result.maxPrice).toBe(0)
  })

  it('accepts operatingHours', () => {
    const result = createShopSchema.safeParse({
      name: 'Test Shop',
      description: 'A test shop description',
      address: '123 Test St',
      operatingHours: 'Mon-Fri 8am-8pm',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing name', () => {
    const result = createShopSchema.safeParse({
      description: 'A test shop',
      address: '123 Test St',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid currency', () => {
    const result = createShopSchema.safeParse({
      name: 'Test',
      description: 'Desc',
      address: 'Addr',
      currency: 'XYZ',
    })
    expect(result.success).toBe(false)
  })
})

describe('updateShopSchema', () => {
  it('accepts partial update', () => {
    const result = updateShopSchema.safeParse({ name: 'New Name' })
    expect(result.success).toBe(true)
  })

  it('accepts empty object', () => {
    const result = updateShopSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepts operatingHours update', () => {
    const result = updateShopSchema.safeParse({ operatingHours: 'Sat-Sun 9am-5pm' })
    expect(result.success).toBe(true)
  })
})

describe('bookingRequestSchema', () => {
  it('accepts valid booking request', () => {
    const result = bookingRequestSchema.safeParse({
      shopId: '507f1f77bcf86cd799439011',
      dateTime: '2026-06-15T10:00:00Z',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing shopId', () => {
    const result = bookingRequestSchema.safeParse({ dateTime: '2026-06-15T10:00:00Z' })
    expect(result.success).toBe(false)
  })

  it('rejects missing dateTime', () => {
    const result = bookingRequestSchema.safeParse({ shopId: '507f1f77bcf86cd799439011' })
    expect(result.success).toBe(false)
  })
})

describe('reviewSchema', () => {
  it('accepts valid review', () => {
    const result = reviewSchema.safeParse({
      shopId: '507f1f77bcf86cd799439011',
      bookingId: '507f1f77bcf86cd799439012',
      rating: 4,
      comment: 'Great service!',
    })
    expect(result.success).toBe(true)
  })

  it('rejects rating below 1', () => {
    const result = reviewSchema.safeParse({
      shopId: 'a',
      bookingId: 'b',
      rating: 0,
      comment: 'Bad',
    })
    expect(result.success).toBe(false)
  })

  it('rejects rating above 5', () => {
    const result = reviewSchema.safeParse({
      shopId: 'a',
      bookingId: 'b',
      rating: 6,
      comment: 'Great',
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-integer rating', () => {
    const result = reviewSchema.safeParse({
      shopId: 'a',
      bookingId: 'b',
      rating: 3.5,
      comment: 'Okay',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty comment', () => {
    const result = reviewSchema.safeParse({
      shopId: 'a',
      bookingId: 'b',
      rating: 3,
      comment: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('badgeSchema', () => {
  it('accepts valid badge type', () => {
    const result = badgeSchema.safeParse({
      shopId: '507f1f77bcf86cd799439011',
      type: 'TOP_PERFORMER',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid badge type', () => {
    const result = badgeSchema.safeParse({
      shopId: '507f1f77bcf86cd799439011',
      type: 'INVALID',
    })
    expect(result.success).toBe(false)
  })
})

describe('adminActionSchema', () => {
  it('accepts toggleBlock action', () => {
    const result = adminActionSchema.safeParse({
      action: 'toggleBlock',
      userId: '507f1f77bcf86cd799439011',
    })
    expect(result.success).toBe(true)
  })

  it('accepts changeRole with role', () => {
    const result = adminActionSchema.safeParse({
      action: 'changeRole',
      userId: 'a',
      role: 'ADMIN',
    })
    expect(result.success).toBe(true)
  })

  it('rejects unknown action', () => {
    const result = adminActionSchema.safeParse({
      action: 'delete',
      userId: 'a',
    })
    expect(result.success).toBe(false)
  })
})

describe('systemActionSchema', () => {
  it('accepts refresh_badges', () => {
    const result = systemActionSchema.safeParse({ action: 'refresh_badges' })
    expect(result.success).toBe(true)
  })

  it('rejects unknown action', () => {
    const result = systemActionSchema.safeParse({ action: 'restart' })
    expect(result.success).toBe(false)
  })
})

describe('bookingStatusSchema', () => {
  it('accepts valid status', () => {
    const result = bookingStatusSchema.safeParse({
      bookingId: 'a',
      status: 'ACCEPTED',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid status', () => {
    const result = bookingStatusSchema.safeParse({
      bookingId: 'a',
      status: 'PENDING',
    })
    expect(result.success).toBe(false)
  })
})

describe('completionStatusSchema', () => {
  it('accepts COMPLETED', () => {
    const result = completionStatusSchema.safeParse({
      bookingId: 'a',
      status: 'COMPLETED',
    })
    expect(result.success).toBe(true)
  })

  it('accepts NO_SHOW', () => {
    const result = completionStatusSchema.safeParse({
      bookingId: 'a',
      status: 'NO_SHOW',
    })
    expect(result.success).toBe(true)
  })

  it('rejects ACCEPTED', () => {
    const result = completionStatusSchema.safeParse({
      bookingId: 'a',
      status: 'ACCEPTED',
    })
    expect(result.success).toBe(false)
  })
})
