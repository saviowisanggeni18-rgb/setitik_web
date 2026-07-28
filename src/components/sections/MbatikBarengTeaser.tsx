'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { events } from '@/data/events'
import { buttonVariants } from '@/components/ui/Button'

const ease = [0.22, 1, 0.36, 1] as const

export default function MbatikBarengTeaser() {
  const nextEvent = events.find(
    (e) => e.status === 'open' && e.availableSlots > 0
  )

  return (
    <section className="px-6 py-14 md:py-16">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.28, ease }}
          className="flex flex-col items-center text-center gap-6"
        >
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone">
            Kegiatan
          </p>

          <h2 className="font-serif text-3xl md:text-4xl text-ink leading-tight">
            Mbatik di jalanan,<br />bareng.
          </h2>

          <p className="font-sans text-base text-stone leading-relaxed max-w-sm">
            Setiap Kamis minggu ketiga, kami membuka ruang belajar membatik
            langsung di tepi jalan Kota Lama Semarang — terbuka untuk semua,
            tanpa perlu pengalaman sebelumnya.
          </p>

          {/* Event info — dari data statis */}
          {nextEvent ? (
            <div className="flex flex-col items-center gap-1.5 py-4 px-8 border border-sand">
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone mb-1">
                Jadwal terdekat
              </p>
              <p className="font-serif text-lg text-ink">{nextEvent.displayDate}</p>
              <p className="font-sans text-sm text-stone">
                {nextEvent.time}
              </p>
              <p className="font-sans text-xs text-brown mt-1">
                {nextEvent.availableSlots} tempat tersisa dari {nextEvent.totalSlots}
              </p>
            </div>
          ) : (
            <p className="font-sans text-sm text-stone italic">
              Jadwal berikutnya segera diumumkan.
            </p>
          )}

          <Link
            href="/mbatik-bareng"
            className={buttonVariants({ variant: 'primary', size: 'md' })}
          >
            Saya Ikut Mbatik
          </Link>

        </motion.div>
      </div>
    </section>
  )
}
