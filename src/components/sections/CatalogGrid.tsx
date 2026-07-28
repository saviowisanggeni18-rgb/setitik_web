'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { products, type Product } from '@/data/products'
import ProductCard from '@/components/sections/ProductCard'
import CatalogFilter, { type FilterKey } from '@/components/sections/CatalogFilter'
import { getProductCreatedTime, isProductRecentlyAdded } from '@/lib/catalog-newness'

const ease = [0.22, 1, 0.36, 1] as const

const categoryCopy: Record<FilterKey, { title: string; body: string }> = {
  semua: {
    title: 'Katalog Setitik',
    body: 'Pilih karya berdasarkan jenis produk, motif bangunan, dan cerita cagar budaya yang ingin dibawa pulang.',
  },
  'batik-tulis': {
    title: 'Batik tulis',
    body: 'Karya yang dikerjakan lebih perlahan, dekat dengan proses canting dan detail motif bangunan.',
  },
  'batik-cap': {
    title: 'Batik cap',
    body: 'Koleksi kain dan pakaian yang lebih ringan dipakai sehari-hari, tetap membawa cerita Kota Lama.',
  },
  'produk-lain': {
    title: 'Produk lain',
    body: 'Bentuk lain dari cerita cagar budaya: jurnal, aksesori, dan produk naratif Setitik.',
  },
}

const categoryHighlights: {
  key: FilterKey
  title: string
  eyebrow: string
  image: string
}[] = [
  {
    key: 'batik-tulis',
    title: 'Batik tulis',
    eyebrow: 'Canting dan proses perlahan',
    image: '/images/products/taplak-blenduk.png',
  },
  {
    key: 'batik-cap',
    title: 'Batik cap',
    eyebrow: 'Kain dan pakaian harian',
    image: '/images/products/jarik-cap.png',
  },
  {
    key: 'produk-lain',
    title: 'Produk lain',
    eyebrow: 'Jurnal, aksesori, dan cerita',
    image: '/images/products/heritage-travel-journal.png',
  },
]

const subcategoryOrder: Record<string, number> = {
  'kain-panjang': 1,
  taplak: 2,
  'sarung-bantal': 3,
  jarik: 4,
  outer: 5,
  buku: 6,
}

const categoryOrder: Record<Product['category'], number> = {
  'batik-tulis': 1,
  'batik-cap': 2,
  'produk-lain': 3,
}

function sortCatalogProducts(list: Product[]) {
  return [...list].sort((a, b) => {
    const aIsNew = isProductRecentlyAdded(a)
    const bIsNew = isProductRecentlyAdded(b)

    if (aIsNew !== bIsNew) return aIsNew ? -1 : 1

    if (aIsNew && bIsNew) {
      return getProductCreatedTime(b) - getProductCreatedTime(a)
    }

    const orderDiff = (a.sortOrder ?? 1000) - (b.sortOrder ?? 1000)
    if (orderDiff !== 0) return orderDiff

    const categoryDiff = categoryOrder[a.category] - categoryOrder[b.category]
    if (categoryDiff !== 0) return categoryDiff

    const subcategoryDiff =
      (subcategoryOrder[a.subcategory] ?? 99) - (subcategoryOrder[b.subcategory] ?? 99)

    if (subcategoryDiff !== 0) return subcategoryDiff

    return a.name.localeCompare(b.name)
  })
}

function getCardClass(index: number, activeFilter: FilterKey) {
  if (activeFilter !== 'semua') {
    return 'md:col-span-6 xl:col-span-4'
  }

  const pattern = [
    'md:col-span-12 xl:col-span-7',
    'md:col-span-6 xl:col-span-5',
    'md:col-span-6 xl:col-span-4',
    'md:col-span-6 xl:col-span-4',
    'md:col-span-6 xl:col-span-4',
  ]

  return pattern[index] ?? 'md:col-span-6 xl:col-span-4'
}

