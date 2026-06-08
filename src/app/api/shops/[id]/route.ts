import { NextResponse } from 'next/server'
import { getShopById } from '@/services/shop.service'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const shop = await getShopById(id)
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }
    return NextResponse.json(shop)
  } catch (error) {
    console.error('GET shop by id failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
