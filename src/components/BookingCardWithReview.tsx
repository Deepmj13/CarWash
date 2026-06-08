"use client"

import { useState } from 'react'
import { Calendar, Clock, CheckCircle2, Timer, XCircle, Star } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'
import MotionBookingCard from '@/components/MotionBookingCard'
import ReviewForm from '@/components/ReviewForm'

interface Booking {
  _id: string
  shopId: { _id: string; name: string; address: string; rating: number }
  serviceId?: { name: string; price: number; duration: number }
  dateTime: string
  status: string
  hasReviewed?: boolean
}

export default function BookingCardWithReview({ booking }: { booking: Booking }) {
  const [showReview, setShowReview] = useState(false)
  const [reviewed, setReviewed] = useState(booking.hasReviewed ?? false)
  const shopId = typeof booking.shopId === 'object' ? booking.shopId._id : booking.shopId

  const handleReviewSuccess = () => {
    setReviewed(true)
    setShowReview(false)
  }

  return (
    <MotionBookingCard className="bg-dark-surface border border-white/10 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="space-y-2 flex-1 min-w-0">
        <h3 className="text-xl font-bold uppercase tracking-tight">
          {typeof booking.shopId === 'object' ? booking.shopId.name : 'Shop'}
        </h3>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {formatDate(booking.dateTime)}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {formatTime(booking.dateTime)}
          </div>
          {booking.serviceId && (
            <span className="text-primary font-medium">{booking.serviceId.name}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          {booking.status === 'PENDING' && (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-black uppercase italic">
              <Timer size={14} /> Pending
            </div>
          )}
          {booking.status === 'ACCEPTED' && (
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase italic">
              <CheckCircle2 size={14} /> Accepted
            </div>
          )}
          {booking.status === 'REJECTED' && (
            <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent border border-accent/20 text-xs font-black uppercase italic">
              <XCircle size={14} /> Rejected
            </div>
          )}
          {booking.status === 'COMPLETED' && !reviewed && (
            <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 text-xs font-black uppercase italic">
              <CheckCircle2 size={14} /> Completed
            </div>
          )}
          {booking.status === 'COMPLETED' && reviewed && (
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase italic">
              <Star size={14} /> Reviewed
            </div>
          )}
        </div>

        {booking.status === 'COMPLETED' && !reviewed && !showReview && (
          <button
            onClick={() => setShowReview(true)}
            className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
          >
            Leave a Review
          </button>
        )}

        {booking.status === 'COMPLETED' && reviewed && (
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Review submitted
          </span>
        )}
      </div>

      {showReview && (
        <div className="w-full">
          <ReviewForm
            bookingId={booking._id}
            shopId={shopId}
            onSuccess={handleReviewSuccess}
          />
        </div>
      )}
    </MotionBookingCard>
  )
}
