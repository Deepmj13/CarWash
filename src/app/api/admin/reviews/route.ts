import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAllReviews, deleteReview } from '@/services/admin.service'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const reviews = await getAllReviews()
    return NextResponse.json(reviews)
  } catch {
    console.error('Admin GET reviews failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const { reviewId } = await req.json()
    const result = await deleteReview(reviewId)
    return NextResponse.json(result)
  } catch {
    console.error('Admin DELETE review failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
