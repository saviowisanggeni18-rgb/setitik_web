'use client'

import {
  FormEvent,
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  CalendarDays,
  GalleryHorizontalEnd,
  ImagePlus,
  Layers3,
  Loader2,
  Megaphone,
  Package,
  RefreshCcw,
  Trash2,
  Upload,
} from 'lucide-react'
import type { SiteUpdate, SiteUpdateTarget } from '@/lib/site-updates'
import type { MbatikEvent, MbatikEventStatus } from '@/lib/mbatik-events'
import CatalogProductManager from '@/components/admin/CatalogProductManager'
import HomepageSectionManager from '@/components/admin/HomepageSectionManager'

type Props = {
  password: string
  initialTarget?: SiteUpdateTarget
  lockedTarget?: boolean
}

const updateTargets: Array<{
  id: SiteUpdateTarget
  label: string
  shortLabel: string
  description: string
  titleLabel: string
  dateLabel: string
  descriptionLabel: string
  imageLabel: string
  titlePlaceholder: string
  descriptionPlaceholder: string
  icon: typeof Megaphone
}> = [
  {
    id: 'latest',
    label: 'Kabar Terbaru',
    shortLabel: 'Kabar',
    description: 'Dokumentasi atau berita umum yang tampil di beranda.',
    titleLabel: 'Judul kabar',
    dateLabel: 'Tanggal kabar',
    descriptionLabel: 'Ringkasan kabar',
    imageLabel: 'Foto utama kabar',
    titlePlaceholder: 'Contoh: Workshop Batik di Kota Lama',
    descriptionPlaceholder: 'Tulis ringkasan singkat tentang kabar ini.',
    icon: Megaphone,
  },
  {
    id: 'mbatik',
    label: 'Mbatik Bareng',
    shortLabel: 'Mbatik',
    description: 'Kegiatan membatik, kelas, workshop, atau dokumentasi peserta.',
    titleLabel: 'Nama kegiatan',
    dateLabel: 'Tanggal kegiatan',
    descriptionLabel: 'Cerita kegiatan',
    imageLabel: 'Foto kegiatan',
    titlePlaceholder: 'Contoh: Mbatik Bareng di Kota Lama',
    descriptionPlaceholder: 'Tulis siapa kegiatannya, suasananya, dan momen pentingnya.',
    icon: GalleryHorizontalEnd,
  },
  {
    id: 'collaboration',
    label: 'Editor Home',
    shortLabel: 'Home',
    description: 'Tambah section, atur urutan, gambar, dan tampilan halaman utama.',
    titleLabel: 'Nama event',
    dateLabel: 'Tanggal event',
    descriptionLabel: 'Cerita event',
    imageLabel: 'Foto event',
    titlePlaceholder: 'Contoh: Presentasi Setitik di Hainan 2025',
    descriptionPlaceholder: 'Tulis bentuk kolaborasi, tempat, dan hasil kegiatannya.',
    icon: CalendarDays,
  },
  {
    id: 'product',
    label: 'Produk/Katalog',
    shortLabel: 'Produk',
    description: 'Koleksi baru, detail produk, motif, atau cerita produk.',
    titleLabel: 'Nama produk atau koleksi',
    dateLabel: 'Tanggal rilis',
    descriptionLabel: 'Deskripsi produk',
    imageLabel: 'Foto produk',
    titlePlaceholder: 'Contoh: Kain Panjang Kota Lama',
    descriptionPlaceholder: 'Tulis motif, bahan, inspirasi, atau cerita produknya.',
    icon: Package,
  },
  {
    id: 'story',
    label: 'Cerita Beranda',
    shortLabel: 'Cerita',
    description: 'Cerita singkat untuk memperkaya narasi di halaman utama.',
    titleLabel: 'Judul cerita',
    dateLabel: 'Tanggal cerita',
    descriptionLabel: 'Isi cerita',
    imageLabel: 'Foto pendukung',
    titlePlaceholder: 'Contoh: Cerita di Balik Motif Blenduk',
    descriptionPlaceholder: 'Tulis cerita pendek yang ingin dibaca pengunjung website.',
    icon: Layers3,
  },
]

