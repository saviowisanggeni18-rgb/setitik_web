import { createClient } from '@supabase/supabase-js'

export type SiteUpdateTarget = 'latest' | 'mbatik' | 'collaboration' | 'product' | 'story'

export type SiteUpdate = {
  id: string
  target: SiteUpdateTarget
  title: string
  description: string
  eventDate: string | null
  imageUrl: string
  imagePath: string
  imagePositionY: number
  imageZoom: number
  isPublished: boolean
  createdAt: string
}

type SiteUpdateRow = {
  id: string
  target?: SiteUpdateTarget | null
  title: string
  description: string
  event_date: string | null
  image_url: string
  image_path: string
  image_position_y?: number | null
  image_zoom?: number | null
  is_published: boolean
  created_at: string
}

export const bucketName = process.env.SUPABASE_UPDATES_BUCKET ?? 'site-updates'
export const siteUpdateTargets: SiteUpdateTarget[] = [
  'latest',
  'mbatik',
  'collaboration',
  'product',
  'story',
]

function getSupabaseUrl() {
  const rawUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!rawUrl) return null

  try {
    return new URL(rawUrl.trim()).origin
  } catch {
    return null
  }
}

function isAnonJwtKey(key: string) {
  const [, payload] = key.split('.')

  if (!payload) return false

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string
    }

    return decoded.role === 'anon'
  } catch {
    return false
  }
}

function isPublicSupabaseKey(key: string) {
  return key.startsWith('sb_publishable_') || isAnonJwtKey(key)
}

export function getSupabaseAdmin() {
  const supabaseUrl = getSupabaseUrl()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey || isPublicSupabaseKey(serviceRoleKey)) {
    return null
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function toSiteUpdate(row: SiteUpdateRow): SiteUpdate {
  return {
    id: row.id,
    target: row.target ?? 'latest',
    title: row.title,
    description: row.description,
    eventDate: row.event_date,
    imageUrl: row.image_url,
    imagePath: row.image_path,
    imagePositionY: row.image_position_y ?? 50,
    imageZoom: row.image_zoom ?? 1,
    isPublished: row.is_published,
    createdAt: row.created_at,
  }
}

export function isSiteUpdateTarget(value: string): value is SiteUpdateTarget {
  return siteUpdateTargets.includes(value as SiteUpdateTarget)
}

function slugifyFileName(name: string) {
  const base = name
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)

  return base || 'foto-update'
}

function getExtension(file: File) {
  const byName = file.name.split('.').pop()?.toLowerCase()

  if (byName && ['jpg', 'jpeg', 'png', 'webp'].includes(byName)) {
    return byName
  }

  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'

  return 'jpg'
}

export async function uploadSiteImage(file: File, folder: string) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    throw new Error('Modul admin belum terhubung ke Supabase.')
  }

  const extension = getExtension(file)
  const storagePath = `${folder}/${new Date().getFullYear()}/${Date.now()}-${slugifyFileName(
    file.name
  )}-${crypto.randomUUID()}.${extension}`
  const imageBuffer = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(storagePath, imageBuffer, {
      contentType: file.type || `image/${extension}`,
      upsert: false,
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(storagePath)

  return {
    publicUrl,
    storagePath,
  }
}

export async function deleteSiteImage(imagePath: string) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    return
  }

  await supabase.storage.from(bucketName).remove([imagePath])
}

export function isSiteUpdateModuleConfigured() {
  return Boolean(
    getSupabaseUrl() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !isPublicSupabaseKey(process.env.SUPABASE_SERVICE_ROLE_KEY)
  )
}

export function isAdminPasswordConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD)
}

export function isAdminPasswordValid(password: FormDataEntryValue | null) {
  return typeof password === 'string' && password.length > 0 && password === process.env.ADMIN_PASSWORD
}

export async function listSiteUpdates(
  options?: number | {
    limit?: number
    target?: SiteUpdateTarget
  }
) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    return []
  }

  const limit = typeof options === 'number' ? options : options?.limit
  const target = typeof options === 'number' ? undefined : options?.target

  let query = supabase
    .from('site_updates')
    .select('id,target,title,description,event_date,image_url,image_path,image_position_y,image_zoom,is_published,created_at')
    .eq('is_published', true)
    .order('event_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (target) {
    query = query.eq('target', target)
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error && (error.message.includes('image_position_y') || error.message.includes('image_zoom'))) {
    let fallbackQuery = supabase
      .from('site_updates')
      .select('id,target,title,description,event_date,image_url,image_path,is_published,created_at')
      .eq('is_published', true)
      .order('event_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (target) {
      fallbackQuery = fallbackQuery.eq('target', target)
    }

    if (limit) {
      fallbackQuery = fallbackQuery.limit(limit)
    }

    const { data: fallbackData, error: fallbackError } = await fallbackQuery

    if (fallbackError) {
      throw new Error(fallbackError.message)
    }

    return (fallbackData ?? []).map((row) => toSiteUpdate(row as SiteUpdateRow))
  }

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map((row) => toSiteUpdate(row as SiteUpdateRow))
}

export async function createSiteUpdate({
  target,
  title,
  description,
  eventDate,
  image,
  imagePositionY,
  imageZoom,
}: {
  target: SiteUpdateTarget
  title: string
  description: string
  eventDate: string | null
  image: File
  imagePositionY: number
  imageZoom: number
}) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    throw new Error('Modul update belum terhubung ke Supabase.')
  }

  const { publicUrl, storagePath } = await uploadSiteImage(image, 'updates')

  const { data, error } = await supabase
    .from('site_updates')
    .insert({
      target,
      title,
      description,
      event_date: eventDate,
      image_url: publicUrl,
      image_path: storagePath,
      image_position_y: imagePositionY,
      image_zoom: imageZoom,
      is_published: true,
    })
    .select('id,target,title,description,event_date,image_url,image_path,image_position_y,image_zoom,is_published,created_at')
    .single()

  if (error) {
    await deleteSiteImage(storagePath)
    throw new Error(error.message)
  }

  return toSiteUpdate(data as SiteUpdateRow)
}

export async function deleteSiteUpdate(id: string) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    throw new Error('Modul update belum terhubung ke Supabase.')
  }

  const { data, error: findError } = await supabase
    .from('site_updates')
    .select('image_path')
    .eq('id', id)
    .single()

  if (findError) {
    throw new Error(findError.message)
  }

  const { error: deleteError } = await supabase.from('site_updates').delete().eq('id', id)

  if (deleteError) {
    throw new Error(deleteError.message)
  }

  const imagePath = (data as { image_path?: string } | null)?.image_path

  if (imagePath) {
    await deleteSiteImage(imagePath)
  }
}
