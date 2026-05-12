"use client"

import { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import { Calendar, Clock } from 'lucide-react'

interface Booking {
  _id: string
  userId: { email: string }
  shopId: { name: string }
  dateTime: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'NO_SHOW'
  createdAt: string
}

const statusStyles: Record<string, string> = {
  PENDING: 'border-yellow-500 text-yellow-500',
  ACCEPTED: 'border-primary text-primary',
  REJECTED: 'border-accent text-accent',
  COMPLETED: 'border-secondary text-secondary',
  NO_SHOW: 'border-gray-500 text-gray-500',
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then(r => r.json())
      .then(data => { setBookings(data); setLoading(false) })
  }, [])

  if (loading) {
    return <div className="text-center py-12 text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">Loading bookings...</div>
  }

  const columns = [
    {
      key: 'userId',
      label: 'User',
      sortable: true,
      render: (b: Booking) => b.userId?.email || '—',
    },
    {
      key: 'shopId',
      label: 'Shop',
      sortable: true,
      render: (b: Booking) => b.shopId?.name || '—',
    },
    {
      key: 'dateTime',
      label: 'Date & Time',
      sortable: true,
      render: (b: Booking) => (
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><Calendar size={12} />{new Date(b.dateTime).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><Clock size={12} />{new Date(b.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (b: Booking) => (
        <span className={`px-2 py-0.5 text-[10px] font-black uppercase italic border ${statusStyles[b.status] || ''}`}>
          {b.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Requested',
      sortable: true,
      render: (b: Booking) => new Date(b.createdAt).toLocaleDateString(),
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Booking <span className="text-primary">Overview</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">{bookings.length} total bookings</p>
      </div>

      <div className="bg-dark-surface border border-white/10 p-6">
        <Table columns={columns} data={bookings} searchKeys={['status']} pageSize={15} />
      </div>
    </div>
  )
}
