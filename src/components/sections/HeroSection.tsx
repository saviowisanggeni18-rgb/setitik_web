'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

/*
  Framer Motion config dari CLAUDE.md — lambat dan tenang (min 0.7s)
  Ease [0.22, 1, 0.36, 1] = kurva yang masuk cepat lalu melambat dengan anggun
*/
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

const ease = [0.22, 1, 0.36, 1] as const

/*
  Catatan untuk pengembang:
  Background saat ini adalah warna solid #D9D0C1 (bg-sand) sebagai placeholder.
  Ketika foto proses pembatikan tersedia:
  1. Ganti <div className="absolute inset-0 bg-sand" /> dengan <Image fill ... />
  2. Tambahkan overlay gelap: <div className="absolute inset-0 bg-ink/40" />
  3. Ganti warna teks dari text-ink/text-stone → text-silk/text-silk/70
*/
export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background placeholder — ganti dengan <Image> saat foto tersedia */}
      <div className="absolute inset-0 bg-sand" aria-hidden="true" />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-32">

        {/* Eyebrow */}
        <motion.p
          {...fadeInUp}
          transition={{ duration: 0.7, ease, delay: 0 }}
          className="font-sans text-[11px] uppercase tracking-[0.35em] text-stone mb-10"
        >
          Kota Lama Semarang&ensp;·&ensp;Sejak 2019
        </motion.p>

        {/* Headline utama — dua baris, serif, tidak bold */}
        <motion.h1
          {...fadeInUp}
          transition={{ duration: 0.8, ease, delay: 0.12 }}
          className="font-serif text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.1] max-w-3xl"
        >
          Setitik demi setitik,
        </motion.h1>

        <motion.p
          {...fadeInUp}
          transition={{ duration: 0.8, ease, delay: 0.22 }}
          className="font-serif text-5xl md:text-6xl lg:text-7xl text-brown leading-[1.1] max-w-3xl mb-10"
        >
          menjadi semakin berarti.
        </motion.p>

        {/* Subheading */}
        <motion.p
          {...fadeInUp}
          transition={{ duration: 0.7, ease, delay: 0.38 }}
          className="font-sans text-sm md:text-base text-stone max-w-md leading-relaxed"
        >
          Batik kontemporer yang lahir dari observasi lapangan — mengabadikan
          ornamen arsitektur bangunan cagar budaya ke dalam helai kain.
        </motion.p>
      </div>

      {/* Scroll prompt — muncul terakhir, menghilang saat scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease, delay: 0.65 }}
        className="relative z-10 pb-10 flex flex-col items-center gap-2"
      >
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-stone/50">
          Gulir ke bawah
        </span>

        {/* Chevron dengan animasi bounce lambat (infinite) */}
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{
            duration: 2.2,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
        >
          <ChevronDown size={14} className="text-stone/40" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  )
}
