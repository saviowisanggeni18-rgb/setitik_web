'use client'

import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
  Check,
  X,
} from 'lucide-react'
import type { HomepageSection, HomepageSectionTemplate } from '@/lib/homepage-sections'
import HeroSection from '@/components/sections/HeroSection'
import BuildingToFabricSection from '@/components/sections/BuildingToFabricSection'
import InspirationMapSection from '@/components/sections/InspirationMapSection'
import FounderQuoteSection from '@/components/sections/FounderQuoteSection'
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection'
import MbatikBarengHighlight from '@/components/sections/MbatikBarengHighlight'
import LocationNavigationSection from '@/components/sections/LocationNavigationSection'
import CustomHomepageSection from '@/components/sections/CustomHomepageSection'
import AboutAnimated from '@/components/sections/AboutAnimated'
import ImpactAnimated from '@/components/sections/ImpactAnimated'
import CollaborationEventsSection from '@/components/sections/CollaborationEventsSection'

type Props = {
  password: string
  page?: 'home' | 'about' | 'impact'
}

function TemplateThumbnail({ template }: { template: HomepageSectionTemplate }) {
  if (template === 'immersive') {
    return <div className="relative h-28 overflow-hidden rounded-xl bg-forest"><div className="absolute inset-3 rounded-lg border border-silk/20" /><div className="absolute bottom-5 left-5 h-3 w-24 bg-silk/85" /><div className="absolute bottom-10 left-5 h-2 w-12 bg-brown" /></div>
  }
  if (template === 'statement') {
    return <div className="grid h-28 grid-cols-[1.15fr_0.85fr] overflow-hidden rounded-xl border border-sand bg-cream"><div className="p-4"><div className="h-3 w-16 bg-ink/80" /><div className="mt-3 h-3 w-24 bg-ink/50" /><div className="mt-9 h-px w-full bg-sand" /></div><div className="bg-forest" /></div>
  }
  if (template === 'image-left') {
    return <div className="grid h-28 grid-cols-2 overflow-hidden rounded-xl border border-sand"><div className="bg-brown/55" /><div className="bg-silk p-4"><div className="h-2 w-10 bg-brown" /><div className="mt-4 h-3 w-20 bg-ink/75" /><div className="mt-3 h-2 w-16 bg-stone/35" /></div></div>
  }
  if (template === 'mosaic') {
    return <div className="grid h-28 grid-cols-3 grid-rows-2 gap-1.5 overflow-hidden rounded-xl bg-forest p-1.5"><div className="row-span-2 bg-brown/60" /><div className="bg-silk/30" /><div className="bg-brown/40" /><div className="col-span-2 flex items-end bg-silk p-3"><div className="h-3 w-20 bg-forest" /></div></div>
  }
  if (template === 'quote') {
    return <div className="flex h-28 items-center justify-between overflow-hidden rounded-xl bg-forest p-5"><div><div className="font-serif text-4xl leading-none text-brown">“</div><div className="h-3 w-24 bg-silk/85" /><div className="mt-3 h-2 w-16 bg-silk/30" /></div><div className="h-16 w-12 rounded-full bg-silk/20" /></div>
  }
  if (template === 'magazine') {
    return <div className="grid h-28 grid-cols-[1.2fr_0.8fr] gap-1.5 overflow-hidden rounded-xl bg-silk p-1.5"><div className="relative bg-brown/45"><div className="absolute bottom-3 left-3 h-3 w-20 bg-silk" /></div><div className="grid gap-1.5"><div className="bg-forest" /><div className="bg-sand p-2"><div className="h-2 w-12 bg-ink/70" /></div></div></div>
  }
  if (template === 'overlap') {
    return <div className="relative h-28 overflow-hidden rounded-xl bg-sand"><div className="absolute inset-y-2 left-2 w-3/5 rounded-lg bg-brown/55" /><div className="absolute bottom-3 right-2 w-3/5 rounded-lg bg-forest p-3 shadow-lg"><div className="h-2 w-16 bg-silk" /><div className="mt-2 h-1.5 w-10 bg-silk/40" /></div></div>
  }
  if (template === 'banner') {
    return <div className="relative h-28 overflow-hidden rounded-xl bg-brown/50"><div className="absolute inset-x-3 bottom-3 rounded-lg bg-silk/95 p-3"><div className="h-3 w-24 bg-ink/75" /><div className="mt-2 h-1.5 w-16 bg-stone/40" /></div></div>
  }
  if (template === 'minimal') {
    return <div className="flex h-28 flex-col justify-between overflow-hidden rounded-xl border border-sand bg-silk p-4"><div className="h-2 w-10 bg-brown" /><div><div className="h-3 w-28 bg-ink/80" /><div className="mt-3 h-px w-full bg-sand" /><div className="mt-3 h-1.5 w-20 bg-stone/40" /></div></div>
  }
  return <div className="grid h-28 grid-cols-[0.85fr_1.15fr] overflow-hidden rounded-xl border border-sand"><div className="bg-silk p-4"><div className="h-2 w-10 bg-brown" /><div className="mt-4 h-3 w-20 bg-ink/75" /><div className="mt-3 h-2 w-16 bg-stone/35" /></div><div className="bg-brown/50" /></div>
}

