'use client'

import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

/* Nested stagger untuk kolom teks dalam Lapas section */
const colVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 1.0, ease } },
}

const stats = [
  { number: '11+', label: 'Bangunan cagar budaya terdokumentasikan' },
  { number: '3', label: 'Kota warisan Heritage Travel Journal' },
  { number: '2019', label: 'Tahun berdiri, Kota Lama Semarang' },
  { number: '8+', label: 'Mitra institusional internasional' },
]

export default function ImpactAnimated() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Header — label → h1 → p → p ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="mb-6"
        >
          <motion.p
            variants={itemVariants}
            className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-4"
          >
            Dampak
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl md:text-5xl text-ink mb-6 leading-tight max-w-2xl"
          >
            Membeli adalah<br />berpartisipasi budaya.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="font-sans text-base text-stone max-w-xl leading-relaxed mb-3"
          >
            Setiap kain yang terjual berarti satu lagi giliran kerja bagi ibu-ibu pengrajin,
            satu lagi alasan kampung batik tetap hidup.
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="font-sans text-base text-stone max-w-xl leading-relaxed"
          >
            Setiap produk Setitik membawa dampak yang melampaui transaksi —
            mendokumentasikan warisan, memberdayakan komunitas, dan menjaga
            agar cagar budaya tetap relevan di hari ini.
          </motion.p>
        </motion.div>

        {/* ── Stats — stagger tiap angka ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px border border-sand mb-24 mt-16"
        >
          {stats.map(({ number, label }) => (
            <motion.div
              key={label}
              variants={itemVariants}
              className="px-8 py-10 text-center"
            >
              <p className="font-serif text-4xl text-brown mb-3">{number}</p>
              <p className="font-sans text-xs text-stone leading-relaxed">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Dua program utama ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20"
        >
          <motion.div variants={itemVariants}>
            <div
              className="w-full aspect-[4/3] bg-sand rounded-sm mb-6"
              role="img"
              aria-label="Kegiatan pemberdayaan ibu-ibu pengrajin batik"
            />
            <h2 className="font-serif text-2xl text-ink mb-3">
              Pemberdayaan Ibu-ibu
            </h2>
            <p className="font-sans text-sm text-stone leading-relaxed">
              Ibu-ibu buruh pabrik di sekitar Kabupaten Semarang yang terdampak pandemi
              dilatih mengolah kain batik menjadi produk siap pakai — menciptakan sumber
              penghasilan baru yang berkelanjutan.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div
              className="w-full aspect-[4/3] bg-sand rounded-sm mb-6"
              role="img"
              aria-label="Pembatik tulis di kampung batik Semarang"
            />
            <h2 className="font-serif text-2xl text-ink mb-3">
              Pelestarian Kampung Batik
            </h2>
            <p className="font-sans text-sm text-stone leading-relaxed">
              Kampung batik Semarang dekat Kota Lama — jumlah pembatik tulisnya semakin
              berkurang dari tahun ke tahun. Setitik menjadikan mereka mitra utama,
              memastikan keahlian ini tidak ikut menghilang.
            </p>
          </motion.div>
        </motion.div>

        {/* ── Lapas Ambarawa — foto → teks (nested stagger) ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="border-t border-sand pt-14"
        >
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-start"
          >
            <div
              className="w-full aspect-video bg-sand rounded-sm"
              role="img"
              aria-label="Bangunan Lapas Ambarawa dan motif Benteng Willem I"
            />
            <motion.div variants={colVariants}>
              <motion.p
                variants={itemVariants}
                className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone mb-3"
              >
                Kolaborasi
              </motion.p>
              <motion.h2
                variants={itemVariants}
                className="font-serif text-lg text-ink mb-3"
              >
                Lapas 2A Ambarawa
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="font-sans text-sm text-stone leading-relaxed"
              >
                Motif Benteng Willem I lahir dari kolaborasi dengan Lapas 2A Ambarawa —
                sebuah bangunan cagar budaya yang kini berfungsi sebagai lembaga
                pemasyarakatan. Diproduksi oleh bapak-bapak yang terbelenggu besi penyekat,
                namun semangat serta mimpinya tak dapat dipenjara. Para warga binaan
                menjadi pembatik, mengubah keahlian baru menjadi karya yang bermakna
                dan berdampak.
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  )
}
