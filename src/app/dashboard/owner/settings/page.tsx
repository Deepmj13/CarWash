import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { getOwnerShop } from '@/services/owner.service'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { serialize } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import ShopSettingsForm from '@/components/ShopSettingsForm'
import ServiceManager from '@/components/ServiceManager'

export default async function OwnerSettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'OWNER') {
    redirect('/login')
  }

  const ownerId = session.user.id
  const shop = await getOwnerShop(ownerId)

  return (
    <div className="min-h-screen bg-dark-bg text-foreground pt-24 pb-12 px-4">
      <div className="container max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/dashboard/owner">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            {shop ? 'Shop' : 'New'} <span className="text-primary">{shop ? 'Settings' : 'Shop'}</span>
          </h1>
        </div>

        <div className="space-y-10">
          <div className="bg-dark-surface border border-white/10 p-8">
            <ShopSettingsForm shop={serialize(shop)} />
          </div>

          {shop && <ServiceManager />}
        </div>
      </div>
    </div>
  )
}
