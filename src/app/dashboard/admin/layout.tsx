"use client"

import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/AdminSidebar'
import { Button } from '@/components/ui/Button'
import { Car, Menu } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setSubmitting(false)
    if (result?.error) {
      setError('Invalid email or password')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-primary text-sm font-bold uppercase tracking-widest animate-pulse">Loading...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-dark-surface border border-white/10 p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />

          <div className="text-center mb-10 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 mb-6">
              <Car size={32} className="text-primary" />
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
              Admin <span className="text-primary">Access</span>
            </h1>
            <p className="text-gray-400 text-sm">Sign in with an admin account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-bg border-2 border-gray-800 focus:border-primary outline-none px-4 py-3 text-white transition-colors"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-bg border-2 border-gray-800 focus:border-primary outline-none px-4 py-3 text-white transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-medium text-center">{error}</p>
            )}

            <Button type="submit" size="lg" className="w-full py-4" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign in to Admin'}
            </Button>
          </form>
        </motion.div>
      </div>
    )
  }

  if ((session?.user as { role?: string })?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center p-8 border border-white/10">
          <p className="text-accent text-lg font-black uppercase italic tracking-tighter">Access Denied</p>
          <p className="text-gray-400 text-sm mt-2">Admin privileges required</p>
          <button
            onClick={() => signIn('credentials', { redirect: false })}
            className="mt-4 text-sm text-primary font-bold uppercase tracking-widest hover:underline"
          >
            Try a different account
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-30 lg:hidden text-gray-400 hover:text-white bg-dark-surface border border-white/10 p-2.5"
        >
          <Menu size={20} />
        </button>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
