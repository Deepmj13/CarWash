import { NextResponse } from 'next/server'
import { getShopReviews } from '@/services/review.service'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const reviews = await getShopReviews(id)
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('GET shop reviews failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
