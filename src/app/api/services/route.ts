import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { createServiceSchema } from '@/lib/validations'
import { connectDB } from '@/lib/db'
import Shop from '@/models/Shop'
import Service from '@/models/Service'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()
    const shop = await Shop.findOne({ ownerId: session.user.id }).select('_id')
    if (!shop) return NextResponse.json([])

    const services = await Service.find({ shopId: shop._id }).sort({ price: 1 }).lean()
    return NextResponse.json(services)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = createServiceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    await connectDB()
    const shop = await Shop.findOne({ ownerId: session.user.id }).select('_id')
    if (!shop) {
      return NextResponse.json({ error: 'Create a shop first' }, { status: 400 })
    }

    const service = await Service.create({ ...parsed.data, shopId: shop._id })
    return NextResponse.json({ message: 'Service created', service }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
