import { connectDB } from '@/lib/db'
import Booking from '@/models/Booking'
import Shop from '@/models/Shop'
import User from '@/models/User'
import Review from '@/models/Review'

export interface IBookingRequest {
  userId: string
  shopId: string
  dateTime: Date
  serviceId?: string
}

export async function createBookingRequest(data: IBookingRequest) {
  try {
    await connectDB()

    const shop = await Shop.findById(data.shopId)
    if (!shop) throw new Error('Shop not found')

    if (shop.ownerId.toString() === data.userId) {
      throw new Error('You cannot book your own service')
    }

    const conflict = await Booking.findOne({
      shopId: data.shopId,
      status: { $in: ['PENDING', 'ACCEPTED'] },
      dateTime: {
        $gte: new Date(data.dateTime.getTime() - 60 * 60 * 1000),
        $lte: new Date(data.dateTime.getTime() + 60 * 60 * 1000),
      },
    })
    if (conflict) throw new Error('This time slot is already booked')

    const user = await User.findById(data.userId)
    if (!user) throw new Error('User not found')

    const booking = await Booking.create({
      userId: data.userId,
      shopId: data.shopId,
      serviceId: data.serviceId || undefined,
      dateTime: data.dateTime,
      status: 'PENDING'
    })

    return booking
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create booking')
  }
}

export async function getUserBookings(userId: string) {
  try {
    await connectDB()
    const bookings = await Booking.find({ userId })
      .populate('shopId', 'name address rating')
      .populate('serviceId', 'name price duration')
      .sort({ dateTime: -1 })
      .lean()

    const bookingIds = bookings.map(b => b._id)
    const reviewedBookingIds = await Review.find({ bookingId: { $in: bookingIds } }).select('bookingId').lean()
    const reviewedSet = new Set(reviewedBookingIds.map(r => r.bookingId.toString()))

    return bookings.map(b => ({
      ...b,
      hasReviewed: reviewedSet.has(b._id.toString()),
    }))
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch bookings')
  }
}
