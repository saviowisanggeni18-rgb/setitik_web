'use client'

import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const

/* Stagger antar dua kolom (foto → kutipan) */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.25 } },
}

/* Stagger di dalam kolom kutipan (label → blockquote → attribution) */
const quoteColVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 1.0, ease } },
}

export default function FounderQuoteSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center"
        >
          {/* Foto — muncul pertama */}
          <motion.div variants={itemVariants}>
            <div
              className="w-full aspect-[3/4] bg-sand rounded-sm"
              role="img"
              aria-label="Foto Jessie Setiawati, Founder & Pembatik Tulis Setitik Cultureware"
            />
          </motion.div>

          {/* Kutipan — nested stagger: label → blockquote → attribution */}
          <motion.div variants={quoteColVariants} className="flex flex-col justify-center">
            <motion.p
              variants={itemVariants}
              className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-8"
            >
              Dari pendiri
            </motion.p>

            <motion.blockquote
              variants={itemVariants}
              className="font-serif text-2xl md:text-3xl text-ink leading-[1.45] mb-10"
            >
              &ldquo;Bangunan cagar budaya bukan hanya tentang masa lalu.
              Ia adalah cermin siapa kita hari ini, dan siapa yang akan
              kita tinggalkan untuk generasi berikutnya.&rdquo;
            </motion.blockquote>

            <motion.div variants={itemVariants} className="border-l-2 border-brown pl-5">
              <p className="font-serif text-lg text-ink">Jessie Setiawati</p>
              <p className="font-sans text-sm text-stone mt-1">
                Founder &amp; Pembatik Tulis
              </p>
              <p className="font-sans text-xs text-stone/60 mt-0.5">
                Setitik Cultureware · Semarang, sejak 2019
              </p>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
