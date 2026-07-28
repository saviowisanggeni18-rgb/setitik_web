'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minimize2 } from 'lucide-react'
import type { HomepageSection } from '@/lib/homepage-sections'

const ease = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease } },
}

interface Location {
  id: string
  name: string
  subtitle: string
  description: string
  landmark: string
  image: string
  photoCredit: string
  photoSource: string
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
    landmark: 'Gereja Blenduk',
    image: '/images/locations/semarang-gereja-blenduk.jpg',
    photoCredit: 'Herusutimbul · CC BY-SA 4.0',
    photoSource:
      'https://commons.wikimedia.org/wiki/File:Gereja_Blenduk_Kota-Lama_Semarang.jpg',
    leftPct: '33.84%',
    topPct:  '76.03%',
  },
  {
    id: 'jakarta',
    name: 'Jakarta',
    subtitle: 'Kawasan Kota Tua',
    description:
      'Warisan arsitektur kolonial yang berbagi DNA visual dengan Kota Lama. Motif-motifnya turut hadir dalam belanja Heritage Travel Journal edisi Jakarta.',
    landmark: 'Museum Fatahillah',
    image: '/images/locations/jakarta-museum-fatahillah.jpg',
    photoCredit: 'Herusutimbul · CC BY-SA 4.0',
    photoSource:
      'https://commons.wikimedia.org/wiki/File:Museum_Fatahilah.jpg',
    leftPct: '27.96%',
    topPct:  '69.84%',
  },
  {
    id: 'bandung',
    name: 'Bandung',
    subtitle: 'Arsitektur Art Deco',
    description:
      'Deretan bangunan art deco Bandung menjadi referensi bagi motif-motif masa depan yang sedang dalam penelitian dan pengembangan.',
    landmark: 'Gedung Merdeka',
    image: '/images/locations/bandung-gedung-merdeka.jpg',
    photoCredit: 'Psetiadharma · Domain publik',
    photoSource:
      'https://commons.wikimedia.org/wiki/File:Gedung_Merdeka_Bandung.JPG',
    leftPct: '29.46%',
    topPct:  '73.48%',
  },
  {
    id: 'yogyakarta',
    name: 'Yogyakarta',
    subtitle: 'Pusat tradisi batik',
    description:
      'Tempat kami belajar dan berdialog dengan para empu batik. Tradisi membatik Yogyakarta menjadi akar teknis dari setiap helai Setitik.',
    landmark: 'Gerbang Taman Sari',
    image: '/images/locations/yogyakarta-taman-sari.jpg',
    photoCredit: 'Fathiya Rahmani · CC BY-SA 4.0',
    photoSource:
      'https://commons.wikimedia.org/wiki/File:Gerbang_Pemandian_Taman_Sari.jpg',
    leftPct: '35.01%',
    topPct:  '78.97%',
  },
]

