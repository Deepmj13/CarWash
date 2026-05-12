import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createBookingRequest } from '@/services/booking.service'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { shopId, dateTime } = await req.json()

    if (!shopId || !dateTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const bookingDate = new Date(dateTime)
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }
    if (bookingDate < new Date()) {
      return NextResponse.json({ error: 'Cannot book in the past' }, { status: 400 })
    }

    const booking = await createBookingRequest({
      userId: (session.user as any).id,
      shopId,
      dateTime: bookingDate,
    })

    return NextResponse.json({ 
      message: 'Booking request sent successfully', 
      bookingId: booking._id 
    }, { status: 201 })

  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