function EditableSectionPreview({
  section,
  editing,
  children,
  onTitleChange,
  onDescriptionChange,
  onImageChange,
}: {
  section: HomepageSection
  editing: boolean
  children: ReactNode
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onImageChange: (file: File) => void
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const heading = root.querySelector<HTMLElement>('h1, h2')
    const paragraphs = [...root.querySelectorAll<HTMLElement>('p')]
    const description =
      paragraphs.find((item) => (item.textContent?.trim().length ?? 0) > 70) ??
      [...paragraphs].sort(
        (a, b) => (b.textContent?.trim().length ?? 0) - (a.textContent?.trim().length ?? 0)
      )[0]
    const images = [...root.querySelectorAll<HTMLImageElement>('img')]
    const editableImage =
      images.find((item) => section.imageUrl && item.src === section.imageUrl) ?? images[0]

    const markText = (element: HTMLElement | undefined | null, field: 'title' | 'description') => {
      if (!element) return
      element.contentEditable = editing ? 'true' : 'false'
      element.dataset.homepageField = field
      element.classList.toggle('cursor-text', editing)
      element.classList.toggle('outline', editing)
      element.classList.toggle('outline-2', editing)
      element.classList.toggle('outline-offset-4', editing)
      element.classList.toggle('outline-brown/70', editing)
    }

    markText(heading, 'title')
    markText(description, 'description')

    if (editableImage) {
      editableImage.dataset.homepageImage = 'true'
      const imageContainer = editableImage.closest<HTMLElement>('figure') ?? editableImage.parentElement
      if (imageContainer) {
        imageContainer.dataset.homepageImageContainer = 'true'
        imageContainer.classList.toggle('cursor-pointer', editing)
        imageContainer.classList.toggle('ring-4', editing)
        imageContainer.classList.toggle('ring-brown', editing)
        imageContainer.classList.toggle('ring-inset', editing)
      }
    }
  }, [children, editing, section.imageUrl])

  return (
    <div
      ref={rootRef}
      className={editing ? 'relative' : 'pointer-events-none'}
      onBlurCapture={(event) => {
        if (!editing) return
        const target = event.target as HTMLElement
        const value = target.innerText.trim()
        if (target.dataset.homepageField === 'title') onTitleChange(value)
        if (target.dataset.homepageField === 'description') onDescriptionChange(value)
      }}
      onClickCapture={(event) => {
        if (!editing) return
        const target = event.target as HTMLElement
        const imageArea = target.closest<HTMLElement>('[data-homepage-image="true"]')
        if (imageArea) {
          event.preventDefault()
          event.stopPropagation()
          inputRef.current?.click()
          return
        }
        if (target.closest('a, button, iframe')) event.preventDefault()
      }}
    >
      {children}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onImageChange(file)
          event.target.value = ''
        }}
      />
      {editing && (
        <div className="pointer-events-none absolute inset-x-0 top-20 z-40 mx-auto w-fit rounded-full bg-brown px-4 py-2 text-xs font-semibold text-silk shadow-xl">
          Klik teks untuk mengetik · klik gambar untuk mengganti
        </div>
      )}
    </div>
  )
}

