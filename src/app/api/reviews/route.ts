import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createReview } from '@/services/review.service'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { shopId, bookingId, rating, comment } = await req.json()

    if (!shopId || !bookingId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const review = await createReview({
      userId: (session.user as any).id,
      shopId,
      bookingId,
      rating,
      comment,
    })

    return NextResponse.json({ 
      message: 'Review submitted successfully', 
      review 
    }, { status: 201 })

  } catch {
    console.error('POST review failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
