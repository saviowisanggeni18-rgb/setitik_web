import Link from 'next/link'
import { ArrowUpRight, Clock3, MapPin, Navigation } from 'lucide-react'
import type { HomepageSection } from '@/lib/homepage-sections'

const mapsUrl =
  'https://www.google.com/maps/search/?api=1&query=Jl.%20Letjen%20Suprapto%20No.44%20Kota%20Lama%20Semarang'

export default function LocationNavigationSection({ section }: { section?: HomepageSection }) {
  return (
    <section id="lokasi" className="bg-silk px-6 pb-12 pt-6 md:pb-16 md:pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid overflow-hidden rounded-[30px] border border-sand bg-cream shadow-[0_22px_70px_rgba(79,62,42,0.08)] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative bg-forest p-7 text-silk sm:p-9 lg:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 top-8 h-56 w-56 rounded-full border border-silk/15"
            />
            <div className="relative">
              <p className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.24em] text-silk">
                <span className="h-px w-9 bg-brown" />
                Lokasi kami
              </p>
              <h2 className="mt-5 max-w-xl font-serif text-4xl leading-[1.04] text-silk md:text-5xl">
                {section?.title && section.title !== 'Alamat Setitik' ? section.title : 'Datang ke ruang Setitik di Kota Lama.'}
              </h2>
              <p className="mt-5 max-w-lg font-sans text-sm leading-[1.8] text-silk">
                {section?.description && section.description !== 'Bagian lokasi, jam operasional, dan tautan navigasi menuju Setitik.' ? section.description : 'Titik temu untuk melihat karya, berdiskusi, dan mengikuti kegiatan Setitik di kawasan cagar budaya Semarang.'}
              </p>

              <div className="mt-8 overflow-hidden rounded-[24px] border border-sand bg-cream text-forest shadow-[0_18px_42px_rgba(0,0,0,0.12)]">
                <div className="border-b border-sand bg-silk p-5">
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brown text-silk shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
                      <MapPin size={18} aria-hidden />
                    </span>
                    <div>
                      <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-brown">
                        Alamat studio
                      </p>
                      <p className="mt-2 max-w-sm font-serif text-2xl leading-tight text-ink">
                        Kota Lama, Semarang
                      </p>
                      <p className="mt-2 font-sans text-sm font-medium leading-relaxed text-stone">
                        Jl. Letjen Suprapto No.44, Jawa Tengah
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-0 sm:grid-cols-2">
                  <div className="border-b border-sand p-5 sm:border-b-0 sm:border-r">
                    <div className="mb-3 flex items-center gap-2">
                      <Clock3 size={15} className="text-brown" aria-hidden />
                      <p className="font-sans text-[8px] font-semibold uppercase tracking-[0.18em] text-stone">
                        Senin-Sabtu
                      </p>
                    </div>
                    <p className="font-serif text-2xl leading-none text-ink">09.00-17.00</p>
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Clock3 size={15} className="text-brown" aria-hidden />
                      <p className="font-sans text-[8px] font-semibold uppercase tracking-[0.18em] text-stone">
                        Minggu
                      </p>
                    </div>
                    <p className="font-serif text-2xl leading-none text-ink">12.00-17.00</p>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-3 rounded-full bg-brown px-6 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-silk transition-colors hover:bg-silk hover:text-forest"
                >
                  <Navigation size={15} aria-hidden />
                  Mulai navigasi
                </a>
                <Link
                  href="/mbatik-bareng"
                  className="inline-flex min-h-12 items-center gap-3 rounded-full border border-silk px-6 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-silk transition-colors hover:bg-silk hover:text-forest"
                >
                  Jadwal kegiatan
                  <ArrowUpRight size={15} aria-hidden />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden bg-sand md:min-h-[520px]">
            <iframe
              title="Peta lokasi Setitik Cultureware"
              src="https://www.google.com/maps?q=Jl.%20Letjen%20Suprapto%20No.44%20Kota%20Lama%20Semarang&output=embed"
              className="absolute inset-0 h-full w-full border-0 saturate-[0.82] contrast-[0.95]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute inset-0 bg-cream/10 mix-blend-multiply" />
            <div className="absolute inset-x-0 top-0 z-10 border-b border-sand bg-cream p-4 shadow-[0_16px_38px_rgba(44,62,48,0.12)] sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest text-silk shadow-[0_8px_20px_rgba(44,62,48,0.18)]">
                    <MapPin size={15} aria-hidden />
                  </span>
                  <div>
                    <p className="font-sans text-[8px] font-semibold uppercase tracking-[0.18em] text-brown">
                      Setitik Cultureware
                    </p>
                    <p className="mt-1 font-sans text-xs font-medium leading-relaxed text-ink">
                      Jl. Letjen Suprapto No.44, Kota Lama, Semarang
                    </p>
                  </div>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-brown px-4 font-sans text-[8px] font-semibold uppercase tracking-[0.14em] text-silk shadow-[0_8px_18px_rgba(139,107,61,0.22)] transition-colors hover:bg-forest"
                >
                  <Navigation size={13} aria-hidden />
                  Navigasi
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
