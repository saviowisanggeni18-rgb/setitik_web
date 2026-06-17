'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { products } from '@/data/products'
import ProductCard from '@/components/sections/ProductCard'
import CatalogFilter, { type FilterKey } from '@/components/sections/CatalogFilter'

const ease = [0.22, 1, 0.36, 1] as const

export default function CatalogGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('semua')

  const filtered =
    activeFilter === 'semua'
      ? products
      : products.filter((p) => p.category === activeFilter)

  return (
    <>
      <CatalogFilter
        activeFilter={activeFilter}
        onFilter={setActiveFilter}
        productCount={filtered.length}
      />

      {/* AnimatePresence fade saat filter berubah — durasi 0.4s */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10"
        >
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
