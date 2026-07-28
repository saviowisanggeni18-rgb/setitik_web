import { NextResponse } from 'next/server'
import {
  createSiteUpdate,
  isAdminPasswordConfigured,
  isAdminPasswordValid,
  isSiteUpdateTarget,
  isSiteUpdateModuleConfigured,
  listSiteUpdates,
} from '@/lib/site-updates'

const maxImageSize = 8 * 1024 * 1024
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const targetRaw = searchParams.get('target') ?? ''
    const limitRaw = searchParams.get('limit') ?? ''
    const target = isSiteUpdateTarget(targetRaw) ? targetRaw : undefined
    const limit = limitRaw ? Number(limitRaw) : undefined
    const updates = await listSiteUpdates({
      target,
      limit: Number.isFinite(limit) ? limit : undefined,
    })

    return NextResponse.json({
      configured: isSiteUpdateModuleConfigured(),
      updates,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Gagal mengambil update.',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  if (!isSiteUpdateModuleConfigured() || !isAdminPasswordConfigured()) {
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
  const targetRaw = String(formData.get('target') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const eventDateRaw = String(formData.get('eventDate') ?? '').trim()
  const image = formData.get('image')
  const imagePositionY = Number(formData.get('imagePositionY') ?? 50)
  const imageZoom = Number(formData.get('imageZoom') ?? 1)

  if (!isSiteUpdateTarget(targetRaw)) {
    return NextResponse.json(
      { message: 'Pilih bagian website yang ingin diupdate.' },
      { status: 400 }
    )
  }

  if (!title || !description) {
    return NextResponse.json(
      { message: 'Judul dan deskripsi wajib diisi.' },
      { status: 400 }
    )
  }

  if (!(image instanceof File)) {
    return NextResponse.json({ message: 'Foto wajib dipilih.' }, { status: 400 })
  }

  if (!allowedImageTypes.includes(image.type)) {
    return NextResponse.json(
      { message: 'Format foto harus JPG, PNG, atau WEBP.' },
      { status: 400 }
    )
  }

  if (image.size > maxImageSize) {
    return NextResponse.json(
      { message: 'Ukuran foto maksimal 8 MB.' },
      { status: 400 }
    )
  }

  try {
    const update = await createSiteUpdate({
      target: targetRaw,
      title,
      description,
      eventDate: eventDateRaw || null,
      image,
      imagePositionY: Math.min(100, Math.max(0, imagePositionY)),
      imageZoom: Math.min(1.8, Math.max(0.75, imageZoom)),
    })

    return NextResponse.json({ update }, { status: 201 })
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message.toLowerCase() : ''
    const message =
      rawMessage.includes('image_position_y') || rawMessage.includes('image_zoom')
        ? 'Kolom pengaturan foto belum tersedia. Jalankan SQL terbaru dari supabase-site-updates.sql di Supabase SQL Editor, lalu coba lagi.'
        : error instanceof Error && rawMessage.includes('target')
        ? 'Database update belum punya kolom target. Jalankan ulang SQL terbaru dari supabase-site-updates.sql di Supabase SQL Editor.'
        : error instanceof Error
          ? error.message
          : 'Gagal menyimpan update.'

    return NextResponse.json(
      {
        message,
      },
      { status: 500 }
    )
  }
}
