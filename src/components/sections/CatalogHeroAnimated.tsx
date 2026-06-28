'use client'

import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 1.0, ease } },
}

export default function CatalogHeroAnimated() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
    >
      <motion.p
        variants={itemVariants}
        className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-4"
      >
        Koleksi
      </motion.p>
      <motion.h1
        variants={itemVariants}
        className="font-serif text-4xl md:text-5xl text-ink mb-5 leading-tight"
      >
        Setiap kain,<br />satu cerita bangunan.
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="font-sans text-base text-stone max-w-xl leading-relaxed mb-16"
      >
        Setiap produk kami berangkat dari satu bangunan cagar budaya yang nyata —
        diterjemahkan menjadi motif batik yang layak dipakai atau dipajang.
      </motion.p>
    </motion.div>
  )
}
