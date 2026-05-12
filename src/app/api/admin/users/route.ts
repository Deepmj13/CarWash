import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAllUsers, toggleBlockUser, changeUserRole, updateUser } from '@/services/admin.service'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const users = await getAllUsers()
    return NextResponse.json(users)
  } catch {
    console.error('Admin GET users failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const { userId, action, role, email } = await req.json()

    if (action === 'toggleBlock') {
      const result = await toggleBlockUser(userId)
      return NextResponse.json(result)
    }

    if (action === 'changeRole') {
      if (!['USER', 'OWNER', 'ADMIN'].includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
      }
      const result = await changeUserRole(userId, role)
      return NextResponse.json(result)
    }

    if (action === 'updateUser') {
      const result = await updateUser(userId, { email })
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch {
    console.error('Admin PATCH users failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
