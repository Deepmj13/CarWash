import { connectDB } from '@/lib/db'
import Shop from '@/models/Shop'
import Badge from '@/models/Badge'

export interface ShopWithDetails {
  id: string
  name: string
  description: string
  address: string
  priceRange: string
  minPrice: number
  maxPrice: number
  currency: string
  rating: number
  totalBookings: number
  image: string
  ownerId?: string
  createdAt?: string
  updatedAt?: string
  badges?: string[]
  operatingHours?: string
}

const images = [
  'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1601362840469-517a36bc3042?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552930277-3637bc97116a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542293787938-c9e299b880cc?auto=format&fit=crop&w=800&q=80',
]

function pickImage(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  }
  return images[Math.abs(hash) % images.length]
}

function attachImages(shops: any[]) {
  return shops.map((shop: any) => ({
    ...shop,
    id: shop._id.toString(),
    image: pickImage(shop._id.toString()),
  }))
}

export interface ShopFilters {
  search?: string
  minRating?: number
  priceBucket?: string
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function parsePriceBucket(bucket: string): { minPrice?: number; maxPrice?: number } | null {
  if (!bucket) return null
  if (bucket.includes('-')) {
    const [min, max] = bucket.split('-').map(Number)
    return { minPrice: min, maxPrice: max }
  }
  return { minPrice: Number(bucket) }
}

export async function getFeaturedShops(): Promise<ShopWithDetails[]> {
  try {
    await connectDB()
    const shops = await Shop.find().sort({ rating: -1 }).limit(3).lean()
    return attachImages(shops)
  } catch (error) {
    console.error("Error fetching shops:", error)
    return []
  }
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
}

export async function getAllShopsPublic(
  filters: ShopFilters = {},
  page = 1,
  pageSize = 12
): Promise<PaginatedResult<ShopWithDetails>> {
  try {
    await connectDB()

    const query: any = {}
    if (filters.search) {
      const regex = new RegExp(escapeRegex(filters.search), 'i')
      query.$or = [{ name: regex }, { address: regex }]
    }
    if (filters.minRating && filters.minRating > 0) {
      query.rating = { $gte: filters.minRating }
    }
    if (filters.priceBucket) {
      const range = parsePriceBucket(filters.priceBucket)
      if (range?.minPrice && range?.maxPrice) {
        query.minPrice = { $gte: range.minPrice }
        query.maxPrice = { $lte: range.maxPrice }
      } else if (range?.minPrice) {
        query.minPrice = { $gte: range.minPrice }
      }
    }

    const [shops, total] = await Promise.all([
      Shop.find(query).sort({ rating: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
      Shop.countDocuments(query),
    ])

    return {
      items: attachImages(shops),
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    }
  } catch (error) {
    console.error("Error fetching shops:", error)
    return { items: [], total: 0, page: 1, totalPages: 0 }
  }
}

export async function getShopById(id: string): Promise<ShopWithDetails | null> {
  try {
    await connectDB()
    const shop = await Shop.findById(id).lean()

    if (!shop) return null

    const badges = await Badge.find({ shopId: id }).lean()
    return {
      ...shop,
      id: shop._id.toString(),
      image: pickImage(shop._id.toString()),
      badges: badges.map(b => b.type),
    }
  } catch (error) {
    console.error("Error fetching shop:", error)
    return null
  }
}
