import { z } from 'zod'

const CURRENCY_VALUES = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'] as const
export type Currency = typeof CURRENCY_VALUES[number]
export const currencySchema = z.enum(CURRENCY_VALUES)

export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  role: z.enum(['USER', 'OWNER']).optional().default('USER'),
})

export const createShopSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required').max(2000),
  address: z.string().min(1, 'Address is required').max(500),
  minPrice: z.number().min(0).default(0),
  maxPrice: z.number().min(0).default(0),
  currency: currencySchema.default('USD'),
  operatingHours: z.string().max(200).optional(),
})

export const updateShopSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(2000).optional(),
  address: z.string().min(1).max(500).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  currency: currencySchema.optional(),
  operatingHours: z.string().max(200).optional(),
})

export const bookingRequestSchema = z.object({
  shopId: z.string().min(1, 'Shop ID is required'),
  dateTime: z.string().min(1, 'Date and time is required'),
  serviceId: z.string().optional(),
})

export const reviewSchema = z.object({
  shopId: z.string().min(1, 'Shop ID is required'),
  bookingId: z.string().min(1, 'Booking ID is required'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(1, 'Comment is required').max(1000),
})

export const badgeSchema = z.object({
  shopId: z.string().min(1, 'Shop ID is required'),
  type: z.enum(['TOP_PERFORMER', 'BEST_RATED', 'FAST_SERVICE']),
})

export const adminActionSchema = z.object({
  action: z.enum(['toggleBlock', 'changeRole', 'updateUser']),
  userId: z.string().min(1),
  role: z.enum(['USER', 'OWNER', 'ADMIN']).optional(),
  email: z.string().email().optional(),
})

export const systemActionSchema = z.object({
  action: z.enum(['refresh_badges', 'process_noshows']),
})

export const bookingStatusSchema = z.object({
  bookingId: z.string().min(1),
  status: z.enum(['ACCEPTED', 'REJECTED', 'COMPLETED', 'NO_SHOW']),
})

export const completionStatusSchema = z.object({
  bookingId: z.string().min(1),
  status: z.enum(['COMPLETED', 'NO_SHOW']),
})

export const createServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required').max(100),
  description: z.string().max(500).optional().default(''),
  price: z.number().min(0, 'Price must be at least 0'),
  duration: z.number().int().min(5, 'Duration must be at least 5 minutes').optional().default(30),
})

export const updateServiceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  price: z.number().min(0).optional(),
  duration: z.number().int().min(5).optional(),
})
