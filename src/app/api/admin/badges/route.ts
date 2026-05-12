import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAllBadges, awardBadge, removeBadge } from '@/services/admin.service'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const badges = await getAllBadges()
    return NextResponse.json(badges)
  } catch {
    console.error('Admin GET badges failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const { shopId, type } = await req.json()
    if (!shopId || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const badge = await awardBadge(shopId, type)
    return NextResponse.json(badge, { status: 201 })
  } catch {
    console.error('Admin POST badge failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const { badgeId } = await req.json()
    const result = await removeBadge(badgeId)
    return NextResponse.json(result)
  } catch {
    console.error('Admin DELETE badge failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
