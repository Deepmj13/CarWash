"use client"

import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/Toast'

export default function ReviewForm({ bookingId, shopId, onSuccess }: { bookingId: string; shopId: string; onSuccess: () => void }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast('Please select a rating', 'error')
      return
    }
    if (!comment.trim()) {
      toast('Please write a comment', 'error')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': '1' },
        body: JSON.stringify({ bookingId, shopId, rating, comment }),
      })

      if (res.ok) {
        toast('Review submitted! Thank you for your feedback.', 'success')
        onSuccess()
      } else {
        const data = await res.json()
        toast(data.error || 'Failed to submit review', 'error')
      }
    } catch {
      toast('An error occurred', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-dark-bg border border-gray-800 p-5 space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-0.5 transition-colors"
            >
              <Star
                size={22}
                fill={(hover || rating) >= star ? '#E0FF00' : 'none'}
                stroke={(hover || rating) >= star ? '#E0FF00' : '#555'}
                className="transition-colors"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Comment</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Tell others about your experience..."
          className="w-full bg-dark-surface border border-gray-800 px-4 py-2.5 outline-none focus:border-primary transition-colors text-sm resize-none"
          required
        />
        <p className="text-xs text-gray-600 text-right">{comment.length}/1000</p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" size="sm" disabled={submitting}>
          {submitting ? 'Submitting...' : <><Send size={14} className="mr-1" /> Submit Review</>}
        </Button>
      </div>
    </form>
  )
}
