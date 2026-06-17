'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const steps = [
  {
    number: '01',
    phase: 'Observasi',
    title: 'Bangunan',
    caption:
      'Setiap motif dimulai dari kunjungan langsung ke bangunan cagar budaya — mengamati ornamen, fasad, dan detail arsitektur yang tak ternilai.',
    imageLabel: 'Foto bangunan cagar budaya Kota Lama Semarang',
  },
  {
    number: '02',
    phase: 'Desain',
    title: 'Motif',
    caption:
      'Detail arsitektur diterjemahkan menjadi sketsa tangan, lalu didigitalisasi menjadi tatanan motif batik yang harmonis di atas kertas.',
    imageLabel: 'Sketsa dan vektorisasi motif dari ornamen bangunan',
  },
  {
    number: '03',
    phase: 'Pengerjaan',
    title: 'Kain',
    caption:
      'Motif dikerjakan oleh tangan pengrajin terlatih dengan canting dan malam — satu helai batik tulis bisa memakan berminggu-minggu.',
    imageLabel: 'Kain batik jadi dengan motif cagar budaya',
  },
] as const

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2 },
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

export default function BuildingToFabricSection() {
  return (
    <section className="py-24 px-6 bg-silk">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-4">
            Proses
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink leading-tight">
            Dari bangunan ke kain
          </h2>
        </motion.div>

        {/* Three columns — stagger on scroll */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12"
        >
          {steps.map(({ number, phase, title, caption, imageLabel }) => (
            <motion.div key={number} variants={itemVariants} className="flex flex-col">

              {/* Image placeholder — h-52 md:h-60 ensures identical height across all three columns */}
              <div
                className="w-full h-52 md:h-60 bg-sand rounded-sm mb-6 flex-none"
                role="img"
                aria-label={imageLabel}
              />

              {/* Step label with horizontal rule */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone tabular-nums">
                  {number}
                </span>
                <span className="flex-1 h-px bg-sand" />
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brown">
                  {phase}
                </span>
              </div>

              <h3 className="font-serif text-2xl text-ink mb-3">{title}</h3>
              <p className="font-sans text-sm text-stone leading-relaxed">{caption}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
