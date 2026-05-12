"use client"

import { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Star, Edit2, X, Save } from 'lucide-react'

interface Shop {
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
  ownerId: { email: string }
  createdAt: string
}

const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']

export default function AdminShops() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    address: '',
    minPrice: 0,
    maxPrice: 0,
    currency: 'USD',
  })
  const [saving, setSaving] = useState(false)

  const fetchShops = () => {
    fetch('/api/admin/shops')
      .then(r => r.json())
      .then(data => { setShops(data); setLoading(false) })
  }

  useEffect(() => { fetchShops() }, [])

  const openEdit = (shop: Shop) => {
    setEditingShop(shop)
    setEditForm({
      name: shop.name,
      description: shop.description,
      address: shop.address,
      minPrice: shop.minPrice ?? 0,
      maxPrice: shop.maxPrice ?? 0,
      currency: shop.currency || 'USD',
    })
  }

  const closeEdit = () => {
    setEditingShop(null)
  }

  const saveEdit = async () => {
    if (!editingShop) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/shops', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: editingShop._id, ...editForm }),
      })
      if (res.ok) {
        closeEdit()
        fetchShops()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to update shop')
      }
    } catch {
      alert('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">Loading shops...</div>
  }

  const columns = [
    { key: 'name', label: 'Shop Name', sortable: true },
    {
      key: 'ownerId',
      label: 'Owner',
      render: (shop: Shop) => shop.ownerId?.email || '—',
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (shop: Shop) => (
        <span className="flex items-center gap-1 text-secondary font-bold">
          <Star size={14} fill="currentColor" />
          {shop.rating}
        </span>
      ),
    },
    {
      key: 'totalBookings',
      label: 'Bookings',
      sortable: true,
    },
    {
      key: 'priceRange',
      label: 'Price',
      render: (shop: Shop) => shop.priceRange || '—',
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (shop: Shop) => new Date(shop.createdAt).toLocaleDateString(),
    },
    {
      key: '_id',
      label: 'Actions',
      render: (shop: Shop) => (
        <Button onClick={() => openEdit(shop)} variant="ghost" size="sm">
          <Edit2 size={14} />
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Shop <span className="text-primary">Management</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">{shops.length} registered shops</p>
      </div>

      <div className="bg-dark-surface border border-white/10 p-6">
        <Table columns={columns} data={shops} searchKeys={['name', 'address']} pageSize={15} />
      </div>

      {editingShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={closeEdit}>
          <div className="bg-dark-surface border border-white/10 p-8 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black uppercase italic tracking-tighter">
                Edit <span className="text-primary">Shop</span>
              </h2>
              <button onClick={closeEdit} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Shop Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full bg-dark-bg border border-gray-800 px-4 py-2.5 outline-none focus:border-primary transition-colors text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Min Price</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={editForm.minPrice}
                    onChange={e => setEditForm({...editForm, minPrice: parseFloat(e.target.value) || 0})}
                    className="w-full bg-dark-bg border border-gray-800 px-4 py-2.5 outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Max Price</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={editForm.maxPrice}
                    onChange={e => setEditForm({...editForm, maxPrice: parseFloat(e.target.value) || 0})}
                    className="w-full bg-dark-bg border border-gray-800 px-4 py-2.5 outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Currency</label>
                  <select
                    value={editForm.currency}
                    onChange={e => setEditForm({...editForm, currency: e.target.value})}
                    className="w-full bg-dark-bg border border-gray-800 px-4 py-2.5 outline-none focus:border-primary transition-colors text-sm appearance-none"
                  >
                    {currencies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={e => setEditForm({...editForm, address: e.target.value})}
                  className="w-full bg-dark-bg border border-gray-800 px-4 py-2.5 outline-none focus:border-primary transition-colors text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                  className="w-full bg-dark-bg border border-gray-800 px-4 py-2.5 outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button onClick={closeEdit} variant="outline" className="flex-1">Cancel</Button>
              <Button onClick={saveEdit} className="flex-1" disabled={saving}>
                {saving ? 'Saving...' : <><Save size={16} className="mr-2" /> Save</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
