import { NextResponse } from 'next/server'
import { getAllShopsPublic } from '@/services/shop.service'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const minRating = Number(searchParams.get('minRating')) || 0
    const priceBucket = searchParams.get('priceBucket') || ''
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize')) || 12))

    const result = await getAllShopsPublic({ search, minRating, priceBucket }, page, pageSize)
    return NextResponse.json(result)
  } catch (error) {
    console.error('GET shops failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
