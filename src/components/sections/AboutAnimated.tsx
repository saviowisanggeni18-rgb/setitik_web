'use client'

import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

/* Nested stagger untuk kolom teks dalam layout 2-kolom */
const colVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

/* Timeline punya jeda lebih lebar — biar cerita terasa mengalir satu per satu */
const timelineVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 1.0, ease } },
}

const clients = [
  { name: 'UNESCO', year: '2022–2023', note: 'Heritage Travel Journal' },
  { name: 'G20', year: '2022', note: 'Paket merchandise' },
  { name: 'ASEAN', year: '2023', note: 'Paket merchandise' },
  { name: 'Kemenparekraf', year: '2021', note: 'Paket merchandise' },
  { name: 'KTT', year: '2023', note: 'Paket merchandise' },
  { name: 'Malaysia UNESCO Cooperation Programme', year: '2023', note: 'Heritage Travel Journal' },
  { name: 'Sekolah Musik Indonesia', year: '—', note: 'Kain seragam motif batik' },
  { name: 'Viu', year: '2020', note: 'Paket merchandise' },
]

const timeline = [
  {
    year: '2019',
    title: 'Awal mula',
    body: 'Setitik lahir dari keprihatinan terhadap kawasan cagar budaya yang diperlakukan hanya sebagai objek wisata. Jessie Setiawati memulai perjalanan mendokumentasikan bangunan-bangunan Kota Lama ke dalam motif batik.',
  },
  {
    year: '2021',
    title: 'Pemberdayaan komunitas',
    body: 'Program pelatihan dimulai — ibu-ibu terdampak pandemi diajak mengolah kain menjadi produk jadi. Kegiatan Mbatik Bareng pertama kali digelar di Kota Lama.',
  },
  {
    year: '2022',
    title: 'Pengakuan internasional',
    body: 'Setitik menjadi bagian dari paket merchandise G20 dan dipercaya oleh UNESCO untuk Heritage Travel Journal edisi Tambang Batu Bara Ombilin Sawahlunto.',
  },
  {
    year: '2023',
    title: 'Kolaborasi lintas batas',
    body: 'ASEAN dan Malaysia UNESCO Cooperation Programme menjadi mitra. Motif Benteng Willem I lahir dari kolaborasi dengan Lapas 2A Ambarawa.',
  },
]

const missions = [
  { number: '01', body: 'Mengadakan pelatihan membatik / pengolahan wastra rutin di area sekitar cagar budaya dan sekitar rumah.' },
  { number: '02', body: 'Membuat produk merchandise dan atau fashion untuk para pengunjung area cagar budaya.' },
  { number: '03', body: 'Mengenalkan cerita cagar budaya Indonesia.' },
  { number: '04', body: 'Membangun media promosi yang ramah dan mengedukasi.' },
]

function StitchDivider() {
  return (
    <div className="flex items-center gap-4 my-24" aria-hidden="true">
      <div className="flex-1 border-t border-dashed border-sand" />
      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--color-sand)' }} />
      <div className="flex-1 border-t border-dashed border-sand" />
    </div>
  )
}

export default function AboutAnimated() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Founder — foto → kolom teks (nested stagger) ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32"
        >
          <motion.div variants={itemVariants}>
            <div
              className="aspect-[3/4] bg-sand rounded-sm"
              role="img"
              aria-label="Foto Jessie Setiawati, Founder Setitik Cultureware"
            />
          </motion.div>

          <motion.div variants={colVariants} className="flex flex-col justify-center">
            <motion.p
              variants={itemVariants}
              className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-6"
            >
              Founder
            </motion.p>
            <motion.h1
              variants={itemVariants}
              className="font-serif text-3xl md:text-4xl text-ink mb-6 leading-tight"
            >
              Jessie Setiawati
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="font-sans text-sm text-stone leading-relaxed mb-6"
            >
              Lahir dari kegelisahan melihat bangunan cagar budaya yang ada di sekitar kita
              diperlakukan hanya sebagai latar belakang foto. Jessie memulai Setitik pada 2019
              dengan satu keyakinan sederhana: bahwa setiap bangunan tua menyimpan cerita
              yang layak diabadikan — bukan di museum, tapi di atas kain yang bisa dipakai.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="font-sans text-sm text-stone leading-relaxed"
            >
              Sebagai pembatik tulis, ia memimpin proses dari observasi lapangan hingga
              helai kain jadi — memastikan setiap motif merupakan representasi yang
              setia dari arsitektur aslinya.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* ── Visi — label → kutipan ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="max-w-3xl mx-auto text-center mb-0"
        >
          <motion.p
            variants={itemVariants}
            className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-8"
          >
            Visi
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="font-serif text-2xl md:text-3xl text-ink leading-relaxed"
          >
            Menyejahterakan warga sekitar area cagar budaya dengan memproduksi
            wastra bermotif cagar budaya.
          </motion.p>
        </motion.div>

        {/* ── Misi — label → grid 4 item (stagger) ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="max-w-3xl mx-auto mt-20"
        >
          <motion.p
            variants={itemVariants}
            className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-8 text-center"
          >
            Misi
          </motion.p>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {missions.map(({ number, body }) => (
              <motion.div key={number} variants={itemVariants}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone tabular-nums">
                    {number}
                  </span>
                  <span className="flex-1 h-px bg-sand" />
                </div>
                <p className="font-sans text-sm text-stone leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <StitchDivider />

        {/* ── Kepercayaan — label → grid klien (stagger) ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.15, margin: "0px 0px -5% 0px" }}
          className="mb-0"
        >
          <motion.p
            variants={itemVariants}
            className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-8 text-center"
          >
            Kepercayaan yang diberikan
          </motion.p>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-px border border-sand"
          >
            {clients.map(({ name, year, note }) => (
              <motion.div
                key={name}
                variants={itemVariants}
                className="px-8 py-6 border-b border-sand last:border-b-0 md:[&:nth-last-child(2)]:border-b-0"
              >
                <p className="font-serif text-lg text-ink mb-1">{name}</p>
                <p className="font-sans text-xs text-stone">
                  {year} · {note}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <StitchDivider />

        {/* ── Perjalanan — header → timeline (masing-masing muncul berurutan) ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="max-w-3xl mx-auto mb-16"
        >
          <motion.p
            variants={itemVariants}
            className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-4"
          >
            Perjalanan
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="font-serif text-3xl text-ink leading-tight"
          >
            Dari ornamen arsitektur<br />ke helai kain.
          </motion.h2>
        </motion.div>

        {/* Timeline — tiap tahun muncul satu per satu dengan jeda 0.2s */}
        <motion.div
          variants={timelineVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1, margin: "0px 0px -5% 0px" }}
          className="max-w-3xl mx-auto space-y-16"
        >
          {timeline.map(({ year, title, body }) => (
            <motion.div
              key={year}
              variants={itemVariants}
              className="grid grid-cols-[72px_1fr] gap-8"
            >
              <p className="font-serif text-2xl text-brown pt-1">{year}</p>
              <div>
                <h3 className="font-serif text-xl text-ink mb-3">{title}</h3>
                <p className="font-sans text-sm text-stone leading-relaxed">{body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  )
}
