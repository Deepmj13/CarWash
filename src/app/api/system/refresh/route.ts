import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { refreshShopBadges, processNoShows } from '@/services/system.service'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const { action } = await req.json()

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
    console.error('System refresh failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
