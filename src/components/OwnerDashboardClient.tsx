"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { LayoutDashboard, Calendar, TrendingUp, Clock } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'
import { useToast } from '@/components/Toast'

interface Stat {
  label: string
  value: number
  icon: typeof LayoutDashboard
  color: string
  iconColor: string
}

interface Booking {
  _id: string
  userId: { email: string }
  shopId: string
  dateTime: string
  status: string
  serviceId?: { name: string; price: number; duration: number }
}

interface Shop {
  _id: string
  name: string
  rating: number
  totalBookings: number
}

export default function OwnerDashboardClient({
  stats: initialStats,
  bookings: initialBookings,
  shop,
}: {
  stats: { total: number; pending: number; completed: number }
  bookings: Booking[]
  shop: Shop | null
}) {
  const [bookings, setBookings] = useState(initialBookings)

  const pending = bookings.filter(b => b.status === 'PENDING').length
  const completed = bookings.filter(b => b.status === 'COMPLETED').length
  const stats = { total: bookings.length, pending, completed }

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setBookings(prev =>
      prev.map(b => (b._id === bookingId ? { ...b, status: newStatus } : b))
    )
  }

  const statCards: Stat[] = [
    { label: 'Total Requests', value: stats.total, icon: LayoutDashboard, color: 'text-foreground', iconColor: '' },
    { label: 'Pending Action', value: stats.pending, icon: Calendar, color: 'text-yellow-500', iconColor: 'text-yellow-500' },
    { label: 'Completed', value: stats.completed, icon: TrendingUp, color: 'text-secondary', iconColor: 'text-secondary' },
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            whileHover={{ y: -5 }}
            className="bg-dark-surface border border-white/10 p-6 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 p-4 opacity-10 ${card.iconColor}`}>
              <card.icon size={64} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{card.label}</p>
            <h3 className={`text-4xl font-black ${card.color}`}>{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-6">
            Booking <span className="text-primary">Requests</span>
          </h2>

          {bookings.length === 0 ? (
            <div className="text-center py-24 bg-dark-surface border border-white/10">
              <p className="text-gray-400">No bookings yet. Your shop is waiting!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingItem
                  key={booking._id}
                  booking={booking}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-6">
            My <span className="text-primary">Shop</span>
          </h2>
          <div className="bg-dark-surface border border-white/10 p-6">
            {shop ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Shop Name</p>
                  <p className="text-lg font-bold">{shop.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Rating</p>
                  <p className="text-lg font-bold text-secondary">{shop.rating} ★</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Total Bookings</p>
                  <p className="text-lg font-bold">{shop.totalBookings}</p>
                </div>
                <Link href="/dashboard/owner/settings" className="block w-full">
                  <Button variant="outline" size="sm" className="w-full mt-4">Edit Details</Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm mb-4">You haven&apos;t listed a shop yet.</p>
                <Link href="/dashboard/owner/settings">
                  <Button variant="primary" size="sm" className="w-full">Create Shop</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function BookingItem({ booking, onStatusChange }: { booking: Booking; onStatusChange: (id: string, s: string) => void }) {
  return (
    <div className="bg-dark-surface border border-white/10 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-primary/30 transition-colors">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold uppercase tracking-tight">
            {booking.userId?.email}
          </h3>
          <span className={`px-2 py-0.5 text-[10px] font-black uppercase italic border ${
            booking.status === 'PENDING' ? 'border-yellow-500 text-yellow-500' :
            booking.status === 'ACCEPTED' ? 'border-primary text-primary' :
            booking.status === 'REJECTED' ? 'border-accent text-accent' :
            'border-secondary text-secondary'
          }`}>
            {booking.status}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {formatDate(booking.dateTime)}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {formatTime(booking.dateTime)}
          </div>
          {booking.serviceId && (
            <span className="text-primary font-medium truncate max-w-[160px]">
              {booking.serviceId.name}
            </span>
          )}
        </div>
      </div>
      <BookingActions bookingId={booking._id} status={booking.status} onStatusChange={onStatusChange} />
    </div>
  )
}

function BookingActions({ bookingId, status, onStatusChange }: { bookingId: string; status: string; onStatusChange: (id: string, s: string) => void }) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const updateStatus = async (newStatus: string, endpoint: string) => {
    setLoading(true)
    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': '1' },
        body: JSON.stringify({ bookingId, status: newStatus })
      })
      if (res.ok) {
        onStatusChange(bookingId, newStatus)
        const label = newStatus.charAt(0) + newStatus.slice(1).toLowerCase()
        toast(`Booking ${label.toLowerCase()} successfully`, 'success')
      } else {
        toast('Failed to update status', 'error')
      }
    } catch {
      toast('An error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'PENDING') {
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => updateStatus('ACCEPTED', '/api/bookings/update')}
          disabled={loading}
          variant="primary"
          size="sm"
          className="px-4"
        >
          {loading ? 'Processing...' : 'Accept'}
        </Button>
        <Button
          onClick={() => updateStatus('REJECTED', '/api/bookings/update')}
          disabled={loading}
          variant="danger"
          size="sm"
          className="px-4"
        >
          {loading ? 'Processing...' : 'Reject'}
        </Button>
      </div>
    )
  }

  if (status === 'ACCEPTED') {
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => updateStatus('COMPLETED', '/api/bookings/complete')}
          disabled={loading}
          variant="primary"
          size="sm"
          className="px-4"
        >
          {loading ? 'Processing...' : 'Complete'}
        </Button>
        <Button
          onClick={() => updateStatus('NO_SHOW', '/api/bookings/complete')}
          disabled={loading}
          variant="danger"
          size="sm"
          className="px-4"
        >
          {loading ? 'Processing...' : 'No Show'}
        </Button>
      </div>
    )
  }

  return (
    <div className="text-xs font-bold uppercase text-gray-600 italic">
      Action Completed
    </div>
  )
}
