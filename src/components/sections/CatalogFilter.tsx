'use client'

import { cn } from '@/lib/utils'

export type FilterKey = 'semua' | 'batik-tulis' | 'batik-cap' | 'produk-lain'

const filters: { key: FilterKey; label: string }[] = [
  { key: 'semua', label: 'Semua' },
  { key: 'batik-tulis', label: 'Batik Tulis' },
  { key: 'batik-cap', label: 'Batik Cap' },
  { key: 'produk-lain', label: 'Produk Lain' },
]

interface CatalogFilterProps {
  activeFilter: FilterKey
  onFilter: (key: FilterKey) => void
  productCount: number
}

export default function CatalogFilter({
  activeFilter,
  onFilter,
  productCount,
}: CatalogFilterProps) {
  return (
    <div className="mb-12">
      {/* Tab filter — teks + underline, tidak ada background button */}
      <div className="flex flex-wrap gap-8 mb-5 border-b border-sand pb-4">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilter(key)}
            className={cn(
              'font-sans text-sm pb-1 -mb-[17px] border-b transition-colors duration-300',
              activeFilter === key
                ? 'text-brown border-brown'
                : 'text-stone border-transparent hover:text-ink'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="font-sans text-xs text-stone mt-4">
        {productCount} produk
      </p>
    </div>
  )
}
