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

const timeline = [
  {
    year: '2019',
    title: 'Awal mula',
    body: 'Setitik lahir dari keprihatinan terhadap kawasan cagar budaya yang diperlakukan hanya sebagai objek wisata. Jessie Setiawati mulai mendokumentasikan bangunan Kota Lama ke dalam motif batik.',
    image: 'https://1001indonesia.net/asset/2020/06/Kota-Lama-Semarang-696x464.jpg',
    label: 'Observasi bangunan',
  },
  {
    year: '2021',
    title: 'Pemberdayaan komunitas',
    body: 'Program pelatihan dimulai. Ibu-ibu terdampak pandemi diajak mengolah kain menjadi produk jadi, dan Mbatik Bareng pertama kali digelar di Kota Lama.',
    image: '/images/mbatik-bareng/mbatik-jalanan-03.webp',
    label: 'Belajar bersama',
  },
  {
    year: '2022',
    title: 'Pengakuan internasional',
    body: 'Setitik menjadi bagian dari paket merchandise G20 dan dipercaya UNESCO untuk Heritage Travel Journal edisi Tambang Batu Bara Ombilin Sawahlunto.',
    image: '/images/products/heritage-travel-journal.png',
    label: 'Heritage journal',
  },
  {
    year: '2023',
    title: 'Kolaborasi lintas batas',
    body: 'ASEAN dan Malaysia UNESCO Cooperation Programme menjadi mitra. Motif Benteng Willem I lahir dari kolaborasi dengan Lapas 2A Ambarawa.',
    image: '/images/collaborations/mucp-2023-presentasi.webp',
    label: 'Kolaborasi motif',
  },
]

const missions = [
  {
    title: 'Pelatihan wastra',
    body: 'Mengadakan pelatihan membatik dan pengolahan wastra rutin di sekitar area cagar budaya.',
  },
  {
    title: 'Produk cagar budaya',
    body: 'Membuat merchandise dan fashion bagi pengunjung area cagar budaya.',
  },
  {
    title: 'Cerita dalam motif',
    body: 'Mengenalkan cerita cagar budaya Indonesia melalui motif dan produk.',
  },
  {
    title: 'Media edukasi',
    body: 'Membangun media promosi yang ramah serta mengedukasi.',
  },
]

