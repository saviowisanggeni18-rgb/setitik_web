import { NextResponse } from 'next/server'
import {
  deleteHomepageSection,
  isHomepageSectionModuleConfigured,
  updateHomepageSection,
} from '@/lib/homepage-sections'
import { isAdminPasswordConfigured, isAdminPasswordValid } from '@/lib/site-updates'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const isVisibleRaw = formData.get('isVisible')
  const sortOrderRaw = formData.get('sortOrder')
  const titleRaw = formData.get('title')
  const descriptionRaw = formData.get('description')
  const labelRaw = formData.get('label')
  const imageRaw = formData.get('image')
  const imagePositionXRaw = formData.get('imagePositionX')
  const imagePositionYRaw = formData.get('imagePositionY')
  const imageZoomRaw = formData.get('imageZoom')
  const { id } = await params

  try {
    const section = await updateHomepageSection({
      id,
      isVisible:
        typeof isVisibleRaw === 'string'
          ? isVisibleRaw === 'true'
          : undefined,
      sortOrder:
        typeof sortOrderRaw === 'string' && sortOrderRaw.length > 0
          ? Number(sortOrderRaw)
          : undefined,
      title: typeof titleRaw === 'string' ? titleRaw.trim() : undefined,
      description:
        typeof descriptionRaw === 'string' ? descriptionRaw.trim() : undefined,
      label: typeof labelRaw === 'string' ? labelRaw.trim() : undefined,
      image: imageRaw instanceof File && imageRaw.size > 0 ? imageRaw : null,
      imagePositionX:
        typeof imagePositionXRaw === 'string'
          ? Math.min(100, Math.max(0, Number(imagePositionXRaw)))
          : undefined,
      imagePositionY:
        typeof imagePositionYRaw === 'string'
          ? Math.min(100, Math.max(0, Number(imagePositionYRaw)))
          : undefined,
      imageZoom:
        typeof imageZoomRaw === 'string'
          ? Math.min(3, Math.max(1, Number(imageZoomRaw)))
          : undefined,
    })

    return NextResponse.json({ section })
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Gagal memperbarui section.',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params

  try {
    await deleteHomepageSection(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Gagal menghapus section.',
      },
      { status: 500 }
    )
  }
}
