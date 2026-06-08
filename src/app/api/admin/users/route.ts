import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAllUsers, toggleBlockUser, changeUserRole, updateUser } from '@/services/admin.service'
import { adminActionSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
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
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = adminActionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { userId, action, role, email } = parsed.data

    if (action === 'toggleBlock') {
      const result = await toggleBlockUser(userId)
      return NextResponse.json(result)
    }

    if (action === 'changeRole') {
      if (!role) {
        return NextResponse.json({ error: 'Role is required' }, { status: 400 })
      }
      const result = await changeUserRole(userId, role)
      return NextResponse.json(result)
    }

    if (action === 'updateUser') {
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
      }
      const result = await updateUser(userId, { email })
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch {
    console.error('Admin PATCH users failed')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
