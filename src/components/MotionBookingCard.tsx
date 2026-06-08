"use client"

import { motion } from 'framer-motion'

export default function MotionBookingCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