export default function InspirationMapSection({ section }: { section?: HomepageSection }) {
  const [activeId, setActiveId] = useState<string | null>('semarang')
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [zoomedId, setZoomedId] = useState<string | null>(null)
  const displayedId = activeId
  const displayedLocation = locations.find((l) => l.id === displayedId) ?? null
  const zoomedLocation = locations.find((l) => l.id === zoomedId) ?? null
  const displayedIndex = Math.max(
    0,
    locations.findIndex((location) => location.id === displayedId),
  )
  const zoomScale = zoomedLocation ? 2.8 : 1
  const zoomX = zoomedLocation
    ? 50 - zoomScale * parseFloat(zoomedLocation.leftPct)
    : 0
  const zoomY = zoomedLocation
    ? 50 - zoomScale * parseFloat(zoomedLocation.topPct)
    : 0

  const focusLocation = (id: string) => {
    setActiveId(id)
    setHoveredCity(null)
    setZoomedId((current) => (current === id ? null : id))
  }

  return (
    <section className="px-6 pb-6 pt-12 md:pb-8 md:pt-16">
      <div className="mx-auto max-w-7xl">

        {/* Header — stagger: label → heading → description */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="mb-8 grid items-end gap-6 md:mb-10 lg:grid-cols-[1fr_0.8fr]"
        >
          <div>
            <motion.p
              variants={itemVariants}
              className="mb-4 font-sans text-xs uppercase tracking-[0.25em] text-stone"
            >
              Wilayah
            </motion.p>
            <motion.h2
              variants={itemVariants}
              className="font-serif text-4xl leading-[1.05] text-ink md:text-5xl"
            >
              {section?.title && section.title !== 'Peta lokasi inspirasi' ? section.title : 'Sumber inspirasi'}
            </motion.h2>
          </div>
          <motion.div
            variants={itemVariants}
            className="border-l border-brown/30 pl-5 md:pl-7"
          >
            <p className="max-w-lg font-sans text-sm leading-relaxed text-stone md:text-[15px]">
              {section?.description && section.description !== 'Bagian peta bangunan dan kota yang menjadi sumber inspirasi.' ? section.description : 'Setiap kota menyimpan arsitektur yang belum habis diceritakan. Pilih titik untuk mendekat, lalu temukan cerita di balik motifnya.'}
            </p>
          </motion.div>
        </motion.div>

        {/* Peta + Info panel — muncul setelah header selesai */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="grid overflow-hidden rounded-[26px] border border-sand/80 bg-silk shadow-[0_24px_70px_rgba(68,52,34,0.09)] lg:grid-cols-[minmax(0,1.7fr)_minmax(330px,0.72fr)]"
        >

          {/* Container peta */}
          <div className="flex min-w-0 flex-col p-5 sm:p-7 lg:p-9">
            <div className="mb-6 flex items-center justify-end gap-4">
              <p className="hidden font-sans text-[10px] uppercase tracking-[0.16em] text-stone/60 sm:block">
                04 kota pilihan
              </p>
            </div>

            <div className="relative w-full overflow-hidden rounded-2xl border border-sand/70 bg-cream">
              <motion.div
                className="relative w-full"
                animate={{
                  x: `${zoomX}%`,
                  y: `${zoomY}%`,
                  scale: zoomScale,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 28,
                  mass: 0.6,
                }}
                style={{ transformOrigin: 'top left' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/maps/indonesia.svg"
                  alt="Peta Indonesia — wilayah inspirasi Setitik Cultureware"
                  width="100%"
                  height="auto"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />

                {locations.map((loc) => {
                  const isActive = activeId === loc.id
                  return (
                    <button
                      key={loc.id}
                      onClick={() => focusLocation(loc.id)}
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
                      <span
                        className="block rounded-full transition-all duration-200"
                        style={{
                          width: isActive ? '12px' : '10px',
                          height: isActive ? '12px' : '10px',
                          backgroundColor: '#ffffff',
                          border: '2px solid var(--color-brown)',
                          boxShadow: isActive
                            ? '0 2px 8px rgba(68,52,34,0.22)'
                            : '0 1px 5px rgba(68,52,34,0.18)',
                        }}
                      />

                      {hoveredCity === loc.id && !zoomedId && (
                        <span className="pointer-events-none absolute bottom-full left-1/2 z-50 -translate-x-1/2 -translate-y-2 whitespace-nowrap rounded-md bg-forest px-3 py-1.5 font-sans text-xs font-medium text-silk shadow-lg">
                          {loc.name}
                        </span>
                      )}
                    </button>
                  )
                })}
              </motion.div>

              <AnimatePresence mode="wait">
                {zoomedLocation && (
                  <motion.figure
                    key={zoomedLocation.id}
                    initial={{ opacity: 0, x: -8, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -6, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.22, ease }}
                    className="relative z-20 mx-3 mb-3 mt-3 w-[calc(100%-1.5rem)] overflow-hidden rounded-xl border border-white/70 bg-silk shadow-[0_16px_45px_rgba(31,38,29,0.18)] sm:absolute sm:bottom-4 sm:left-4 sm:m-0 sm:w-64 sm:shadow-[0_16px_45px_rgba(31,38,29,0.24)]"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-sand">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={zoomedLocation.image}
                        alt={`${zoomedLocation.landmark}, ${zoomedLocation.name}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/35 to-transparent" />
                      <p className="absolute left-3 top-2.5 font-sans text-[8px] uppercase tracking-[0.2em] text-white/90">
                        Landmark pilihan
                      </p>
                    </div>
                    <figcaption className="flex items-end justify-between gap-3 px-3.5 py-3 sm:px-4">
                      <div className="min-w-0">
                        <p className="font-serif text-base leading-tight text-ink sm:text-lg">
                          {zoomedLocation.landmark}
                        </p>
                        <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.14em] text-stone">
                          {zoomedLocation.name}
                        </p>
                      </div>
                      <a
                        href={zoomedLocation.photoSource}
                        target="_blank"
                        rel="noreferrer"
                        title={`Foto: ${zoomedLocation.photoCredit}`}
                        aria-label={`Sumber foto ${zoomedLocation.landmark}: ${zoomedLocation.photoCredit}`}
                        className="shrink-0 font-sans text-[8px] uppercase tracking-[0.12em] text-stone/45 transition-colors hover:text-brown"
                      >
                        Sumber
                      </a>
                    </figcaption>
                  </motion.figure>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {zoomedLocation && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.18 }}
                    onClick={() => setZoomedId(null)}
                    className="absolute right-3 top-3 z-30 flex items-center gap-2 rounded-full border border-sand bg-silk/95 px-3 py-2 font-sans text-[8px] uppercase tracking-[0.12em] text-stone shadow-md backdrop-blur-md transition-colors hover:border-brown hover:text-brown sm:right-4 sm:top-4 sm:px-3.5 sm:text-[9px] sm:tracking-[0.14em]"
                    aria-label="Kembali ke peta Indonesia"
                  >
                    <Minimize2 size={13} aria-hidden />
                    Lihat Indonesia
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {locations.map((location, index) => {
                const isActive = activeId === location.id
                return (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => focusLocation(location.id)}
                    onMouseEnter={() => setHoveredCity(location.id)}
                    onMouseLeave={() => setHoveredCity(null)}
                    aria-pressed={isActive}
                    className={`group flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200 ${
                      isActive
                        ? 'border-forest bg-forest text-silk shadow-md'
                        : 'border-sand/70 bg-cream/40 text-stone hover:border-brown/50 hover:bg-cream'
                    }`}
                  >
                    <span
                      className={`font-sans text-[9px] tracking-[0.12em] ${
                        isActive ? 'text-silk/50' : 'text-stone/45'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="truncate font-sans text-[11px] font-medium">
                      {location.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Panel info kota */}
          <div className="relative min-h-[410px] overflow-hidden border-t border-forest/10 bg-forest lg:min-h-full lg:border-l lg:border-t-0">
            <AnimatePresence mode="wait">
              {displayedLocation ? (
                <motion.div
                  key={displayedId ?? 'empty'}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease }}
                  className="relative z-10 flex h-full min-h-[410px] flex-col p-7 sm:p-9 lg:min-h-[520px] lg:p-10"
                >
                  <div className="flex items-center justify-between border-b border-silk/15 pb-6">
                    <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-silk/55">
                      Cerita wilayah
                    </p>
                    <p className="font-sans text-[10px] tracking-[0.14em] text-silk/40">
                      {String(displayedIndex + 1).padStart(2, '0')} / {String(locations.length).padStart(2, '0')}
                    </p>
                  </div>

                  <div className="pt-8">
                    <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.2em] text-silk/55">
                      {displayedLocation.subtitle}
                    </p>
                    <p className="font-serif text-4xl leading-none text-silk lg:text-[42px]">
                      {displayedLocation.name}
                    </p>
                    <span className="mt-6 block h-px w-12 bg-brown" />
                    <p className="mt-6 font-sans text-sm leading-[1.85] text-silk/70">
                      {displayedLocation.description}
                    </p>
                  </div>

                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex min-h-[410px] items-center justify-center p-8"
                >
                  <p className="text-center font-sans text-xs italic leading-relaxed text-silk/60">
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
