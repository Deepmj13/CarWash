import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Service from '@/models/Service'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    const services = await Service.find({ shopId: id }).sort({ price: 1 }).lean()
    return NextResponse.json(services)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
