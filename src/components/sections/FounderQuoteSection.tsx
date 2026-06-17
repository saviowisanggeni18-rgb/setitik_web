'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function FounderQuoteSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

          {/* Kiri — foto founder placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease }}
          >
            {/*
              Placeholder foto Jessie Setiawati.
              Ganti dengan <Image> saat foto tersedia.
              Rasio 3:4 (portrait) — lebih personal dari persegi.
            */}
            <div
              className="w-full aspect-[3/4] bg-sand rounded-sm"
              role="img"
              aria-label="Foto Jessie Setiawati, Founder & Pembatik Tulis Setitik Cultureware"
            />
          </motion.div>

          {/* Kanan — kutipan */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            className="flex flex-col justify-center"
          >
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-8">
              Dari pendiri
            </p>

            <blockquote className="font-serif text-2xl md:text-3xl text-ink leading-[1.45] mb-10">
              &ldquo;Bangunan cagar budaya bukan hanya tentang masa lalu.
              Ia adalah cermin siapa kita hari ini, dan siapa yang akan
              kita tinggalkan untuk generasi berikutnya.&rdquo;
            </blockquote>

            {/* Attributi */}
            <div className="border-l-2 border-brown pl-5">
              <p className="font-serif text-lg text-ink">Jessie Setiawati</p>
              <p className="font-sans text-sm text-stone mt-1">
                Founder &amp; Pembatik Tulis
              </p>
              <p className="font-sans text-xs text-stone/60 mt-0.5">
                Setitik Cultureware · Semarang, sejak 2019
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
