'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  CalendarDays,
  ChevronDown,
  FileSpreadsheet,
  Loader2,
  Mail,
  Phone,
  RefreshCcw,
  Users,
} from 'lucide-react'

type Registration = {
  id: string
  event_id: string | null
  event_date: string
  event_label: string
  name: string
  whatsapp: string
  email: string | null
  participants: number
  notes: string | null
  created_at: string
}

type ReportEvent = {
  id: string
  total_slots: number
  available_slots: number
  status: string
}

function registrationGroupKey(registration: Registration) {
  return registration.event_id ?? `${registration.event_date}:${registration.event_label}`
}

export default function ReportsPanel({ password }: { password: string }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [reportEvents, setReportEvents] = useState<ReportEvent[]>([])
  const [expandedEventKeys, setExpandedEventKeys] = useState<Set<string>>(new Set())

  const loadReport = useCallback(async function loadReport() {
    const formData = new FormData()
    formData.set('password', password)

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin-reports', {
        method: 'POST',
        body: formData,
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Gagal membuka konfigurasi laporan.')
      }

      const loadedRegistrations = (payload.registrations ?? []) as Registration[]
      setRegistrations(loadedRegistrations)
      setReportEvents(payload.events ?? [])
      setExpandedEventKeys((current) => {
        if (current.size > 0 || loadedRegistrations.length === 0) return current
        return new Set([registrationGroupKey(loadedRegistrations[0])])
      })
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Gagal membuka konfigurasi laporan.'
      )
    } finally {
      setLoading(false)
    }
  }, [password])

  const eventGroups = registrations.reduce<
    Array<{ key: string; date: string; label: string; registrations: Registration[] }>
  >((groups, registration) => {
    const key = registrationGroupKey(registration)
    const existing = groups.find((group) => group.key === key)
    if (existing) existing.registrations.push(registration)
    else {
      groups.push({
        key,
        date: registration.event_date,
        label: registration.event_label,
        registrations: [registration],
      })
    }
    return groups
  }, [])

  const totalParticipants = registrations.reduce(
    (total, registration) => total + registration.participants,
    0
  )

  function toggleEvent(key: string) {
    setExpandedEventKeys((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReport()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadReport])

  return (
    <section className="border border-sand bg-silk p-5 shadow-[0_18px_70px_rgba(63,47,27,0.08)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sand pb-5">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest text-silk">
            <FileSpreadsheet size={19} aria-hidden />
          </span>
          <div>
            <p className="font-serif text-3xl leading-tight text-ink">Laporan pendaftaran</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-stone">
              Lihat siapa saja yang mendaftar pada setiap event Mbatik Bareng.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void loadReport()}
          className="inline-flex h-10 items-center gap-2 border border-sand bg-cream px-4 text-sm font-semibold text-stone transition hover:border-brown hover:text-brown"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
          Muat ulang
        </button>
      </div>

      {error && (
        <p className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="mt-5 grid gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Event terdaftar', value: eventGroups.length, icon: CalendarDays },
              { label: 'Data pendaftaran', value: registrations.length, icon: FileSpreadsheet },
              { label: 'Total peserta', value: totalParticipants, icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-4 border border-sand bg-cream p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest text-silk">
                  <Icon size={16} aria-hidden />
                </span>
                <div>
                  <p className="font-serif text-3xl leading-none text-ink">{value}</p>
                  <p className="mt-1 text-[0.62rem] uppercase tracking-[0.16em] text-stone">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {eventGroups.length === 0 ? (
            <div className="border border-dashed border-sand bg-cream px-5 py-10 text-center">
              <p className="font-serif text-2xl text-ink">Belum ada peserta.</p>
              <p className="mt-2 text-sm text-stone">Pendaftaran yang masuk akan tampil di sini.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setExpandedEventKeys(new Set(eventGroups.map((group) => group.key)))}
                  className="border border-sand bg-cream px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-stone transition hover:border-brown hover:text-brown"
                >
                  Buka semua
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedEventKeys(new Set())}
                  className="border border-sand bg-cream px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-stone transition hover:border-brown hover:text-brown"
                >
                  Tutup semua
                </button>
              </div>

              {eventGroups.map((group) => {
              const participants = group.registrations.reduce(
                (total, registration) => total + registration.participants,
                0
              )
              const expanded = expandedEventKeys.has(group.key)
              const reportEvent = reportEvents.find((event) => event.id === group.key)

              return (
                <article key={group.key} className="overflow-hidden border border-sand bg-cream">
                  <button
                    type="button"
                    onClick={() => toggleEvent(group.key)}
                    aria-expanded={expanded}
                    className="flex w-full flex-wrap items-center justify-between gap-3 bg-forest px-5 py-4 text-left text-silk transition hover:bg-forest/95"
                  >
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-silk/50">Event Mbatik Bareng</p>
                      <h3 className="mt-1 font-serif text-2xl">{group.label}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.12em]">
                      <span className="rounded-full border border-silk/15 px-3 py-2">
                        {group.registrations.length} pendaftaran
                      </span>
                      <span className="rounded-full bg-brown px-3 py-2 text-silk">
                        {participants} peserta
                      </span>
                      {reportEvent ? (
                        <span className="rounded-full border border-silk/25 bg-silk/10 px-3 py-2 text-silk">
                          Sisa {reportEvent.available_slots} dari {reportEvent.total_slots}
                        </span>
                      ) : null}
                      <span className="grid h-9 w-9 place-items-center rounded-full border border-silk/20">
                        <ChevronDown
                          size={17}
                          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                          aria-hidden
                        />
                      </span>
                    </div>
                  </button>

                  {expanded ? <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-sand text-[0.6rem] uppercase tracking-[0.16em] text-stone">
                          <th className="px-5 py-3 font-semibold">Nama</th>
                          <th className="px-4 py-3 font-semibold">Kontak</th>
                          <th className="px-4 py-3 text-center font-semibold">Peserta</th>
                          <th className="px-4 py-3 font-semibold">Catatan</th>
                          <th className="px-5 py-3 font-semibold">Waktu daftar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.registrations.map((registration) => (
                          <tr key={registration.id} className="border-b border-sand/70 last:border-b-0">
                            <td className="px-5 py-4 font-serif text-lg text-ink">{registration.name}</td>
                            <td className="px-4 py-4 text-xs text-stone">
                              <p className="flex items-center gap-2"><Phone size={12} />{registration.whatsapp}</p>
                              {registration.email ? (
                                <p className="mt-2 flex items-center gap-2"><Mail size={12} />{registration.email}</p>
                              ) : null}
                            </td>
                            <td className="px-4 py-4 text-center font-semibold text-brown">{registration.participants}</td>
                            <td className="max-w-xs px-4 py-4 text-xs leading-5 text-stone">{registration.notes || '—'}</td>
                            <td className="whitespace-nowrap px-5 py-4 text-xs text-stone">
                              {new Intl.DateTimeFormat('id-ID', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              }).format(new Date(registration.created_at))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div> : null}
                </article>
              )
            })}
            </>
          )}
        </div>
      )}

    </section>
  )
}
