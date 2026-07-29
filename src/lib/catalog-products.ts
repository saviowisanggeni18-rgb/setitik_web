import { products as defaultProducts, type Product } from '@/data/products'
import {
  deleteSiteImage,
  getSupabaseAdmin,
  isSiteUpdateModuleConfigured,
  uploadSiteImage,
} from '@/lib/site-updates'

export type CatalogProductSource = 'built-in' | 'custom'

export type CatalogProduct = Product & {
  id: string
  source: CatalogProductSource
  imagePath: string | null
  buildingImagePath: string | null
  isVisible: boolean
  sortOrder: number
}

type CatalogProductRow = {
  id: string
  source: CatalogProductSource
  slug: string
  name: string
  category: Product['category']
  subcategory: string
  motif: string
  building_full: string
  building_story: string
  building_built: string | null
  price: number
  price_note: string | null
  dimensions: string
  material: string
  image_url: string
  image_path: string | null
  images: string[] | null
  image_fit: Product['imageFit'] | null
  image_position: string | null
  image_positions: string[] | null
  building_image: string | null
  building_image_path: string | null
  shopee_url: string | null
  is_preorder: boolean
  in_stock: boolean
  is_visible: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export const catalogCategories: Product['category'][] = [
  'batik-tulis',
  'batik-cap',
  'produk-lain',
]

const catalogSelect =
  'id,source,slug,name,category,subcategory,motif,building_full,building_story,building_built,price,price_note,dimensions,material,image_url,image_path,images,image_fit,image_position,image_positions,building_image,building_image_path,shopee_url,is_preorder,in_stock,is_visible,sort_order,created_at,updated_at'

function normalizeLegacyBuildingImage(image: string | null) {
  if (!image) return undefined
  const replacements: Record<string, string> = {
    '/images/buildings/gereja-blenduk.jpg': '/images/locations/semarang-gereja-blenduk.jpg',
    '/images/buildings/monod-diephuis.jpg': '/images/locations/semarang-monod-diephuis.jpg',
    '/images/buildings/nhm.jpg': '/images/locations/semarang-nhm.jpg',
  }
  return replacements[image] ?? image
}

function toCatalogProduct(row: CatalogProductRow): CatalogProduct {
  const images = Array.isArray(row.images) && row.images.length > 0 ? row.images : [row.image_url]
  const [storedPosition, storedZoom] = (row.image_position ?? '').split('|')
  const imageZoom = Number(storedZoom)
  const storedPositions = row.image_positions ?? []
  const cleanImagePositions = storedPositions.map((value) => value.split('|')[0])
  const [buildingImagePosition, buildingImageZoomRaw] = (storedPositions[1] ?? '').split('|')
  const buildingImageZoom = Number(buildingImageZoomRaw)

  return {
    id: row.id,
    source: row.source,
    slug: row.slug,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    motif: row.motif,
    buildingFull: row.building_full,
    buildingStory: row.building_story,
    buildingBuilt: row.building_built ?? undefined,
    price: row.price,
    priceNote: row.price_note ?? undefined,
    dimensions: row.dimensions,
    material: row.material,
    image: row.image_url,
    images,
    imageFit: row.image_fit ?? undefined,
    imagePosition: storedPosition || undefined,
    imageZoom: Number.isFinite(imageZoom) ? imageZoom : undefined,
    imagePositions: cleanImagePositions.length > 0 ? cleanImagePositions : undefined,
    buildingImage: normalizeLegacyBuildingImage(row.building_image),
    buildingImagePosition: buildingImagePosition || undefined,
    buildingImageZoom: Number.isFinite(buildingImageZoom) ? buildingImageZoom : undefined,
    shopeeUrl: row.shopee_url ?? undefined,
    isPreorder: row.is_preorder,
    inStock: row.in_stock,
    imagePath: row.image_path,
    buildingImagePath: row.building_image_path,
    isVisible: row.is_visible,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  }
}

function toDefaultCatalogProduct(product: Product, index: number): CatalogProduct {
  return {
    ...product,
    id: product.slug,
    source: 'built-in',
    imagePath: null,
    buildingImagePath: null,
    isVisible: true,
    sortOrder: index + 1,
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 70) || `produk-${Date.now()}`
}

function isCatalogTableMissing(error: unknown) {
  return error instanceof Error && error.message.toLowerCase().includes('catalog_products')
}

async function ensureBuiltInCatalogProducts() {
  const supabase = getSupabaseAdmin()

  if (!supabase) return

  const { data, error } = await supabase.from('catalog_products').select('slug')

  if (error) {
    throw new Error(error.message)
  }

  const existingSlugs = new Set((data ?? []).map((row) => String(row.slug)))
  const missingRows = defaultProducts
    .map((product, index) => ({ product, index }))
    .filter(({ product }) => !existingSlugs.has(product.slug))
    .map(({ product, index }) => ({
      source: 'built-in',
      slug: product.slug,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      motif: product.motif,
      building_full: product.buildingFull,
      building_story: product.buildingStory,
      building_built: product.buildingBuilt ?? null,
      price: product.price,
      price_note: product.priceNote ?? null,
      dimensions: product.dimensions,
      material: product.material,
      image_url: product.image,
      image_path: null,
      images: product.images ?? [product.image],
      image_fit: product.imageFit ?? null,
      image_position: product.imagePosition ?? null,
      image_positions: product.imagePositions ?? [],
      building_image: product.buildingImage ?? null,
      building_image_path: null,
      shopee_url: product.shopeeUrl ?? null,
      is_preorder: product.isPreorder,
      in_stock: product.inStock,
      is_visible: true,
      sort_order: index + 1,
    }))

  if (missingRows.length === 0) return

  const { error: insertError } = await supabase.from('catalog_products').insert(missingRows)

  if (insertError) {
    throw new Error(insertError.message)
  }
}

export function isCatalogModuleConfigured() {
  return isSiteUpdateModuleConfigured()
}

export async function listCatalogProducts({
  visibleOnly = true,
  fallbackToDefault = true,
} = {}) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    if (!fallbackToDefault) {
      throw new Error('Admin belum memakai Supabase service role/secret key.')
    }

    return defaultProducts.map(toDefaultCatalogProduct)
  }

  try {
    await ensureBuiltInCatalogProducts()

    let query = supabase
      .from('catalog_products')
      .select(catalogSelect)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (visibleOnly) {
      query = query.eq('is_visible', true)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)

    return (data ?? []).map((row) => toCatalogProduct(row as CatalogProductRow))
  } catch (error) {
    if (!fallbackToDefault) {
      throw isCatalogTableMissing(error)
        ? new Error(
            'Database belum punya tabel catalog_products. Jalankan ulang SQL terbaru dari supabase-site-updates.sql.'
          )
        : error
    }

    return defaultProducts.map(toDefaultCatalogProduct)
  }
}

