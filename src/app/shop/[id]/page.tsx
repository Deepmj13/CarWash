"use client"

import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Star, MapPin, Clock, ShieldCheck } from "lucide-react"
import { useState, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function ShopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: session } = useSession()
  const router = useRouter()

  const [shop, setShop] = useState<any>(null)
  const [loadingShop, setLoadingShop] = useState(true)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/shops/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setShop(data)
        setLoadingShop(false)
      })
      .catch(() => {
        setLoadingShop(false)
      })
  }, [id])

  const today = new Date().toISOString().split('T')[0]
  const userId = (session?.user as any)?.id
  const isOwner = shop && userId && shop.ownerId === userId

  const handleBooking = async () => {
    if (!date || !time) {
      alert("Please select both date and time")
      return
    }

    const selected = new Date(`${date}T${time}`)
    if (selected <= new Date()) {
      alert("Please select a future date and time")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId: id,
          dateTime: `${date}T${time}`,
        })
      })

      if (res.ok) {
        alert("Booking request sent! The shop owner will review it soon.")
        router.push('/dashboard/bookings')
      } else {
        const data = await res.json()
        alert(data.error || "Failed to send request")
      }
    } catch (err) {
      alert("An unexpected error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingShop) {
    return (
      <div className="min-h-screen bg-dark-bg text-foreground pt-24 pb-12 px-4 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading shop...</p>
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-dark-bg text-foreground pt-24 pb-12 px-4 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Shop not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg text-foreground pt-24 pb-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Gallery & Info */}
          <div className="space-y-8">
            <div className="aspect-video relative overflow-hidden border-2 border-primary/20">
              <Image
                src={shop.image || ''}
                alt={shop.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-secondary text-dark-bg text-xs font-black uppercase italic">
                  Verified Provider
                </span>
                <div className="flex items-center gap-1 text-secondary font-bold">
                  <Star size={16} fill="currentColor" />
                  {shop.rating} / 5.0
                </div>
              </div>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
                {shop.name}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                {shop.description}
              </p>
              <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  {shop.address}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  Open 8am - 8pm
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Panel */}
          <div className="relative">
            <div className="bg-dark-surface border border-white/10 p-8 sticky top-28">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-6">
                Book a <span className="text-primary">Session</span>
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-dark-bg border border-gray-800 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Price Range</p>
                    <p className="text-2xl font-black">{shop.priceRange}</p>
                  </div>
                  <ShieldCheck className="text-primary" size={32} />
                </div>

                {isOwner ? (
                  <div className="p-4 bg-dark-bg border border-yellow-600/40 text-yellow-400 text-sm font-medium text-center">
                    You own this shop. You can't book your own service.
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Select Date & Time</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="date"
                          value={date}
                          min={today}
                          onChange={(e) => setDate(e.target.value)}
                          className="bg-dark-bg border-2 border-gray-800 px-4 py-3 outline-none focus:border-primary transition-colors"
                        />
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="bg-dark-bg border-2 border-gray-800 px-4 py-3 outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleBooking}
                      disabled={submitting}
                      size="xl"
                      className="w-full py-6 text-lg"
                    >
                      {submitting ? "Sending..." : "Request Booking"}
                    </Button>
                  </>
                )}

                <p className="text-center text-xs text-gray-500 font-medium">
                  Your booking will be marked as <span className="text-secondary">Pending</span> until the shop owner accepts it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
