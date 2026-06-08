"use client"

import { useEffect, useState } from 'react'
import { Users, Store, Calendar, MessageSquare, Award, Ban } from 'lucide-react'

interface Stats {
  users: number
  shops: number
  bookings: number
  reviews: number
  badges: number
  blockedUsers: number
}

const statCards = [
  { key: 'users' as const, label: 'Total Users', icon: Users, color: 'text-primary' },
  { key: 'shops' as const, label: 'Total Shops', icon: Store, color: 'text-secondary' },
  { key: 'bookings' as const, label: 'Total Bookings', icon: Calendar, color: 'text-primary' },
  { key: 'reviews' as const, label: 'Total Reviews', icon: MessageSquare, color: 'text-secondary' },
  { key: 'badges' as const, label: 'Badges Awarded', icon: Award, color: 'text-primary' },
  { key: 'blockedUsers' as const, label: 'Blocked Users', icon: Ban, color: 'text-accent' },
]

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => setLoading(false))
  }, [])

  const renderStatValue = <K extends keyof Stats>(key: K): number | string => {
    if (!stats) return 0
    return stats[key]
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Dashboard <span className="text-primary">Overview</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Platform-wide statistics at a glance</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-dark-surface border border-white/10 p-6 animate-pulse">
              <div className="h-3 w-24 bg-gray-800 mb-2" />
              <div className="h-8 w-16 bg-gray-800" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map(card => (
            <div key={card.key} className="bg-dark-surface border border-white/10 p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <card.icon size={64} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{card.label}</p>
              <h3 className={`text-4xl font-black ${card.color}`}>
                {renderStatValue(card.key)}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
