import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Shop from '@/models/Shop'
import Booking from '@/models/Booking'
import Review from '@/models/Review'
import Badge from '@/models/Badge'
import { refreshShopBadges, processNoShows } from './system.service'

export async function getAdminStats() {
  try {
    await connectDB()
    const [users, shops, bookings, reviews, badges, blockedUsers] = await Promise.all([
      User.countDocuments(),
      Shop.countDocuments(),
      Booking.countDocuments(),
      Review.countDocuments(),
      Badge.countDocuments(),
      User.countDocuments({ isBlocked: true }),
    ])
    return { users, shops, bookings, reviews, badges, blockedUsers }
  } catch (error: unknown) {
    throw new Error(`Failed to get stats: ${(error as Error).message}`)
  }
}

export async function getAllUsers() {
  try {
    await connectDB()
    return await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean()
  } catch (error: unknown) {
    throw new Error(`Failed to get users: ${(error as Error).message}`)
  }
}

export async function toggleBlockUser(userId: string) {
  try {
    await connectDB()
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')
    user.isBlocked = !user.isBlocked
    await user.save()
    return { id: user._id, isBlocked: user.isBlocked }
  } catch (error: unknown) {
    throw new Error(`Failed to toggle block: ${(error as Error).message}`)
  }
}

export async function changeUserRole(userId: string, role: 'USER' | 'OWNER' | 'ADMIN') {
  try {
    await connectDB()
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: '-password' }
    )
    if (!user) throw new Error('User not found')
    return user
  } catch (error: unknown) {
    throw new Error(`Failed to change role: ${(error as Error).message}`)
  }
}

export async function getAllShops() {
  try {
    await connectDB()
    return await Shop.find()
      .populate('ownerId', 'email')
      .sort({ createdAt: -1 })
      .lean()
  } catch (error: unknown) {
    throw new Error(`Failed to get shops: ${(error as Error).message}`)
  }
}

export async function getAllBookings() {
  try {
    await connectDB()
    return await Booking.find()
      .populate('userId', 'email')
      .populate('shopId', 'name')
      .sort({ createdAt: -1 })
      .lean()
  } catch (error: unknown) {
    throw new Error(`Failed to get bookings: ${(error as Error).message}`)
  }
}

export async function getAllReviews() {
  try {
    await connectDB()
    return await Review.find()
      .populate('userId', 'email')
      .populate('shopId', 'name')
      .sort({ createdAt: -1 })
      .lean()
  } catch (error: unknown) {
    throw new Error(`Failed to get reviews: ${(error as Error).message}`)
  }
}

export async function deleteReview(reviewId: string) {
  try {
    await connectDB()
    const review = await Review.findByIdAndDelete(reviewId)
    if (!review) throw new Error('Review not found')
    return { success: true }
  } catch (error: unknown) {
    throw new Error(`Failed to delete review: ${(error as Error).message}`)
  }
}

export async function getAllBadges() {
  try {
    await connectDB()
    return await Badge.find()
      .populate('shopId', 'name')
      .sort({ awardedAt: -1 })
      .lean()
  } catch (error: unknown) {
    throw new Error(`Failed to get badges: ${(error as Error).message}`)
  }
}

export async function awardBadge(shopId: string, type: 'TOP_PERFORMER' | 'BEST_RATED' | 'FAST_SERVICE') {
  try {
    await connectDB()
    const badge = await Badge.create({ shopId, type })
    return badge
  } catch (error: unknown) {
    throw new Error(`Failed to award badge: ${(error as Error).message}`)
  }
}

export async function removeBadge(badgeId: string) {
  try {
    await connectDB()
    const badge = await Badge.findByIdAndDelete(badgeId)
    if (!badge) throw new Error('Badge not found')
    return { success: true }
  } catch (error: unknown) {
    throw new Error(`Failed to remove badge: ${(error as Error).message}`)
  }
}

export async function updateUser(userId: string, data: { email?: string }) {
  try {
    await connectDB()
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, select: '-password' }
    )
    if (!user) throw new Error('User not found')
    return user
  } catch (error: unknown) {
    throw new Error(`Failed to update user: ${(error as Error).message}`)
  }
}

export async function updateShop(shopId: string, data: {
  name?: string
  description?: string
  address?: string
  minPrice?: number
  maxPrice?: number
  currency?: string
}) {
  try {
    await connectDB()
    const setData: any = { ...data }
    if (data.minPrice !== undefined || data.maxPrice !== undefined || data.currency) {
      const shop = await Shop.findById(shopId)
      if (shop) {
        const minPrice = data.minPrice ?? shop.minPrice ?? 0
        const maxPrice = data.maxPrice ?? shop.maxPrice ?? 0
        const currency = data.currency ?? shop.currency ?? 'USD'
        setData.priceRange = `${currency} ${minPrice}–${maxPrice}`
      }
    }
    const updated = await Shop.findByIdAndUpdate(shopId, { $set: setData }, { new: true })
      .populate('ownerId', 'email')
      .lean()
    if (!updated) throw new Error('Shop not found')
    return updated
  } catch (error: unknown) {
    throw new Error(`Failed to update shop: ${(error as Error).message}`)
  }
}

export { refreshShopBadges, processNoShows }
