import { connectDB } from '@/lib/db'
import Shop from '@/models/Shop'

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
}

const images = [
  'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1601362840469-517a36bc3042?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552930277-3637bc97116a?auto=format&fit=crop&w=800&q=80',
]

function attachImages(shops: any[]) {
  return shops.map((shop: any, index: number) => ({
    ...shop,
    id: shop._id.toString(),
    image: images[index % images.length],
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
    return [
      {
        id: '1',
        name: 'Crystal Clear Wash',
        description: 'Premium detailing and exterior wash specialists.',
        address: 'Downtown',
        priceRange: 'USD 15–50',
        minPrice: 15,
        maxPrice: 50,
        currency: 'USD',
        rating: 4.9,
        totalBookings: 128,
        image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '2',
        name: 'Turbo Shine Pro',
        description: 'Fast and efficient washes for the busy professional.',
        address: 'North Side',
        priceRange: 'USD 25–80',
        minPrice: 25,
        maxPrice: 80,
        currency: 'USD',
        rating: 4.7,
        totalBookings: 85,
        image: 'https://images.unsplash.com/photo-1601362840469-517a36bc3042?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: '3',
        name: 'EcoWash Studio',
        description: 'Water-saving technology for a greener clean.',
        address: 'East End',
        priceRange: 'USD 5–20',
        minPrice: 5,
        maxPrice: 20,
        currency: 'USD',
        rating: 4.8,
        totalBookings: 210,
        image: 'https://images.unsplash.com/photo-1552930277-3637bc97116a?auto=format&fit=crop&w=800&q=80',
      },
    ]
  }
}

export async function getAllShopsPublic(filters: ShopFilters = {}): Promise<ShopWithDetails[]> {
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

    const shops = await Shop.find(query).sort({ rating: -1 }).lean()
    return attachImages(shops)
  } catch (error) {
    console.error("Error fetching shops:", error)
    return []
  }
}

export async function getShopById(id: string): Promise<ShopWithDetails | null> {
  try {
    await connectDB()
    const shop = await Shop.findById(id).lean()

    if (!shop) return null

    return {
      ...shop,
      id: shop._id.toString(),
      image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
    }
  } catch (error) {
    console.error("Error fetching shop:", error)
    return null
  }
}
