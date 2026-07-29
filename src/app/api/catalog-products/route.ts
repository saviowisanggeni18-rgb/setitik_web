import { NextResponse } from 'next/server'
import {
  catalogCategories,
  createCatalogProduct,
  isCatalogModuleConfigured,
  listCatalogProducts,
} from '@/lib/catalog-products'
import { isAdminPasswordConfigured, isAdminPasswordValid } from '@/lib/site-updates'
import type { Product } from '@/data/products'

const maxImageSize = 8 * 1024 * 1024
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']

export const dynamic = 'force-dynamic'

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function getBoolean(formData: FormData, key: string) {
  return getText(formData, key) === 'true'
}

function parsePrice(value: string) {
  const normalized = value.replace(/[^\d]/g, '')
  const price = Number(normalized)

  return Number.isFinite(price) ? price : NaN
}

function validateOptionalImage(file: FormDataEntryValue | null, label: string) {
  if (!(file instanceof File) || file.size === 0) return null

  if (!allowedImageTypes.includes(file.type)) {
    return `${label} harus JPG, PNG, atau WEBP.`
  }

  if (file.size > maxImageSize) {
    return `${label} maksimal 8 MB.`
  }

  return null
}

export async function GET(request: Request) {
  const adminPassword = request.headers.get('x-admin-password')
  const isAdmin = isAdminPasswordConfigured() && isAdminPasswordValid(adminPassword)

  try {
    const products = await listCatalogProducts({
      visibleOnly: !isAdmin,
      fallbackToDefault: true,
    })

    return NextResponse.json(
      { configured: isCatalogModuleConfigured(), products },
      { headers: { 'Cache-Control': 'private, no-store', Vary: 'x-admin-password' } }
    )
  } catch (error) {
    return NextResponse.json(
      {
        configured: isCatalogModuleConfigured(),
        message: error instanceof Error ? error.message : 'Gagal mengambil katalog.',
        products: [],
      },
      { status: 500, headers: { 'Cache-Control': 'private, no-store', Vary: 'x-admin-password' } }
    )
  }
}

export async function POST(request: Request) {
  if (!isCatalogModuleConfigured() || !isAdminPasswordConfigured()) {
    return NextResponse.json(
      { message: 'Modul katalog belum dikonfigurasi di environment hosting.' },
      { status: 503 }
    )
  }

  const formData = await request.formData()

  if (!isAdminPasswordValid(formData.get('password'))) {
    return NextResponse.json({ message: 'Password admin tidak sesuai.' }, { status: 401 })
  }

  const name = getText(formData, 'name')
  const category = getText(formData, 'category') as Product['category']
  const subcategory = getText(formData, 'subcategory')
  const motif = getText(formData, 'motif')
  const buildingFull = getText(formData, 'buildingFull')
  const buildingStory = getText(formData, 'buildingStory')
  const price = parsePrice(getText(formData, 'price'))
  const priceNote = getText(formData, 'priceNote') || null
  const dimensions = getText(formData, 'dimensions')
  const material = getText(formData, 'material')
  const shopeeUrl = getText(formData, 'shopeeUrl') || null
  const isPreorder = getBoolean(formData, 'isPreorder')
  const inStock = getBoolean(formData, 'inStock')
  const image = formData.get('image')
  const buildingImage = formData.get('buildingImage')
  const imagePosition = getText(formData, 'imagePosition') || '50% 50%'
  const imageZoom = Math.max(0.75, Math.min(3, Number(getText(formData, 'imageZoom') || 1)))
  const buildingImagePosition = getText(formData, 'buildingImagePosition') || '50% 50%'
  const buildingImageZoom = Math.max(0.75, Math.min(3, Number(getText(formData, 'buildingImageZoom') || 1)))

  if (!catalogCategories.includes(category)) {
    return NextResponse.json({ message: 'Pilih kategori produk yang benar.' }, { status: 400 })
  }

  if (!name || !subcategory || !motif || !buildingFull || !buildingStory || !dimensions || !material) {
    return NextResponse.json(
      { message: 'Lengkapi nama, kategori, motif, cerita, ukuran, bahan, dan deskripsi produk.' },
      { status: 400 }
    )
  }

  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ message: 'Harga produk belum benar.' }, { status: 400 })
  }

  if (!(image instanceof File)) {
    return NextResponse.json({ message: 'Foto produk wajib dipilih.' }, { status: 400 })
  }

  if (!allowedImageTypes.includes(image.type)) {
    return NextResponse.json(
      { message: 'Format foto harus JPG, PNG, atau WEBP.' },
      { status: 400 }
    )
  }

  if (image.size > maxImageSize) {
    return NextResponse.json({ message: 'Ukuran foto maksimal 8 MB.' }, { status: 400 })
  }

  const buildingImageError = validateOptionalImage(buildingImage, 'Foto bangunan')

  if (buildingImageError) {
    return NextResponse.json({ message: buildingImageError }, { status: 400 })
  }

  try {
    const product = await createCatalogProduct({
      name,
      category,
      subcategory,
      motif,
      buildingFull,
      buildingStory,
      price,
      priceNote,
      dimensions,
      material,
      shopeeUrl,
      isPreorder,
      inStock,
      image,
      buildingImage:
        buildingImage instanceof File && buildingImage.size > 0 ? buildingImage : null,
      imagePosition,
      imageZoom,
      buildingImagePosition,
      buildingImageZoom,
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Gagal menyimpan produk ke katalog.',
      },
      { status: 500 }
    )
  }
}
