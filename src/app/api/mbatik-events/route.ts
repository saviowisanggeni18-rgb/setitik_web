import { NextResponse } from 'next/server'
import {
  createMbatikEvent,
  isMbatikEventStatus,
  listMbatikEvents,
} from '@/lib/mbatik-events'
import {
  isAdminPasswordConfigured,
  isAdminPasswordValid,
  isSiteUpdateModuleConfigured,
} from '@/lib/site-updates'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const events = await listMbatikEvents({ fallbackToDefault: false })

    return NextResponse.json({
      configured: isSiteUpdateModuleConfigured(),
      events,
    })
  } catch (error) {
    return NextResponse.json(
      {
        configured: isSiteUpdateModuleConfigured(),
        events: [],
        message:
          error instanceof Error
            ? error.message
            : 'Gagal mengambil jadwal Mbatik Bareng.',
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

  const date = String(formData.get('date') ?? '').trim()
  const time = String(formData.get('time') ?? '').trim()
  const location = String(formData.get('location') ?? '').trim()
  const totalSlots = Number(formData.get('totalSlots'))
  const availableSlots = Number(formData.get('availableSlots'))
  const statusRaw = String(formData.get('status') ?? '').trim()

  if (!date || !time || !location) {
    return NextResponse.json(
      { message: 'Tanggal, jam, dan lokasi wajib diisi.' },
      { status: 400 }
    )
  }

  if (!Number.isInteger(totalSlots) || totalSlots < 0) {
    return NextResponse.json({ message: 'Kuota harus berupa angka valid.' }, { status: 400 })
  }

  if (!Number.isInteger(availableSlots) || availableSlots < 0) {
    return NextResponse.json(
      { message: 'Sisa tempat harus berupa angka valid.' },
      { status: 400 }
    )
  }

  if (availableSlots > totalSlots) {
    return NextResponse.json(
      { message: 'Sisa tempat tidak boleh lebih besar dari kuota.' },
      { status: 400 }
    )
  }

  if (!isMbatikEventStatus(statusRaw)) {
    return NextResponse.json({ message: 'Status jadwal tidak valid.' }, { status: 400 })
  }

  try {
    const result = await createMbatikEvent({
      date,
      time,
      location,
      totalSlots,
      availableSlots,
      status: statusRaw,
    })

    return NextResponse.json(
      {
        event: result.event,
        sheet: result.sheet,
        message: result.sheet.synced
          ? 'Jadwal tersimpan dan tab Google Sheets sudah dibuat.'
          : result.sheet.reason ?? 'Jadwal tersimpan.',
      },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error && error.message.toLowerCase().includes('mbatik_events')
        ? 'Database belum punya tabel mbatik_events. Jalankan ulang SQL terbaru dari supabase-site-updates.sql.'
        : error instanceof Error
          ? error.message
          : 'Gagal menyimpan jadwal Mbatik Bareng.'

    return NextResponse.json({ message }, { status: 500 })
  }
}
