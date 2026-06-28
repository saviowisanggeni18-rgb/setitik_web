'use client'

import { motion } from 'framer-motion'
import { events } from '@/data/events'

const ease = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 1.0, ease } },
}

const statusLabel: Record<string, string> = {
  open: 'Buka',
  full: 'Penuh',
  'coming-soon': 'Segera',
}

const statusColor: Record<string, string> = {
  open: 'text-forest',
  full: 'text-stone',
  'coming-soon': 'text-brown',
}

const galleryItems = [
  { id: '1', caption: 'Kegiatan Juni 2026', label: 'Dokumentasi Mbatik Bareng Juni 2026' },
  { id: '2', caption: 'Kegiatan Mei 2026', label: 'Dokumentasi Mbatik Bareng Mei 2026' },
  { id: '3', caption: 'Kegiatan April 2026', label: 'Dokumentasi Mbatik Bareng April 2026' },
  { id: '4', caption: 'Kegiatan Maret 2026', label: 'Dokumentasi Mbatik Bareng Maret 2026' },
]

export default function MbatikBarengAnimated() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-3xl mx-auto">

        {/* ── Hero — label → h1 → deskripsi → catatan lokasi ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
        >
          <motion.p
            variants={itemVariants}
            className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-4"
          >
            Kegiatan
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl md:text-5xl text-ink mb-6 leading-tight"
          >
            Mbatik di jalanan,<br />bareng.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="font-sans text-base text-stone leading-relaxed mb-4 max-w-lg"
          >
            Setiap Kamis minggu ketiga, kami membuka ruang belajar membatik
            langsung di tepi jalan Kota Lama Semarang. Terbuka untuk semua,
            tanpa perlu pengalaman sebelumnya.
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="font-sans text-sm text-stone italic mb-16"
          >
            Lokasi: Taman Srigunting, Kota Lama Semarang · 09.00–12.00 WIB
          </motion.p>
        </motion.div>

        {/* ── Suasana placeholder ── */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="mb-24"
        >
          <div
            className="w-full aspect-video bg-sand rounded-sm"
            role="img"
            aria-label="Suasana kegiatan Mbatik Bareng di Kota Lama Semarang"
          />
        </motion.div>

        {/* ── Galeri — header stagger, lalu grid stagger ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="mb-6"
        >
          <motion.p
            variants={itemVariants}
            className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-2"
          >
            Galeri
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="font-serif text-2xl text-ink mb-8"
          >
            Kegiatan sebelumnya
          </motion.h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="grid grid-cols-2 gap-4 mb-24"
        >
          {galleryItems.map(({ id, caption, label }) => (
            <motion.figure key={id} variants={itemVariants}>
              <div
                className="w-full aspect-[4/3] bg-sand rounded-sm mb-2"
                role="img"
                aria-label={label}
              />
              <figcaption className="font-sans text-xs text-stone">
                {caption}
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>

        {/* ── Jadwal mendatang ── */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="mb-8"
        >
          <h2 className="font-serif text-2xl text-ink">Jadwal mendatang</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
          className="space-y-4 mb-24"
        >
          {events.map((event) => (
            <motion.div
              key={event.id}
              variants={itemVariants}
              className="border border-sand px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <p className="font-serif text-lg text-ink">{event.displayDate}</p>
                <p className="font-sans text-sm text-stone mt-1">
                  {event.time} · {event.location}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className={`font-sans text-sm font-medium ${statusColor[event.status]}`}>
                    {statusLabel[event.status]}
                  </p>
                  {event.status !== 'full' && (
                    <p className="font-sans text-xs text-stone mt-0.5">
                      {event.availableSlots} tempat tersisa
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Form pendaftaran — heading → deskripsi → form ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2, margin: "0px 0px -5% 0px" }}
        >
          <motion.h2
            variants={itemVariants}
            className="font-serif text-2xl text-ink mb-3"
          >
            Daftarkan diri
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="font-sans text-sm text-stone mb-10"
          >
            Isi formulir di bawah ini. Kami akan mengirimkan konfirmasi melalui WhatsApp.
          </motion.p>

          <motion.form variants={itemVariants} className="space-y-6">
            <div>
              <label className="block font-sans text-xs uppercase tracking-[0.2em] text-stone mb-2">
                Nama Lengkap <span className="text-brown">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Nama Anda"
                className="w-full border border-sand bg-silk px-4 py-3 font-sans text-sm text-ink placeholder:text-stone/50 focus:outline-none focus:border-brown transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-[0.2em] text-stone mb-2">
                Email <span className="text-brown">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="email@contoh.com"
                className="w-full border border-sand bg-silk px-4 py-3 font-sans text-sm text-ink placeholder:text-stone/50 focus:outline-none focus:border-brown transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-[0.2em] text-stone mb-2">
                Nomor WhatsApp <span className="text-brown">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="08xx xxxx xxxx"
                className="w-full border border-sand bg-silk px-4 py-3 font-sans text-sm text-ink placeholder:text-stone/50 focus:outline-none focus:border-brown transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-[0.2em] text-stone mb-2">
                Tanggal Kegiatan <span className="text-brown">*</span>
              </label>
              <select
                required
                defaultValue=""
                className="w-full border border-sand bg-silk px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-brown transition-colors duration-300 appearance-none"
              >
                <option value="" disabled>Pilih tanggal</option>
                {events
                  .filter((e) => e.status !== 'full' && e.status !== 'coming-soon')
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.displayDate} — {e.availableSlots} tempat tersisa
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-[0.2em] text-stone mb-2">
                Jumlah Peserta <span className="text-brown">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                max={5}
                defaultValue={1}
                className="w-full border border-sand bg-silk px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-brown transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-[0.2em] text-stone mb-4">
                Pernah membatik sebelumnya? <span className="text-brown">*</span>
              </label>
              <div className="flex gap-8">
                {['Ya', 'Tidak'].map((option) => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="experience"
                      value={option}
                      className="accent-brown"
                    />
                    <span className="font-sans text-sm text-ink">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs uppercase tracking-[0.2em] text-stone mb-2">
                Catatan tambahan
              </label>
              <textarea
                rows={4}
                placeholder="Hal-hal yang ingin Anda sampaikan..."
                className="w-full border border-sand bg-silk px-4 py-3 font-sans text-sm text-ink placeholder:text-stone/50 focus:outline-none focus:border-brown transition-colors duration-300 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full font-sans text-sm tracking-wide bg-brown text-silk py-4 hover:bg-forest transition-colors duration-500 mt-4"
            >
              Saya Ikut Mbatik
            </button>
          </motion.form>
        </motion.div>

      </div>
    </div>
  )
}