function LatestUpdatesAdminPreview({ section }: { section: HomepageSection }) {
  const previewImages = [
    section.imageUrl ?? '/images/collaborations/hainan-2025-fashion-show.webp',
    '/images/editorial/founder-canting.webp',
    '/images/mbatik-bareng/mbatik-jalanan-03.webp',
  ]

  return (
    <section className="bg-silk px-4 py-10 text-ink sm:px-6 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 grid gap-4 border-b border-sand pb-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-4 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-brown">
              <span className="h-px w-9 bg-brown" />
              Kabar Setitik
            </p>
            <h2 className="max-w-3xl font-serif text-4xl leading-[1.02] sm:text-5xl md:text-6xl">
              {section.title !== 'Dokumentasi terbaru' ? section.title : 'Yang baru dari Setitik.'}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-stone md:text-right">
            {section.description !== 'Bagian otomatis dari foto dan kegiatan yang diterbitkan owner.'
              ? section.description
              : 'Catatan terbaru tentang perjalanan, karya, dan perjumpaan Setitik.'}
          </p>
        </div>

        <div className="grid gap-4 rounded-[1.25rem] border border-sand bg-cream p-3 shadow-[0_24px_70px_rgba(63,47,27,0.07)] md:grid-cols-12 sm:p-4">
          {previewImages.map((src, index) => (
            <article
              key={src}
              className={`relative overflow-hidden rounded-[0.9rem] bg-forest ${
                index === 0
                  ? 'min-h-[560px] md:col-span-7 md:row-span-2'
                  : 'min-h-[270px] md:col-span-5'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Preview kabar Setitik" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/35 to-forest/5" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-silk">
                <p className="text-[0.6rem] uppercase tracking-[0.24em] text-[#d6bd91]">Cerita terbaru</p>
                <p className={`${index === 0 ? 'text-4xl' : 'text-2xl'} mt-3 font-serif`}>
                  Konten terbaru dari owner
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function renderHomepageSection(section: HomepageSection) {
  switch (section.sectionKey) {
    case 'hero':
      return <HeroSection section={section} />
    case 'building-to-fabric':
      return <BuildingToFabricSection section={section} />
    case 'inspiration-map':
      return <InspirationMapSection section={section} />
    case 'founder-quote':
      return <FounderQuoteSection section={section} />
    case 'featured-products':
      return <FeaturedProductsSection section={section} />
    case 'latest-updates':
      return <LatestUpdatesAdminPreview section={section} />
    case 'mbatik-bareng':
      return <MbatikBarengHighlight events={[]} section={section} />
    case 'location-navigation':
      return <LocationNavigationSection section={section} />
    case 'about-main':
      return <AboutAnimated section={section} />
    case 'impact-main':
      return <ImpactAnimated section={section} />
    case 'collaboration-events':
      return <CollaborationEventsSection />
    default:
      return <CustomHomepageSection section={section} />
  }
}

export default function HomepageSectionManager({ password, page = 'home' }: Props) {
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [configured, setConfigured] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [template, setTemplate] = useState<HomepageSectionTemplate | null>(null)
  const requiredSectionSyncAttempted = useRef(false)

  const orderedSections = useMemo(() => {
    const filtered = sections.filter((section) => {
      return (section.page ?? 'home') === page
    })
    return filtered.sort((a, b) => a.sortOrder - b.sortOrder)
  }, [page, sections])

  const visibleCount = orderedSections.filter((section) => section.isVisible).length
  const canCreate = Boolean(password && title.trim() && description.trim() && !submitting)

  function handleImageChange(file: File | null) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setImage(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  async function loadSections() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/homepage-sections', { cache: 'no-store' })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Gagal mengambil susunan beranda.')
      }

      setConfigured(Boolean(payload.configured))
      setSections(payload.sections ?? [])
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Gagal mengambil susunan beranda.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadSections()
    }, 0)

    return () => window.clearTimeout(loadTimer)
  }, [])

  useEffect(() => {
    const collaborationMissing =
      page === 'about' &&
      !loading &&
      !sections.some((section) => section.sectionKey === 'collaboration-events')

    if (!collaborationMissing || requiredSectionSyncAttempted.current) return

    requiredSectionSyncAttempted.current = true
    const syncTimer = window.setTimeout(() => void loadSections(), 0)
    return () => window.clearTimeout(syncTimer)
  }, [loading, page, sections])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  async function patchSection(id: string, data: Record<string, string | number | boolean>) {
    const formData = new FormData()
    formData.set('password', password)

    Object.entries(data).forEach(([key, value]) => {
      formData.set(key, String(value))
    })

    const response = await fetch(`/api/homepage-sections/${id}`, {
      method: 'PATCH',
      body: formData,
    })
    const payload = await response.json()

    if (!response.ok) {
      throw new Error(payload.message ?? 'Gagal memperbarui section.')
    }

    return payload.section as HomepageSection
  }

  async function handleToggle(section: HomepageSection) {
    setBusyId(section.id)
    setError('')
    setMessage('')

    try {
      const updated = await patchSection(section.id, { isVisible: !section.isVisible })
      setSections((current) =>
        current.map((item) => (item.id === section.id ? updated : item))
      )
      setMessage(
        updated.isVisible
          ? 'Bagian ditampilkan lagi di beranda.'
          : 'Bagian sudah dihapus dari tampilan beranda.'
      )
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Gagal memperbarui bagian.')
    } finally {
      setBusyId(null)
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    const current = orderedSections[index]
    const target = orderedSections[targetIndex]

    if (!current || !target) return

    setBusyId(current.id)
    setError('')
    setMessage('')

    try {
      const [updatedCurrent, updatedTarget] = await Promise.all([
        patchSection(current.id, { sortOrder: target.sortOrder }),
        patchSection(target.id, { sortOrder: current.sortOrder }),
      ])

      setSections((items) =>
        items.map((item) => {
          if (item.id === updatedCurrent.id) return updatedCurrent
          if (item.id === updatedTarget.id) return updatedTarget
          return item
        })
      )
      setMessage('Urutan beranda diperbarui.')
    } catch (moveError) {
      setError(moveError instanceof Error ? moveError.message : 'Gagal mengubah urutan.')
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(section: HomepageSection) {
    const confirmed = window.confirm(`Hapus permanen bagian custom "${section.label}"?`)

    if (!confirmed) return

    const formData = new FormData()
    formData.set('password', password)

    setBusyId(section.id)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`/api/homepage-sections/${section.id}`, {
        method: 'DELETE',
        body: formData,
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Gagal menghapus bagian.')
      }

      setSections((current) => current.filter((item) => item.id !== section.id))
      setMessage('Bagian custom berhasil dihapus permanen.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Gagal menghapus bagian.')
    } finally {
      setBusyId(null)
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSubmitting(true)
    setError('')
    setMessage('')

    const formData = new FormData()
    formData.set('password', password)
    formData.set('title', title.trim())
    formData.set('description', description.trim())
    formData.set('page', page)
    formData.set('template', template ?? 'editorial')
    if (image) formData.set('image', image)

    try {
      const response = await fetch(
        editingId ? `/api/homepage-sections/${editingId}` : '/api/homepage-sections',
        {
        method: editingId ? 'PATCH' : 'POST',
        body: formData,
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Gagal menambah bagian.')
      }

      setSections((current) =>
        editingId
          ? current.map((item) => (item.id === editingId ? payload.section : item))
          : [...current, payload.section]
      )
      setTitle('')
      setDescription('')
      handleImageChange(null)
      setShowCreate(false)
      setEditingId(null)
      setTemplate(null)
      setMessage(
        editingId
          ? 'Isi bagian berhasil diperbarui di beranda.'
          : 'Bagian baru berhasil ditambahkan ke beranda.'
      )
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Gagal menambah bagian.')
    } finally {
      setSubmitting(false)
    }
  }

  function startEdit(section: HomepageSection) {
    setEditingId(section.id)
    setTitle(section.title)
    setDescription(section.description)
    handleImageChange(null)
    setShowCreate(true)
    setMessage('')
    setError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setShowCreate(false)
    setTitle('')
    setDescription('')
    handleImageChange(null)
  }

  return (
    <div className="grid gap-6">
      <div className="border border-sand bg-silk shadow-[0_18px_70px_rgba(63,47,27,0.07)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand px-5 py-5">
          <div>
            <p className="mb-2 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brown">
              <span className="h-px w-9 bg-brown" />
              Preview {page === 'home' ? 'Beranda' : page === 'about' ? 'Tentang' : 'Dampak'}
            </p>
            <p className="font-serif text-4xl leading-tight text-ink">Edit halaman langsung seperti melihat websitenya.</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-stone">
              {visibleCount} bagian sedang tampil. Owner bisa menambah bagian baru,
              mengubah urutan, atau menghapus bagian dari beranda.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setShowCreate((current) => !current)
                if (showCreate) {
                  setEditingId(null)
                  setTemplate(null)
                  setTitle('')
                  setDescription('')
                  handleImageChange(null)
                }
              }}
              className="inline-flex h-10 items-center gap-2 bg-forest px-4 text-sm font-semibold text-silk transition hover:bg-brown"
            >
              {showCreate ? <X size={16} /> : <Plus size={16} />}
              {showCreate ? 'Tutup editor' : 'Tambah bagian'}
            </button>
            <button
              type="button"
              onClick={() => void loadSections()}
              className="inline-flex h-10 items-center gap-2 border border-sand bg-cream px-4 text-sm font-semibold text-stone transition hover:border-brown hover:text-brown"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
              Muat ulang
            </button>
          </div>
        </div>

        {!configured && (
          <p className="border-b border-sand bg-cream px-5 py-4 text-sm leading-7 text-stone">
            Modul belum tersambung ke Supabase. Susunan bawaan tetap tampil, tetapi perubahan
            belum bisa disimpan.
          </p>
        )}

        {error && (
          <p className="border-b border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p className="border-b border-forest/20 bg-forest/5 px-5 py-4 text-sm leading-6 text-forest">
            {message}
          </p>
        )}

        {showCreate && (
          <form
            id="homepage-inline-editor"
            onSubmit={handleCreate}
            className={`${editingId ? 'hidden' : 'grid'} grid-cols-1 gap-5 border-b border-sand bg-cream p-5 lg:items-start`}
          >
            <div className={`grid gap-5 ${!template ? 'w-full' : ''}`}>
              <fieldset className="grid gap-3">
                <legend className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                  Pilih template bagian
                </legend>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                  {([
                    ['editorial', 'Editorial'],
                    ['immersive', 'Visual penuh'],
                    ['statement', 'Pernyataan'],
                    ['image-left', 'Foto kiri'],
                    ['mosaic', 'Mozaik'],
                    ['quote', 'Kutipan'],
                    ['magazine', 'Majalah'],
                    ['overlap', 'Bertumpuk'],
                    ['banner', 'Banner foto'],
                    ['minimal', 'Minimal'],
                  ] as Array<[HomepageSectionTemplate, string]>).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        if (!template) {
                          setTitle('Judul bagian Anda')
                          setDescription('Tulis cerita bagian ini langsung pada layout yang dipilih.')
                        }
                        setTemplate(value)
                      }}
                      className={`relative border p-3 text-left transition ${
                        template === value
                          ? 'border-forest bg-forest text-silk shadow-[0_12px_30px_rgba(44,62,48,0.16)] ring-2 ring-forest ring-offset-2'
                          : 'border-sand bg-silk text-ink hover:border-brown hover:shadow-[0_10px_25px_rgba(68,52,34,0.08)]'
                      }`}
                    >
                      <TemplateThumbnail template={value} />
                      <span className="mt-3 block px-1 text-center font-serif text-xl">{label}</span>
                      {template === value ? (
                        <span className="absolute right-5 top-5 rounded-full bg-brown px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-silk">
                          Dipilih
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="hidden gap-2">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                  {editingId ? 'Ubah judul bagian' : 'Judul bagian'}
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="h-12 border border-sand bg-silk px-4 text-sm outline-none transition focus:border-brown"
                  placeholder="Contoh: Program Ramadan Setitik"
                  required
                />
              </label>

              <label className="hidden gap-2">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                  Isi singkat
                </span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="min-h-32 resize-y border border-sand bg-silk px-4 py-3 text-sm leading-7 outline-none transition focus:border-brown"
                  placeholder="Tulis kalimat yang akan tampil di halaman utama."
                  required
                />
              </label>
            </div>

            <div className="hidden gap-5">
              <label className="group grid min-h-44 cursor-pointer place-items-center border-2 border-dashed border-brown/45 bg-silk p-4 text-center transition hover:border-forest">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(event) => handleImageChange(event.target.files?.[0] ?? null)}
                />
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Preview foto bagian"
                    className="max-h-64 w-full object-contain"
                  />
                ) : (
                  <span className="flex flex-col items-center gap-3 text-stone">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-brown text-silk">
                      <ImagePlus size={18} aria-hidden />
                    </span>
                    <span className="font-serif text-2xl text-ink">
                      {editingId ? 'Ganti foto (opsional)' : 'Pilih foto opsional'}
                    </span>
                    <span className="text-xs">JPG, PNG, atau WEBP. Maksimal 8 MB.</span>
                  </span>
                )}
              </label>

              <button
                type="submit"
                disabled={!canCreate}
                className="inline-flex h-12 items-center justify-center gap-2 bg-forest px-5 text-sm font-semibold text-silk transition hover:bg-brown disabled:pointer-events-none disabled:opacity-50"
              >
                {submitting ? <Loader2 size={17} className="animate-spin" /> : <Plus size={17} />}
                {editingId ? 'Simpan Perubahan' : 'Tambah ke Beranda'}
              </button>
            </div>

            {template ? (
              <div className="grid gap-4 lg:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand pb-4">
                  <div>
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brown">
                      Isi langsung pada template
                    </p>
                    <p className="mt-1 text-sm text-stone">
                      Klik judul atau isi untuk mengetik. Klik gambar untuk menggantinya.
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.25rem] border border-sand bg-silk">
                  <EditableSectionPreview
                    section={{
                      id: 'new-section-preview',
                      sectionKey: null,
                      kind: 'custom',
                      label: title,
                      title,
                      description,
                      imageUrl: previewUrl ?? '/images/editorial/founder-canting.webp',
                      imagePath: null,
                      isVisible: true,
                      sortOrder: orderedSections.length * 10 + 10,
                      createdAt: '',
                      page,
                      template,
                    }}
                    editing
                    onTitleChange={setTitle}
                    onDescriptionChange={setDescription}
                    onImageChange={handleImageChange}
                  >
                    <CustomHomepageSection
                      section={{
                        id: 'new-section-preview',
                        sectionKey: null,
                        kind: 'custom',
                        label: title,
                        title,
                        description,
                        imageUrl: previewUrl ?? '/images/editorial/founder-canting.webp',
                        imagePath: null,
                        isVisible: true,
                        sortOrder: orderedSections.length * 10 + 10,
                        createdAt: '',
                        page,
                        template,
                      }}
                    />
                  </EditableSectionPreview>
                </div>

                <button
                  type="submit"
                  disabled={!canCreate}
                  className="inline-flex h-12 items-center justify-center gap-2 bg-forest px-5 text-sm font-semibold text-silk transition hover:bg-brown disabled:pointer-events-none disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={17} className="animate-spin" /> : <Plus size={17} />}
                  Tambah ke halaman
                </button>
              </div>
            ) : null}
          </form>
        )}

        <div className="grid gap-8 bg-cream/70 p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center gap-3 px-5 py-6 text-sm text-stone">
              <Loader2 size={16} className="animate-spin" />
              Memuat bagian beranda...
            </div>
          ) : (
            <>
            {orderedSections.map((section, index) => {
              const previewSection =
                editingId === section.id
                  ? {
                      ...section,
                      imageUrl: previewUrl ?? section.imageUrl,
                    }
                  : section

              return (
              <article
                key={section.id}
                className={`relative rounded-[1.5rem] border border-sand p-3 shadow-[0_18px_55px_rgba(63,47,27,0.08)] sm:p-4 ${
                  section.isVisible ? 'bg-silk' : 'bg-cream/75'
                }`}
              >
                <div className="sticky top-3 z-50 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.15rem] border border-white/20 bg-forest/95 p-3 text-silk shadow-[0_12px_32px_rgba(0,0,0,0.2)] backdrop-blur-md sm:px-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-silk font-serif text-lg text-brown shadow-sm">
                      {index + 1}
                    </span>
                    <span
                      className={`inline-flex h-8 items-center gap-1.5 px-3 text-xs font-semibold ${
                        section.isVisible ? 'bg-silk/15 text-silk' : 'bg-sand text-forest'
                      }`}
                    >
                      {section.isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                      {section.isVisible ? 'Tampil di website' : 'Tidak tampil'}
                    </span>
                    <span className="hidden text-xs font-semibold text-silk/70 sm:inline">{section.label}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                  {busyId === section.id || (submitting && editingId === section.id) ? (
                    <span className="inline-flex items-center gap-2 px-2 text-sm text-silk/70">
                      <Loader2 size={15} className="animate-spin" />
                      Menyimpan...
                    </span>
                  ) : editingId === section.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          (document.getElementById('homepage-inline-editor') as HTMLFormElement | null)?.requestSubmit()
                        }
                        disabled={!canCreate}
                        className="inline-flex h-9 items-center gap-2 rounded-full bg-silk px-4 text-xs font-semibold text-forest transition hover:bg-brown hover:text-silk disabled:opacity-40"
                      >
                        <Check size={15} /> Simpan
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="inline-flex h-9 items-center gap-2 rounded-full border border-silk/25 px-4 text-xs font-semibold text-silk hover:bg-silk hover:text-forest"
                      >
                        <X size={15} /> Batal
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(section)}
                        disabled={busyId === section.id}
                        className="inline-flex h-9 items-center gap-2 rounded-full bg-silk px-3 text-xs font-semibold text-forest transition hover:bg-brown hover:text-silk disabled:pointer-events-none disabled:opacity-35"
                      >
                        <Pencil size={15} />
                        Edit teks/foto
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleMove(index, -1)}
                        disabled={index === 0 || busyId === section.id}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-silk/20 text-silk transition hover:bg-silk hover:text-forest disabled:pointer-events-none disabled:opacity-35"
                        aria-label="Naikkan bagian"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleMove(index, 1)}
                        disabled={index === orderedSections.length - 1 || busyId === section.id}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-silk/20 text-silk transition hover:bg-silk hover:text-forest disabled:pointer-events-none disabled:opacity-35"
                        aria-label="Turunkan bagian"
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleToggle(section)}
                        disabled={busyId === section.id}
                        className={`inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-semibold transition disabled:pointer-events-none disabled:opacity-35 ${
                          section.isVisible
                            ? 'border border-silk/20 text-silk hover:bg-red-700'
                            : 'bg-silk text-forest hover:bg-brown hover:text-silk'
                        }`}
                      >
                        {section.isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                        {section.isVisible ? 'Hapus dari Beranda' : 'Tampilkan Lagi'}
                      </button>
                    </>
                  )}
                  </div>
                </div>

                <div
                  className={`overflow-hidden rounded-[1.1rem] border border-sand bg-silk ${
                    section.isVisible ? '' : 'opacity-40 grayscale'
                  }`}
                >
                  <EditableSectionPreview
                    section={previewSection}
                    editing={editingId === section.id}
                    onTitleChange={setTitle}
                    onDescriptionChange={setDescription}
                    onImageChange={handleImageChange}
                  >
                    {renderHomepageSection(previewSection)}
                  </EditableSectionPreview>
                </div>

                {section.kind === 'custom' && (
                  <div className="absolute bottom-4 right-4 z-40">
                    <button
                      type="button"
                      onClick={() => void handleDelete(section)}
                      disabled={busyId === section.id}
                      className="inline-flex h-10 items-center gap-2 border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:pointer-events-none disabled:opacity-35"
                    >
                      <Trash2 size={15} />
                      Hapus Permanen Bagian Tambahan
                    </button>
                  </div>
                )}
              </article>
            )})}

            </>
          )}
        </div>
      </div>
    </div>
  )
}
