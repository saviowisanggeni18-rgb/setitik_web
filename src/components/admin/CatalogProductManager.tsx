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
  ImagePlus,
  Loader2,
  Package,
  Pencil,
  RefreshCcw,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import type { Product } from '@/data/products'
import type { CatalogProduct } from '@/lib/catalog-products'
import { formatPrice } from '@/lib/utils'
import ProductCard from '@/components/sections/ProductCard'
import { getProductCreatedTime, isProductRecentlyAdded } from '@/lib/catalog-newness'

type Props = {
  password: string
}

type FormState = {
  id: string | null
  name: string
  category: Product['category']
  subcategory: string
  motif: string
  buildingFull: string
  buildingStory: string
  price: string
  priceNote: string
  shopeeUrl: string
  dimensions: string
  material: string
  isPreorder: boolean
  inStock: boolean
  isVisible: boolean
  sortOrder: string
}

const emptyForm: FormState = {
  id: null,
  name: '',
  category: 'batik-tulis',
  subcategory: '',
  motif: '',
  buildingFull: '',
  buildingStory: '',
  price: '',
  priceNote: '',
  shopeeUrl: '',
  dimensions: '',
  material: '',
  isPreorder: true,
  inStock: true,
  isVisible: true,
  sortOrder: '1000',
}

const categoryLabels: Record<Product['category'], string> = {
  'batik-tulis': 'Batik tulis',
  'batik-cap': 'Batik cap',
  'produk-lain': 'Produk lain',
}

const categoryOptions: Product['category'][] = ['batik-tulis', 'batik-cap', 'produk-lain']

function toForm(product: CatalogProduct): FormState {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    subcategory: product.subcategory,
    motif: product.motif,
    buildingFull: product.buildingFull,
    buildingStory: product.buildingStory,
    price: String(product.price),
    priceNote: product.priceNote ?? '',
    shopeeUrl: product.shopeeUrl ?? '',
    dimensions: product.dimensions,
    material: product.material,
    isPreorder: product.isPreorder,
    inStock: product.inStock,
    isVisible: product.isVisible,
    sortOrder: String(product.sortOrder),
  }
}

function cleanPrice(value: string) {
  return value.replace(/[^\d]/g, '')
}