export default function AboutAnimated({ section }: { section?: HomepageSection }) {
  return (
    <div className="overflow-hidden px-6 py-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid overflow-hidden rounded-[30px] bg-forest text-silk shadow-[0_28px_85px_rgba(30,45,34,0.2)] lg:min-h-[650px] lg:grid-cols-[0.82fr_1.18fr]"
        >
          <div className="flex flex-col p-7 sm:p-10 lg:p-12">
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <span className="h-px w-9 bg-brown" />
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-silk/50">
                Tentang Setitik
              </p>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-9 font-serif text-4xl leading-[1.05] text-silk md:text-5xl"
            >
              {section?.title ?? <><span>Jessie Setiawati</span><span className="mt-2 block italic text-brown">dan cerita Setitik.</span></>}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-7 max-w-md font-sans text-sm leading-[1.85] text-silk/63"
            >
              {section?.description ??
                'Setitik dimulai pada 2019 dari keyakinan bahwa bangunan tua menyimpan cerita yang layak diabadikan—bukan hanya di museum, tetapi di atas kain yang dapat dipakai.'}
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-md font-sans text-sm leading-[1.85] text-silk/63"
            >
              Sebagai pembatik tulis, Jessie memimpin proses dari observasi lapangan
              hingga kain jadi agar setiap motif tetap setia pada arsitektur aslinya.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-auto border-t border-silk/15 pt-7"
            >
              <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-brown">
                Founder &amp; Pembatik Tulis
              </p>
              <p className="mt-2 font-serif text-xl text-silk">Setitik Cultureware</p>
            </motion.div>
          </div>

          <motion.figure variants={itemVariants} className="relative min-h-[520px] overflow-hidden lg:min-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section?.imageUrl ?? '/images/founder/jessie-setiawati-v3.webp'}
              alt="Jessie Setiawati bersama karya batik Setitik"
              className="h-full w-full object-cover"
              style={{ objectPosition: '45% center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-transparent to-transparent" />
            <figcaption className="absolute bottom-6 left-6 rounded-full border border-white/25 bg-forest/30 px-4 py-2 font-sans text-[8px] uppercase tracking-[0.18em] text-white/75 backdrop-blur-md">
              Semarang · 2019—sekarang
            </figcaption>
          </motion.figure>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="pb-6 pt-6 md:pb-8 md:pt-8"
        >
          <div className="relative overflow-hidden rounded-[34px] border border-sand bg-cream shadow-[0_30px_90px_rgba(79,62,42,0.08)]">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-brown/10 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 bottom-8 h-72 w-72 rounded-full border border-brown/10"
            />

            <motion.div
              variants={itemVariants}
              className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[0.72fr_1fr] lg:p-12"
            >
              <div className="flex flex-col justify-between gap-7 rounded-[26px] bg-forest p-7 text-silk sm:p-8">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-silk/48">
                    Visi
                  </p>
                  <h2 className="mt-4 font-serif text-4xl leading-[1.06] text-silk md:text-5xl">
                    Arah yang
                    <span className="block italic text-brown">dijaga.</span>
                  </h2>
                </div>

                <div className="grid grid-cols-3 overflow-hidden rounded-[22px] border border-silk/12">
                  {[
                    { label: 'Bangunan', image: '/images/locations/semarang-gereja-blenduk.jpg' },
                    { label: 'Motif', image: '/images/products/batik-cap-kain-biru.png' },
                    { label: 'Kain', image: '/images/products/jarik-cap.png' },
                  ].map(({ label, image }) => (
                    <div key={label} className="relative h-28 border-r border-silk/12 last:border-r-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image} alt={label} className="h-full w-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-forest/25" />
                      <p className="absolute bottom-3 left-3 font-sans text-[8px] uppercase tracking-[0.16em] text-silk">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between gap-7 py-2">
                <p className="max-w-3xl font-serif text-4xl leading-[1.2] text-ink md:text-5xl">
                  Menyejahterakan warga sekitar area cagar budaya dengan memproduksi
                  <span className="italic text-brown"> wastra bermotif cagar budaya.</span>
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  {['Observasi', 'Produksi', 'Edukasi'].map((step, index) => (
                    <div
                      key={step}
                      className="rounded-full border border-sand bg-silk px-4 py-3 font-sans text-[9px] uppercase tracking-[0.18em] text-stone"
                    >
                      <span className="mr-2 text-brown">{String(index + 1).padStart(2, '0')}</span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="relative border-t border-sand bg-silk/55 p-7 sm:p-10 lg:p-12">
              <motion.div variants={itemVariants} className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-stone">
                    Misi
                  </p>
                  <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
                    Yang kami kerjakan
                  </h2>
                </div>
                <p className="max-w-md font-sans text-sm leading-[1.75] text-stone md:text-right">
                  Empat cara Setitik menjaga hubungan antara bangunan cagar budaya,
                  warga sekitar, dan karya yang bisa dipakai sehari-hari.
                </p>
              </motion.div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {missions.map(({ title, body }, index) => (
                  <motion.article
                    key={title}
                    variants={itemVariants}
                    className="group relative overflow-hidden rounded-[24px] border border-sand bg-cream p-6 transition duration-200 hover:border-brown/35 hover:shadow-[0_16px_44px_rgba(79,62,42,0.1)]"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-forest font-sans text-[10px] text-silk transition duration-300 group-hover:bg-brown">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="h-px w-16 bg-sand transition duration-300 group-hover:bg-brown/50" />
                    </div>
                    <h3 className="font-serif text-2xl leading-tight text-ink">{title}</h3>
                    <p className="mt-5 font-sans text-sm leading-[1.75] text-stone">{body}</p>
                  </motion.article>
                ))}
              </div>

              <motion.div
                variants={itemVariants}
                className="hidden"
              >
                <p className="font-serif text-4xl text-brown">2019—2023</p>
                <p className="mx-auto mt-3 max-w-2xl font-sans text-sm leading-[1.8] text-silk/55">
                  Dari pengamatan bangunan, bertemu komunitas, lalu menjadi karya
                  yang membawa cerita cagar budaya.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="pb-4 pt-6 md:pb-6 md:pt-8"
        >
          <div className="relative overflow-hidden rounded-[34px] bg-forest p-6 text-silk shadow-[0_32px_90px_rgba(30,45,34,0.16)] sm:p-8 lg:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-silk/10"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-28 left-16 h-64 w-64 rounded-full bg-brown/10 blur-3xl"
            />

            <motion.div
              variants={itemVariants}
              className="relative mb-8 border-b border-silk/12 pb-6"
            >
              <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-silk/45">
                Perjalanan
              </p>
              <div className="mt-4 grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
                <h2 className="max-w-2xl font-serif text-4xl leading-[1.08] text-silk md:text-5xl">
                  Dari ornamen arsitektur
                  <span className="block italic text-brown">ke helai kain.</span>
                </h2>
                <p className="max-w-xl font-sans text-sm leading-[1.85] text-silk/58 lg:justify-self-end lg:text-right">
                  Perjalanan Setitik bergerak dari pengamatan bangunan, pelatihan
                  komunitas, hingga kolaborasi yang membawa motif cagar budaya ke
                  berbagai bentuk produk.
                </p>
              </div>
            </motion.div>

            <div className="hidden">
              <motion.figure
                variants={itemVariants}
                className="relative min-h-[520px] overflow-hidden rounded-[30px] border border-silk/12 bg-silk/8"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/locations/semarang-gereja-blenduk.jpg"
                  alt="Gereja Blenduk sebagai salah satu titik awal inspirasi Setitik"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/35 to-transparent" />
                <div className="absolute left-6 top-6 rounded-full border border-white/20 bg-silk/90 px-4 py-2 font-sans text-[8px] uppercase tracking-[0.18em] text-forest">
                  Arsip perjalanan
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="font-serif text-6xl leading-none text-silk md:text-7xl">
                    2019—2023
                  </p>
                  <p className="mt-4 max-w-sm font-sans text-sm leading-[1.75] text-silk/70">
                    Satu perjalanan dari membaca fasad bangunan, bertemu komunitas,
                    hingga mengubah cerita kota menjadi motif.
                  </p>

                  <div className="mt-7 grid grid-cols-4 gap-2">
                    {timeline.map(({ year, image, label }) => (
                      <div key={year} className="group/thumb">
                        <div className="relative aspect-square overflow-hidden rounded-[16px] border border-white/15 bg-sand">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image}
                            alt={label}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-forest/25" />
                        </div>
                        <p className="mt-2 text-center font-sans text-[8px] uppercase tracking-[0.12em] text-silk/55">
                          {year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.figure>

              <div className="overflow-hidden rounded-[30px] border border-silk/12 bg-silk text-forest">
                {timeline.map(({ year, title, body, label }, index) => (
                  <motion.article
                    key={year}
                    variants={itemVariants}
                    className="group grid gap-5 border-b border-sand p-6 transition duration-300 last:border-b-0 hover:bg-cream md:grid-cols-[8rem_1fr]"
                  >
                    <div>
                      <p className="font-serif text-5xl leading-none text-brown">
                        {year}
                      </p>
                      <p className="mt-3 font-sans text-[8px] uppercase tracking-[0.18em] text-stone/55">
                        Jejak {String(index + 1).padStart(2, '0')}
                      </p>
                    </div>

                    <div>
                      <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-9 bg-brown" />
                        <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-brown">
                          {label}
                        </p>
                      </div>
                      <h3 className="font-serif text-3xl leading-tight text-ink">
                        {title}
                      </h3>
                      <p className="mt-4 max-w-xl font-sans text-sm leading-[1.8] text-stone">
                        {body}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-6 space-y-5 md:mt-8">
            {timeline.map(({ year, title, body, image, label }, index) => {
              const reversed = index % 2 === 1

              return (
                <motion.article
                  key={year}
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-[30px] border border-silk/12 bg-silk text-forest shadow-[0_24px_72px_rgba(0,0,0,0.14)] transition duration-200 hover:border-brown/45"
                >
                  <div className="grid lg:grid-cols-[0.98fr_1.02fr]">
                    <div
                      className={`relative min-h-[280px] overflow-hidden bg-sand lg:min-h-[360px] ${
                        reversed ? 'lg:order-2' : ''
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={`${title} - ${label}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest/78 via-forest/12 to-transparent" />
                      <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-silk/92 px-4 py-2 font-sans text-[8px] uppercase tracking-[0.16em] text-forest">
                          {label}
                        </span>
                        <span className="rounded-full bg-forest/55 px-3 py-2 font-sans text-[8px] uppercase tracking-[0.14em] text-silk backdrop-blur">
                          Bab {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="absolute bottom-5 right-6 font-serif text-6xl leading-none text-silk md:text-7xl">
                        {year}
                      </p>
                    </div>

                    <div className="relative flex min-h-[280px] flex-col justify-between p-6 sm:p-8 lg:min-h-[360px]">
                      <div className="relative">
                        <div className="mb-6 flex items-center gap-3">
                          <span className="h-px w-11 bg-brown" />
                          <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-brown">
                            Perjalanan {year}
                          </p>
                        </div>
                        <h3 className="max-w-md font-serif text-4xl leading-tight text-ink">
                          {title}
                        </h3>
                      </div>

                      <div className="relative mt-7 border-t border-sand pt-5">
                        <p className="max-w-xl font-sans text-sm leading-[1.85] text-stone">
                          {body}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>

          <div className="hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-28 top-16 h-72 w-72 rounded-full bg-brown/12 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full border border-silk/10"
            />

            <motion.div
              variants={itemVariants}
              className="relative mb-10 grid gap-6 border-b border-silk/12 pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
            >
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-silk/45">
                  Perjalanan
                </p>
                <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.08] text-silk md:text-5xl">
                  Dari ornamen arsitektur
                  <span className="block italic text-brown">ke helai kain.</span>
                </h2>
              </div>
              <p className="max-w-xl font-sans text-sm leading-[1.85] text-silk/58 lg:justify-self-end lg:text-right">
                Perjalanan Setitik bergerak dari pengamatan bangunan, pelatihan
                komunitas, hingga kolaborasi yang membawa motif cagar budaya ke
                berbagai bentuk produk.
              </p>
            </motion.div>

            <div className="relative">
              <span
                aria-hidden
                className="absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-brown via-silk/20 to-brown/50 lg:left-[7.5rem]"
              />

              <div className="space-y-6">
                {timeline.map(({ year, title, body, image, label }, index) => {
                  return (
                    <motion.article
                      key={year}
                      variants={itemVariants}
                      className="group relative grid gap-5 pl-14 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-8 lg:pl-0"
                    >
                      <div className="relative hidden lg:block">
                        <div className="sticky top-28">
                          <p className="font-serif text-6xl leading-none text-brown">
                            {year}
                          </p>
                          <p className="mt-3 font-sans text-[9px] uppercase tracking-[0.2em] text-silk/45">
                            Jejak {String(index + 1).padStart(2, '0')}
                          </p>
                        </div>
                      </div>

                      <div className="absolute left-0 top-7 z-20 lg:left-[6.1rem]" aria-hidden>
                        <div className="relative grid h-11 w-11 place-items-center rounded-full bg-forest shadow-[0_0_0_10px_rgba(30,45,34,1)]">
                          <span className="absolute h-9 w-9 rounded-full border border-brown/35" />
                          <span className="h-3 w-3 rounded-full bg-brown" />
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-[32px] border border-silk/12 bg-silk text-forest shadow-[0_24px_72px_rgba(0,0,0,0.16)] transition duration-200 group-hover:border-brown/45">
                        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                          <div className="relative min-h-[260px] overflow-hidden bg-sand lg:min-h-[330px]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image}
                            alt={`${title} - ${label}`}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-forest/72 via-forest/10 to-transparent" />
                          <div className="absolute left-5 top-5 flex items-center gap-2">
                            <span className="rounded-full border border-white/20 bg-silk/90 px-4 py-2 font-sans text-[8px] uppercase tracking-[0.16em] text-forest">
                              {label}
                            </span>
                            <span className="rounded-full border border-white/15 bg-forest/45 px-3 py-2 font-sans text-[8px] uppercase tracking-[0.14em] text-silk backdrop-blur">
                              Fase {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <p className="absolute bottom-5 right-5 font-serif text-6xl leading-none text-silk/95 lg:hidden">
                            {year}
                          </p>
                        </div>

                        <div className="flex min-h-[260px] flex-col justify-between p-6 sm:p-8 lg:min-h-[330px]">
                          <div>
                          <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-10 bg-brown" />
                            <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-brown">
                              Perjalanan {year}
                            </p>
                          </div>
                          <h3 className="font-serif text-3xl leading-tight text-ink">
                            {title}
                          </h3>
                          </div>

                          <p className="mt-8 border-t border-sand pt-5 font-sans text-sm leading-[1.85] text-stone">
                            {body}
                          </p>
                        </div>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}

                <div className="hidden">
                  <div className="absolute left-[46%] top-[390px] rounded-full border border-silk/12 bg-silk/[0.05] px-5 py-3 font-sans text-[9px] uppercase tracking-[0.2em] text-silk/50">
                    Jejak proses
                  </div>
                  <div className="absolute bottom-0 left-[46%] rounded-[28px] border border-silk/10 bg-silk/[0.05] p-6 text-center">
                    <p className="font-serif text-4xl text-brown">2019—2023</p>
                    <p className="mt-2 max-w-xs font-sans text-xs leading-[1.7] text-silk/50">
                      Dari pengamatan bangunan, bertemu komunitas, lalu menjadi karya
                      yang membawa cerita cagar budaya.
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                variants={itemVariants}
                className="mt-8 rounded-[30px] border border-silk/10 bg-silk/[0.05] p-6 text-center lg:ml-[11rem]"
              >
                <p className="font-serif text-4xl text-brown">2019—2023</p>
                <p className="mx-auto mt-3 max-w-2xl font-sans text-sm leading-[1.8] text-silk/55">
                  Dari pengamatan bangunan, bertemu komunitas, lalu menjadi karya
                  yang membawa cerita cagar budaya.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
