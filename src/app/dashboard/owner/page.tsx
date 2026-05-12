import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { getOwnerBookings, getOwnerShop } from '@/services/owner.service'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { serialize } from '@/lib/utils'
import OwnerDashboardClient from '@/components/OwnerDashboardClient'

export default async function OwnerDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as { role: string }).role !== 'OWNER') {
    redirect('/login')
  }

  const ownerId = (session.user as { id: string }).id
  const bookings = await getOwnerBookings(ownerId)
  const shop = await getOwnerShop(ownerId)

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
  }

  return (
    <div className="min-h-screen bg-dark-bg text-foreground pt-24 pb-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              Owner <span className="text-primary">Command Center</span>
            </h1>
            <p className="text-gray-400">Manage your shop and booking requests</p>
          </div>
          <Link href="/dashboard/owner/settings">
            <Button variant="outline" size="md">Shop Settings</Button>
          </Link>
        </div>

        <OwnerDashboardClient stats={stats} bookings={serialize(bookings)} shop={serialize(shop)} />
      </div>
    </div>
  )
}
