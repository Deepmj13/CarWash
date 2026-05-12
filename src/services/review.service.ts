import { connectDB } from '@/lib/db'
import Booking from '@/models/Booking'
import Review from '@/models/Review'
import Shop from '@/models/Shop'
import User from '@/models/User'

export async function completeBooking(bookingId: string, status: 'COMPLETED' | 'NO_SHOW') {
  try {
    await connectDB()
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    )
    if (!booking) throw new Error('Booking not found')

    if (status === 'NO_SHOW') {
      await User.findByIdAndUpdate(booking.userId, { $inc: { noShowCount: 1 } })
    }

    return booking
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update booking status')
  }
}

export async function createReview(data: {
  userId: string,
  shopId: string,
  bookingId: string,
  rating: number,
  comment: string
}) {
  try {
    await connectDB()
    
    const booking = await Booking.findById(data.bookingId)
    if (!booking || booking.status !== 'COMPLETED') {
      throw new Error('Reviews can only be submitted for completed bookings')
    }

    const review = await Review.create(data)

    const reviews = await Review.find({ shopId: data.shopId })
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    
    await Shop.findByIdAndUpdate(data.shopId, { 
      rating: parseFloat(avgRating.toFixed(1)) 
    })

    return review
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create review')
  }
}
