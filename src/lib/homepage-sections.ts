import {
  deleteSiteImage,
  getSupabaseAdmin,
  isSiteUpdateModuleConfigured,
  uploadSiteImage,
} from '@/lib/site-updates'

export type BuiltInSectionKey =
  | 'hero'
  | 'building-to-fabric'
  | 'inspiration-map'
  | 'founder-quote'
  | 'featured-products'
  | 'latest-updates'
  | 'mbatik-bareng'
  | 'location-navigation'
  | 'about-main'
  | 'impact-main'
  | 'collaboration-events'

export type HomepageSectionKind = 'built-in' | 'custom'
export type HomepageSectionTemplate =
  | 'editorial'
  | 'immersive'
  | 'statement'
  | 'image-left'
  | 'mosaic'
  | 'quote'
  | 'magazine'
  | 'overlap'
  | 'banner'
  | 'minimal'

export type HomepageSection = {
  id: string
  sectionKey: string | null
  kind: HomepageSectionKind
  label: string
  title: string
  description: string
  imageUrl: string | null
  imagePath: string | null
  imagePositionX?: number
  imagePositionY?: number
  imageZoom?: number
  isVisible: boolean
  sortOrder: number
  createdAt: string
  page?: 'home' | 'about' | 'impact'
  template?: HomepageSectionTemplate
}

type HomepageSectionRow = {
  id: string
  section_key: string | null
  kind: HomepageSectionKind
  label: string
  title: string
  description: string
  image_url: string | null
  image_path: string | null
  image_position_x?: number | null
  image_position_y?: number | null
  image_zoom?: number | null
  is_visible: boolean
  sort_order: number
  created_at: string
  page_key?: 'home' | 'about' | 'impact' | null
}

const homepageSectionColumns =
  'id,section_key,kind,label,title,description,image_url,image_path,image_position_x,image_position_y,image_zoom,is_visible,sort_order,created_at,page_key'
const transformlessHomepageSectionColumns =
  'id,section_key,kind,label,title,description,image_url,image_path,is_visible,sort_order,created_at,page_key'
const legacyHomepageSectionColumns =
  'id,section_key,kind,label,title,description,image_url,image_path,is_visible,sort_order,created_at'

function isMissingPageKeyError(error: { message?: string } | null) {
  const message = error?.message?.toLowerCase() ?? ''
  return message.includes('page_key') && message.includes('homepage_sections')
}

function isMissingImageTransformError(error: { message?: string } | null) {
  const message = error?.message?.toLowerCase() ?? ''
  return message.includes('homepage_sections') &&
    (message.includes('image_position_x') || message.includes('image_position_y') || message.includes('image_zoom'))
}

function legacyPageFromSectionKey(sectionKey: string | null) {
  if (
    sectionKey === 'about-main' ||
    sectionKey === 'collaboration-events' ||
    sectionKey?.startsWith('custom:about:')
  ) return 'about'
  if (sectionKey === 'impact-main' || sectionKey?.startsWith('custom:impact:')) return 'impact'
  return 'home'
}

function templateFromSectionKey(sectionKey: string | null): HomepageSectionTemplate {
  const template = sectionKey?.split(':')[2]
  return template === 'immersive' ||
    template === 'statement' ||
    template === 'image-left' ||
    template === 'mosaic' ||
    template === 'quote'
    || template === 'magazine'
    || template === 'overlap'
    || template === 'banner'
    || template === 'minimal'
    ? template
    : 'editorial'
}

function transformFromSectionKey(sectionKey: string | null) {
  const match = sectionKey?.match(/:crop:([\d.]+):([\d.]+):([\d.]+)$/)
  return {
    x: match ? Number(match[1]) : 50,
    y: match ? Number(match[2]) : 50,
    zoom: match ? Math.max(1, Number(match[3])) : 1,
  }
}

function sectionKeyWithTransform(
  sectionKey: string,
  imagePositionX: number,
  imagePositionY: number,
  imageZoom: number
) {
  const baseKey = sectionKey.replace(/:crop:[\d.]+:[\d.]+:[\d.]+$/, '')
  return `${baseKey}:crop:${imagePositionX.toFixed(2)}:${imagePositionY.toFixed(2)}:${imageZoom.toFixed(2)}`
}

