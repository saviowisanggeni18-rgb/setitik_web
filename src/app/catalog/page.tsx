import type { Metadata } from 'next'
import CatalogGrid from '@/components/sections/CatalogGrid'
import { listCatalogProducts } from '@/lib/catalog-products'

export const metadata: Metadata = {
  title: 'Koleksi',
  description: 'Koleksi batik tulis, batik cap, dan produk cagar budaya Setitik Cultureware.',
}

export const dynamic = 'force-dynamic'

export default async function CatalogPage() {
  const products = await listCatalogProducts()

  return (
    <div className="px-6 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <CatalogGrid initialProducts={products} />
      </div>
    </div>
  )
}
