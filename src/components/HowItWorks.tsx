"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar, CheckCircle } from 'lucide-react'

const STEPS = [
  {
    title: "Discover",
    desc: "Browse top-rated car wash shops in your area with detailed pricing and ratings.",
    icon: <Search size={32} />,
    color: "text-primary"
  },
  {
    title: "Book",
    desc: "Select your preferred date and time. Send a request to the shop in one click.",
    icon: <Calendar size={32} />,
    color: "text-secondary"
  },
  {
    title: "Shine",
    desc: "Once accepted, show up and get your car sparkling. Pay at the shop and leave a review.",
    icon: <CheckCircle size={32} />,
    color: "text-accent"
  }
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-dark-surface px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Three simple steps to get your vehicle looking like new.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {STEPS.map((step, index) => (
            <motion.div 
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group text-center"
            >
              <div className={`mb-6 inline-flex items-center justify-center w-20 h-20 rounded-none border-4 border-current ${step.color} font-black`}>
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-3">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {step.desc}
              </p>
              
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-6 w-12 h-1 bg-gray-800 group-hover:bg-primary transition-colors" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