export const defaultHomepageSections: HomepageSection[] = [
  {
    id: 'about-main', sectionKey: 'about-main', kind: 'built-in', label: 'Tentang utama',
    title: 'Jessie Setiawati dan cerita Setitik.',
    description: 'Setitik dimulai pada 2019 dari keyakinan bahwa bangunan tua menyimpan cerita yang layak diabadikan.',
    imageUrl: null, imagePath: null, isVisible: true, sortOrder: 10, createdAt: '', page: 'about',
  },
  {
    id: 'impact-main', sectionKey: 'impact-main', kind: 'built-in', label: 'Dampak utama',
    title: 'Budaya yang hidup, komunitas yang bergerak.',
    description: 'Setitik bekerja bersama komunitas dan pengrajin agar pelestarian budaya menghasilkan manfaat ekonomi nyata.',
    imageUrl: null, imagePath: null, isVisible: true, sortOrder: 10, createdAt: '', page: 'impact',
  },
  {
    id: 'collaboration-events', sectionKey: 'collaboration-events', kind: 'built-in',
    label: 'Arsip visual dan kolaborasi', title: 'Arsip visual Setitik di ruang budaya.',
    description: 'Dokumentasi presentasi, fashion show, kolaborasi seni, seragam institusi, dan pameran.',
    imageUrl: null, imagePath: null, isVisible: true, sortOrder: 30, createdAt: '', page: 'about',
  },
  {
    id: 'hero',
    sectionKey: 'hero',
    kind: 'built-in',
    label: 'Hero utama',
    title: 'Pembuka website',
    description: 'Section pertama yang memperkenalkan Setitik di halaman utama.',
    imageUrl: null,
    imagePath: null,
    isVisible: true,
    sortOrder: 10,
    createdAt: '',
  },
  {
    id: 'building-to-fabric',
    sectionKey: 'building-to-fabric',
    kind: 'built-in',
    label: 'Bangunan ke kain',
    title: 'Cerita inspirasi motif',
    description: 'Bagian yang menjelaskan proses membaca ornamen bangunan menjadi motif.',
    imageUrl: null,
    imagePath: null,
    isVisible: true,
    sortOrder: 20,
    createdAt: '',
  },
  {
    id: 'inspiration-map',
    sectionKey: 'inspiration-map',
    kind: 'built-in',
    label: 'Peta inspirasi',
    title: 'Peta lokasi inspirasi',
    description: 'Bagian peta bangunan dan kota yang menjadi sumber inspirasi.',
    imageUrl: null,
    imagePath: null,
    isVisible: true,
    sortOrder: 30,
    createdAt: '',
  },
  {
    id: 'founder-quote',
    sectionKey: 'founder-quote',
    kind: 'built-in',
    label: 'Kutipan founder',
    title: 'Cerita pendiri',
    description: 'Bagian kutipan dan narasi pendiri Setitik.',
    imageUrl: null,
    imagePath: null,
    isVisible: true,
    sortOrder: 40,
    createdAt: '',
  },
  {
    id: 'featured-products',
    sectionKey: 'featured-products',
    kind: 'built-in',
    label: 'Produk unggulan',
    title: 'Pilihan produk utama',
    description: 'Bagian katalog ringkas yang menampilkan produk unggulan.',
    imageUrl: null,
    imagePath: null,
    isVisible: true,
    sortOrder: 50,
    createdAt: '',
  },
  {
    id: 'latest-updates',
    sectionKey: 'latest-updates',
    kind: 'built-in',
    label: 'Update terbaru',
    title: 'Dokumentasi terbaru',
    description: 'Bagian otomatis dari foto dan kegiatan yang diterbitkan owner.',
    imageUrl: null,
    imagePath: null,
    isVisible: true,
    sortOrder: 60,
    createdAt: '',
  },
  {
    id: 'mbatik-bareng',
    sectionKey: 'mbatik-bareng',
    kind: 'built-in',
    label: 'Mbatik Bareng',
    title: 'Ajakan kegiatan',
    description: 'Bagian ajakan mengikuti kegiatan Mbatik Bareng.',
    imageUrl: null,
    imagePath: null,
    isVisible: true,
    sortOrder: 70,
    createdAt: '',
  },
  {
    id: 'location-navigation',
    sectionKey: 'location-navigation',
    kind: 'built-in',
    label: 'Lokasi dan navigasi',
    title: 'Alamat Setitik',
    description: 'Bagian lokasi, jam operasional, dan tautan navigasi menuju Setitik.',
    imageUrl: null,
    imagePath: null,
    isVisible: true,
    sortOrder: 80,
    createdAt: '',
  },
]

