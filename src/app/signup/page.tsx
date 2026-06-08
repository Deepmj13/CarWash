"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'USER'
  })

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': '1' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        window.location.href = '/login'
      } else {
        const data = await res.json()
        alert(data.error || 'Something went wrong')
      }
    } catch (err) {
      alert('An unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-dark-surface border border-white/10 p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/10 blur-3xl -ml-16 -mt-16" />
        
        <div className="text-center mb-10 relative z-10">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
            Get <span className="text-secondary">Started</span>
          </h1>
          <p className="text-gray-400 text-sm">Create your account to experience the best</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-dark-bg border-2 border-gray-800 focus:border-secondary outline-none px-4 py-3 text-white transition-colors"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-dark-bg border-2 border-gray-800 focus:border-secondary outline-none px-4 py-3 text-white transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">I am a...</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full bg-dark-bg border-2 border-gray-800 focus:border-secondary outline-none px-4 py-3 text-white transition-colors appearance-none"
            >
              <option value="USER">Customer (Looking for wash)</option>
              <option value="OWNER">Shop Owner (Providing wash)</option>
            </select>
          </div>

          <Button type="submit" variant="secondary" size="lg" className="w-full py-4">
            Create Account
          </Button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-secondary font-bold hover:underline uppercase tracking-tighter">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
