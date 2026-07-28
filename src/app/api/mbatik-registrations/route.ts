import { NextResponse } from 'next/server'
import { submitMbatikRegistration } from '@/lib/mbatik-events'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const formData = await request.formData()
  const eventId = String(formData.get('eventId') ?? '').trim()
  const name = String(formData.get('name') ?? '').trim()
  const whatsapp = String(formData.get('whatsapp') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const notes = String(formData.get('notes') ?? '').trim()
  const participants = Number(formData.get('participants') ?? 1)

  if (!eventId) {
    return NextResponse.json({ message: 'Pilih tanggal kegiatan dulu.' }, { status: 400 })
  }

  if (!name || !whatsapp) {
    return NextResponse.json(
      { message: 'Nama dan nomor WhatsApp wajib diisi.' },
      { status: 400 }
    )
  }

  if (!Number.isInteger(participants) || participants < 1 || participants > 5) {
    return NextResponse.json(
      { message: 'Jumlah peserta harus 1 sampai 5 orang.' },
      { status: 400 }
    )
  }

  try {
    const result = await submitMbatikRegistration({
      eventId,
      name,
      whatsapp,
      email,
      participants,
      notes,
    })

    return NextResponse.json({
      message: result.sheet.synced
        ? 'Pendaftaran berhasil. Data sudah masuk ke laporan.'
        : 'Pendaftaran berhasil dan tersimpan. Sinkronisasi otomatis ke Google Sheets belum aktif.',
      event: result.event,
      sheet: result.sheet,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Gagal mengirim pendaftaran.',
      },
      { status: 500 }
    )
  }
}
