"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard, Users, Store, Calendar, MessageSquare,
  Award, Settings, X, ChevronLeft, Shield, LogOut
} from 'lucide-react'

const navItems = [
  { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users },
  { href: '/dashboard/admin/shops', label: 'Shops', icon: Store },
  { href: '/dashboard/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/dashboard/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { href: '/dashboard/admin/badges', label: 'Badges', icon: Award },
  { href: '/dashboard/admin/system', label: 'System', icon: Settings },
]

export default function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-dark-surface border-r border-white/10 transform transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <Shield size={18} className="text-dark-bg" />
              </div>
              <span className="text-lg font-black uppercase italic tracking-tighter">
                Admin<span className="text-primary">Panel</span>
              </span>
            </Link>
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          {session?.user && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-gray-400 font-medium truncate">
                {session.user.email}
              </p>
            </div>
          )}
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-1">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-accent hover:bg-white/5 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500 hover:text-white transition-colors"
          >
            <ChevronLeft size={14} />
            Back to site
          </Link>
        </div>
      </aside>
    </>
  )
}
