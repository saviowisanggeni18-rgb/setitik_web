'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { getProductBySlug, type Product } from '@/data/products'
import ProductCard from '@/components/sections/ProductCard'
import { buttonVariants } from '@/components/ui/Button'

/*
  Tiga produk pilihan — satu dari tiap kategori untuk tunjukkan rentang koleksi.
  Urutan: tulis (ikonik) → cap (ready stock) → produk-lain (berbeda)
*/
const FEATURED_SLUGS = [
  'taplak-gereja-blenduk',
  'jarik-cap',
  'heritage-travel-journal',
] as const

const ease = [0.22, 1, 0.36, 1] as const

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
}

export default function FeaturedProductsSection() {
  const featured = FEATURED_SLUGS
    .map(getProductBySlug)
    .filter((p): p is Product => p !== undefined)

  return (
    <section className="py-24 px-6 bg-silk">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16"
        >
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-3">
              Koleksi
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink leading-tight">
              Produk pilihan
            </h2>
          </div>
          <Link
            href="/catalog"
            className="font-sans text-sm text-brown hover:text-ink transition-colors duration-300 hidden md:inline"
          >
            Jelajahi Koleksi →
          </Link>
        </motion.div>

        {/* Product cards — stagger antar card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {featured.map((product) => (
            <motion.article key={product.slug} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.article>
          ))}
        </motion.div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          className="mt-12 text-center md:hidden"
        >
          <Link href="/catalog" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            Jelajahi Koleksi
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
