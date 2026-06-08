import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectDB } from '@/lib/db'
import Booking from '@/models/Booking'
import Shop from '@/models/Shop'
import { completeBooking } from '@/services/review.service'
import { completionStatusSchema } from '@/lib/validations'

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized: Owner access required' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = completionStatusSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { bookingId, status } = parsed.data

    await connectDB()
    const shop = await Shop.findOne({ ownerId: session.user.id })
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
      booking: updatedBooking,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
