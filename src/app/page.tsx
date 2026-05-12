import Hero from '@/components/Hero'
import FeaturedShops from '@/components/FeaturedShops'
import HowItWorks from '@/components/HowItWorks'
import { serialize } from '@/lib/utils'
import { getFeaturedShops } from '@/services/shop.service'

export default async function Home() {
  const shops = await getFeaturedShops()

  return (
    <main className="min-h-screen bg-dark-bg">
      <Hero />
      <HowItWorks />
      <FeaturedShops shops={serialize(shops)} />
    </main>
  )
}