function toHomepageSection(row: HomepageSectionRow): HomepageSection {
  const storedTransform = transformFromSectionKey(row.section_key)
  return {
    id: row.id,
    sectionKey: row.section_key,
    kind: row.kind,
    label: row.label,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    imagePath: row.image_path,
    imagePositionX: row.image_position_x ?? storedTransform.x,
    imagePositionY: row.image_position_y ?? storedTransform.y,
    imageZoom: Math.max(1, row.image_zoom ?? storedTransform.zoom),
    isVisible: row.is_visible,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    page: row.page_key ?? legacyPageFromSectionKey(row.section_key),
    template: templateFromSectionKey(row.section_key),
  }
}

async function ensureBuiltInSections() {
  const supabase = getSupabaseAdmin()

  if (!supabase) return

  const { data, error } = await supabase
    .from('homepage_sections')
      .select('section_key')
    .eq('kind', 'built-in')

  if (error) {
    throw new Error(error.message)
  }

  const existingKeys = new Set((data ?? []).map((row) => row.section_key))
  const missing = defaultHomepageSections.filter(
    (section) => section.sectionKey && !existingKeys.has(section.sectionKey)
  )

  if (missing.length === 0) return

  const { error: insertError } = await supabase.from('homepage_sections').insert(
    missing.map((section) => ({
      section_key: section.sectionKey,
      kind: section.kind,
      label: section.label,
      title: section.title,
      description: section.description,
      page_key: section.page ?? 'home',
      is_visible: section.isVisible,
      sort_order: section.sortOrder,
    }))
  )

  if (isMissingPageKeyError(insertError)) {
    // Keep older databases usable until the additive page_key migration is run.
    // About and impact belong to the new multi-page editor and cannot be stored
    // correctly in the legacy schema.
    const legacyMissing = missing
    const { error: legacyInsertError } = await supabase.from('homepage_sections').insert(
      legacyMissing.map((section) => ({
        section_key: section.sectionKey,
        kind: section.kind,
        label: section.label,
        title: section.title,
        description: section.description,
        is_visible: section.isVisible,
        sort_order: section.sortOrder,
      }))
    )

    if (legacyInsertError) throw new Error(legacyInsertError.message)
    return
  }

  if (insertError) {
    throw new Error(insertError.message)
  }
}

export async function listHomepageSections({
  visibleOnly = false,
  fallbackToDefault = true,
} = {}) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    if (!fallbackToDefault) {
      throw new Error(
        'Admin belum memakai Supabase service role/secret key. Ganti SUPABASE_SERVICE_ROLE_KEY, jangan pakai publishable atau anon key.'
      )
    }

    return defaultHomepageSections.filter((section) => !visibleOnly || section.isVisible)
  }

  try {
    await ensureBuiltInSections()

    let query = supabase
      .from('homepage_sections')
      .select(homepageSectionColumns)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (visibleOnly) {
      query = query.eq('is_visible', true)
    }

    const primaryResult = await query
    const data = primaryResult.data
    let error = primaryResult.error

    if (isMissingImageTransformError(error)) {
      let transformlessQuery = supabase
        .from('homepage_sections')
        .select(transformlessHomepageSectionColumns)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (visibleOnly) transformlessQuery = transformlessQuery.eq('is_visible', true)

      const transformlessResult = await transformlessQuery
      if (!transformlessResult.error) {
        return (transformlessResult.data ?? []).map((row) =>
          toHomepageSection(row as HomepageSectionRow)
        )
      }
      error = transformlessResult.error
    }

    if (isMissingPageKeyError(error)) {
      let legacyQuery = supabase
        .from('homepage_sections')
        .select(legacyHomepageSectionColumns)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (visibleOnly) legacyQuery = legacyQuery.eq('is_visible', true)

      const legacyResult = await legacyQuery
      if (legacyResult.error) throw new Error(legacyResult.error.message)

      return (legacyResult.data ?? []).map((row) =>
        toHomepageSection(row as HomepageSectionRow)
      )
    }

    if (error) {
      throw new Error(error.message)
    }

    return (data ?? []).map((row) => toHomepageSection(row as HomepageSectionRow))
  } catch (error) {
    if (!fallbackToDefault) {
      throw error
    }

    return defaultHomepageSections.filter((section) => !visibleOnly || section.isVisible)
  }
}