function formatDate(value: string | null) {
  if (!value) return 'Tanpa tanggal'

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

export default function UpdateManager({ password, initialTarget = 'latest', lockedTarget = false }: Props) {
  const [updates, setUpdates] = useState<SiteUpdate[]>([])
  const [target, setTarget] = useState<SiteUpdateTarget>(initialTarget)
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imagePositionY, setImagePositionY] = useState(50)
  const [imageZoom, setImageZoom] = useState(1)
  const updatePreviewRef = useRef<HTMLDivElement>(null)
  const updateDragRef = useRef<{ pointerY: number; positionY: number } | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [scheduleLoading, setScheduleLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingScheduleId, setDeletingScheduleId] = useState<string | null>(null)
  const [configured, setConfigured] = useState(true)
  const [mbatikEvents, setMbatikEvents] = useState<MbatikEvent[]>([])
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('09.00-12.00 WIB')
  const [scheduleLocation, setScheduleLocation] = useState('Taman Srigunting, Kota Lama Semarang')
  const [totalSlots, setTotalSlots] = useState('20')
  const [availableSlots, setAvailableSlots] = useState('20')
  const [scheduleStatus, setScheduleStatus] = useState<MbatikEventStatus>('open')

  const activeTarget = updateTargets.find((item) => item.id === target) ?? updateTargets[0]

  const canSubmit = useMemo(
    () => Boolean(password && title.trim() && description.trim() && image && !submitting),
    [description, image, password, submitting, title]
  )

  function handleImageChange(file: File | null) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setImage(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  async function loadUpdates() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/updates', { cache: 'no-store' })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Gagal mengambil update.')
      }

      setConfigured(Boolean(payload.configured))
      setUpdates(payload.updates ?? [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Gagal mengambil update.')
    } finally {
      setLoading(false)
    }
  }

  async function loadMbatikEvents() {
    setScheduleLoading(true)
    setError('')

    try {
      const response = await fetch('/api/mbatik-events', { cache: 'no-store' })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Gagal mengambil jadwal Mbatik Bareng.')
      }

      setConfigured(Boolean(payload.configured))
      setMbatikEvents(payload.events ?? [])
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Gagal mengambil jadwal Mbatik Bareng.'
      )
    } finally {
      setScheduleLoading(false)
    }
  }

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadUpdates()
      void loadMbatikEvents()
    }, 0)

    return () => window.clearTimeout(loadTimer)
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!image) return

    setSubmitting(true)
    setError('')
    setMessage('')

    const formData = new FormData()
    formData.set('password', password)
    formData.set('target', target)
    formData.set('title', title.trim())
    formData.set('eventDate', eventDate)
    formData.set('description', description.trim())
    formData.set('image', image)
    formData.set('imagePositionY', String(imagePositionY))
    formData.set('imageZoom', String(imageZoom))

    try {
      const response = await fetch('/api/updates', {
        method: 'POST',
        body: formData,
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Gagal menyimpan update.')
      }

      sessionStorage.setItem('setitik-admin-password', password)
      setUpdates((current) => [payload.update, ...current])
      setTitle('')
      setEventDate('')
      setDescription('')
      setImagePositionY(50)
      setImageZoom(1)
      handleImageChange(null)
      setMessage(`${activeTarget.label} berhasil diterbitkan ke website.`)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Gagal menyimpan update.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleUpdatePreviewWheel(event: ReactWheelEvent<HTMLDivElement>) {
    if (!previewUrl) return
    event.preventDefault()
    const direction = event.deltaY < 0 ? 0.05 : -0.05
    setImageZoom((current) =>
      Number(Math.min(1.8, Math.max(0.75, current + direction)).toFixed(2))
    )
  }

  function handleUpdatePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!previewUrl) return
    event.currentTarget.setPointerCapture(event.pointerId)
    updateDragRef.current = { pointerY: event.clientY, positionY: imagePositionY }
  }

  function handleUpdatePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const start = updateDragRef.current
    const frame = updatePreviewRef.current
    if (!start || !frame) return
    const deltaY = ((event.clientY - start.pointerY) / frame.getBoundingClientRect().height) * 100
    setImagePositionY(Math.min(100, Math.max(0, start.positionY - deltaY / imageZoom)))
  }

  function stopUpdateDrag(event: ReactPointerEvent<HTMLDivElement>) {
    updateDragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  async function handleScheduleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setScheduleSubmitting(true)
    setError('')
    setMessage('')

    const formData = new FormData()
    formData.set('password', password)
    formData.set('date', scheduleDate)
    formData.set('time', scheduleTime.trim())
    formData.set('location', scheduleLocation.trim())
    formData.set('totalSlots', totalSlots)
    formData.set('availableSlots', availableSlots)
    formData.set('status', scheduleStatus)

    try {
      const response = await fetch('/api/mbatik-events', {
        method: 'POST',
        body: formData,
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Gagal menyimpan jadwal Mbatik Bareng.')
      }

      setMbatikEvents((current) =>
        [...current, payload.event].sort((a, b) => a.date.localeCompare(b.date))
      )
      setScheduleDate('')
      setScheduleTime('09.00-12.00 WIB')
      setScheduleLocation('Taman Srigunting, Kota Lama Semarang')
      setTotalSlots('20')
      setAvailableSlots('20')
      setScheduleStatus('open')
      setMessage(payload.message ?? 'Jadwal Mbatik Bareng berhasil ditambahkan.')
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Gagal menyimpan jadwal Mbatik Bareng.'
      )
    } finally {
      setScheduleSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Hapus update ini dari website?')

    if (!confirmed) return

    const formData = new FormData()
    formData.set('password', password)

    setDeletingId(id)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`/api/updates/${id}`, {
        method: 'DELETE',
        body: formData,
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Gagal menghapus update.')
      }

      setUpdates((current) => current.filter((update) => update.id !== id))
      setMessage('Update berhasil dihapus.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Gagal menghapus update.')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleScheduleDelete(id: string) {
    const confirmed = window.confirm('Hapus jadwal Mbatik Bareng ini?')

    if (!confirmed) return

    const formData = new FormData()
    formData.set('password', password)

    setDeletingScheduleId(id)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`/api/mbatik-events/${id}`, {
        method: 'DELETE',
        body: formData,
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Gagal menghapus jadwal Mbatik Bareng.')
      }

      setMbatikEvents((current) => current.filter((event) => event.id !== id))
      setMessage('Jadwal Mbatik Bareng berhasil dihapus.')
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Gagal menghapus jadwal Mbatik Bareng.'
      )
    } finally {
      setDeletingScheduleId(null)
    }
  }

  return (
    <div className="grid gap-6">
      {!lockedTarget && <div className="border border-sand bg-silk p-5 shadow-[0_18px_70px_rgba(63,47,27,0.07)] sm:p-6">
        <div className="mb-5 border-b border-sand pb-5">
          <p className="mb-3 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brown">
            <span className="h-px w-9 bg-brown" />
            Pilih Bagian
          </p>
          <h2 className="font-serif text-4xl leading-tight text-ink">
            Bagian website mana yang mau diupdate?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-stone">
            Pilihan ini membantu form menyesuaikan bahasa dan contoh isi dengan bagian website
            yang sedang dikerjakan.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {updateTargets.map((item) => {
            const Icon = item.icon
            const active = item.id === target

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTarget(item.id)}
                className={`min-h-36 border p-4 text-left transition ${
                  active
                    ? 'border-forest bg-forest text-silk shadow-[0_16px_38px_rgba(44,62,48,0.16)]'
                    : 'border-sand bg-cream text-ink hover:border-brown'
                }`}
              >
                <span
                  className={`mb-4 grid h-11 w-11 place-items-center rounded-full border ${
                    active ? 'border-silk/25 bg-silk/8' : 'border-sand bg-silk text-brown'
                  }`}
                >
                  <Icon size={18} aria-hidden />
                </span>
                <span className="block font-serif text-2xl leading-tight">{item.label}</span>
                <span className={`mt-2 block text-xs leading-5 ${active ? 'text-silk/68' : 'text-stone'}`}>
                  {item.description}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      }

      {target === 'collaboration' ? (
        <HomepageSectionManager password={password} />
      ) : target === 'product' ? (
        <CatalogProductManager password={password} />
      ) : target === 'mbatik' ? (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={handleScheduleSubmit}
            className="border border-sand bg-silk p-5 shadow-[0_18px_70px_rgba(63,47,27,0.08)] sm:p-6"
          >
            <div className="mb-5 flex items-start gap-4 border-b border-sand pb-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brown text-silk">
                <CalendarDays size={18} aria-hidden />
              </span>
              <div>
                <p className="font-serif text-3xl leading-tight text-ink">
                  Isi jadwal Mbatik Bareng
                </p>
                <p className="mt-2 text-sm leading-7 text-stone">
                  Jadwal ini akan muncul di tulisan Jadwal terdekat dan pilihan Tanggal kegiatan.
                </p>
              </div>
            </div>

            {!configured && (
              <div className="mb-5 border border-brown/30 bg-cream p-4 text-sm leading-7 text-stone">
                Modul belum tersambung ke Supabase. Lengkapi environment variable terlebih dulu.
              </div>
            )}

            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                  Tanggal kegiatan
                </span>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(event) => setScheduleDate(event.target.value)}
                  className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                  Jam kegiatan
                </span>
                <input
                  type="text"
                  value={scheduleTime}
                  onChange={(event) => setScheduleTime(event.target.value)}
                  className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
                  placeholder="09.00-12.00 WIB"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                  Lokasi
                </span>
                <input
                  type="text"
                  value={scheduleLocation}
                  onChange={(event) => setScheduleLocation(event.target.value)}
                  className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
                  placeholder="Taman Srigunting, Kota Lama Semarang"
                  required
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                    Kuota peserta
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={totalSlots}
                    onChange={(event) => setTotalSlots(event.target.value)}
                    className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                    Sisa tempat
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={availableSlots}
                    onChange={(event) => setAvailableSlots(event.target.value)}
                    className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                  Status
                </span>
                <select
                  value={scheduleStatus}
                  onChange={(event) => setScheduleStatus(event.target.value as MbatikEventStatus)}
                  className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
                >
                  <option value="open">Buka pendaftaran</option>
                  <option value="coming-soon">Segera diumumkan</option>
                  <option value="full">Penuh</option>
                </select>
              </label>

              {error && (
                <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {error}
                </p>
              )}
              {message && (
                <p className="border border-forest/20 bg-forest/5 px-4 py-3 text-sm leading-6 text-forest">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  !password ||
                  !scheduleDate ||
                  !scheduleTime.trim() ||
                  !scheduleLocation.trim() ||
                  scheduleSubmitting
                }
                className="inline-flex h-12 items-center justify-center gap-2 bg-forest px-5 text-sm font-semibold text-silk transition hover:bg-brown disabled:pointer-events-none disabled:opacity-50"
              >
                {scheduleSubmitting ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <CalendarDays size={17} />
                )}
                Simpan Jadwal
              </button>
            </div>
          </form>

          <div className="grid gap-6">
            <div className="border border-sand bg-forest p-5 text-silk shadow-[0_18px_70px_rgba(44,62,48,0.16)] sm:p-6">
              <p className="mb-4 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brown">
                <span className="h-px w-9 bg-brown" />
                Preview Jadwal Terdekat
              </p>
              <div className="rounded-[20px] border border-silk/15 bg-silk/[0.05] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-2xl leading-tight text-silk">
                      {scheduleDate ? formatDate(scheduleDate) : 'Pilih tanggal kegiatan'}
                    </p>
                    <p className="mt-3 text-sm text-silk/65">{scheduleTime}</p>
                  </div>
                  <span className="rounded-full border border-brown/45 px-3 py-1.5 text-[8px] uppercase tracking-[0.13em] text-brown">
                    {scheduleStatus === 'open'
                      ? 'Buka'
                      : scheduleStatus === 'full'
                        ? 'Penuh'
                        : 'Segera'}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-silk/62">{scheduleLocation}</p>
                <p className="mt-4 border-t border-silk/10 pt-4 text-xs text-silk/45">
                  {availableSlots || 0} tempat tersedia dari {totalSlots || 0}
                </p>
              </div>
            </div>

            <div className="border border-sand bg-silk">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand px-5 py-4">
                <div>
                  <p className="font-serif text-3xl leading-tight text-ink">Tanggal yang tampil</p>
                  <p className="mt-1 text-sm text-stone">
                    Jadwal ini mengisi card Jadwal terdekat dan dropdown Tanggal kegiatan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void loadMbatikEvents()}
                  className="inline-flex h-10 items-center gap-2 border border-sand bg-cream px-4 text-sm font-semibold text-stone transition hover:border-brown hover:text-brown"
                >
                  {scheduleLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <RefreshCcw size={16} />
                  )}
                  Muat ulang
                </button>
              </div>

              <div className="divide-y divide-sand">
                {scheduleLoading ? (
                  <div className="flex items-center gap-3 px-5 py-6 text-sm text-stone">
                    <Loader2 size={16} className="animate-spin" />
                    Memuat jadwal...
                  </div>
                ) : mbatikEvents.length === 0 ? (
                  <p className="px-5 py-8 text-sm leading-7 text-stone">
                    Belum ada jadwal dari admin. Website akan memakai jadwal bawaan sementara.
                  </p>
                ) : (
                  mbatikEvents.map((event) => (
                    <article key={event.id} className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-brown">
                            {event.status === 'open'
                              ? 'Buka pendaftaran'
                              : event.status === 'full'
                                ? 'Penuh'
                                : 'Segera diumumkan'}
                          </p>
                          <h3 className="mt-2 font-serif text-2xl leading-tight text-ink">
                            {event.displayDate}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-stone">
                            {event.time} / {event.location}
                          </p>
                          <p className="mt-1 text-sm text-stone">
                            {event.availableSlots} tempat tersedia dari {event.totalSlots}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleScheduleDelete(event.id)}
                          disabled={deletingScheduleId === event.id}
                          className="inline-flex h-10 items-center gap-2 border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:pointer-events-none disabled:opacity-45"
                        >
                          {deletingScheduleId === event.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          Hapus
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <form
          onSubmit={handleSubmit}
          className="border border-sand bg-silk p-5 shadow-[0_18px_70px_rgba(63,47,27,0.08)] sm:p-6"
        >
          <div className="mb-5 flex items-start gap-4 border-b border-sand pb-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brown text-silk">
              <Upload size={18} aria-hidden />
            </span>
            <div>
              <p className="font-serif text-3xl leading-tight text-ink">
                Isi {activeTarget.label}
              </p>
              <p className="mt-2 text-sm leading-7 text-stone">
                Form ini mengikuti bagian website yang dipilih di atas.
              </p>
            </div>
          </div>

          {!configured && (
            <div className="mb-5 border border-brown/30 bg-cream p-4 text-sm leading-7 text-stone">
              Modul belum tersambung ke Supabase. Lengkapi environment variable terlebih dulu.
            </div>
          )}

          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                {activeTarget.titleLabel}
              </span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
                placeholder={activeTarget.titlePlaceholder}
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                {activeTarget.dateLabel}
              </span>
              <input
                type="date"
                value={eventDate}
                onChange={(event) => setEventDate(event.target.value)}
                className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                {activeTarget.descriptionLabel}
              </span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-36 resize-y border border-sand bg-cream px-4 py-3 text-sm leading-7 outline-none transition focus:border-brown"
                placeholder={activeTarget.descriptionPlaceholder}
                required
              />
            </label>

            <label className="group grid min-h-56 cursor-pointer place-items-center border-2 border-dashed border-brown/45 bg-cream p-4 text-center transition hover:border-forest">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => handleImageChange(event.target.files?.[0] ?? null)}
                required
              />
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview foto yang akan diunggah"
                  className="max-h-80 w-full object-contain"
                />
              ) : (
                <span className="flex flex-col items-center gap-3 text-stone">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-brown text-silk">
                    <ImagePlus size={22} aria-hidden />
                  </span>
                  <span className="font-serif text-2xl text-ink">{activeTarget.imageLabel}</span>
                  <span className="text-xs">JPG, PNG, atau WEBP. Maksimal 8 MB.</span>
                </span>
              )}
            </label>

            {error && (
              <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                {error}
              </p>
            )}
            {message && (
              <p className="border border-forest/20 bg-forest/5 px-4 py-3 text-sm leading-6 text-forest">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-12 items-center justify-center gap-2 bg-forest px-5 text-sm font-semibold text-silk transition hover:bg-brown disabled:pointer-events-none disabled:opacity-50"
            >
              {submitting ? <Loader2 size={17} className="animate-spin" /> : <Upload size={17} />}
              Terbitkan {activeTarget.shortLabel}
            </button>
          </div>
        </form>

        <div className="grid gap-6">
          <div className="border border-sand bg-cream p-5 shadow-[0_18px_60px_rgba(63,47,27,0.07)] sm:p-6">
            <p className="mb-4 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brown">
              <span className="h-px w-9 bg-brown" />
              Preview
            </p>
            <div className="overflow-hidden border border-sand bg-silk">
              <div
                ref={updatePreviewRef}
                className={`relative aspect-[4/3] touch-none overflow-hidden bg-[#e7dac8] ${previewUrl ? 'cursor-grab active:cursor-grabbing' : ''}`}
                onWheel={handleUpdatePreviewWheel}
                onPointerDown={handleUpdatePointerDown}
                onPointerMove={handleUpdatePointerMove}
                onPointerUp={stopUpdateDrag}
                onPointerCancel={stopUpdateDrag}
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Preview update"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      objectPosition: `center ${imagePositionY}%`,
                      transform: `scale(${imageZoom})`,
                    }}
                  />
                ) : (
                  <div className="grid h-full place-items-center px-6 text-center text-sm leading-7 text-stone">
                    Foto yang dipilih akan muncul di sini.
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-transparent to-transparent" />
                <p className="absolute left-4 top-4 border border-white/35 bg-white/90 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-forest">
                  {activeTarget.label}
                </p>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-brown">
                  {eventDate ? formatDate(eventDate) : activeTarget.dateLabel}
                </p>
                <h3 className="mt-2 font-serif text-3xl leading-tight text-ink">
                  {title || activeTarget.titlePlaceholder}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone">
                  {description || activeTarget.descriptionPlaceholder}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-sand bg-silk">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand px-5 py-4">
              <div>
                <p className="font-serif text-3xl leading-tight text-ink">Update yang sudah tampil</p>
                <p className="mt-1 text-sm text-stone">{updates.length} update diterbitkan</p>
              </div>
              <button
                type="button"
                onClick={() => void loadUpdates()}
                className="inline-flex h-10 items-center gap-2 border border-sand bg-cream px-4 text-sm font-semibold text-stone transition hover:border-brown hover:text-brown"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
                Muat ulang
              </button>
            </div>

            <div className="divide-y divide-sand">
              {loading ? (
                <div className="flex items-center gap-3 px-5 py-6 text-sm text-stone">
                  <Loader2 size={16} className="animate-spin" />
                  Memuat update...
                </div>
              ) : updates.length === 0 ? (
                <p className="px-5 py-8 text-sm leading-7 text-stone">
                  Belum ada update yang diterbitkan.
                </p>
              ) : (
                updates.map((update) => (
                  <article key={update.id} className="grid gap-4 p-5 sm:grid-cols-[150px_1fr]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={update.imageUrl}
                      alt={update.title}
                      className="aspect-[4/3] w-full bg-cream object-cover sm:w-[150px]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.16em] text-brown">
                        {formatDate(update.eventDate)} / {updateTargets.find((item) => item.id === update.target)?.label ?? 'Kabar'}
                      </p>
                      <h2 className="mt-2 font-serif text-2xl leading-tight text-ink">
                        {update.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-7 text-stone">
                        {update.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => void handleDelete(update.id)}
                        disabled={deletingId === update.id}
                        className="mt-4 inline-flex h-10 items-center gap-2 border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:pointer-events-none disabled:opacity-45"
                      >
                        {deletingId === update.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Hapus update
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
