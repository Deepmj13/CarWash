import { connectDB } from '@/lib/db'
import Shop from '@/models/Shop'
import Badge from '@/models/Badge'
import User from '@/models/User'
import Booking from '@/models/Booking'

export async function refreshShopBadges() {
  try {
    await connectDB()
    const shops = await Shop.find().lean()
    
    for (const shop of shops) {
      const shopId = shop._id.toString()
      
      // Determine which badges the shop should have
      const deservedBadges: string[] = []
      
      // TOP_PERFORMER: Awarded for high booking volumes (e.g., > 100)
      if (shop.totalBookings >= 100) {
        deservedBadges.push('TOP_PERFORMER')
      }
      
      // BEST_RATED: Awarded for maintaining high user ratings (e.g., >= 4.8)
      if (shop.rating >= 4.8) {
        deservedBadges.push('BEST_RATED')
      }
      
      // FAST_SERVICE: For this simulation, we'll award it if they have a high ratio of ACCEPTED vs PENDING
      const bookings = await Booking.find({ shopId: shop._id })
      const accepted = bookings.filter(b => b.status === 'ACCEPTED').length
      const pending = bookings.filter(b => b.status === 'PENDING').length
      if (accepted > 10 && (pending === 0 || accepted / (pending + 1) > 5)) {
        deservedBadges.push('FAST_SERVICE')
      }

      // Sync badges: remove old ones not deserved, add new ones
      await Badge.deleteMany({ shopId: shop._id })
      if (deservedBadges.length > 0) {
        await Badge.insertMany(
          deservedBadges.map(type => ({ shopId: shop._id, type }))
        )
      }
    }
    return { success: true, message: 'Badges refreshed for all shops' }
  } catch (error: any) {
    throw new Error(`Badge refresh failed: ${error.message}`)
  }
}

export async function processNoShows() {
  try {
    await connectDB()
    const noShowBookings = await Booking.find({ status: 'NO_SHOW' }).lean()
    
    const userNoShowCounts: Record<string, number> = {}
    noShowBookings.forEach(b => {
      const uid = b.userId.toString()
      userNoShowCounts[uid] = (userNoShowCounts[uid] || 0) + 1
    })

    const results = []
    for (const [userId, count] of Object.entries(userNoShowCounts)) {
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          $set: { 
            noShowCount: count,
            isBlocked: count >= 5 
          } 
        },
        { new: true }
      )
      if (user) results.push({ email: user.email, count, isBlocked: user.isBlocked })
    }
    
    return { success: true, processedUsers: results.length }
  } catch (error: any) {
    throw new Error(`No-show processing failed: ${error.message}`)
  }
}