export async function getCatalogProductBySlug(slug: string) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    const product = defaultProducts.find((item) => item.slug === slug)
    return product ? toDefaultCatalogProduct(product, defaultProducts.indexOf(product)) : null
  }

  try {
    await ensureBuiltInCatalogProducts()

    const { data, error } = await supabase
      .from('catalog_products')
      .select(catalogSelect)
      .eq('slug', slug)
      .eq('is_visible', true)
      .maybeSingle()

    if (error) throw new Error(error.message)

    return data ? toCatalogProduct(data as CatalogProductRow) : null
  } catch {
    const product = defaultProducts.find((item) => item.slug === slug)
    return product ? toDefaultCatalogProduct(product, defaultProducts.indexOf(product)) : null
  }
}

export async function createCatalogProduct({
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
  buildingImage,
  imagePosition,
  imageZoom,
  buildingImagePosition,
  buildingImageZoom,
}: {
  name: string
  category: Product['category']
  subcategory: string
  motif: string
  buildingFull: string
  buildingStory: string
  price: number
  priceNote: string | null
  dimensions: string
  material: string
  shopeeUrl: string | null
  isPreorder: boolean
  inStock: boolean
  image: File
  buildingImage: File | null
  imagePosition: string
  imageZoom: number
  buildingImagePosition: string
  buildingImageZoom: number
}) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    throw new Error('Modul katalog belum terhubung ke Supabase.')
  }

  await ensureBuiltInCatalogProducts()

  const { publicUrl, storagePath } = await uploadSiteImage(image, 'catalog-products')
  const uploadedBuildingImage = buildingImage
    ? await uploadSiteImage(buildingImage, 'catalog-buildings')
    : null
  const slug = `${slugify(name)}-${Date.now().toString(36)}`

  const { data, error } = await supabase
    .from('catalog_products')
    .insert({
      source: 'custom',
      slug,
      name,
      category,
      subcategory,
      motif,
      building_full: buildingFull,
      building_story: buildingStory,
      price,
      price_note: priceNote,
      dimensions,
      material,
      image_url: publicUrl,
      image_path: storagePath,
      images: [publicUrl],
      image_fit: 'cover',
      image_position: `${imagePosition}|${imageZoom}`,
      image_positions: [
        `${imagePosition}|${imageZoom}`,
        `${buildingImagePosition}|${buildingImageZoom}`,
      ],
      building_built: null,
      building_image: uploadedBuildingImage?.publicUrl ?? null,
      building_image_path: uploadedBuildingImage?.storagePath ?? null,
      shopee_url: shopeeUrl,
      is_preorder: isPreorder,
      in_stock: inStock,
      is_visible: true,
      sort_order: 1000,
    })
    .select(catalogSelect)
    .single()

  if (error) throw new Error(error.message)

  return toCatalogProduct(data as CatalogProductRow)
}

