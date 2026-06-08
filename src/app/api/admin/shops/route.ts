import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAllShops, updateShop } from '@/services/admin.service'
import { updateShopSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
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
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const { shopId } = body
    if (!shopId) {
      return NextResponse.json({ error: 'shopId is required' }, { status: 400 })
    }

    const parsed = updateShopSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const updatedShop = await updateShop(shopId, parsed.data)
    return NextResponse.json(updatedShop)
  } catch {
    console.error('Admin PATCH shop failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