export async function createCustomHomepageSection({
  title,
  description,
  label,
  image,
  page = 'home',
  template = 'editorial',
  imagePositionX = 50,
  imagePositionY = 50,
  imageZoom = 1,
}: {
  title: string
  description: string
  label: string
  image: File | null
  page?: 'home' | 'about' | 'impact'
  template?: HomepageSectionTemplate
  imagePositionX?: number
  imagePositionY?: number
  imageZoom?: number
}) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    throw new Error('Modul section belum terhubung ke Supabase.')
  }

  const { count } = await supabase
    .from('homepage_sections')
    .select('id', { count: 'exact', head: true })

  let imageUrl: string | null = null
  let imagePath: string | null = null

  if (image) {
    const uploaded = await uploadSiteImage(image, 'homepage-sections')
    imageUrl = uploaded.publicUrl
    imagePath = uploaded.storagePath
  }

  const insertPayload = {
    section_key: `custom:${page}:${template}:${crypto.randomUUID()}`,
    kind: 'custom',
    label,
    title,
    description,
    page_key: page,
    image_url: imageUrl,
    image_path: imagePath,
    image_position_x: imagePositionX,
    image_position_y: imagePositionY,
    image_zoom: imageZoom,
    is_visible: true,
    sort_order: ((count ?? defaultHomepageSections.length) + 1) * 10,
  }

  const result = await supabase
    .from('homepage_sections')
    .insert(insertPayload)
    .select(homepageSectionColumns)
    .single()

  if (isMissingImageTransformError(result.error)) {
    const {
      image_position_x: _imagePositionX,
      image_position_y: _imagePositionY,
      image_zoom: _imageZoom,
      ...transformlessPayload
    } = insertPayload
    void _imagePositionX
    void _imagePositionY
    void _imageZoom
    const transformlessResult = await supabase
      .from('homepage_sections')
      .insert({
        ...transformlessPayload,
        section_key: sectionKeyWithTransform(
          transformlessPayload.section_key,
          imagePositionX,
          imagePositionY,
          imageZoom
        ),
      })
      .select(transformlessHomepageSectionColumns)
      .single()

    if (!transformlessResult.error) {
      return toHomepageSection(transformlessResult.data as HomepageSectionRow)
    }
    result.error = transformlessResult.error
  }

  if (isMissingPageKeyError(result.error)) {
    const {
      page_key: _pageKey,
      image_position_x: _imagePositionX,
      image_position_y: _imagePositionY,
      image_zoom: _imageZoom,
      ...legacyPayload
    } = insertPayload
    void _pageKey
    void _imagePositionX
    void _imagePositionY
    void _imageZoom
    const legacyResult = await supabase
      .from('homepage_sections')
      .insert({
        ...legacyPayload,
        section_key: sectionKeyWithTransform(
          insertPayload.section_key,
          imagePositionX,
          imagePositionY,
          imageZoom
        ),
      })
      .select(legacyHomepageSectionColumns)
      .single()

    if (!legacyResult.error) {
      return toHomepageSection(legacyResult.data as HomepageSectionRow)
    }

    if (imagePath) {
      await deleteSiteImage(imagePath)
    }

    throw new Error(legacyResult.error.message)
  }

  if (result.error) {
    if (imagePath) await deleteSiteImage(imagePath)
    throw new Error(result.error.message)
  }

  return toHomepageSection(result.data as HomepageSectionRow)
}

