import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { getUserBookings } from '@/services/booking.service'
import { Button } from '@/components/ui/Button'
import { Calendar } from 'lucide-react'
import Link from 'next/link'
import BookingCardWithReview from '@/components/BookingCardWithReview'

export default async function BookingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    redirect('/login')
  }

  const bookings = await getUserBookings(session.user.id)

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
          <Link href="/shops">
            <Button variant="outline" size="md">
              Find New Shop
            </Button>
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-24 bg-dark-surface border border-white/10">
            <Calendar size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg">No bookings found. Start by finding a shop!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any) => (
              <BookingCardWithReview key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
