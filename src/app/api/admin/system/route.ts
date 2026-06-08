import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { refreshShopBadges, processNoShows } from '@/services/admin.service'
import { systemActionSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = systemActionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { action } = parsed.data

    if (action === 'refresh_badges') {
      const result = await refreshShopBadges()
      return NextResponse.json(result)
    }

    if (action === 'process_noshows') {
      const result = await processNoShows()
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch {
    console.error('Admin system action failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
