import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAllBadges, awardBadge, removeBadge } from '@/services/admin.service'
import { badgeSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
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
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = badgeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const badge = await awardBadge(parsed.data.shopId, parsed.data.type)
    return NextResponse.json(badge, { status: 201 })
  } catch {
    console.error('Admin POST badge failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const { badgeId } = await req.json()
    if (!badgeId) {
      return NextResponse.json({ error: 'badgeId is required' }, { status: 400 })
    }
    const result = await removeBadge(badgeId)
    return NextResponse.json(result)
  } catch {
    console.error('Admin DELETE badge failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