function parseImagePosition(value?: string) {
  const matches = value?.match(/([\d.]+)%\s+([\d.]+)%/)
  return {
    x: matches ? Number(matches[1]) : 50,
    y: matches ? Number(matches[2]) : 50,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function sortAdminCatalogProducts(list: CatalogProduct[]) {
  return [...list].sort((a, b) => {
    const aIsNew = isProductRecentlyAdded(a)
    const bIsNew = isProductRecentlyAdded(b)

    if (aIsNew !== bIsNew) return aIsNew ? -1 : 1

    if (aIsNew && bIsNew) {
      return getProductCreatedTime(b) - getProductCreatedTime(a)
    }

    return a.sortOrder - b.sortOrder
  })
}

function getCatalogCardClass(index: number) {
  const pattern = [
    'md:col-span-12 xl:col-span-7',
    'md:col-span-6 xl:col-span-5',
    'md:col-span-6 xl:col-span-4',
    'md:col-span-6 xl:col-span-4',
    'md:col-span-6 xl:col-span-4',
  ]

  return pattern[index] ?? 'md:col-span-6 xl:col-span-4'
}

function AdminCatalogCard({
  product,
  index,
  deleting,
  onEdit,
  onDelete,
}: {
  product: CatalogProduct
  index: number
  deleting: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className={`relative ${getCatalogCardClass(index)}`}>
      <ProductCard
        product={product}
        index={index}
        featured={index === 0}
        compactMobile
        className={`h-full ${product.isVisible ? '' : 'opacity-55 grayscale'}`}
      />

      <div className="absolute right-3 top-3 z-40 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-sand bg-silk/95 px-3 text-xs font-semibold text-forest shadow-[0_10px_24px_rgba(31,45,34,0.16)] backdrop-blur transition hover:border-brown hover:text-brown"
        >
          <Pencil size={14} />
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-red-200 bg-red-50/95 px-3 text-xs font-semibold text-red-700 shadow-[0_10px_24px_rgba(127,29,29,0.1)] backdrop-blur transition hover:border-red-300 hover:bg-red-100 disabled:pointer-events-none disabled:opacity-45"
        >
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          {product.source === 'built-in' ? 'Sembunyikan' : 'Hapus'}
        </button>
      </div>

      {!product.isVisible && (
        <span className="absolute left-3 top-3 z-40 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-red-700">
          Sembunyi
        </span>
      )}
    </div>
  )
}

export default function CatalogProductManager({ password }: Props) {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [image, setImage] = useState<File | null>(null)
  const [buildingImage, setBuildingImage] = useState<File | null>(null)
  const [includeBuildingImage, setIncludeBuildingImage] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [buildingPreviewUrl, setBuildingPreviewUrl] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const [existingBuildingImageUrl, setExistingBuildingImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [configured, setConfigured] = useState(true)
  const [editorOpen, setEditorOpen] = useState(false)
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 })
  const [imageZoom, setImageZoom] = useState(1)
  const [buildingImagePosition, setBuildingImagePosition] = useState({ x: 50, y: 50 })
  const [buildingImageZoom, setBuildingImageZoom] = useState(1)
  const previewFrameRef = useRef<HTMLDivElement>(null)
  const buildingPreviewFrameRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{
    pointerX: number
    pointerY: number
    imageX: number
    imageY: number
  } | null>(null)
  const buildingDragStartRef = useRef<{
    pointerX: number
    pointerY: number
    imageX: number
    imageY: number
  } | null>(null)
  const buildingWasDraggedRef = useRef(false)

  const editing = Boolean(form.id)
  const canSubmit = useMemo(
    () =>
      Boolean(
        password &&
          form.name.trim() &&
          form.subcategory.trim() &&
          form.motif.trim() &&
          form.buildingFull.trim() &&
          form.buildingStory.trim() &&
          form.price.trim() &&
          form.dimensions.trim() &&
          form.material.trim() &&
          (editing || image) &&
          !submitting
      ),
    [editing, form, image, password, submitting]
  )

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleImageChange(file: File | null) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setImage(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  function handleBuildingImageChange(file: File | null) {
    if (buildingPreviewUrl) {
      URL.revokeObjectURL(buildingPreviewUrl)
    }

    setBuildingImage(file)
    setBuildingPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  function resetForm() {
    setForm(emptyForm)
    setIncludeBuildingImage(false)
    setExistingImageUrl(null)
    setExistingBuildingImageUrl(null)
    handleImageChange(null)
    handleBuildingImageChange(null)
    setImagePosition({ x: 50, y: 50 })
    setImageZoom(1)
    setBuildingImagePosition({ x: 50, y: 50 })
    setBuildingImageZoom(1)
    setEditorOpen(false)
  }

  async function loadProducts() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/catalog-products', { cache: 'no-store' })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Gagal mengambil katalog.')
      }

      setConfigured(Boolean(payload.configured))
      setProducts(sortAdminCatalogProducts(payload.products ?? []))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Gagal mengambil katalog.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadProducts()
    }, 0)

    return () => window.clearTimeout(loadTimer)
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      if (buildingPreviewUrl) {
        URL.revokeObjectURL(buildingPreviewUrl)
      }
    }
  }, [buildingPreviewUrl, previewUrl])

  function startEdit(product: CatalogProduct) {
    setForm(toForm(product))
    setIncludeBuildingImage(Boolean(product.buildingImage))
    setExistingImageUrl(product.image)
    setExistingBuildingImageUrl(product.buildingImage ?? null)
    handleImageChange(null)
    handleBuildingImageChange(null)
    setImagePosition(parseImagePosition(product.imagePosition))
    setImageZoom(product.imageZoom ?? 1)
    setBuildingImagePosition(parseImagePosition(product.buildingImagePosition))
    setBuildingImageZoom(product.buildingImageZoom ?? 1)
    setEditorOpen(true)
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startAdd() {
    setForm(emptyForm)
    setIncludeBuildingImage(false)
    setExistingImageUrl(null)
    setExistingBuildingImageUrl(null)
    handleImageChange(null)
    handleBuildingImageChange(null)
    setImagePosition({ x: 50, y: 50 })
    setImageZoom(1)
    setBuildingImagePosition({ x: 50, y: 50 })
    setBuildingImageZoom(1)
    setEditorOpen(true)
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSubmitting(true)
    setMessage('')
    setError('')

    const formData = new FormData()
    formData.set('password', password)
    formData.set('name', form.name.trim())
    formData.set('category', form.category)
    formData.set('subcategory', form.subcategory.trim())
    formData.set('motif', form.motif.trim())
    formData.set('buildingFull', form.buildingFull.trim())
    formData.set('buildingStory', form.buildingStory.trim())
    formData.set('price', cleanPrice(form.price))
    formData.set('priceNote', form.priceNote.trim())
    formData.set('shopeeUrl', form.shopeeUrl.trim())
    formData.set('dimensions', form.dimensions.trim())
    formData.set('material', form.material.trim())
    formData.set('isPreorder', String(form.isPreorder))
    formData.set('inStock', String(form.inStock))
    formData.set('isVisible', String(form.isVisible))
    formData.set('sortOrder', form.sortOrder || '1000')
    formData.set('removeBuildingImage', String(!includeBuildingImage))
    formData.set('imagePosition', `${imagePosition.x.toFixed(2)}% ${imagePosition.y.toFixed(2)}%`)
    formData.set('imageZoom', imageZoom.toFixed(2))
    formData.set(
      'buildingImagePosition',
      `${buildingImagePosition.x.toFixed(2)}% ${buildingImagePosition.y.toFixed(2)}%`
    )
    formData.set('buildingImageZoom', buildingImageZoom.toFixed(2))

    if (image) {
      formData.set('image', image)
    }

    if (includeBuildingImage && buildingImage) {
      formData.set('buildingImage', buildingImage)
    }

    try {
      const response = await fetch(
        editing ? `/api/catalog-products/${form.id}` : '/api/catalog-products',
        {
          method: editing ? 'PATCH' : 'POST',
          body: formData,
        }
      )
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Gagal menyimpan produk.')
      }

      const savedProduct = payload.product as CatalogProduct
      setProducts((current) => {
        const withoutSaved = current.filter((product) => product.id !== savedProduct.id)
        return sortAdminCatalogProducts([...withoutSaved, savedProduct])
      })
      resetForm()
      setMessage(editing ? 'Produk berhasil diperbarui di halaman Belanja.' : 'Produk baru berhasil masuk ke halaman Belanja.')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Gagal menyimpan produk.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(product: CatalogProduct) {
    const confirmed = window.confirm(
      product.source === 'built-in'
        ? 'Sembunyikan produk bawaan ini dari halaman Belanja?'
        : 'Hapus produk ini dari halaman Belanja?'
    )

    if (!confirmed) return

    const formData = new FormData()
    formData.set('password', password)

    setDeletingId(product.id)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`/api/catalog-products/${product.id}`, {
        method: 'DELETE',
        body: formData,
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Gagal menghapus produk.')
      }

      setProducts((current) =>
        product.source === 'built-in'
          ? current.map((item) =>
              item.id === product.id ? { ...item, isVisible: false } : item
            )
          : current.filter((item) => item.id !== product.id)
      )
      setMessage(
        product.source === 'built-in'
          ? 'Produk bawaan disembunyikan dari Belanja.'
          : 'Produk berhasil dihapus dari Belanja.'
      )
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Gagal menghapus produk.')
    } finally {
      setDeletingId(null)
    }
  }

  const previewImage = previewUrl ?? existingImageUrl
  const buildingPreviewImage = buildingPreviewUrl ?? existingBuildingImageUrl
  const visibleCount = products.filter((product) => product.isVisible).length

  function handlePreviewWheel(event: ReactWheelEvent<HTMLDivElement>) {
    if (!previewImage) return
    event.preventDefault()
    const direction = event.deltaY < 0 ? 0.1 : -0.1
    setImageZoom((current) => Number(clamp(current + direction, 0.75, 3).toFixed(2)))
  }

  function handlePreviewPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!previewImage) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      imageX: imagePosition.x,
      imageY: imagePosition.y,
    }
  }

  function handlePreviewPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const start = dragStartRef.current
    const frame = previewFrameRef.current
    if (!start || !frame) return

    const bounds = frame.getBoundingClientRect()
    const deltaX = ((event.clientX - start.pointerX) / bounds.width) * 100
    const deltaY = ((event.clientY - start.pointerY) / bounds.height) * 100
    setImagePosition({
      x: clamp(start.imageX - deltaX / imageZoom, 0, 100),
      y: clamp(start.imageY - deltaY / imageZoom, 0, 100),
    })
  }

  function stopPreviewDrag(event: ReactPointerEvent<HTMLDivElement>) {
    dragStartRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function handleBuildingPreviewWheel(event: ReactWheelEvent<HTMLDivElement>) {
    if (!buildingPreviewImage) return
    event.preventDefault()
    const direction = event.deltaY < 0 ? 0.1 : -0.1
    setBuildingImageZoom((current) =>
      Number(clamp(current + direction, 0.75, 3).toFixed(2))
    )
  }

  function handleBuildingPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!buildingPreviewImage) return
    event.currentTarget.setPointerCapture(event.pointerId)
    buildingWasDraggedRef.current = false
    buildingDragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      imageX: buildingImagePosition.x,
      imageY: buildingImagePosition.y,
    }
  }

  function handleBuildingPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const start = buildingDragStartRef.current
    const frame = buildingPreviewFrameRef.current
    if (!start || !frame) return

    const bounds = frame.getBoundingClientRect()
    const deltaX = ((event.clientX - start.pointerX) / bounds.width) * 100
    const deltaY = ((event.clientY - start.pointerY) / bounds.height) * 100
    if (Math.abs(event.clientX - start.pointerX) > 3 || Math.abs(event.clientY - start.pointerY) > 3) {
      buildingWasDraggedRef.current = true
    }
    setBuildingImagePosition({
      x: clamp(start.imageX - deltaX / buildingImageZoom, 0, 100),
      y: clamp(start.imageY - deltaY / buildingImageZoom, 0, 100),
    })
  }

  function stopBuildingDrag(event: ReactPointerEvent<HTMLDivElement>) {
    buildingDragStartRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div className="grid gap-6">
      {editorOpen && (
      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <form
        onSubmit={handleSubmit}
        className="border border-sand bg-silk p-5 shadow-[0_18px_70px_rgba(63,47,27,0.08)] sm:p-6"
      >
        <div className="mb-5 flex items-start gap-4 border-b border-sand pb-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brown text-silk">
            <Package size={18} aria-hidden />
          </span>
          <div>
            <p className="font-serif text-3xl leading-tight text-ink">
              {editing ? 'Edit produk Belanja' : 'Tambah produk Belanja'}
            </p>
            <p className="mt-2 text-sm leading-7 text-stone">
              Isi bagian ini seperti kartu produk yang muncul di halaman Belanja.
            </p>
          </div>
        </div>

        {!configured && (
          <div className="mb-5 border border-brown/30 bg-cream p-4 text-sm leading-7 text-stone">
            Modul katalog belum tersambung ke Supabase. Lengkapi environment variable terlebih dulu.
          </div>
        )}

        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                Nama produk
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => setField('name', event.target.value)}
                className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
                placeholder="Contoh: Outer Nona"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                Kategori
              </span>
              <select
                value={form.category}
                onChange={(event) => setField('category', event.target.value as Product['category'])}
                className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                Jenis kecil
              </span>
              <input
                type="text"
                value={form.subcategory}
                onChange={(event) => setField('subcategory', event.target.value)}
                className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
                placeholder="taplak / outer / kain-panjang"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                Motif
              </span>
              <input
                type="text"
                value={form.motif}
                onChange={(event) => setField('motif', event.target.value)}
                className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
                placeholder="Contoh: Gereja Blenduk"
                required
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
              Cerita/deskripsi di kartu produk
            </span>
            <textarea
              value={form.buildingStory}
              onChange={(event) => setField('buildingStory', event.target.value)}
              className="min-h-28 resize-y border border-sand bg-cream px-4 py-3 text-sm leading-7 outline-none transition focus:border-brown"
              placeholder="Tulis deskripsi natural yang akan terbaca di katalog."
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
              Inspirasi/bangunan
            </span>
            <input
              type="text"
              value={form.buildingFull}
              onChange={(event) => setField('buildingFull', event.target.value)}
              className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
              placeholder="Contoh: Gedung Spaarbank, Kota Lama Semarang"
              required
            />
          </label>

          <div className="grid min-w-0 gap-5 sm:grid-cols-3">
            <label className="grid min-w-0 gap-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                Harga
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={form.price}
                onChange={(event) => setField('price', cleanPrice(event.target.value))}
                className="h-12 min-w-0 w-full border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
                placeholder="250000"
                required
              />
            </label>

            <label className="grid min-w-0 gap-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                Ukuran
              </span>
              <input
                type="text"
                value={form.dimensions}
                onChange={(event) => setField('dimensions', event.target.value)}
                className="h-12 min-w-0 w-full border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
                placeholder="All size / 40 x 50 cm"
                required
              />
            </label>

            <label className="grid min-w-0 gap-2">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
                Bahan
              </span>
              <input
                type="text"
                value={form.material}
                onChange={(event) => setField('material', event.target.value)}
                className="h-12 min-w-0 w-full border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
                placeholder="Katun Primis"
                required
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
              Catatan harga
            </span>
            <input
              type="text"
              value={form.priceNote}
              onChange={(event) => setField('priceNote', event.target.value)}
              className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
              placeholder="Opsional: Pre-order 2-3 bulan"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
              Link Shopee produk
            </span>
            <input
              type="url"
              value={form.shopeeUrl}
              onChange={(event) => setField('shopeeUrl', event.target.value)}
              className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
              placeholder="Opsional: https://shopee.co.id/..."
            />
          </label>

          <label className="group grid min-h-52 cursor-pointer place-items-center border-2 border-dashed border-brown/45 bg-cream p-4 text-center transition hover:border-forest">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => handleImageChange(event.target.files?.[0] ?? null)}
              required={!editing}
            />
            {previewImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewImage}
                alt="Preview foto produk"
                className="max-h-80 w-full object-contain"
              />
            ) : (
              <span className="flex flex-col items-center gap-3 text-stone">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-brown text-silk">
                  <ImagePlus size={22} aria-hidden />
                </span>
                <span className="font-serif text-2xl text-ink">Foto produk</span>
                <span className="text-xs">JPG, PNG, atau WEBP. Maksimal 8 MB.</span>
              </span>
            )}
          </label>

          <fieldset className="grid gap-3 border border-sand bg-cream p-4">
            <legend className="px-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
              Foto bangunan
            </legend>
            <p className="text-sm leading-6 text-stone">
              Apakah ingin menambahkan foto bangunan asli?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                aria-pressed={includeBuildingImage}
                onClick={() => setIncludeBuildingImage(true)}
                className={`h-11 border px-4 text-sm font-semibold transition ${
                  includeBuildingImage
                    ? 'border-forest bg-forest text-silk'
                    : 'border-sand bg-silk text-stone hover:border-forest'
                }`}
              >
                Ya, tambahkan
              </button>
              <button
                type="button"
                aria-pressed={!includeBuildingImage}
                onClick={() => {
                  setIncludeBuildingImage(false)
                  handleBuildingImageChange(null)
                }}
                className={`h-11 border px-4 text-sm font-semibold transition ${
                  !includeBuildingImage
                    ? 'border-forest bg-forest text-silk'
                    : 'border-sand bg-silk text-stone hover:border-forest'
                }`}
              >
                Tidak perlu
              </button>
            </div>
          </fieldset>

          {includeBuildingImage && (
            <label className="group grid min-h-52 cursor-pointer place-items-center border-2 border-dashed border-brown/25 bg-cream p-4 text-center transition hover:border-forest">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => handleBuildingImageChange(event.target.files?.[0] ?? null)}
              />
              {buildingPreviewImage ? (
                <div
                  ref={buildingPreviewFrameRef}
                  className="relative aspect-[4/3] w-full touch-none overflow-hidden bg-sand cursor-grab active:cursor-grabbing"
                  onWheel={handleBuildingPreviewWheel}
                  onPointerDown={handleBuildingPointerDown}
                  onPointerMove={handleBuildingPointerMove}
                  onPointerUp={stopBuildingDrag}
                  onPointerCancel={stopBuildingDrag}
                  onClick={(event) => {
                    if (buildingWasDraggedRef.current) event.preventDefault()
                    buildingWasDraggedRef.current = false
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={buildingPreviewImage}
                    alt="Preview foto bangunan"
                    draggable={false}
                    className="h-full w-full select-none object-cover"
                    style={{
                      objectPosition: `${buildingImagePosition.x}% ${buildingImagePosition.y}%`,
                      transform: `scale(${buildingImageZoom})`,
                      transformOrigin: `${buildingImagePosition.x}% ${buildingImagePosition.y}%`,
                    }}
                  />
                </div>
              ) : (
                <span className="flex flex-col items-center gap-3 text-stone">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-forest text-silk">
                    <ImagePlus size={22} aria-hidden />
                  </span>
                  <span className="font-serif text-2xl text-ink">Pilih foto bangunan</span>
                  <span className="text-xs">JPG, PNG, atau WEBP. Maksimal 8 MB.</span>
                </span>
              )}
            </label>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-3 border border-sand bg-cream px-4 py-3 text-sm text-stone">
              <input
                type="checkbox"
                checked={form.isVisible}
                onChange={(event) => setField('isVisible', event.target.checked)}
              />
              Tampil di Belanja
            </label>
            <label className="flex items-center gap-3 border border-sand bg-cream px-4 py-3 text-sm text-stone">
              <input
                type="checkbox"
                checked={form.isPreorder}
                onChange={(event) => setField('isPreorder', event.target.checked)}
              />
              Pre-order
            </label>
            <label className="flex items-center gap-3 border border-sand bg-cream px-4 py-3 text-sm text-stone">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(event) => setField('inStock', event.target.checked)}
              />
              Stok tersedia
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-stone">
              Urutan tampil
            </span>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(event) => setField('sortOrder', event.target.value)}
              className="h-12 border border-sand bg-cream px-4 text-sm outline-none transition focus:border-brown"
            />
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

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-12 items-center justify-center gap-2 bg-forest px-5 text-sm font-semibold text-silk transition hover:bg-brown disabled:pointer-events-none disabled:opacity-50"
            >
              {submitting ? <Loader2 size={17} className="animate-spin" /> : <Upload size={17} />}
              {editing ? 'Simpan Perubahan' : 'Tambah ke Belanja'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-12 items-center justify-center gap-2 border border-sand bg-cream px-5 text-sm font-semibold text-stone transition hover:border-brown hover:text-brown"
              >
                <X size={17} />
                Batal edit
              </button>
            )}
          </div>
        </div>
        </form>

        <div className="grid gap-6">
        <div className="border border-sand bg-cream p-5 shadow-[0_18px_60px_rgba(63,47,27,0.07)] sm:p-6">
          <p className="mb-4 flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brown">
            <span className="h-px w-9 bg-brown" />
            Preview Kartu Belanja
          </p>
          <div className="overflow-hidden rounded-[24px] border border-sand bg-silk">
            <div
              ref={previewFrameRef}
              className={`relative aspect-[4/3] touch-none overflow-hidden bg-[#e7dac8] ${
                previewImage ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
              onWheel={handlePreviewWheel}
              onPointerDown={handlePreviewPointerDown}
              onPointerMove={handlePreviewPointerMove}
              onPointerUp={stopPreviewDrag}
              onPointerCancel={stopPreviewDrag}
            >
              {previewImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewImage}
                  alt="Preview produk"
                  draggable={false}
                  className="h-full w-full select-none object-cover"
                  style={{
                    objectPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                    transform: `scale(${imageZoom})`,
                    transformOrigin: `${imagePosition.x}% ${imagePosition.y}%`,
                  }}
                />
              ) : (
                <div className="grid h-full place-items-center px-6 text-center text-sm leading-7 text-stone">
                  Foto produk akan muncul di sini.
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-brown">
                {categoryLabels[form.category]} / {form.subcategory || 'jenis produk'}
              </p>
              <h3 className="mt-2 font-serif text-3xl leading-tight text-ink">
                {form.name || 'Nama produk'}
              </h3>
              <p className="mt-2 font-serif text-2xl text-ink">{form.motif || 'Motif produk'}</p>
              <p className="mt-3 text-sm leading-7 text-stone">
                {form.buildingStory || 'Deskripsi produk akan terlihat di kartu Belanja.'}
              </p>
              <p className="mt-5 border-t border-sand pt-4 text-sm text-ink">
                {form.price ? formatPrice(Number(cleanPrice(form.price))) : 'Harga belum diisi'}
                {form.priceNote ? ` - ${form.priceNote}` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
      )}

      <div className="border border-sand bg-silk shadow-[0_18px_70px_rgba(63,47,27,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand px-5 py-4">
            <div>
              <p className="font-serif text-3xl leading-tight text-ink">Produk di halaman Belanja</p>
              <p className="mt-1 text-sm text-stone">
                {visibleCount} produk tampil dari {products.length} data katalog
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startAdd}
                className="inline-flex h-10 items-center gap-2 bg-forest px-4 text-sm font-semibold text-silk transition hover:bg-brown"
              >
                <Package size={16} />
                Tambah Produk
              </button>
              <button
                type="button"
                onClick={() => void loadProducts()}
                className="inline-flex h-10 items-center gap-2 border border-sand bg-cream px-4 text-sm font-semibold text-stone transition hover:border-brown hover:text-brown"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
                Muat ulang
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-3 md:grid-cols-12 md:gap-6 md:p-5">
            {loading ? (
              <div className="col-span-full flex items-center gap-3 text-sm text-stone">
                <Loader2 size={16} className="animate-spin" />
                Memuat katalog...
              </div>
            ) : products.length === 0 ? (
              <p className="col-span-full text-sm leading-7 text-stone">
                Belum ada produk katalog. Jalankan SQL terbaru lalu muat ulang halaman ini.
              </p>
            ) : (
              products.map((product, index) => (
                <AdminCatalogCard
                  key={product.id}
                  product={product}
                  index={index}
                  deleting={deletingId === product.id}
                  onEdit={() => startEdit(product)}
                  onDelete={() => void handleDelete(product)}
                />
              ))
            )}
          </div>
        </div>
      </div>
  )
}
