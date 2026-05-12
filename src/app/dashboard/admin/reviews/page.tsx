"use client"

import { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Trash2, Star } from 'lucide-react'

interface Review {
  _id: string
  userId: { email: string }
  shopId: { name: string }
  rating: number
  comment: string
  createdAt: string
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/reviews')
      .then(r => r.json())
      .then(data => { setReviews(data); setLoading(false) })
  }, [])

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Delete this review?')) return
    await fetch('/api/admin/reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId }),
    })
    const res = await fetch('/api/admin/reviews')
    setReviews(await res.json())
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">Loading reviews...</div>
  }

  const columns = [
    {
      key: 'userId',
      label: 'User',
      sortable: true,
      render: (r: Review) => r.userId?.email || '—',
    },
    {
      key: 'shopId',
      label: 'Shop',
      sortable: true,
      render: (r: Review) => r.shopId?.name || '—',
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (r: Review) => (
        <span className="flex items-center gap-1 text-secondary font-bold">
          {Array.from({ length: r.rating }).map((_, i) => (
            <Star key={i} size={12} fill="currentColor" />
          ))}
          {r.rating}/5
        </span>
      ),
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (r: Review) => (
        <span className="text-gray-400 max-w-xs truncate block">{r.comment}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (r: Review) => new Date(r.createdAt).toLocaleDateString(),
    },
    {
      key: '_id',
      label: 'Actions',
      render: (r: Review) => (
        <Button onClick={() => handleDelete(r._id)} variant="danger" size="sm">
          <Trash2 size={14} />
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Review <span className="text-primary">Moderation</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">{reviews.length} submitted reviews</p>
      </div>

      <div className="bg-dark-surface border border-white/10 p-6">
        <Table columns={columns} data={reviews} searchKeys={['comment']} pageSize={15} />
      </div>
    </div>
  )
}
