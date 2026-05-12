"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { Star, MapPin, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { ShopWithDetails } from '@/services/shop.service'

interface FeaturedShopsProps {
  shops: ShopWithDetails[]
}

export default function FeaturedShops({ shops }: FeaturedShopsProps) {
  return (
    <section className="py-24 bg-dark-bg px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
              Elite <span className="text-primary">Providers</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl">
              Hand-picked shops with the highest standards of quality and service.
            </p>
          </div>
          <Link href="/shops">
            <Button variant="outline" size="lg">
              View All Shops
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {shops.map((shop, index) => (
            <motion.div 
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
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
                  <h3 className="text-2xl font-bold uppercase tracking-tight">{shop.name}</h3>
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

                <Link href={`/shop/${shop.id}`} className="w-full">
                  <Button variant="primary" size="md" className="w-full">
                    Book Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
