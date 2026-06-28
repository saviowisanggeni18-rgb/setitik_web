'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const ease = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 1.0, ease } },
}

/*
  Pola zigzag: gambar dan teks bertukar posisi kiri-kanan setiap baris.
  - Baris 01: gambar KIRI  (55%), teks KANAN (flex-1)
  - Baris 02: gambar KANAN (55%), teks KIRI  (flex-1)  ← flex-row-reverse
  - Baris 03: gambar KIRI  (55%), teks KANAN (flex-1)
*/
const steps = [
  {
    number: '01',
    phase: 'Observasi',
    title: 'Bangunan',
    caption:
      'Setiap motif dimulai dari kunjungan langsung ke bangunan cagar budaya — mengamati ornamen, fasad, dan detail arsitektur yang tak ternilai.',
    imageLabel: 'Foto bangunan cagar budaya Kota Lama Semarang',
    isReversed: false,
  },
  {
    number: '02',
    phase: 'Desain',
    title: 'Motif',
    caption:
      'Detail arsitektur diterjemahkan menjadi sketsa tangan, lalu didigitalisasi menjadi tatanan motif batik yang harmonis di atas kertas.',
    imageLabel: 'Sketsa dan vektorisasi motif dari ornamen bangunan',
    isReversed: true,
  },
  {
    number: '03',
    phase: 'Pengerjaan',
    title: 'Kain',
    caption:
      'Motif dikerjakan oleh tangan pengrajin terlatih dengan canting dan malam — satu helai batik tulis bisa memakan berminggu-minggu.',
    imageLabel: 'Kain batik jadi dengan motif cagar budaya',
    isReversed: false,
  },
] as const

export default function BuildingToFabricSection() {
  return (
    <section className="py-24 px-6 bg-silk">
      <div className="max-w-6xl mx-auto">

        {/* Header — stagger: label → heading */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="text-center mb-20"
        >
          <motion.p
            variants={itemVariants}
            className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-4"
          >
            Proses
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="font-serif text-3xl md:text-4xl text-ink leading-tight"
          >
            Dari bangunan ke kain
          </motion.h2>
        </motion.div>

        {/* Rows — stagger tiap baris satu per satu */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1, margin: "0px 0px -5% 0px" }}
          className="space-y-20"
        >
          {steps.map(({ number, phase, title, caption, imageLabel, isReversed }) => (
            <motion.div
              key={number}
              variants={itemVariants}
              className={cn(
                'flex flex-col md:flex-row items-center gap-10 md:gap-14',
                isReversed && 'md:flex-row-reverse'
              )}
            >
              {/* Gambar */}
              <div
                className="w-full md:w-[55%] flex-none aspect-[4/3] bg-sand rounded-sm"
                role="img"
                aria-label={imageLabel}
              />

              {/* Teks */}
              <div className="w-full md:flex-1">
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone tabular-nums">
                    {number}
                  </span>
                  <span className="flex-1 h-px bg-sand" />
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-brown">
                    {phase}
                  </span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4 leading-tight">
                  {title}
                </h3>
                <p className="font-sans text-sm text-stone leading-relaxed">
                  {caption}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
