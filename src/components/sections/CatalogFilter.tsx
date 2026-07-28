'use client'

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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {filters.map(({ key, label }) => {
          const active = activeFilter === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onFilter(key)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2.5 font-sans text-[9px] uppercase tracking-[0.14em] transition-all duration-300 ${
                active
                  ? 'border-forest bg-forest text-silk shadow-sm'
                  : 'border-sand bg-cream/50 text-stone hover:border-brown hover:text-brown'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <p className="font-sans text-[9px] uppercase tracking-[0.16em] text-stone/55">
        {String(productCount).padStart(2, '0')} produk ditemukan
      </p>
    </div>
  )
}
