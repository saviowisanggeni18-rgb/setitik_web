import type { Metadata } from 'next'
import CatalogGrid from '@/components/sections/CatalogGrid'
import CatalogHeroAnimated from '@/components/sections/CatalogHeroAnimated'

export const metadata: Metadata = {
  title: 'Koleksi',
  description: 'Koleksi batik tulis, batik cap, dan produk cagar budaya Setitik Cultureware.',
}

export default function CatalogPage() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <CatalogHeroAnimated />
        <CatalogGrid />
      </div>
    </div>
  )
}
