import type { Metadata } from 'next'
import CatalogGrid from '@/components/sections/CatalogGrid'

export const metadata: Metadata = {
  title: 'Koleksi',
  description: 'Koleksi batik tulis, batik cap, dan produk cagar budaya Setitik Cultureware.',
}

export default function CatalogPage() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-4">
          Koleksi
        </p>

        <h1 className="font-serif text-4xl md:text-5xl text-ink mb-5 leading-tight">
          Setiap kain,<br />satu cerita bangunan.
        </h1>

        <p className="font-sans text-base text-stone max-w-xl leading-relaxed mb-16">
          Setiap produk kami berangkat dari satu bangunan cagar budaya yang nyata —
          diterjemahkan menjadi motif batik yang layak dipakai atau dipajang.
        </p>

        <CatalogGrid />

      </div>
    </div>
  )
}
