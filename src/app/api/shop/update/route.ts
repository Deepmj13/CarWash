import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { updateShopDetails, getOwnerShop } from '@/services/owner.service'
import { updateShopSchema } from '@/lib/validations'

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = updateShopSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const shop = await getOwnerShop(session.user.id)
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    const updatedShop = await updateShopDetails(shop._id.toString(), parsed.data)

    return NextResponse.json({
      message: 'Shop updated successfully',
      shop: updatedShop,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
