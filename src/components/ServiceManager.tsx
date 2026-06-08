"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Plus, Pencil, Trash2, Clock } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface Service {
  _id: string
  name: string
  description: string
  price: number
  duration: number
}

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState({ name: '', description: '', price: 0, duration: 30 })
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const fetchServices = () => {
    fetch('/api/services')
      .then(r => r.json())
      .then(data => { setServices(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchServices() }, [])

  const resetForm = () => {
    setForm({ name: '', description: '', price: 0, duration: 30 })
    setEditing(null)
    setShowForm(false)
  }

  const openEdit = (svc: Service) => {
    setForm({ name: svc.name, description: svc.description, price: svc.price, duration: svc.duration })
    setEditing(svc)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name || form.price < 0) return
    setSaving(true)
    try {
      const endpoint = editing ? `/api/services/${editing._id}` : '/api/services'
      const method = editing ? 'PATCH' : 'POST'
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': '1' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast(editing ? 'Service updated' : 'Service created', 'success')
        resetForm()
        fetchServices()
      } else {
        const data = await res.json()
        toast(data.error || 'Operation failed', 'error')
      }
    } catch {
      toast('An error occurred', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'x-csrf-token': '1' },
      })
      if (res.ok) {
        toast('Service deleted', 'success')
        fetchServices()
      } else {
        toast('Failed to delete service', 'error')
      }
    } catch {
      toast('An error occurred', 'error')
    }
  }

  return (
    <div className="bg-dark-surface border border-white/10 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">
            Service <span className="text-primary">Menu</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage what services you offer</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} variant="primary" size="sm">
            <Plus size={16} className="mr-1" /> Add Service
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-dark-bg border border-gray-800 p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Service Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-dark-surface border border-gray-800 px-4 py-2.5 outline-none focus:border-primary transition-colors"
                placeholder="e.g. Basic Wash"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Price ($)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={e => setForm({...form, price: parseFloat(e.target.value) || 0})}
                className="w-full bg-dark-surface border border-gray-800 px-4 py-2.5 outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Duration (minutes)</label>
              <input
                type="number"
                min={5}
                step={5}
                value={form.duration}
                onChange={e => setForm({...form, duration: parseInt(e.target.value) || 30})}
                className="w-full bg-dark-surface border border-gray-800 px-4 py-2.5 outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Description (optional)</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              className="w-full bg-dark-surface border border-gray-800 px-4 py-2.5 outline-none focus:border-primary transition-colors"
              placeholder="e.g. Exterior hand wash and dry"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} variant="primary" size="sm" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update Service' : 'Add Service'}
            </Button>
            <Button onClick={resetForm} variant="outline" size="sm">Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500 text-sm animate-pulse">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No services added yet. Add your first service above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map(svc => (
            <div key={svc._id} className="bg-dark-bg border border-gray-800 p-5 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-lg font-bold uppercase tracking-tight">{svc.name}</h4>
                  <span className="text-lg font-black text-primary">${svc.price.toFixed(2)}</span>
                </div>
                {svc.description && (
                  <p className="text-sm text-gray-400 truncate">{svc.description}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <Clock size={12} />
                  {svc.duration} min
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button onClick={() => openEdit(svc)} variant="ghost" size="sm">
                  <Pencil size={14} />
                </Button>
                <Button onClick={() => handleDelete(svc._id)} variant="danger" size="sm">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
