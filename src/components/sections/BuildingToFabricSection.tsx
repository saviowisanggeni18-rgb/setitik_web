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

const steps = [
  {
    number: '01',
    phase: 'Observasi',
    title: 'Bangunan',
    caption:
      'Setiap motif dimulai dari kunjungan langsung ke bangunan cagar budaya—mengamati ornamen, fasad, dan detail arsitektur yang tak ternilai.',
    image: '/images/locations/semarang-gereja-blenduk.jpg',
    imageLabel: 'Gereja Blenduk di kawasan Kota Lama Semarang',
    imagePosition: 'center',
    note: 'Membaca detail yang sering terlewat.',
    reversed: false,
    dark: false,
  },
  {
    number: '02',
    phase: 'Desain',
    title: 'Motif',
    caption:
      'Detail arsitektur diterjemahkan menjadi sketsa tangan, kemudian disusun menjadi ritme motif batik yang harmonis dan tetap menyimpan karakter bangunan.',
    image: '/images/products/taplak-blenduk.png',
    imageLabel: 'Susunan motif batik yang terinspirasi ornamen bangunan',
    imagePosition: 'center',
    note: 'Arsitektur diterjemahkan menjadi bahasa pola.',
    reversed: true,
    dark: true,
  },
  {
    number: '03',
    phase: 'Pengerjaan',
    title: 'Kain',
    caption:
      'Motif kemudian hadir di atas kain melalui tangan pengrajin. Dari proses yang teliti, lahirlah karya yang membawa cerita kota ke dalam keseharian.',
    image: '/images/products/batik-tulis-blenduk-2.webp',
    imageLabel: 'Kain batik bermotif cagar budaya yang telah selesai',
    imagePosition: 'center 48%',
    note: 'Cerita kota hidup di setiap helai.',
    reversed: false,
    dark: false,
  },
] as const

export default function BuildingToFabricSection({ section }: { section?: HomepageSection }) {
  return (
    <section id="proses" className="overflow-hidden bg-silk px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -5% 0px' }}
          className="mb-8 grid items-end gap-6 md:mb-10 lg:grid-cols-[1fr_0.78fr]"
        >
          <div>
            <motion.p
              variants={itemVariants}
              className="mb-4 font-sans text-xs uppercase tracking-[0.25em] text-stone"
            >
              Proses
            </motion.p>
            <motion.h2
              variants={itemVariants}
              className="max-w-xl font-serif text-4xl leading-[1.05] text-ink md:text-5xl"
            >
              {section?.title && section.title !== 'Cerita inspirasi motif' ? section.title : <>Dari bangunan<span className="block italic text-brown">menjadi cerita.</span></>}
            </motion.h2>
          </div>

          <motion.div
            variants={itemVariants}
            className="border-l border-brown/30 pl-5 md:pl-7"
          >
            <p className="max-w-lg font-sans text-sm leading-relaxed text-stone md:text-[15px]">
              {section?.description && section.description !== 'Bagian yang menjelaskan proses membaca ornamen bangunan menjadi motif.' ? section.description : 'Sebuah perjalanan dari detail arsitektur menuju karya yang dapat dikenakan. Ikuti setiap tahap untuk melihat bagaimana cerita itu dibentuk.'}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.08, margin: '0px 0px -5% 0px' }}
          className="relative"
        >
          <div className="pointer-events-none absolute bottom-10 left-1/2 top-10 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brown/25 to-transparent lg:block" />

          {steps.map((step, index) => (
            <div key={step.number}>
              <motion.article
                variants={itemVariants}
                className="relative z-10 grid overflow-hidden rounded-[26px] border border-sand/80 bg-cream shadow-[0_22px_65px_rgba(68,52,34,0.09)] lg:min-h-[510px] lg:grid-cols-12"
              >
                <div
                  className={`relative min-h-[340px] overflow-hidden sm:min-h-[430px] lg:col-span-7 lg:min-h-[510px] ${
                    step.reversed ? 'lg:order-2' : ''
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={index === 0 && section?.imageUrl ? section.imageUrl : step.image}
                    alt={step.imageLabel}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: step.imagePosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/65 via-transparent to-black/10" />

                  <div className="hidden">
                    <span className="h-1.5 w-1.5 rounded-full bg-brown" />
                    <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/90">
                      Arsip visual · {step.number}
                    </p>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 sm:p-8">
                    <div>
                      <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/60">
                        {step.phase}
                      </p>
                      <p className="mt-2 max-w-sm font-serif text-xl leading-snug text-white sm:text-2xl">
                        {step.note}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`relative flex min-h-[390px] flex-col overflow-hidden p-7 sm:p-10 lg:col-span-5 lg:min-h-[510px] lg:p-12 ${
                    step.reversed ? 'lg:order-1' : ''
                  } ${step.dark ? 'bg-forest text-silk' : 'bg-cream text-ink'}`}
                >
                  <div
                    className={`flex items-center justify-between border-b pb-6 ${
                      step.dark ? 'border-silk/15' : 'border-sand'
                    }`}
                  >
                    <p
                      className={`font-sans text-[9px] uppercase tracking-[0.22em] ${
                        step.dark ? 'text-silk/50' : 'text-stone'
                      }`}
                    >
                      Tahap {step.number}
                    </p>
                    <p
                      className={`font-sans text-[9px] uppercase tracking-[0.2em] ${
                        step.dark ? 'text-brown' : 'text-brown'
                      }`}
                    >
                      {step.phase}
                    </p>
                  </div>

                  <div className="my-auto py-9">
                    <p
                      className={`font-serif text-4xl leading-none md:text-5xl ${
                        step.dark ? 'text-silk' : 'text-ink'
                      }`}
                    >
                      {step.title}
                    </p>
                    <span className="mt-7 block h-px w-12 bg-brown" />
                    <p
                      className={`mt-7 max-w-md font-sans text-sm leading-[1.9] ${
                        step.dark ? 'text-silk/68' : 'text-stone'
                      }`}
                    >
                      {step.caption}
                    </p>
                  </div>

                  <div
                    className={`border-t pt-6 ${
                      step.dark ? 'border-silk/15' : 'border-sand'
                    }`}
                  >
                    <p
                      className={`font-sans text-[9px] uppercase tracking-[0.18em] ${
                        step.dark ? 'text-silk/38' : 'text-stone/55'
                      }`}
                    >
                      Setitik Cultureware
                    </p>
                    <p
                      className={`mt-2 font-serif text-lg italic ${
                        step.dark ? 'text-silk/75' : 'text-ink/75'
                      }`}
                    >
                      Warisan yang terus bergerak.
                    </p>
                  </div>

                </div>

                <div
                  className={`pointer-events-none absolute left-1/2 top-1/2 z-20 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-silk bg-brown font-sans text-[10px] tracking-[0.12em] text-silk shadow-lg lg:flex ${
                    step.reversed ? 'lg:left-[41.666667%]' : 'lg:left-[58.333333%]'
                  }`}
                >
                  {step.number}
                </div>
              </motion.article>

              {index < steps.length - 1 && (
                <motion.div
                  variants={itemVariants}
                  className="relative z-10 flex h-20 items-center justify-center md:h-24"
                  aria-hidden
                >
                  <span className="h-full w-px bg-brown/25" />
                  <span className="absolute h-3 w-3 rounded-full border-2 border-silk bg-brown shadow-sm" />
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
