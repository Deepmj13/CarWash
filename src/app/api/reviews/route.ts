import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createReview } from '@/services/review.service'
import { reviewSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = reviewSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { shopId, bookingId, rating, comment } = parsed.data
    const review = await createReview({
      userId: session.user.id,
      shopId,
      bookingId,
      rating,
      comment,
    })

    return NextResponse.json({
      message: 'Review submitted successfully',
      review,
    }, { status: 201 })
  } catch {
    console.error('POST review failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
