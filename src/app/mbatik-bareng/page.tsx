import type { Metadata } from 'next'
import { events } from '@/data/events'

export const metadata: Metadata = {
  title: 'Mbatik Bareng',
  description: 'Ikut Mbatik Bareng — kegiatan membatik langsung di tepi jalan Kota Lama Semarang, setiap Kamis minggu ketiga.',
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

export default function MbatikBarengPage() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-stone mb-4">Kegiatan</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 leading-tight">
          Mbatik di jalanan,<br />bareng.
        </h1>
        <p className="font-sans text-base text-stone leading-relaxed mb-4 max-w-lg">
          Setiap Kamis minggu ketiga, kami membuka ruang belajar membatik
          langsung di tepi jalan Kota Lama Semarang. Terbuka untuk semua,
          tanpa perlu pengalaman sebelumnya.
        </p>
        <p className="font-sans text-sm text-stone italic mb-16">
          Lokasi: Taman Srigunting, Kota Lama Semarang · 09.00–12.00 WIB
        </p>

        {/* Suasana placeholder */}
        <div className="w-full aspect-video bg-sand rounded-sm mb-24" />

        {/* Event list */}
        <h2 className="font-serif text-2xl text-ink mb-8">Jadwal mendatang</h2>
        <div className="space-y-4 mb-24">
          {events.map((event) => (
            <div
              key={event.id}
              className="border border-sand px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <p className="font-serif text-lg text-ink">{event.displayDate}</p>
                <p className="font-sans text-sm text-stone mt-1">{event.time} · {event.location}</p>
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
            </div>
          ))}
        </div>

        {/* Registration form */}
        <div>
          <h2 className="font-serif text-2xl text-ink mb-3">Daftarkan diri</h2>
          <p className="font-sans text-sm text-stone mb-10">
            Isi formulir di bawah ini. Kami akan mengirimkan konfirmasi melalui WhatsApp.
          </p>

          <form className="space-y-6">
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
                className="w-full border border-sand bg-silk px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-brown transition-colors duration-300 appearance-none"
              >
                <option value="">Pilih tanggal</option>
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
          </form>
        </div>
      </div>
    </div>
  )
}
