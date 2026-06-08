"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Car, Search } from 'lucide-react'

export default function Hero() {
  const { data: session } = useSession()
  const role = session?.user?.role
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-bg text-foreground px-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-6xl relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6"
        >
          <Car size={14} />
          <span>The Future of Car Care</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-6"
        >
          Find your <span className="text-primary">Perfect</span> <br />
          <span className="text-secondary">Car Wash</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-medium"
        >
          Connect with the best local car wash professionals. Book in seconds, 
          get a sparkling clean, and earn rewards.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {role !== 'OWNER' && role !== 'ADMIN' && (
            <Link href="/shops">
              <Button size="xl" className="w-full sm:w-auto px-10">
                Find a Shop <Search className="ml-2" size={20} />
              </Button>
            </Link>
          )}
          {!session && (
            <Link href="/signup">
              <Button variant="outline" size="xl" className="w-full sm:w-auto px-10">
                List Your Shop
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}
