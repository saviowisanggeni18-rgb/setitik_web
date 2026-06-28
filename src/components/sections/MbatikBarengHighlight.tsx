'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { events } from '@/data/events'
import { buttonVariants } from '@/components/ui/Button'

const ease = [0.16, 1, 0.3, 1] as const

/* Stagger antar dua kolom (foto → konten) */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
}

/* Stagger di dalam kolom konten (label → heading → desc → event card → CTA) */
const contentColVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 1.0, ease } },
}

export default function MbatikBarengHighlight() {
  const nextEvent = events.find(
    (e) => e.status === 'open' && e.availableSlots > 0
  )

  return (
    <section className="py-24 px-6 bg-silk">
      <div className="max-w-6xl mx-auto">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
        >
          {/* Kolom kiri — foto muncul pertama */}
          <motion.div variants={itemVariants}>
            <div
              className="w-full aspect-[4/5] bg-sand rounded-sm"
              role="img"
              aria-label="Suasana kegiatan Mbatik Bareng di Kota Lama Semarang"
            />
          </motion.div>

          {/* Kolom kanan — nested stagger tiap elemen konten */}
          <motion.div
            variants={contentColVariants}
            className="flex flex-col gap-6"
          >
            <motion.p
              variants={itemVariants}
              className="font-sans text-xs uppercase tracking-[0.25em] text-stone"
            >
              Kegiatan
            </motion.p>

            <motion.h2
              variants={itemVariants}
              className="font-serif text-3xl md:text-4xl text-ink leading-tight"
            >
              Mbatik di jalanan,<br />bareng.
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="font-sans text-base text-stone leading-relaxed max-w-sm"
            >
              Setiap Kamis minggu ketiga, kami membuka ruang belajar membatik
              langsung di tepi jalan Kota Lama Semarang — terbuka untuk semua,
              tanpa perlu pengalaman sebelumnya.
            </motion.p>

            {/* Info event terdekat */}
            {nextEvent ? (
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-1.5 py-5 px-6 border border-sand self-start"
              >
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone mb-1">
                  Jadwal terdekat
                </p>
                <p className="font-serif text-lg text-ink">{nextEvent.displayDate}</p>
                <p className="font-sans text-sm text-stone">{nextEvent.time}</p>
                <p className="font-sans text-xs text-brown mt-1">
                  {nextEvent.availableSlots} tempat tersisa dari {nextEvent.totalSlots}
                </p>
              </motion.div>
            ) : (
              <motion.p variants={itemVariants} className="font-sans text-sm text-stone italic">
                Jadwal berikutnya segera diumumkan.
              </motion.p>
            )}

            <motion.div variants={itemVariants}>
              <Link
                href="/mbatik-bareng"
                className={buttonVariants({ variant: 'primary', size: 'md' })}
              >
                Saya Ikut Mbatik
              </Link>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
