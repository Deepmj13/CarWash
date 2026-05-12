import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createShop } from '@/services/owner.service'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { name, description, address, minPrice, maxPrice, currency } = await req.json()

    if (!name || !description || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const ownerId = (session.user as { id: string }).id
    const shop = await createShop(ownerId, { name, description, address, minPrice, maxPrice, currency })

    return NextResponse.json({ message: 'Shop created successfully', shop }, { status: 201 })
  } catch {
    console.error('POST shop create failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