export async function updateHomepageSection({
  id,
  isVisible,
  sortOrder,
  title,
  description,
  label,
  image,
  imagePositionX,
  imagePositionY,
  imageZoom,
}: {
  id: string
  isVisible?: boolean
  sortOrder?: number
  title?: string
  description?: string
  label?: string
  image?: File | null
  imagePositionX?: number
  imagePositionY?: number
  imageZoom?: number
}) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    throw new Error('Modul section belum terhubung ke Supabase.')
  }

  const updatePayload: Record<string, boolean | number | string | null> = {
    updated_at: new Date().toISOString(),
  }

  if (typeof isVisible === 'boolean') updatePayload.is_visible = isVisible
  if (typeof sortOrder === 'number') updatePayload.sort_order = sortOrder
  if (typeof title === 'string') {
    updatePayload.title = title
  }
  if (typeof description === 'string') updatePayload.description = description
  if (typeof label === 'string' && label.trim()) updatePayload.label = label.trim()
  if (typeof imagePositionX === 'number') updatePayload.image_position_x = imagePositionX
  if (typeof imagePositionY === 'number') updatePayload.image_position_y = imagePositionY
  if (typeof imageZoom === 'number') updatePayload.image_zoom = imageZoom

  if (image) {
    const { data: current } = await supabase
      .from('homepage_sections')
      .select('image_path')
      .eq('id', id)
      .single()
    const uploaded = await uploadSiteImage(image, 'homepage-sections')
    updatePayload.image_url = uploaded.publicUrl
    updatePayload.image_path = uploaded.storagePath

    if (current?.image_path) {
      await deleteSiteImage(String(current.image_path))
    }
  }

  const result = await supabase
    .from('homepage_sections')
    .update(updatePayload)
    .eq('id', id)
    .select(homepageSectionColumns)
    .single()

  if (isMissingImageTransformError(result.error)) {
    const {
      image_position_x: _imagePositionX,
      image_position_y: _imagePositionY,
      image_zoom: _imageZoom,
      ...transformlessUpdatePayload
    } = updatePayload
    void _imagePositionX
    void _imagePositionY
    void _imageZoom

    const { data: currentSection, error: currentSectionError } = await supabase
      .from('homepage_sections')
      .select('section_key,kind')
      .eq('id', id)
      .single()
    if (currentSectionError) throw new Error(currentSectionError.message)

    if (
      currentSection?.kind === 'custom' &&
      currentSection.section_key &&
      typeof imagePositionX === 'number' &&
      typeof imagePositionY === 'number' &&
      typeof imageZoom === 'number'
    ) {
      transformlessUpdatePayload.section_key = sectionKeyWithTransform(
        String(currentSection.section_key),
        imagePositionX,
        imagePositionY,
        imageZoom
      )
    }
    const transformlessResult = await supabase
      .from('homepage_sections')
      .update(transformlessUpdatePayload)
      .eq('id', id)
      .select(transformlessHomepageSectionColumns)
      .single()
    if (!transformlessResult.error) {
      return toHomepageSection(transformlessResult.data as HomepageSectionRow)
    }
    result.error = transformlessResult.error
  }

  if (isMissingPageKeyError(result.error)) {
    const {
      image_position_x: _imagePositionX,
      image_position_y: _imagePositionY,
      image_zoom: _imageZoom,
      ...legacyUpdatePayload
    } = updatePayload
    void _imagePositionX
    void _imagePositionY
    void _imageZoom

    const { data: currentSection } = await supabase
      .from('homepage_sections')
      .select('section_key,kind')
      .eq('id', id)
      .single()
    if (
      currentSection?.kind === 'custom' &&
      currentSection.section_key &&
      typeof imagePositionX === 'number' &&
      typeof imagePositionY === 'number' &&
      typeof imageZoom === 'number'
    ) {
      legacyUpdatePayload.section_key = sectionKeyWithTransform(
        String(currentSection.section_key),
        imagePositionX,
        imagePositionY,
        imageZoom
      )
    }
    const legacyResult = await supabase
      .from('homepage_sections')
      .update(legacyUpdatePayload)
      .eq('id', id)
      .select(legacyHomepageSectionColumns)
      .single()

    if (legacyResult.error) throw new Error(legacyResult.error.message)

    return toHomepageSection(legacyResult.data as HomepageSectionRow)
  }

  if (result.error) throw new Error(result.error.message)

  return toHomepageSection(result.data as HomepageSectionRow)
}

export async function deleteHomepageSection(id: string) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    throw new Error('Modul section belum terhubung ke Supabase.')
  }

  const { data, error: findError } = await supabase
    .from('homepage_sections')
    .select('kind,image_path')
    .eq('id', id)
    .single()

  if (findError) {
    throw new Error(findError.message)
  }

  const section = data as { kind?: HomepageSectionKind; image_path?: string | null }

  if (section.kind === 'built-in') {
    await updateHomepageSection({ id, isVisible: false })
    return
  }

  const { error } = await supabase.from('homepage_sections').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  if (section.image_path) {
    await deleteSiteImage(section.image_path)
  }
}

export function isHomepageSectionModuleConfigured() {
  return isSiteUpdateModuleConfigured()
}
