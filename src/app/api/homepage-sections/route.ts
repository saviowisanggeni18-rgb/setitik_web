import { NextResponse } from 'next/server'
import {
  createCustomHomepageSection,
  isHomepageSectionModuleConfigured,
  listHomepageSections,
} from '@/lib/homepage-sections'
import { isAdminPasswordConfigured, isAdminPasswordValid } from '@/lib/site-updates'

const maxImageSize = 8 * 1024 * 1024
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const adminPassword = request.headers.get('x-admin-password')
  const isAdmin = isAdminPasswordConfigured() && isAdminPasswordValid(adminPassword)

  try {
    const sections = await listHomepageSections({
      visibleOnly: !isAdmin,
      fallbackToDefault: false,
    })

    return NextResponse.json(
      { configured: isHomepageSectionModuleConfigured(), sections },
      { headers: { 'Cache-Control': 'private, no-store', Vary: 'x-admin-password' } }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Gagal mengambil susunan beranda.',
      },
      { status: 500, headers: { 'Cache-Control': 'private, no-store', Vary: 'x-admin-password' } }
    )
  }
}

export async function POST(request: Request) {
  if (!isHomepageSectionModuleConfigured() || !isAdminPasswordConfigured()) {
    return NextResponse.json(
      { message: 'Modul admin belum dikonfigurasi di environment hosting.' },
      { status: 503 }
    )
  }

  const formData = await request.formData()

  if (!isAdminPasswordValid(formData.get('password'))) {
    return NextResponse.json({ message: 'Password admin tidak sesuai.' }, { status: 401 })
  }

  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const label = String(formData.get('label') ?? '').trim()
  const image = formData.get('image')
  const imageFile = image instanceof File && image.size > 0 ? image : null
  const pageRaw = String(formData.get('page') ?? 'home')
  const page = pageRaw === 'about' || pageRaw === 'impact' ? pageRaw : 'home'
  const templateRaw = String(formData.get('template') ?? 'editorial')
  const allowedTemplates = [
    'editorial', 'immersive', 'statement', 'image-left', 'mosaic', 'quote',
    'magazine', 'overlap', 'banner', 'minimal',
  ] as const
  const template = allowedTemplates.includes(templateRaw as (typeof allowedTemplates)[number])
    ? (templateRaw as (typeof allowedTemplates)[number])
    : 'editorial'
  const imagePositionX = Math.min(100, Math.max(0, Number(formData.get('imagePositionX') ?? 50)))
  const imagePositionY = Math.min(100, Math.max(0, Number(formData.get('imagePositionY') ?? 50)))
  const imageZoom = Math.min(3, Math.max(1, Number(formData.get('imageZoom') ?? 1)))

  if (!title || !description) {
    return NextResponse.json(
      { message: 'Judul dan deskripsi section wajib diisi.' },
      { status: 400 }
    )
  }

  if (imageFile && !allowedImageTypes.includes(imageFile.type)) {
    return NextResponse.json(
      { message: 'Format foto harus JPG, PNG, atau WEBP.' },
      { status: 400 }
    )
  }

  if (imageFile && imageFile.size > maxImageSize) {
    return NextResponse.json(
      { message: 'Ukuran foto maksimal 8 MB.' },
      { status: 400 }
    )
  }

  try {
    const section = await createCustomHomepageSection({
      title,
      description,
      label: label || (page === 'about' ? 'Cerita Setitik' : page === 'impact' ? 'Catatan Dampak' : 'Kabar Setitik'),
      image: imageFile,
      page,
      template,
      imagePositionX,
      imagePositionY,
      imageZoom,
    })

    return NextResponse.json({ section }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Gagal menambah section.',
      },
      { status: 500 }
    )
  }
}
