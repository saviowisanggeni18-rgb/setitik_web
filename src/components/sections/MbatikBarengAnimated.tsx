'use client'

import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Loader2, MapPin, Send, Sparkles, Users } from 'lucide-react'
import type { MbatikEvent } from '@/lib/mbatik-events'
import type { MbatikPageContent } from '@/lib/mbatik-page-content'

const ease = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease } },
}

const registrationNotes = [
  'Pemula boleh ikut',
  'Alat disiapkan',
  'Belajar langsung di Kota Lama',
]

export default function MbatikBarengAnimated({ events, content }: { events: MbatikEvent[]; content: MbatikPageContent }) {
  const [upcomingEvents, setUpcomingEvents] = useState(events)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const openEvents = upcomingEvents.filter(
    (event) => event.status === 'open' && event.availableSlots > 0,
  )

  async function handleRegistrationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSubmitting(true)
    setMessage('')
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/mbatik-registrations', {
        method: 'POST',
        body: formData,
      })
      const responseText = await response.text()
      let payload: {
        message?: string
        event?: MbatikEvent
      } = {}

      try {
        payload = responseText ? JSON.parse(responseText) : {}
      } catch {
        throw new Error(
          response.ok
            ? 'Pendaftaran diproses, tetapi respons server tidak valid.'
            : 'Server gagal memproses pendaftaran. Muat ulang halaman lalu coba lagi.'
        )
      }

      if (!response.ok) {
        throw new Error(payload.message ?? 'Gagal mengirim pendaftaran.')
      }

      if (payload.event) {
        setUpcomingEvents((current) =>
          current.map((item) => (item.id === payload.event?.id ? payload.event : item))
        )
      }
      form.reset()
      setMessage(payload.message ?? 'Pendaftaran berhasil.')
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Gagal mengirim pendaftaran.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="overflow-hidden px-6 py-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative min-h-[500px] overflow-hidden rounded-[30px] bg-forest text-silk shadow-[0_28px_85px_rgba(30,45,34,0.2)] md:min-h-[540px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.heroImage.src}
            alt="Kegiatan Mbatik Bareng Setitik"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: `${content.heroImage.positionX}% ${content.heroImage.positionY}%`, transform: `scale(${content.heroImage.zoom})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/78 to-forest/15" />
          <div className="absolute inset-5 rounded-[23px] border border-white/15 sm:inset-7" />

          <div className="relative z-10 flex min-h-[500px] max-w-[650px] flex-col justify-center p-7 sm:p-9 md:min-h-[540px] lg:p-10">
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <span className="h-px w-9 bg-brown" />
              <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-silk/55">
                {content.heroEyebrow}
              </p>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-5 font-serif text-4xl leading-[0.98] text-silk md:text-5xl"
            >
              {content.heroTitle}
              <span className="block italic text-brown">{content.heroAccent}</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-lg font-sans text-sm leading-[1.75] text-silk/67"
            >
              {content.heroDescription}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-4 flex flex-wrap gap-2">
              {['Kamis minggu ketiga', '09.00-12.00 WIB', 'Taman Srigunting'].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-silk/20 bg-forest/25 px-4 py-2.5 font-sans text-[8px] uppercase tracking-[0.14em] text-silk/60 backdrop-blur-md"
                >
                  {label}
                </span>
              ))}
            </motion.div>

            <motion.a
              variants={itemVariants}
              href="#pendaftaran"
              className="mt-5 inline-flex self-start rounded-full bg-silk px-6 py-3 font-sans text-[9px] uppercase tracking-[0.17em] text-forest transition-colors hover:bg-brown hover:text-silk"
            >
              Lihat jadwal &amp; daftar
            </motion.a>
          </div>
        </motion.section>

        <motion.section
          id="pendaftaran"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.16 }}
          className="mt-5 grid overflow-hidden rounded-[30px] border border-sand/80 bg-silk shadow-[0_26px_80px_rgba(65,49,31,0.12)] md:mt-6 lg:grid-cols-[0.92fr_1.08fr]"
        >
          <div className="relative overflow-hidden bg-forest p-6 text-silk sm:p-7 lg:p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.registrationImage.src}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity"
              style={{ objectPosition: `${content.registrationImage.positionX}% ${content.registrationImage.positionY}%`, transform: `scale(${content.registrationImage.zoom})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest/94 to-forest/74" />

            <div className="relative z-10">
              <motion.p
                variants={itemVariants}
                className="flex items-center gap-3 font-sans text-[9px] uppercase tracking-[0.22em] text-silk/55"
              >
                <Sparkles size={14} className="text-brown" aria-hidden />
                Pendaftaran dibuka
              </motion.p>
              <motion.h2
                variants={itemVariants}
                className="mt-4 max-w-md font-serif text-3xl leading-tight text-silk md:text-4xl"
              >
                Ambil tempat di lingkar belajar berikutnya.
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="mt-3 max-w-md font-sans text-sm leading-[1.7] text-silk/66"
              >
                Datang, duduk bersama, lalu kenali proses membatik dari dekat.
                Tim Setitik akan mendampingi dari pengenalan canting sampai proses awal di kain.
              </motion.p>

              <motion.div variants={itemVariants} className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {registrationNotes.map((note) => (
                  <div
                    key={note}
                    className="flex items-center gap-3 rounded-2xl border border-silk/12 bg-silk/[0.06] px-4 py-2.5 backdrop-blur-md"
                  >
                    <CheckCircle2 size={15} className="shrink-0 text-brown" aria-hidden />
                    <p className="font-sans text-xs leading-relaxed text-silk/72">{note}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="mt-5 border-t border-silk/15 pt-5">
                <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-silk/42">
                  Jadwal terdekat
                </p>
                <div className="mt-3 space-y-2">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.slice(0, 2).map((event) => (
                      <article
                        key={event.id}
                        className="rounded-[18px] border border-silk/14 bg-forest/35 p-3.5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-serif text-xl leading-tight text-silk">{event.displayDate}</p>
                            <p className="mt-2 flex items-center gap-2 font-sans text-xs text-silk/55">
                              <Clock size={13} className="text-brown" aria-hidden />
                              {event.time}
                            </p>
                          </div>
                          <span className="rounded-full border border-brown/45 px-3 py-1.5 font-sans text-[8px] uppercase tracking-[0.13em] text-brown">
                            {event.status === 'open' ? 'Buka' : 'Segera'}
                          </span>
                        </div>
                        <p className="mt-3 flex items-center gap-2 font-sans text-xs leading-relaxed text-silk/52">
                          <MapPin size={13} className="shrink-0 text-brown" aria-hidden />
                          {event.location}
                        </p>
                        <p className="mt-3 flex items-center gap-2 border-t border-silk/10 pt-3 font-sans text-[9px] text-silk/40">
                          <Users size={13} aria-hidden />
                          {event.availableSlots} tempat tersedia dari {event.totalSlots}
                        </p>
                      </article>
                    ))
                  ) : (
                    <p className="font-serif text-xl text-silk">Jadwal berikutnya segera diumumkan.</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div variants={itemVariants} className="p-6 sm:p-7 lg:p-8">
            <div>
              <div>
                <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-stone">
                  Formulir pendaftaran
                </p>
                <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">
                  Daftarkan diri
                </h2>
                <p className="mt-3 max-w-lg font-sans text-sm leading-relaxed text-stone">
                  Pilih tanggal yang masih tersedia. Konfirmasi pendaftaran akan dikirim melalui WhatsApp.
                </p>
              </div>
            </div>

            <form onSubmit={handleRegistrationSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField name="name" label="Nama lengkap" type="text" placeholder="Nama Anda" />
              <FormField name="whatsapp" label="Nomor WhatsApp" type="tel" placeholder="08xx xxxx xxxx" />
              <FormField name="email" label="Email" type="email" placeholder="email@contoh.com" />

              <label className="block">
                <span className="mb-2 block font-sans text-[9px] uppercase tracking-[0.17em] text-stone">
                  Tanggal kegiatan
                </span>
                <select
                  name="eventId"
                  required
                  defaultValue=""
                  className="w-full rounded-xl border border-sand bg-cream px-4 py-3 font-sans text-sm text-ink outline-none transition-colors focus:border-brown"
                >
                  <option value="" disabled>Pilih tanggal</option>
                  {openEvents.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.displayDate} - {event.availableSlots} tempat
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block font-sans text-[9px] uppercase tracking-[0.17em] text-stone">
                  Jumlah peserta
                </span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  name="participants"
                  defaultValue={1}
                  className="w-full rounded-xl border border-sand bg-cream px-4 py-3 font-sans text-sm text-ink outline-none transition-colors focus:border-brown"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block font-sans text-[9px] uppercase tracking-[0.17em] text-stone">
                  Catatan tambahan
                </span>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Hal yang ingin disampaikan..."
                  className="w-full resize-none rounded-xl border border-sand bg-cream px-4 py-3 font-sans text-sm text-ink outline-none transition-colors placeholder:text-stone/45 focus:border-brown"
                />
              </label>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm leading-6 text-red-700 sm:col-span-2">
                  {error}
                </p>
              )}
              {message && (
                <p className="rounded-xl border border-forest/20 bg-forest/5 px-4 py-3 font-sans text-sm leading-6 text-forest sm:col-span-2">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={openEvents.length === 0 || submitting}
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-brown px-6 py-3.5 font-sans text-[9px] uppercase tracking-[0.17em] text-silk transition-colors hover:bg-forest disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
              >
                {submitting ? 'Mengirim pendaftaran...' : 'Saya ikut Mbatik Bareng'}
                {submitting ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden />
                ) : (
                  <Send size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                )}
              </button>
            </form>
          </motion.div>
        </motion.section>

        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="pb-10 pt-8 md:pb-12 md:pt-10"
        >
          <motion.div variants={itemVariants} className="mb-6 grid gap-5 lg:grid-cols-[0.7fr_1fr] lg:items-end">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-stone">
                {content.galleryEyebrow}
              </p>
              <h2 className="mt-3 font-serif text-4xl text-ink">{content.galleryTitle}</h2>
            </div>
            <p className="max-w-xl border-l border-brown/30 pl-5 font-sans text-sm leading-[1.8] text-stone">
              {content.galleryDescription}
            </p>
          </motion.div>

          <div className="space-y-5">
            {content.galleryItems.map((item, index) => (
              <motion.figure
                key={item.id}
                variants={itemVariants}
                className={`group grid overflow-hidden rounded-[28px] border border-sand bg-cream shadow-[0_18px_55px_rgba(65,49,31,0.08)] lg:grid-cols-[1.12fr_0.88fr] ${
                  index % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''
                }`}
              >
                <div className="relative min-h-[260px] overflow-hidden bg-sand md:min-h-[340px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image.src}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: `${item.image.positionX}% ${item.image.positionY}%`, transform: `scale(${item.image.zoom})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/35 via-transparent to-transparent" />
                </div>

                <figcaption className="flex min-h-[210px] flex-col justify-between p-6 text-ink sm:p-7 lg:p-8">
                  <div>
                    <p className="flex items-center gap-3 font-sans text-[9px] uppercase tracking-[0.22em] text-brown">
                      <span className="h-px w-9 bg-brown" />
                      {item.eyebrow}
                    </p>
                    <p className="mt-6 max-w-sm font-serif text-3xl leading-tight md:text-4xl">
                      {item.title}
                    </p>
                  </div>
                  <p className="mt-9 border-t border-brown/25 pt-5 font-sans text-sm leading-[1.8] text-stone">
                    {item.description}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

function FormField({
  name,
  label,
  type,
  placeholder,
}: {
  name: string
  label: string
  type: string
  placeholder: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-sans text-[9px] uppercase tracking-[0.17em] text-stone">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-sand bg-cream px-4 py-3 font-sans text-sm text-ink outline-none transition-colors placeholder:text-stone/45 focus:border-brown"
      />
    </label>
  )
}
