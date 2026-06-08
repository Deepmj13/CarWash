"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function LoginPage() {
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
    } else if (result?.ok) {
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-dark-surface border border-white/10 p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />
        
        <div className="text-center mb-10 relative z-10">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
            Welcome <span className="text-primary">Back</span>
          </h1>
          <p className="text-gray-400 text-sm">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-bg border-2 border-gray-800 focus:border-primary outline-none px-4 py-3 text-white transition-colors"
              placeholder="name@example.com"
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
            {submitting ? 'Signing in...' : 'Login Now'}
          </Button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary font-bold hover:underline uppercase tracking-tighter">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
