import { connectDB } from '@/lib/db'
import Booking from '@/models/Booking'
import Shop from '@/models/Shop'
import User from '@/models/User'

export interface IBookingRequest {
  userId: string
  shopId: string
  dateTime: Date
}

export async function createBookingRequest(data: IBookingRequest) {
  try {
    await connectDB()

    // Verify shop exists
    const shop = await Shop.findById(data.shopId)
    if (!shop) throw new Error('Shop not found')

    // Prevent owners from booking their own shop
    if (shop.ownerId.toString() === data.userId) {
      throw new Error('You cannot book your own service')
    }

    // Verify user exists
    const user = await User.findById(data.userId)
    if (!user) throw new Error('User not found')

    // Create booking with PENDING status
    const booking = await Booking.create({
      userId: data.userId,
      shopId: data.shopId,
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
    return await Booking.find({ userId })
      .populate('shop', 'name address rating')
      .sort({ dateTime: -1 })
      .lean()
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch bookings')
  }
}
