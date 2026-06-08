import { connectDB } from '@/lib/db'
import Booking from '@/models/Booking'
import Shop, { IShop } from '@/models/Shop'

export async function createShop(ownerId: string, data: {
  name: string
  description: string
  address: string
  minPrice: number
  maxPrice: number
  currency: string
}) {
  try {
    await connectDB()
    const existing = await Shop.findOne({ ownerId })
    if (existing) throw new Error('You already have a shop')
    const priceRange = `${data.currency} ${data.minPrice}–${data.maxPrice}`
    const shop = await Shop.create({ ...data, priceRange, ownerId })
    return shop
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create shop')
  }
}

export async function getOwnerBookings(ownerId: string) {
  try {
    await connectDB()
    // Find shops owned by the owner
    const shops = await Shop.find({ ownerId }).select('_id')
    const shopIds = shops.map(shop => shop._id)

    // Find all bookings for those shops
    return await Booking.find({ shopId: { $in: shopIds } })
      .populate('userId', 'email')
      .populate('serviceId', 'name price duration')
      .sort({ createdAt: -1 })
      .lean()
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch owner bookings')
  }
}

export async function updateBookingStatus(bookingId: string, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'NO_SHOW') {
  try {
    await connectDB()
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    )
    if (!booking) throw new Error('Booking not found')
    return booking
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update booking status')
  }
}

export async function updateShopDetails(shopId: string, updates: Partial<IShop>) {
  try {
    await connectDB()
    const setData: any = { ...updates }
    if (updates.minPrice !== undefined || updates.maxPrice !== undefined || updates.currency) {
      const shop = await Shop.findById(shopId)
      if (shop) {
        const minPrice = updates.minPrice ?? shop.minPrice ?? 0
        const maxPrice = updates.maxPrice ?? shop.maxPrice ?? 0
        const currency = updates.currency ?? shop.currency ?? 'USD'
        setData.priceRange = `${currency} ${minPrice}–${maxPrice}`
      }
    }
    return await Shop.findByIdAndUpdate(
      shopId,
      { $set: setData },
      { new: true }
    )
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update shop details')
  }
}

export async function getOwnerServices(ownerId: string) {
  try {
    await connectDB()
    const shop = await Shop.findOne({ ownerId }).select('_id')
    if (!shop) return []
    const Service = (await import('@/models/Service')).default
    return await Service.find({ shopId: shop._id }).sort({ price: 1 }).lean()
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch services')
  }
}

export async function getOwnerShop(ownerId: string) {
  try {
    await connectDB()
    return await Shop.findOne({ ownerId }).lean()
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch shop')
  }
}
