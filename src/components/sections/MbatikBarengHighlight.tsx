'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import type { MbatikEvent } from '@/lib/mbatik-events'
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

const photos = [
  {
    src: '/images/mbatik-bareng/mbatik-jalanan-04.webp',
    alt: 'Peserta mengikuti kegiatan Mbatik Bareng di tepi jalan Kota Lama',
    position: 'center',
    main: true,
  },
  {
    src: '/images/mbatik-bareng/mbatik-jalanan-02.webp',
    alt: 'Peserta belajar menggunakan canting di depan bangunan Kota Lama',
    position: 'center',
    main: false,
  },
  {
    src: '/images/mbatik-bareng/mbatik-jalanan-05.webp',
    alt: 'Display kain Mbatik di Jalanan Setitik',
    position: 'center',
    main: false,
  },
  {
    src: '/images/mbatik-bareng/mbatik-jalanan-03.webp',
    alt: 'Peserta duduk melingkar belajar membatik bersama',
    position: 'center',
    main: false,
  },
] as const

export default function MbatikBarengHighlight({
  events,
  section,
}: {
  events: MbatikEvent[]
  section?: HomepageSection
}) {
  const nextEvent = events.find(
    (event) => event.status === 'open' && event.availableSlots > 0,
  )

  return (
    <section className="overflow-hidden bg-silk px-6 pb-12 pt-6 md:pb-16 md:pt-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12, margin: '0px 0px -5% 0px' }}
        className="mx-auto grid max-w-7xl overflow-hidden rounded-[30px] bg-forest shadow-[0_30px_85px_rgba(30,45,34,0.2)] lg:grid-cols-[0.78fr_1.22fr]"
      >
        <motion.div
          variants={itemVariants}
          className="order-2 flex flex-col p-7 text-silk sm:p-10 lg:order-1 lg:p-12"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-brown" />
            <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-silk/55">
              Mbatik Bareng
            </p>
          </div>

          <h2 className="mt-6 max-w-md font-serif text-4xl leading-[1.05] text-silk md:text-5xl">
            {section?.title && section.title !== 'Ajakan kegiatan' ? section.title : <>Mbatik di jalanan,<span className="block italic text-brown">bersama.</span></>}
          </h2>

          <p className="mt-5 max-w-md font-sans text-sm leading-[1.85] text-silk/65">
            {section?.description && section.description !== 'Bagian ajakan mengikuti kegiatan Mbatik Bareng.' ? section.description : 'Kegiatan membatik bersama Setitik di tepi jalan Kota Lama Semarang. Terbuka untuk umum dan peserta tidak perlu memiliki pengalaman membatik sebelumnya.'}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {['Kamis minggu ketiga', 'Terbuka untuk umum', 'Kota Lama Semarang'].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-silk/15 px-3.5 py-2 font-sans text-[8px] uppercase tracking-[0.14em] text-silk/55"
                >
                  {label}
                </span>
              ),
            )}
          </div>

          <div className="mt-7 border-t border-silk/15 pt-6">
            {nextEvent ? (
              <div>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-silk/45">
                    Jadwal terdekat
                  </p>
                  <p className="font-sans text-[9px] uppercase tracking-[0.16em] text-brown">
                    {nextEvent.availableSlots} tempat tersedia
                  </p>
                </div>

                <p className="mt-4 font-serif text-2xl text-silk">
                  {nextEvent.displayDate}
                </p>

                <div className="mt-4 grid gap-3 font-sans text-xs text-silk/58">
                  <p className="flex items-center gap-2.5">
                    <CalendarDays size={14} className="text-brown" aria-hidden />
                    {nextEvent.time}
                  </p>
                  <p className="flex items-center gap-2.5">
                    <MapPin size={14} className="text-brown" aria-hidden />
                    {nextEvent.location}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-silk/45">
                  Jadwal berikutnya
                </p>
                <p className="mt-3 font-serif text-xl text-silk">
                  Segera diumumkan.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Link
              href="/mbatik-bareng"
              className="group inline-flex items-center gap-3 rounded-full bg-silk px-6 py-3.5 font-sans text-[9px] uppercase tracking-[0.17em] text-forest transition-colors duration-200 hover:bg-brown hover:text-silk"
            >
              Lihat Mbatik Bareng
              <ArrowUpRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="order-1 grid min-h-[620px] gap-2 bg-silk/5 p-2 sm:grid-cols-[1.12fr_0.88fr] sm:grid-rows-3 lg:order-2 lg:min-h-[700px]"
        >
          {photos.map((photo, index) => (
            <motion.figure
              key={photo.src}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-[20px] bg-sand ${
                photo.main ? 'sm:row-span-3' : 'min-h-[210px]'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={index === 0 && section?.imageUrl ? section.imageUrl : photo.src}
                alt={photo.alt}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: photo.position }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-transparent to-black/5" />

              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                <div>
                  <p className="font-sans text-[7px] uppercase tracking-[0.2em] text-white/55">
                    Dokumentasi kegiatan
                  </p>
                  <p className="mt-1 font-serif text-sm text-white sm:text-lg">
                    Mbatik Bareng
                  </p>
                </div>
                <span className="font-sans text-[8px] tracking-[0.14em] text-white/55">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