export async function updateCatalogProduct({
  id,
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
  isVisible,
  sortOrder,
  image,
  buildingImage,
  removeBuildingImage,
  imagePosition,
  imageZoom,
  buildingImagePosition,
  buildingImageZoom,
}: {
  id: string
  name: string
  category: Product['category']
  subcategory: string
  motif: string
  buildingFull: string
  buildingStory: string
  price: number
  priceNote: string | null
  dimensions: string
  material: string
  shopeeUrl: string | null
  isPreorder: boolean
  inStock: boolean
  isVisible: boolean
  sortOrder: number
  image: File | null
  buildingImage: File | null
  removeBuildingImage: boolean
  imagePosition: string
  imageZoom: number
  buildingImagePosition: string
  buildingImageZoom: number
}) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    throw new Error('Modul katalog belum terhubung ke Supabase.')
  }

  await ensureBuiltInCatalogProducts()

  const { data: current, error: currentError } = await supabase
    .from('catalog_products')
    .select('image_path,image_url,building_image_path,building_image')
    .eq('id', id)
    .single()

  if (currentError) throw new Error(currentError.message)

  let imageUrl = String(current.image_url)
  let imagePath = current.image_path ? String(current.image_path) : null
  let buildingImageUrl = current.building_image ? String(current.building_image) : null
  let buildingImagePath = current.building_image_path ? String(current.building_image_path) : null

  if (image) {
    const uploaded = await uploadSiteImage(image, 'catalog-products')
    imageUrl = uploaded.publicUrl

    if (imagePath) {
      await deleteSiteImage(imagePath)
    }

    imagePath = uploaded.storagePath
  }

  if (buildingImage) {
    const uploaded = await uploadSiteImage(buildingImage, 'catalog-buildings')
    buildingImageUrl = uploaded.publicUrl

    if (buildingImagePath) {
      await deleteSiteImage(buildingImagePath)
    }

    buildingImagePath = uploaded.storagePath
  } else if (removeBuildingImage) {
    if (buildingImagePath) {
      await deleteSiteImage(buildingImagePath)
    }

    buildingImageUrl = null
    buildingImagePath = null
  }

  const { data, error } = await supabase
    .from('catalog_products')
    .update({
      name,
      category,
      subcategory,
      motif,
      building_full: buildingFull,
      building_story: buildingStory,
      price,
      price_note: priceNote,
      dimensions,
      material,
      image_url: imageUrl,
      image_path: imagePath,
      images: [imageUrl],
      image_fit: 'cover',
      image_position: `${imagePosition}|${imageZoom}`,
      image_positions: [
        `${imagePosition}|${imageZoom}`,
        `${buildingImagePosition}|${buildingImageZoom}`,
      ],
      building_image: buildingImageUrl,
      building_image_path: buildingImagePath,
      shopee_url: shopeeUrl,
      is_preorder: isPreorder,
      in_stock: inStock,
      is_visible: isVisible,
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(catalogSelect)
    .single()

  if (error) throw new Error(error.message)

  return toCatalogProduct(data as CatalogProductRow)
}

export async function deleteCatalogProduct(id: string) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    throw new Error('Modul katalog belum terhubung ke Supabase.')
  }

  await ensureBuiltInCatalogProducts()

  const { data: current, error: currentError } = await supabase
    .from('catalog_products')
    .select('source,image_path,building_image_path')
    .eq('id', id)
    .single()

  if (currentError) throw new Error(currentError.message)

  if (current.source === 'built-in') {
    const { error } = await supabase
      .from('catalog_products')
      .update({ is_visible: false, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw new Error(error.message)
    return
  }

  const { error } = await supabase.from('catalog_products').delete().eq('id', id)

  if (error) throw new Error(error.message)

  if (current.image_path) {
    await deleteSiteImage(String(current.image_path))
  }

  if (current.building_image_path) {
    await deleteSiteImage(String(current.building_image_path))
  }
}
