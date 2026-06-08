"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Menu, X, Car } from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (pathname.startsWith('/dashboard/admin')) return null
  const role = session?.user?.role

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 py-4">
      <div className="container max-w-6xl mx-auto bg-dark-bg/80 backdrop-blur-md border border-white/10 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-primary flex items-center justify-center text-dark-bg">
            <Car size={24} strokeWidth={3} />
          </div>
          <span className="text-xl font-black uppercase italic tracking-tighter">
            CarWash<span className="text-primary">Finder</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {!session ? (
            <Link href="/" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Explore</Link>
          ) : role === 'OWNER' ? (
            <>
              <Link href="/dashboard/owner" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">My Dashboard</Link>
              <Link href="/dashboard/owner/settings" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">My Shop</Link>
            </>
          ) : (
            <>
              <Link href="/shops" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Find Shops</Link>
              <Link href="/dashboard/bookings" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">My Bookings</Link>
            </>
          )}
          {role === 'ADMIN' && (
            <Link href="/dashboard/admin" className="text-sm font-bold uppercase tracking-widest text-accent hover:text-accent/80 transition-colors">Admin</Link>
          )}
          <Link href="/how-it-works" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">How it works</Link>

          <div className="flex items-center gap-4 ml-4">
            {!session ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-bold uppercase">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm" className="font-bold uppercase">Join Now</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase text-gray-500">Hello, {session.user?.email}</span>
                <Button onClick={() => signOut()} variant="outline" size="sm" className="font-bold uppercase">Logout</Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-4 right-4 bg-dark-bg border border-white/10 p-6 flex flex-col gap-6 z-40 md:hidden"
        >
          {!session ? (
            <Link href="/" className="text-lg font-bold uppercase tracking-widest hover:text-primary transition-colors">Explore</Link>
          ) : role === 'OWNER' ? (
            <>
              <Link href="/dashboard/owner" className="text-lg font-bold uppercase tracking-widest hover:text-primary transition-colors">My Dashboard</Link>
              <Link href="/dashboard/owner/settings" className="text-lg font-bold uppercase tracking-widest hover:text-primary transition-colors">My Shop</Link>
            </>
          ) : (
            <>
              <Link href="/shops" className="text-lg font-bold uppercase tracking-widest hover:text-primary transition-colors">Find Shops</Link>
              <Link href="/dashboard/bookings" className="text-lg font-bold uppercase tracking-widest hover:text-primary transition-colors">My Bookings</Link>
            </>
          )}
          {role === 'ADMIN' && (
            <Link href="/dashboard/admin" className="text-lg font-bold uppercase tracking-widest text-accent hover:text-accent/80 transition-colors">Admin</Link>
          )}
          <Link href="/how-it-works" className="text-lg font-bold uppercase tracking-widest hover:text-primary transition-colors">How it works</Link>
          <hr className="border-white/10" />
          <div className="flex flex-col gap-4">
            {!session ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="w-full">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" className="w-full">Join Now</Button>
                </Link>
              </>
            ) : (
              <Button onClick={() => signOut()} variant="outline" className="w-full">Logout</Button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}
