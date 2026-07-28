'use client'

import { motion } from 'framer-motion'
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

export default function FounderQuoteSection({ section }: { section?: HomepageSection }) {
  return (
    <section className="overflow-hidden px-6 pb-12 pt-6 md:pb-16 md:pt-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -5% 0px' }}
          className="mb-8 grid items-end gap-6 md:mb-10 lg:grid-cols-[1fr_0.72fr]"
        >
          <div>
            <motion.div variants={itemVariants} className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-brown" />
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone">
                Dari pendiri
              </p>
            </motion.div>
            <motion.h2
              variants={itemVariants}
              className="font-serif text-4xl leading-tight text-ink md:text-5xl"
            >
              {section?.title && section.title !== 'Cerita pendiri' ? section.title : 'Jessie Setiawati'}
            </motion.h2>
          </div>

          <motion.div
            variants={itemVariants}
            className="border-l border-brown/30 pl-5 md:pl-7"
          >
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-brown">
              Founder &amp; Pembatik Tulis
            </p>
            <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-stone">
              {section?.description && section.description !== 'Bagian kutipan dan narasi pendiri Setitik.' ? section.description : 'Pendiri Setitik Cultureware, Semarang · sejak 2019.'}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12, margin: '0px 0px -5% 0px' }}
          className="relative lg:min-h-[670px]"
        >
          <motion.figure
            variants={itemVariants}
            className="relative h-[430px] overflow-hidden rounded-[24px] bg-sand shadow-[0_24px_70px_rgba(68,52,34,0.12)] sm:h-[570px] sm:rounded-[26px] lg:h-[670px] lg:w-[72%]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section?.imageUrl ?? '/images/founder/jessie-setiawati-v3.webp'}
              alt="Jessie Setiawati, Founder dan Pembatik Tulis Setitik Cultureware"
              className="h-full w-full object-cover"
              style={{ objectPosition: '45% center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/65 via-transparent to-black/5" />

            <div className="absolute left-5 top-5 flex items-center gap-3 rounded-full border border-white/30 bg-forest/25 px-4 py-2 backdrop-blur-md sm:left-7 sm:top-7">
              <span className="h-1.5 w-1.5 rounded-full bg-brown" />
              <p className="font-sans text-[8px] uppercase tracking-[0.2em] text-white/85">
                Profil pendiri
              </p>
            </div>

            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 text-silk sm:p-8">
              <div>
                <p className="font-sans text-[8px] uppercase tracking-[0.2em] text-white/55">
                  Bersama karya Setitik
                </p>
                <p className="mt-2 font-serif text-lg text-white sm:text-2xl">
                  Jessie Setiawati
                </p>
              </div>
              <p className="hidden max-w-[210px] text-right font-sans text-[9px] uppercase leading-relaxed tracking-[0.14em] text-white/45 sm:block">
                Batik · Arsitektur · Warisan
              </p>
            </figcaption>
          </motion.figure>

          <motion.aside
            variants={itemVariants}
            className="relative z-10 mt-4 overflow-hidden rounded-[24px] bg-forest p-6 text-silk shadow-[0_22px_60px_rgba(30,45,34,0.24)] sm:mx-8 sm:-mt-10 sm:p-10 lg:absolute lg:right-0 lg:top-1/2 lg:mx-0 lg:mt-0 lg:w-[43%] lg:-translate-y-1/2 lg:p-11"
          >
            <div className="flex items-center justify-between border-b border-silk/15 pb-6">
              <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-silk/45">
                Filosofi Setitik
              </p>
              <p className="font-sans text-[9px] uppercase tracking-[0.16em] text-brown">
                01 / Pendiri
              </p>
            </div>

            <span className="mt-6 block font-serif text-6xl leading-[0.6] text-brown sm:mt-8 sm:text-7xl" aria-hidden>
              “
            </span>

            <blockquote className="mt-6 font-serif text-[22px] leading-[1.42] text-silk sm:mt-7 sm:text-[28px]">
              Bangunan cagar budaya bukan hanya tentang masa lalu. Ia adalah cermin
              siapa kita hari ini, dan siapa yang akan kita tinggalkan untuk generasi
              berikutnya.
            </blockquote>

            <div className="mt-7 flex items-center gap-4 border-t border-silk/15 pt-6 sm:mt-9">
              <span className="h-11 w-px bg-brown" aria-hidden />
              <div>
                <p className="font-serif text-lg text-silk">Jessie Setiawati</p>
                <p className="mt-1 font-sans text-xs text-silk/50">
                  Founder &amp; Pembatik Tulis
                </p>
              </div>
            </div>

            <span className="pointer-events-none absolute -bottom-14 -right-4 font-serif text-[170px] leading-none text-silk/[0.025]">
              J
            </span>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  )
}
