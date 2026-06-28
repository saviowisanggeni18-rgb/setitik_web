'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 1.0, ease } },
}

interface Location {
  id: string
  name: string
  subtitle: string
  description: string
  leftPct: string
  topPct: string
}

/*
  Koordinat dihitung dari cx/cy file SVG provinsi (viewBox 0 0 1000 368):
    left = cx / 1000 * 100
    top  = cy / 368  * 100

  Semarang   cx=338.4 cy=279.8  → 33.84% / 76.03%
  Jakarta    cx=279.6 cy=257    → 27.96% / 69.84%
  Bandung    cx=294.6 cy=270.4  → 29.46% / 73.48%
  Yogyakarta cx=350.1 cy=290.6  → 35.01% / 78.97%
*/
const locations: Location[] = [
  {
    id: 'semarang',
    name: 'Semarang',
    subtitle: 'Kawasan Kota Lama',
    description:
      'Jantung inspirasi Setitik. Sebelas bangunan cagar budaya dari kawasan ini telah terdokumentasikan dalam motif — dari Gereja Blenduk hingga Gedung NHM.',
    leftPct: '33.84%',
    topPct:  '76.03%',
  },
  {
    id: 'jakarta',
    name: 'Jakarta',
    subtitle: 'Kawasan Kota Tua',
    description:
      'Warisan arsitektur kolonial yang berbagi DNA visual dengan Kota Lama. Motif-motifnya turut hadir dalam koleksi Heritage Travel Journal edisi Jakarta.',
    leftPct: '27.96%',
    topPct:  '69.84%',
  },
  {
    id: 'bandung',
    name: 'Bandung',
    subtitle: 'Arsitektur Art Deco',
    description:
      'Deretan bangunan art deco Bandung menjadi referensi bagi motif-motif masa depan yang sedang dalam penelitian dan pengembangan.',
    leftPct: '29.46%',
    topPct:  '73.48%',
  },
  {
    id: 'yogyakarta',
    name: 'Yogyakarta',
    subtitle: 'Pusat tradisi batik',
    description:
      'Tempat kami belajar dan berdialog dengan para empu batik. Tradisi membatik Yogyakarta menjadi akar teknis dari setiap helai Setitik.',
    leftPct: '35.01%',
    topPct:  '78.97%',
  },
]

export default function InspirationMapSection() {
  const [activeId, setActiveId] = useState<string | null>('semarang')
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const displayedId = hoveredCity ?? activeId
  const displayedLocation = locations.find((l) => l.id === displayedId) ?? null

  const toggle = (id: string) =>
    setActiveId((prev) => (prev === id ? null : id))

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header — stagger: label → heading → description */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="mb-14"
        >
          <motion.p
            variants={itemVariants}
            className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-4"
          >
            Wilayah
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="font-serif text-3xl md:text-4xl text-ink leading-tight mb-4"
          >
            Sumber inspirasi
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="font-sans text-sm text-stone max-w-md leading-relaxed"
          >
            Setiap kota menyimpan arsitektur yang belum habis diceritakan.
            Klik titik kota untuk membaca inspirasinya.
          </motion.p>
        </motion.div>

        {/* Peta + Info panel — muncul setelah header selesai */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-10 items-start"
        >

          {/* Container peta */}
          <div className="relative w-full">
            {/*
              Gunakan <img> biasa (bukan next/image) agar SVG dari public/
              merender dengan width 100% height auto tanpa konfigurasi tambahan.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/maps/indonesia.svg"
              alt="Peta Indonesia — wilayah inspirasi Setitik Cultureware"
              width="100%"
              height="auto"
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />

            {/* Titik interaktif */}
            {locations.map((loc) => {
              const isActive = activeId === loc.id
              return (
                <button
                  key={loc.id}
                  onClick={() => toggle(loc.id)}
                  onMouseEnter={() => setHoveredCity(loc.id)}
                  onMouseLeave={() => setHoveredCity(null)}
                  aria-pressed={isActive}
                  aria-label={`${loc.name} — ${loc.subtitle}`}
                  style={{
                    position: 'absolute',
                    left: loc.leftPct,
                    top: loc.topPct,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                  }}
                  className="group"
                >
                  {/* Cincin outer — hanya saat aktif */}
                  {isActive && (
                    <span
                      className="absolute rounded-full"
                      style={{
                        width: '26px',
                        height: '26px',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '2px solid var(--color-brown)',
                        opacity: 0.6,
                      }}
                    />
                  )}

                  {/* Titik utama */}
                  <span
                    className="block rounded-full transition-all duration-200"
                    style={{
                      width: isActive ? '14px' : '10px',
                      height: isActive ? '14px' : '10px',
                      backgroundColor: '#ffffff',
                      border: '2px solid var(--color-brown)',
                      boxShadow: '0 1px 6px rgba(0,0,0,0.4)',
                    }}
                  />

                  {/* Tooltip nama kota — HANYA saat hover */}
                  {hoveredCity === loc.id && (
                    <span
                      className="font-sans pointer-events-none"
                      style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translate(-50%, -8px)',
                        zIndex: 50,
                        backgroundColor: '#ffffff',
                        color: 'var(--color-ink)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        fontSize: '13px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {loc.name}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Panel info kota */}
          <div className="w-full lg:w-72 min-h-[180px]">
            <AnimatePresence mode="wait">
              {displayedLocation ? (
                <motion.div
                  key={displayedId ?? 'empty'}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease }}
                  className="border border-sand p-6"
                >
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone mb-3">
                    {displayedLocation.subtitle}
                  </p>
                  <p className="font-serif text-xl text-ink leading-snug mb-4">
                    {displayedLocation.name}
                  </p>
                  <p className="font-sans text-sm text-stone leading-relaxed mb-6">
                    {displayedLocation.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-square bg-sand rounded-sm" />
                    <div className="aspect-square bg-sand rounded-sm" />
                  </div>
                  <p className="font-sans text-[10px] text-stone/60 italic leading-relaxed mt-4">
                    Arahkan kursor ke titik lain, atau klik untuk mengunci pilihan.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border border-dashed border-sand/60 p-6 min-h-[180px]
                             flex items-center justify-center"
                >
                  <p className="font-sans text-xs text-stone/60 italic text-center leading-relaxed">
                    Klik titik pada peta<br />untuk melihat informasi kota
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>

      </div>
    </section>
  )
}
