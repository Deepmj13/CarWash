"use client"

import { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Shield, ShieldOff, Check, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface User {
  _id: string
  email: string
  role: 'USER' | 'OWNER' | 'ADMIN'
  noShowCount: number
  isBlocked: boolean
  createdAt: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEmail, setEditingEmail] = useState<string | null>(null)
  const [emailDraft, setEmailDraft] = useState('')

  const fetchUsers = () => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const toggleBlock = async (userId: string) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-csrf-token': '1' },
      body: JSON.stringify({ userId, action: 'toggleBlock' }),
    })
    fetchUsers()
  }

  const changeRole = async (userId: string, role: string) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-csrf-token': '1' },
      body: JSON.stringify({ userId, action: 'changeRole', role }),
    })
    fetchUsers()
  }

  const startEmailEdit = (userId: string, email: string) => {
    setEditingEmail(userId)
    setEmailDraft(email)
  }

  const cancelEmailEdit = () => {
    setEditingEmail(null)
    setEmailDraft('')
  }

  const saveEmail = async (userId: string) => {
    if (!emailDraft) return
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-csrf-token': '1' },
      body: JSON.stringify({ userId, action: 'updateUser', email: emailDraft }),
    })
    cancelEmailEdit()
    fetchUsers()
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">Loading users...</div>
  }

  const columns = [
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (user: User) => {
        if (editingEmail === user._id) {
          return (
            <div className="flex items-center gap-1">
              <input
                type="email"
                value={emailDraft}
                onChange={e => setEmailDraft(e.target.value)}
                className="bg-dark-bg border border-gray-800 px-2 py-1 text-xs outline-none focus:border-primary w-40"
                autoFocus
              />
              <button onClick={() => saveEmail(user._id)} className="text-secondary hover:text-white">
                <Check size={14} />
              </button>
              <button onClick={cancelEmailEdit} className="text-gray-500 hover:text-white">
                <X size={14} />
              </button>
            </div>
          )
        }
        return (
          <button onClick={() => startEmailEdit(user._id, user.email)} className="hover:text-primary transition-colors text-left">
            {user.email}
          </button>
        )
      },
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (user: User) => (
        <select
          value={user.role}
          onChange={e => changeRole(user._id, e.target.value)}
          className="bg-dark-bg border border-gray-800 px-2 py-1 text-xs font-bold uppercase tracking-wider outline-none focus:border-primary cursor-pointer"
        >
          <option value="USER">USER</option>
          <option value="OWNER">OWNER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      ),
    },
    {
      key: 'noShowCount',
      label: 'No-Shows',
      sortable: true,
      render: (user: User) => (
        <span className={user.noShowCount >= 5 ? 'text-accent font-bold' : ''}>{user.noShowCount}</span>
      ),
    },
    {
      key: 'isBlocked',
      label: 'Status',
      render: (user: User) => (
        <span className={`text-xs font-black uppercase italic ${user.isBlocked ? 'text-accent' : 'text-secondary'}`}>
          {user.isBlocked ? 'Blocked' : 'Active'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      sortable: true,
      render: (user: User) => formatDate(user.createdAt),
    },
    {
      key: '_id',
      label: 'Actions',
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => toggleBlock(user._id)}
            variant={user.isBlocked ? 'primary' : 'danger'}
            size="sm"
          >
            {user.isBlocked ? <Shield size={14} /> : <ShieldOff size={14} />}
            <span className="ml-1 text-[10px]">{user.isBlocked ? 'Unblock' : 'Block'}</span>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          User <span className="text-primary">Management</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-dark-surface border border-white/10 p-6">
        <Table columns={columns} data={users} searchKeys={['email']} pageSize={15} />
      </div>
    </div>
  )
}
