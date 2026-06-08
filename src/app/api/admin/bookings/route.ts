import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAllBookings } from '@/services/admin.service'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const bookings = await getAllBookings()
    return NextResponse.json(bookings)
  } catch {
    console.error('Admin GET bookings failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
