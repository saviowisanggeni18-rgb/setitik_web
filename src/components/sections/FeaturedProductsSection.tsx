'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { getProductBySlug, type Product } from '@/data/products'
import ProductCard from '@/components/sections/ProductCard'
import { buttonVariants } from '@/components/ui/Button'

/*
  Tiga produk pilihan — satu dari tiap kategori untuk tunjukkan rentang koleksi.
*/
const FEATURED_SLUGS = [
  'taplak-gereja-blenduk',
  'jarik-cap',
  'heritage-travel-journal',
] as const

const ease = [0.16, 1, 0.3, 1] as const

/* Header: stagger antar label ↔ heading+link */
const headerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

/* Cards: jeda lebih kecil — muncul bergelombang kiri ke kanan */
const cardContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 1.0, ease } },
}

export default function FeaturedProductsSection() {
  const featured = FEATURED_SLUGS
    .map(getProductBySlug)
    .filter((p): p is Product => p !== undefined)

  return (
    <section className="py-24 px-6 bg-silk">
      <div className="max-w-6xl mx-auto">

        {/* Header — stagger: left block (label + heading) → right link */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16"
        >
          <motion.div variants={itemVariants}>
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-3">
              Koleksi
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-ink leading-tight">
              Produk pilihan
            </h2>
          </motion.div>

          <motion.div variants={itemVariants} className="hidden md:block">
            <Link
              href="/catalog"
              className="font-sans text-sm text-brown hover:text-ink transition-colors duration-300"
            >
              Jelajahi Koleksi →
            </Link>
          </motion.div>
        </motion.div>

        {/* Cards — bergelombang kiri ke kanan (stagger 0.1s) */}
        <motion.div
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
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
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
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
