import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { updateServiceSchema } from '@/lib/validations'
import { connectDB } from '@/lib/db'
import Shop from '@/models/Shop'
import Service from '@/models/Service'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const parsed = updateServiceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    await connectDB()
    const shop = await Shop.findOne({ ownerId: session.user.id }).select('_id')
    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 400 })
    }

    const service = await Service.findOneAndUpdate(
      { _id: id, shopId: shop._id },
      { $set: parsed.data },
      { new: true }
    )
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Service updated', service })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    await connectDB()
    const shop = await Shop.findOne({ ownerId: session.user.id }).select('_id')
    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 400 })
    }

    const service = await Service.findOneAndDelete({ _id: id, shopId: shop._id })
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Service deleted' })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
