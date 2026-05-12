"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Save } from 'lucide-react'

const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']

interface ShopData {
  _id?: string
  name?: string
  description?: string
  address?: string
  minPrice?: number
  maxPrice?: number
  currency?: string
}

export default function ShopSettingsForm({ shop }: { shop: ShopData | null }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: shop?.name || '',
    description: shop?.description || '',
    address: shop?.address || '',
    minPrice: shop?.minPrice ?? 0,
    maxPrice: shop?.maxPrice ?? 0,
    currency: shop?.currency || 'USD',
  })
  const router = useRouter()
  const isCreating = !shop

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const endpoint = isCreating ? '/api/shop/create' : '/api/shop/update'
      const method = isCreating ? 'POST' : 'PATCH'
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        alert(isCreating ? 'Shop created successfully!' : 'Shop details updated!')
        router.push('/dashboard/owner')
      } else {
        const data = await res.json()
        alert(data.error || 'Operation failed')
      }
    } catch {
      alert('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Shop Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-dark-bg border-2 border-gray-800 px-4 py-3 outline-none focus:border-primary transition-colors"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({...formData, currency: e.target.value})}
            className="w-full bg-dark-bg border-2 border-gray-800 px-4 py-3 outline-none focus:border-primary transition-colors appearance-none"
          >
            {currencies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Min Price</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={formData.minPrice}
            onChange={(e) => setFormData({...formData, minPrice: parseFloat(e.target.value) || 0})}
            className="w-full bg-dark-bg border-2 border-gray-800 px-4 py-3 outline-none focus:border-primary transition-colors"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Max Price</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={formData.maxPrice}
            onChange={(e) => setFormData({...formData, maxPrice: parseFloat(e.target.value) || 0})}
            className="w-full bg-dark-bg border-2 border-gray-800 px-4 py-3 outline-none focus:border-primary transition-colors"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Shop Address</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="w-full bg-dark-bg border-2 border-gray-800 px-4 py-3 outline-none focus:border-primary transition-colors"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full bg-dark-bg border-2 border-gray-800 px-4 py-3 outline-none focus:border-primary transition-colors"
          required
        />
      </div>

      <Button type="submit" size="lg" className="w-full py-4" disabled={loading}>
        {loading ? 'Saving...' : <><Save size={20} className="mr-2" /> {isCreating ? 'Create Shop' : 'Save Changes'}</>}
      </Button>
    </form>
  )
}
