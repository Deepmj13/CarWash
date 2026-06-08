"use client"

import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Star, MapPin, Clock, ShieldCheck, MessageSquare, Award, Zap, ThumbsUp, Timer } from "lucide-react"
import { formatDate } from '@/lib/utils'
import { useState, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/Toast"

interface Service {
  _id: string
  name: string
  description: string
  price: number
  duration: number
}

export default function ShopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [shop, setShop] = useState<any>(null)
  const [loadingShop, setLoadingShop] = useState(true)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<string>('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])
  const [loadingReviews, setLoadingReviews] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/shops/${id}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data)
        setLoadingReviews(false)
      })
      .catch(() => setLoadingReviews(false))
  }, [id])

  useEffect(() => {
    Promise.all([
      fetch(`/api/shops/${id}`).then(r => r.json()),
      fetch(`/api/shops/${id}/services`).then(r => r.json()),
    ])
      .then(([shopData, servicesData]) => {
        setShop(shopData)
        setServices(servicesData)
        if (servicesData.length === 1) {
          setSelectedService(servicesData[0]._id)
        }
        setLoadingShop(false)
      })
      .catch(() => setLoadingShop(false))
  }, [id])

  const today = new Date().toISOString().split('T')[0]
  const userId = session?.user?.id
  const isOwner = shop && userId && shop.ownerId === userId
  const selectedSvc = services.find(s => s._id === selectedService)

  const handleBooking = async () => {
    if (!date || !time) {
      toast("Please select both date and time", 'error')
      return
    }

    const selected = new Date(`${date}T${time}`)
    if (selected <= new Date()) {
      toast("Please select a future date and time", 'error')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': '1' },
        body: JSON.stringify({
          shopId: id,
          dateTime: `${date}T${time}`,
          serviceId: selectedService || undefined,
        })
      })

      if (res.ok) {
        toast("Booking request sent! The shop owner will review it soon.", 'success')
        router.push('/dashboard/bookings')
      } else {
        const data = await res.json()
        toast(data.error || "Failed to send request", 'error')
      }
    } catch {
      toast("An unexpected error occurred", 'error')
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
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 text-secondary font-bold">
                  <Star size={16} fill="currentColor" />
                  {shop.rating} / 5.0
                </div>
                {shop.badges?.map((badge: string) => (
                  <span
                    key={badge}
                    className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black uppercase italic border ${
                      badge === 'TOP_PERFORMER'
                        ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10'
                        : badge === 'BEST_RATED'
                        ? 'border-secondary text-secondary bg-secondary/10'
                        : 'border-blue-500 text-blue-500 bg-blue-500/10'
                    }`}
                  >
                    {badge === 'TOP_PERFORMER' && <Award size={12} />}
                    {badge === 'BEST_RATED' && <ThumbsUp size={12} />}
                    {badge === 'FAST_SERVICE' && <Zap size={12} />}
                    {badge.replace('_', ' ')}
                  </span>
                ))}
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
                  {shop.operatingHours || 'Contact for hours'}
                </div>
              </div>
            </div>

            {/* Services Section */}
            {services.length > 0 && (
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4">
                  Our <span className="text-primary">Services</span>
                </h2>
                <div className="space-y-3">
                  {services.map(svc => (
                    <div
                      key={svc._id}
                      className={`bg-dark-surface border p-5 transition-colors ${
                        selectedService === svc._id
                          ? 'border-primary bg-primary/5'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold uppercase tracking-tight">{svc.name}</h3>
                        <span className="text-xl font-black text-primary">${svc.price.toFixed(2)}</span>
                      </div>
                      {svc.description && (
                        <p className="text-sm text-gray-400">{svc.description}</p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Timer size={12} />
                        {svc.duration} min
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

                {/* Service Selection */}
                {services.length > 0 && !isOwner && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Select Service</label>
                    <select
                      value={selectedService}
                      onChange={e => setSelectedService(e.target.value)}
                      className="w-full bg-dark-bg border-2 border-gray-800 px-4 py-3 outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="">Choose a service...</option>
                      {services.map(svc => (
                        <option key={svc._id} value={svc._id}>
                          {svc.name} — ${svc.price.toFixed(2)} ({svc.duration} min)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedSvc && !isOwner && (
                  <div className="p-4 bg-dark-bg border border-primary/20">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Selected Service</p>
                    <p className="text-lg font-bold">{selectedSvc.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                      <span className="text-primary font-black">${selectedSvc.price.toFixed(2)}</span>
                      <span className="flex items-center gap-1"><Timer size={12} />{selectedSvc.duration} min</span>
                    </div>
                  </div>
                )}

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

        {/* Reviews Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">
            Customer <span className="text-primary">Reviews</span>
          </h2>

          {loadingReviews ? (
            <div className="text-center py-12 text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 border border-white/10">
              <MessageSquare size={40} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No reviews yet. Be the first to review this shop!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <div
                  key={review._id}
                  className="bg-dark-surface border border-white/10 p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 flex items-center justify-center text-primary font-black text-sm">
                        {review.userId?.email?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          {review.userId?.email?.split('@')[0] || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-secondary">
                      {Array.from({ length: review.rating }).map((_: any, i: number) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
