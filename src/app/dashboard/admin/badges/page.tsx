"use client"

import { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Trash2, Award, Plus } from 'lucide-react'

interface Badge {
  _id: string
  shopId: { _id: string; name: string }
  type: string
  awardedAt: string
}

interface ShopItem {
  _id: string
  name: string
}

const badgeColors: Record<string, string> = {
  TOP_PERFORMER: 'text-primary border-primary',
  BEST_RATED: 'text-secondary border-secondary',
  FAST_SERVICE: 'text-accent border-accent',
}

export default function AdminBadges() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [shops, setShops] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newShopId, setNewShopId] = useState('')
  const [newType, setNewType] = useState<'TOP_PERFORMER' | 'BEST_RATED' | 'FAST_SERVICE'>('TOP_PERFORMER')

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/badges').then(r => r.json()),
      fetch('/api/admin/shops').then(r => r.json()),
    ]).then(([badgesData, shopsData]) => {
      setBadges(badgesData)
      setShops(shopsData)
      setLoading(false)
    })
  }, [])

  const awardBadge = async () => {
    if (!newShopId) return
    await fetch('/api/admin/badges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId: newShopId, type: newType }),
    })
    setShowForm(false)
    setNewShopId('')
    const res = await fetch('/api/admin/badges')
    setBadges(await res.json())
  }

  const handleDelete = async (badgeId: string) => {
    if (!confirm('Remove this badge?')) return
    await fetch('/api/admin/badges', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ badgeId }),
    })
    const res = await fetch('/api/admin/badges')
    setBadges(await res.json())
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">Loading badges...</div>
  }

  const columns = [
    {
      key: 'shopId',
      label: 'Shop',
      sortable: true,
      render: (b: Badge) => b.shopId?.name || '—',
    },
    {
      key: 'type',
      label: 'Badge Type',
      sortable: true,
      render: (b: Badge) => (
        <span className={`px-2 py-0.5 text-[10px] font-black uppercase italic border ${badgeColors[b.type] || ''}`}>
          {b.type.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'awardedAt',
      label: 'Awarded',
      sortable: true,
      render: (b: Badge) => new Date(b.awardedAt).toLocaleDateString(),
    },
    {
      key: '_id',
      label: 'Actions',
      render: (b: Badge) => (
        <Button onClick={() => handleDelete(b._id)} variant="danger" size="sm">
          <Trash2 size={14} />
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            Badge <span className="text-primary">Management</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">{badges.length} badges awarded</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant="primary" size="md">
          <Plus size={16} className="mr-1" /> Award Badge
        </Button>
      </div>

      {showForm && (
        <div className="bg-dark-surface border border-white/10 p-6 mb-6">
          <h3 className="text-lg font-black uppercase italic tracking-tighter mb-4">
            New <span className="text-primary">Badge</span>
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={newShopId}
              onChange={e => setNewShopId(e.target.value)}
              className="bg-dark-bg border-2 border-gray-800 px-4 py-2.5 outline-none focus:border-primary text-sm flex-1"
            >
              <option value="">Select shop...</option>
              {shops.map(shop => (
                <option key={shop._id} value={shop._id}>{shop.name}</option>
              ))}
            </select>
            <select
              value={newType}
              onChange={e => setNewType(e.target.value as 'TOP_PERFORMER' | 'BEST_RATED' | 'FAST_SERVICE')}
              className="bg-dark-bg border-2 border-gray-800 px-4 py-2.5 outline-none focus:border-primary text-sm"
            >
              <option value="TOP_PERFORMER">Top Performer</option>
              <option value="BEST_RATED">Best Rated</option>
              <option value="FAST_SERVICE">Fast Service</option>
            </select>
            <Button onClick={awardBadge} variant="primary" size="md">
              <Award size={16} className="mr-1" /> Award
            </Button>
          </div>
        </div>
      )}

      <div className="bg-dark-surface border border-white/10 p-6">
        <Table columns={columns} data={badges} searchable={false} pageSize={15} />
      </div>
    </div>
  )
}