export default function CatalogGrid({ initialProducts = products }: { initialProducts?: Product[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('semua')

  const filtered = sortCatalogProducts(
    activeFilter === 'semua'
      ? initialProducts
      : initialProducts.filter((p) => p.category === activeFilter),
  )

  const activeCopy = categoryCopy[activeFilter]

  return (
    <section className="relative">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease }}
        className="mb-8 overflow-hidden rounded-[34px] border border-sand bg-forest text-silk shadow-[0_30px_90px_rgba(31,45,34,0.18)]"
      >
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.75) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.75) 1px, transparent 1px)',
              backgroundSize: '42px 42px',
            }}
            aria-hidden
          />

          <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-brown" />
              <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-silk/58">
                Belanja Setitik
              </p>
            </div>
            <h1 className="mt-6 font-serif text-5xl leading-[0.96] text-silk md:text-7xl">
              {activeCopy.title}
            </h1>
            <p className="mt-6 max-w-lg border-l border-silk/18 pl-5 font-sans text-sm leading-[1.85] text-silk/68">
              {activeCopy.body}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {['Batik tulis', 'Batik cap', 'Produk naratif'].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-silk/15 bg-silk/8 px-4 py-2 font-sans text-[9px] uppercase tracking-[0.16em] text-silk/62"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative min-h-[330px] sm:min-h-[390px]">
            <div className="absolute bottom-6 left-[4%] top-0 w-[58%] overflow-hidden rounded-[9rem_9rem_1.6rem_1.6rem] border border-silk/20 bg-sand shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/products/batik-tulis-spaarbank.webp"
                alt="Batik Tulis Spaarbank"
                className="h-full w-full object-cover"
                style={{ objectPosition: 'center 52%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/65 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-forest/55 px-3 py-2 font-sans text-[8px] uppercase tracking-[0.16em] text-silk backdrop-blur">
                Batik Tulis
              </span>
            </div>

            <div className="absolute right-[4%] top-8 w-[44%] overflow-hidden rounded-[1.6rem] border-[6px] border-forest bg-silk shadow-[0_20px_55px_rgba(0,0,0,0.3)]">
              <div className="aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/products/batik-tulis-blenduk.webp"
                  alt="Batik Tulis Blenduk"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: 'center 52%' }}
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <p className="font-sans text-[7px] uppercase tracking-[0.18em] text-stone">
                  Pilihan baru
                </p>
                <span className="h-1.5 w-1.5 rounded-full bg-brown" />
              </div>
            </div>

            <div className="absolute bottom-0 right-[14%] w-[34%] overflow-hidden rounded-[1.2rem] border-[5px] border-forest bg-silk shadow-[0_16px_45px_rgba(0,0,0,0.26)]">
              <div className="aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/products/heritage-travel-journal-photo.webp"
                  alt="Heritage Travel Journal"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: 'center 72%' }}
                />
              </div>
            </div>
          </div>
        </div>

        </div>

        <div className="border-t border-sand bg-cream px-5 py-5 text-ink sm:px-7">
          <CatalogFilter
            activeFilter={activeFilter}
            onFilter={setActiveFilter}
            productCount={filtered.length}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease, delay: 0.03 }}
        className="mb-6 grid grid-cols-3 gap-2 md:mb-8 md:gap-4"
      >
        {categoryHighlights.map(({ key, title, eyebrow, image }) => {
          const active = activeFilter === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveFilter(key)}
              className={`group relative min-h-[118px] overflow-hidden rounded-[16px] border text-left shadow-[0_12px_28px_rgba(79,62,42,0.07)] transition duration-200 md:min-h-[210px] md:rounded-[28px] md:shadow-[0_20px_60px_rgba(79,62,42,0.08)] ${
                active
                  ? 'border-brown bg-forest'
                  : 'border-sand bg-cream hover:border-brown/40'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/45 to-transparent" />
              <div className="relative flex h-full min-h-[118px] flex-col justify-between p-3 md:min-h-[210px] md:p-5">
                <span className="hidden w-fit rounded-full border border-white/25 bg-silk/90 px-3 py-2 font-sans text-[8px] uppercase tracking-[0.16em] text-forest md:inline-flex">
                  {eyebrow}
                </span>
                <div className="mt-auto flex items-end justify-between gap-4">
                  <div>
                    <p className="font-serif text-lg leading-tight text-silk md:text-3xl">{title}</p>
                    <p className="mt-2 hidden font-sans text-[9px] uppercase tracking-[0.16em] text-silk/62 md:block">
                      Lihat koleksi
                    </p>
                  </div>
                  <span className="hidden h-10 w-10 place-items-center rounded-full border border-white/25 bg-silk/15 font-serif text-lg text-silk backdrop-blur transition group-hover:bg-brown md:grid">
                    ↗
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease }}
          className="grid grid-cols-3 gap-2 md:grid-cols-12 md:gap-6"
        >
          {filtered.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              index={index}
              featured={activeFilter === 'semua' && index === 0}
              compactMobile
              className={getCardClass(index, activeFilter)}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
