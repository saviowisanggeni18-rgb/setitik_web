import { NextResponse } from 'next/server'
import {
  isAdminPasswordConfigured,
  isAdminPasswordValid,
  uploadSiteImage,
} from '@/lib/site-updates'

export const dynamic = 'force-dynamic'

const maxImageSize = 8 * 1024 * 1024
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json({ message: 'Password admin belum dikonfigurasi.' }, { status: 503 })
  }

  const formData = await request.formData()
  if (!isAdminPasswordValid(formData.get('password'))) {
    return NextResponse.json({ message: 'Password admin tidak sesuai.' }, { status: 401 })
  }

  const image = formData.get('image')
  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json({ message: 'Pilih gambar terlebih dahulu.' }, { status: 400 })
  }
  if (!allowedImageTypes.includes(image.type)) {
    return NextResponse.json({ message: 'Format foto harus JPG, PNG, atau WEBP.' }, { status: 400 })
  }
  if (image.size > maxImageSize) {
    return NextResponse.json({ message: 'Ukuran foto maksimal 8 MB.' }, { status: 400 })
  }

  try {
    const uploaded = await uploadSiteImage(image, 'collaboration-events')
    return NextResponse.json({ imageUrl: uploaded.publicUrl })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Gagal mengunggah gambar.' },
      { status: 500 }
    )
  }
}
