import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAllShops, updateShop } from '@/services/admin.service'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const shops = await getAllShops()
    return NextResponse.json(shops)
  } catch {
    console.error('Admin GET shops failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const { shopId, name, description, address, minPrice, maxPrice, currency } = await req.json()
    if (!shopId) {
      return NextResponse.json({ error: 'shopId is required' }, { status: 400 })
    }

    const updatedShop = await updateShop(shopId, { name, description, address, minPrice, maxPrice, currency })
    return NextResponse.json(updatedShop)
  } catch {
    console.error('Admin PATCH shop failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
