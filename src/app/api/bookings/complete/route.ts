import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import Booking from '@/models/Booking'
import Shop from '@/models/Shop'
import { completeBooking } from '@/services/review.service'

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized: Owner access required' }, { status: 403 })
    }

    const { bookingId, status } = await req.json()

    if (status !== 'COMPLETED' && status !== 'NO_SHOW') {
      return NextResponse.json({ error: 'Invalid completion status' }, { status: 400 })
    }

    await connectDB()
    const ownerId = (session.user as any).id
    const shop = await Shop.findOne({ ownerId })
    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 })
    }

    const booking = await Booking.findById(bookingId)
    if (!booking || booking.shopId.toString() !== shop._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized: Not your booking' }, { status: 403 })
    }

    const updatedBooking = await completeBooking(bookingId, status)

    return NextResponse.json({ 
      message: `Booking marked as ${status}`, 
      booking: updatedBooking 
    })

  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
