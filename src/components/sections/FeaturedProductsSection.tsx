'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { getProductBySlug, type Product } from '@/data/products'
import { formatPrice } from '@/lib/utils'
import type { HomepageSection } from '@/lib/homepage-sections'

const FEATURED_SLUGS = [
  'taplak-gereja-blenduk',
  'jarik-cap',
  'heritage-travel-journal',
] as const

const ease = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease } },
}

function categoryLabel(product: Product) {
  if (product.category === 'batik-tulis') return 'Batik Tulis'
  if (product.category === 'batik-cap') return 'Batik Cap'
  return 'Produk Lain'
}

export default function FeaturedProductsSection({ section }: { section?: HomepageSection }) {
  const featured = FEATURED_SLUGS
    .map(getProductBySlug)
    .filter((product): product is Product => product !== undefined)

  return (
    <section className="overflow-hidden bg-silk px-6 pb-6 pt-12 md:pb-8 md:pt-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -5% 0px' }}
          className="mb-6 flex flex-col gap-5 md:mb-8 md:flex-row md:items-end md:justify-between"
        >
          <motion.div variants={itemVariants}>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-brown" />
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone">
                Katalog
              </p>
            </div>
            <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
              {section?.title && section.title !== 'Pilihan produk utama' ? section.title : 'Produk pilihan'}
            </h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-3 rounded-full border border-brown px-5 py-3 font-sans text-[9px] uppercase tracking-[0.17em] text-brown transition-colors duration-200 hover:bg-brown hover:text-silk"
            >
              Lihat semua produk
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12, margin: '0px 0px -5% 0px' }}
          className="grid gap-3 rounded-[28px] bg-forest p-3 shadow-[0_18px_48px_rgba(30,45,34,0.14)] md:grid-cols-3 md:p-4"
        >
          {featured.map((product, index) => (
            <motion.article
              key={product.slug}
              variants={itemVariants}
              className="min-w-0"
            >
              <Link
                href={`/catalog/${product.slug}`}
                className="group relative block h-[330px] overflow-hidden rounded-[18px] border border-white/15 bg-sand sm:h-[390px] md:h-[430px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={index === 0 && section?.imageUrl ? section.imageUrl : product.image}
                  alt={`Foto produk ${product.name}`}
                  className={`absolute inset-0 h-full w-full ${
                    product.imageFit === 'contain' ? 'object-contain' : 'object-cover'
                  }`}
                  style={{ objectPosition: product.imagePosition ?? 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/10 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-forest via-forest/80 to-transparent" />

                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-5">
                  <span className="rounded-full border border-white/30 bg-forest/45 px-3 py-1.5 font-sans text-[7px] uppercase tracking-[0.16em] text-white sm:px-3.5 sm:py-2 sm:text-[8px]">
                    {categoryLabel(product)}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-forest/45 font-sans text-[7px] tracking-[0.12em] text-white sm:h-9 sm:w-9 sm:text-[8px]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-4 text-silk sm:p-7">
                  <p className="font-sans text-[8px] uppercase tracking-[0.18em] text-silk/50">
                    {product.subcategory.replaceAll('-', ' ')}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl leading-tight text-silk sm:text-3xl">
                    {product.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 font-sans text-[9px] uppercase tracking-[0.14em] text-brown">
                    Motif {product.motif}
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-4 border-t border-silk/20 pt-4 sm:mt-5 sm:pt-5">
                    <div>
                      <p className="font-sans text-[8px] uppercase tracking-[0.15em] text-silk/40">
                        Harga
                      </p>
                      <p className="mt-1 font-sans text-sm text-silk">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-silk/25 bg-silk/5 text-silk transition-colors duration-200 group-hover:border-brown group-hover:bg-brown sm:h-11 sm:w-11">
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="hidden"
        >
          <p className="font-sans text-[8px] uppercase tracking-[0.17em] text-stone/50">
            Arahkan kursor untuk melihat cerita produk
          </p>
          <p className="font-sans text-[8px] uppercase tracking-[0.17em] text-stone/50">
            Setitik Cultureware · Semarang
          </p>
        </motion.div>
      </div>
    </section>
  )
}
