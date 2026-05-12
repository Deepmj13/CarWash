import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { getUserBookings } from '@/services/booking.service'
import { Button } from '@/components/ui/Button'
import { Calendar, Clock, CheckCircle2, Timer, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default async function BookingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    redirect('/login')
  }

  const bookings = await getUserBookings((session.user as any).id)

  return (
    <div className="min-h-screen bg-dark-bg text-foreground pt-24 pb-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              My <span className="text-primary">Bookings</span>
            </h1>
            <p className="text-gray-400">Track your upcoming car wash sessions</p>
          </div>
          <Button variant="outline" size="md">
            Find New Shop
          </Button>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-24 bg-dark-surface border border-white/10">
            <Calendar size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg">No bookings found. Start by finding a shop!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <motion.div 
                key={booking._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-dark-surface border border-white/10 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold uppercase tracking-tight">
                    {booking.shop?.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(booking.dateTime).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(booking.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {booking.status === 'PENDING' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-black uppercase italic">
                      <Timer size={14} />
                      Pending
                    </div>
                  )}
                  {booking.status === 'ACCEPTED' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase italic">
                      <CheckCircle2 size={14} />
                      Accepted
                    </div>
                  )}
                  {booking.status === 'REJECTED' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent border border-accent/20 text-xs font-black uppercase italic">
                      <XCircle size={14} />
                      Rejected
                    </div>
                  )}
                  {booking.status === 'COMPLETED' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 text-xs font-black uppercase italic">
                      <CheckCircle2 size={14} />
                      Completed
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
