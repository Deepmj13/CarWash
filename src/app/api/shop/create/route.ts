import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createShop } from '@/services/owner.service'
import { createShopSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = createShopSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { name, description, address, minPrice, maxPrice, currency } = parsed.data
    const shop = await createShop(session.user.id, { name, description, address, minPrice, maxPrice, currency })

    return NextResponse.json({ message: 'Shop created successfully', shop }, { status: 201 })
  } catch {
    console.error('POST shop create failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
