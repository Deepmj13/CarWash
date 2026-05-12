"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { RefreshCw, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminSystem() {
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<{ message: string; success: boolean } | null>(null)

  const runAction = async (action: string) => {
    setLoading(action)
    setResult(null)
    try {
      const res = await fetch('/api/admin/system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      setResult({ message: data.message || data.error || 'Done', success: res.ok })
    } catch {
      setResult({ message: 'Request failed', success: false })
    } finally {
      setLoading(null)
    }
  }

  const actions = [
    {
      action: 'refresh_badges',
      label: 'Refresh Shop Badges',
      desc: 'Re-evaluate and re-award badges to all shops based on current performance metrics',
      icon: RefreshCw,
    },
    {
      action: 'process_noshows',
      label: 'Process No-Shows',
      desc: 'Calculate no-show counts for all users and auto-block those exceeding the threshold',
      icon: AlertTriangle,
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          System <span className="text-primary">Operations</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Maintenance and administrative tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actions.map(a => (
          <motion.div
            key={a.action}
            whileHover={{ y: -2 }}
            className="bg-dark-surface border border-white/10 p-8"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 border border-primary/20">
                <a.icon size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black uppercase italic tracking-tighter mb-2">{a.label}</h3>
                <p className="text-sm text-gray-400 mb-6">{a.desc}</p>

                <Button
                  onClick={() => runAction(a.action)}
                  disabled={loading !== null}
                  variant="outline"
                  size="md"
                  className="w-full"
                >
                  {loading === a.action ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" /> Running...</>
                  ) : (
                    <><a.icon size={16} className="mr-2" /> Execute</>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 border flex items-center gap-3 ${
            result.success ? 'border-secondary/30 bg-secondary/5' : 'border-accent/30 bg-accent/5'
          }`}
        >
          {result.success ? (
            <CheckCircle2 size={20} className="text-secondary shrink-0" />
          ) : (
            <AlertTriangle size={20} className="text-accent shrink-0" />
          )}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider">{result.message}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
