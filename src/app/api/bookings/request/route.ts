import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createBookingRequest } from '@/services/booking.service'
import { bookingRequestSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = bookingRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { shopId, dateTime, serviceId } = parsed.data
    const bookingDate = new Date(dateTime)
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }
    if (bookingDate < new Date()) {
      return NextResponse.json({ error: 'Cannot book in the past' }, { status: 400 })
    }

    const booking = await createBookingRequest({
      userId: session.user.id,
      shopId,
      dateTime: bookingDate,
      serviceId,
    })

    return NextResponse.json({
      message: 'Booking request sent successfully',
      bookingId: booking._id,
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
