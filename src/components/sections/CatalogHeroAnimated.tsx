'use client'

import { motion } from 'framer-motion'
import { products } from '@/data/products'

const ease = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease } },
}

const heroImages = [
  { src: '/images/products/kain-panjang-kota-lama-formal.webp', alt: 'Kain Panjang Kota Lama Setitik' },
  { src: '/images/products/outer-nona-monod-gaya-2.webp', alt: 'Outer Nona Monod Setitik' },
  { src: '/images/products/heritage-travel-journal.png', alt: 'Heritage Travel Journal Setitik' },
]

export default function CatalogHeroAnimated() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid overflow-hidden rounded-[30px] bg-forest text-silk shadow-[0_28px_85px_rgba(30,45,34,0.2)] lg:min-h-[560px] lg:grid-cols-[0.85fr_1.15fr]"
    >
      <div className="flex flex-col p-7 sm:p-10 lg:p-12">
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <span className="h-px w-9 bg-brown" />
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-silk/50">
            Katalog Setitik
          </p>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mt-9 max-w-lg font-serif text-4xl leading-[1.05] text-silk md:text-5xl xl:text-6xl"
        >
          Setiap kain,
          <span className="block italic text-brown">satu cerita bangunan.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-7 max-w-md font-sans text-sm leading-[1.85] text-silk/62"
        >
          Produk Setitik berangkat dari bangunan cagar budaya yang nyata, kemudian
          diterjemahkan menjadi motif batik untuk dikenakan, digunakan, atau disimpan.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-7 grid grid-cols-3 gap-4 border-t border-silk/15 pt-6 lg:mt-auto"
        >
          <div>
            <p className="font-serif text-2xl text-silk">{products.length}</p>
            <p className="mt-1 font-sans text-[8px] uppercase tracking-[0.15em] text-silk/38">Produk</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-silk">03</p>
            <p className="mt-1 font-sans text-[8px] uppercase tracking-[0.15em] text-silk/38">Kategori</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-silk">11+</p>
            <p className="mt-1 font-sans text-[8px] uppercase tracking-[0.15em] text-silk/38">Bangunan</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="grid min-h-[500px] grid-cols-[1.12fr_0.88fr] grid-rows-2 gap-2 bg-silk/5 p-2 lg:min-h-full"
      >
        {heroImages.map((image, index) => (
          <figure
            key={image.src}
            className={`relative overflow-hidden rounded-[20px] bg-sand ${index === 0 ? 'row-span-2' : ''}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
              style={{ objectPosition: index === 0 ? 'center 44%' : index === 1 ? 'center 48%' : 'center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-transparent to-transparent" />
            <figcaption className="absolute bottom-4 left-4 font-sans text-[8px] uppercase tracking-[0.18em] text-white/70">
              Koleksi {String(index + 1).padStart(2, '0')}
            </figcaption>
          </figure>
        ))}
      </motion.div>
    </motion.section>
  )
}
