'use client'

import { motion } from 'framer-motion'
import type { HomepageSection } from '@/lib/homepage-sections'

const ease = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease } },
}

const impactStories = [
  {
    number: '01',
    label: 'Pemberdayaan',
    title: 'Pemberdayaan Ibu-ibu',
    image: '/images/mbatik-bareng/mbatik-jalanan-03.webp',
    position: 'center 72%',
    body: 'Ibu-ibu buruh pabrik di sekitar Kabupaten Semarang yang terdampak pandemi dilatih mengolah kain batik menjadi produk siap pakai, menciptakan sumber penghasilan baru.',
  },
  {
    number: '02',
    label: 'Pelestarian',
    title: 'Pelestarian Kampung Batik',
    image: '/images/editorial/founder-canting.webp',
    position: 'center',
    body: 'Pembatik tulis di Kampung Batik Semarang menjadi mitra utama Setitik agar keahlian yang jumlah pelakunya terus berkurang tetap hidup dan mendapat ruang.',
  },
  {
    number: '03',
    label: 'Kolaborasi',
    title: 'Motif Benteng Willem I',
    image: '/images/impact/motif-benteng-willem-1.jpeg',
    position: 'center 56%',
    body: 'Motif Benteng Willem I lahir dari kolaborasi dengan Lapas 2A Ambarawa. Warga binaan belajar membatik dan mengubah keahlian baru menjadi karya yang bermakna serta berdampak.',
  },
]

const impactFlow = [
  {
    title: 'Belajar',
    body: 'Pelatihan membatik dan pendampingan proses produksi.',
  },
  {
    title: 'Mengolah',
    body: 'Kain dan motif cagar budaya diterjemahkan menjadi produk siap pakai.',
  },
  {
    title: 'Menghidupkan',
    body: 'Keterampilan, cerita bangunan, dan peluang kerja terus bergerak bersama komunitas.',
  },
]

export default function ImpactAnimated({ section }: { section?: HomepageSection }) {
  return (
    <main className="overflow-hidden px-5 py-8 sm:px-6 md:py-12">
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto grid max-w-7xl overflow-hidden rounded-[34px] border border-sand bg-forest text-silk shadow-[0_30px_90px_rgba(39,55,43,0.22)] lg:grid-cols-[0.92fr_1.08fr]"
      >
        <motion.div variants={itemVariants} className="relative min-h-[430px] p-7 sm:p-10 lg:min-h-[680px] lg:p-12">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section?.imageUrl ?? '/images/mbatik-bareng/mbatik-jalanan-04.webp'}
              alt="Kegiatan membatik bersama Setitik"
              className="h-full w-full object-cover"
              style={{ objectPosition: 'center 68%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-forest/55 via-forest/38 to-forest/90" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="inline-flex items-center gap-3 rounded-full border border-silk/25 bg-silk/10 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.25em] text-silk/70 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-brown" />
                Dampak Setitik
              </p>
              <h1 className="mt-8 max-w-xl font-serif text-5xl leading-[0.98] text-white sm:text-6xl lg:text-7xl">
                {section?.title ?? <><span>Budaya yang hidup,</span><span className="block italic text-brown">komunitas yang bergerak.</span></>}
              </h1>
            </div>

            <div className="mt-8 grid gap-3 border-t border-silk/18 pt-6 sm:grid-cols-3">
              {impactFlow.map((item) => (
                <div key={item.title} className="rounded-2xl bg-silk/10 p-4 backdrop-blur-md">
                  <p className="font-serif text-xl text-white">{item.title}</p>
                  <p className="mt-2 font-sans text-[11px] leading-relaxed text-silk/58">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="relative bg-cream p-5 text-ink sm:p-8 lg:p-10">
          <motion.div variants={itemVariants} className="grid gap-6 border-b border-sand pb-7 md:grid-cols-[0.82fr_1fr] md:items-end">
            <div className="max-w-sm">
              <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-brown">Program utama</p>
              <h2 className="mt-4 font-serif text-[38px] leading-[0.98] md:text-5xl">Dampak yang dikerjakan.</h2>
            </div>
            <p className="border-l border-brown/35 pl-5 font-sans text-sm leading-[1.8] text-stone">
              {section?.description ?? 'Setitik bekerja bersama komunitas dan pengrajin agar pelestarian budaya juga menghasilkan manfaat ekonomi yang nyata.'}
            </p>
          </motion.div>

          <motion.div variants={containerVariants} className="mt-7 grid gap-5">
            {impactStories.map((story, index) => (
              <motion.article
                key={story.title}
                variants={itemVariants}
                className="group grid overflow-hidden rounded-[24px] border border-sand bg-paper shadow-[0_18px_45px_rgba(60,45,28,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_58px_rgba(60,45,28,0.11)] sm:grid-cols-[0.64fr_1fr]"
              >
                {story.image && (
                  <div className="relative min-h-[230px] sm:min-h-[260px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={story.image}
                      alt={story.title}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: story.position }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-forest/5 to-transparent" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-paper/92 px-3.5 py-2 font-sans text-[8px] uppercase tracking-[0.18em] text-stone shadow-sm backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-brown" />
                      {story.label}
                    </span>
                    <span className="absolute bottom-4 right-4 font-serif text-5xl leading-none text-white/92 drop-shadow">
                      {story.number}
                    </span>
                  </div>
                )}

                <div className="flex min-h-[230px] flex-col justify-center p-6 sm:min-h-[260px] sm:p-7">
                  <div className="max-w-md">
                    <p className="font-sans text-[8px] uppercase tracking-[0.22em] text-brown">
                      Program {story.number}
                    </p>
                    <h3 className="mt-3 font-serif text-[30px] leading-[1.04] text-ink md:text-4xl">{story.title}</h3>
                    <div className="mt-5 h-px w-full bg-sand" />
                    <p className="mt-5 font-sans text-sm leading-[1.78] text-stone">{story.body}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}
