import { NextResponse } from 'next/server'
import { deleteMbatikEvent } from '@/lib/mbatik-events'
import {
  isAdminPasswordConfigured,
  isAdminPasswordValid,
  isSiteUpdateModuleConfigured,
} from '@/lib/site-updates'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params

  try {
    await deleteMbatikEvent(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Gagal menghapus jadwal Mbatik Bareng.',
      },
      { status: 500 }
    )
  }
}
