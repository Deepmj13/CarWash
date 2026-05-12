import { NextResponse } from 'next/server'
import { getAllShopsPublic } from '@/services/shop.service'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const minRating = Number(searchParams.get('minRating')) || 0
    const priceBucket = searchParams.get('priceBucket') || ''

    const shops = await getAllShopsPublic({ search, minRating, priceBucket })
    return NextResponse.json(shops)
  } catch {
    console.error('GET shops failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
