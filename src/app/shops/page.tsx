"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { Star, MapPin, CheckCircle2, Search } from 'lucide-react'
import Link from 'next/link'

interface Shop {
  id: string
  _id: string
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
}

interface PaginatedResponse {
  items: Shop[]
  total: number
  page: number
  totalPages: number
}

const priceBuckets = [
  { value: '', label: 'All Prices' },
  { value: '0-20', label: 'Under $20' },
  { value: '20-50', label: '$20 – $50' },
  { value: '50-100', label: '$50 – $100' },
  { value: '100', label: '$100+' },
]
const ratingOptions = [0, 3, 3.5, 4, 4.5]

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [priceBucket, setPriceBucket] = useState('')
  const [minRating, setMinRating] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (priceBucket) params.set('priceBucket', priceBucket)
    if (minRating) params.set('minRating', String(minRating))
    if (page > 1) params.set('page', String(page))

    fetch(`/api/shops?${params.toString()}`)
      .then(r => r.json())
      .then((data: PaginatedResponse) => {
        setShops(data.items)
        setTotal(data.total)
        setPage(data.page)
        setTotalPages(data.totalPages)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [search, priceBucket, minRating, page])

  useEffect(() => {
    setPage(1)
  }, [search, priceBucket, minRating])

  return (
    <div className="min-h-screen bg-dark-bg text-foreground pt-24 pb-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-2">
            Find Your <span className="text-primary">Car Wash</span>
          </h1>
          <p className="text-gray-400">Browse trusted providers near you</p>
        </div>

        {/* Filters */}
        <div className="bg-dark-surface border border-white/10 p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or location..."
                className="w-full bg-dark-bg border border-gray-800 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <select
              value={priceBucket}
              onChange={e => setPriceBucket(e.target.value)}
              className="bg-dark-bg border border-gray-800 px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            >
              {priceBuckets.map(b => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
            <select
              value={minRating}
              onChange={e => setMinRating(Number(e.target.value))}
              className="bg-dark-bg border border-gray-800 px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            >
              <option value={0}>Min Rating</option>
              {ratingOptions.filter(r => r > 0).map(r => (
                <option key={r} value={r}>{r}+ ★</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-dark-surface border border-gray-800 animate-pulse">
                <div className="aspect-[4/3] bg-gray-800" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-3/4 bg-gray-800" />
                  <div className="h-3 w-1/2 bg-gray-800" />
                  <div className="h-10 bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-24 border border-white/10">
            <p className="text-gray-400 text-lg">No shops found matching your criteria</p>
            <button
              onClick={() => { setSearch(''); setPriceBucket(''); setMinRating(0); setPage(1) }}
              className="text-primary text-sm font-bold uppercase tracking-widest mt-4 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {shops.map((shop, index) => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-dark-surface border border-gray-800 overflow-hidden transition-all hover:border-primary/50"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <Image
                      src={shop.image || ''}
                      alt={shop.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-secondary text-dark-bg text-[10px] font-black uppercase tracking-widest">
                        {shop.totalBookings > 200 ? 'Top Performer' : shop.rating > 4.8 ? 'Best Rated' : 'Verified'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold uppercase tracking-tight">{shop.name}</h3>
                      <div className="flex items-center gap-1 text-secondary">
                        <Star size={16} fill="currentColor" />
                        <span className="font-bold">{shop.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {shop.address}
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        {shop.priceRange || '—'}
                      </div>
                      <div className="ml-auto text-xs">
                        {shop.totalBookings} Bookings
                      </div>
                    </div>

                    <Link href={`/shop/${shop.id}`}>
                      <Button variant="primary" size="md" className="w-full">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-400 font-medium">
                  Page {page} of {totalPages} ({total} shops)
                </span>
                <Button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
