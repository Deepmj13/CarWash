import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { updateShopDetails, getOwnerShop } from '@/services/owner.service'

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const ownerId = (session.user as any).id

    const allowedFields = ['name', 'description', 'address', 'minPrice', 'maxPrice', 'currency']
    const updates: Record<string, any> = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) updates[key] = body[key]
    }
    
    const shop = await getOwnerShop(ownerId)
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    const updatedShop = await updateShopDetails(shop._id.toString(), updates)

    return NextResponse.json({ 
      message: 'Shop updated successfully', 
      shop: updatedShop 
    })

  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
