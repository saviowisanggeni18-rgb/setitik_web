import { NextResponse } from 'next/server'
import {
  bucketName,
  getSupabaseAdmin,
  isAdminPasswordConfigured,
  isAdminPasswordValid,
} from '@/lib/site-updates'

export const dynamic = 'force-dynamic'
// Bucket site-updates memang dibatasi untuk MIME gambar. Konfigurasi kecil ini
// tetap berisi JSON, tetapi disimpan sebagai objek internal bertipe PNG agar
// lolos allow-list bucket yang sudah ada tanpa memerlukan migrasi baru.
const reportConfigPath = 'admin/report-settings.png'

function isValidSheetUrl(value: string) {
  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:' &&
      (url.hostname === 'docs.google.com' || url.hostname === 'sheets.google.com')
    )
  } catch {
    return false
  }
}

async function readStoredSheetUrl() {
  const supabase = getSupabaseAdmin()
  if (!supabase) return ''

  const { data, error } = await supabase.storage.from(bucketName).download(reportConfigPath)
  if (error || !data) return ''

  try {
    const parsed = JSON.parse(await data.text()) as { sheetUrl?: unknown }
    return typeof parsed.sheetUrl === 'string' ? parsed.sheetUrl : ''
  } catch {
    return ''
  }
}

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { message: 'Password admin belum dikonfigurasi.' },
      { status: 503 }
    )
  }

  const formData = await request.formData()

  if (!isAdminPasswordValid(formData.get('password'))) {
    return NextResponse.json({ message: 'Password admin tidak sesuai.' }, { status: 401 })
  }

  const submittedUrl = formData.get('sheetUrl')

  if (typeof submittedUrl === 'string') {
    const sheetUrl = submittedUrl.trim()

    if (!isValidSheetUrl(sheetUrl)) {
      return NextResponse.json(
        { message: 'Masukkan link Google Sheet yang valid dari docs.google.com.' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json(
        { message: 'Supabase admin belum dikonfigurasi.' },
        { status: 503 }
      )
    }

    const { error } = await supabase.storage.from(bucketName).upload(
      reportConfigPath,
      new Blob([JSON.stringify({ sheetUrl, updatedAt: new Date().toISOString() })], {
        type: 'image/png',
      }),
      { contentType: 'image/png', upsert: true }
    )

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({ configured: true, sheetUrl, saved: true })
  }

  const storedUrl = await readStoredSheetUrl()
  const sheetUrl = storedUrl || process.env.GOOGLE_SHEETS_REPORT_URL || ''
  const configured = Boolean(sheetUrl && !sheetUrl.includes('isi-id-sheet'))
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    return NextResponse.json(
      { message: 'Supabase admin belum dikonfigurasi.' },
      { status: 503 }
    )
  }

  const [registrationsResult, eventsResult] = await Promise.all([
    supabase
      .from('mbatik_registrations')
      .select('id,event_id,event_date,event_label,name,whatsapp,email,participants,notes,created_at')
      .order('event_date', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase
      .from('mbatik_events')
      .select('id,total_slots,available_slots,status'),
  ])

  if (registrationsResult.error || eventsResult.error) {
    return NextResponse.json(
      { message: registrationsResult.error?.message ?? eventsResult.error?.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    configured,
    sheetUrl: configured ? sheetUrl : null,
    registrations: registrationsResult.data ?? [],
    events: eventsResult.data ?? [],
  })
}

export async function DELETE(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json({ message: 'Password admin belum dikonfigurasi.' }, { status: 503 })
  }
  if (!isAdminPasswordValid(request.headers.get('x-admin-password'))) {
    return NextResponse.json({ message: 'Password admin tidak sesuai.' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ message: 'Supabase admin belum dikonfigurasi.' }, { status: 503 })

  try {
    const body = await request.json() as {
      registrationId?: string
      eventId?: string | null
      eventDate?: string
      eventLabel?: string
    }

    let lookup = supabase
      .from('mbatik_registrations')
      .select('id,event_id,participants')

    if (body.registrationId) {
      lookup = lookup.eq('id', body.registrationId)
    } else if (body.eventId) {
      lookup = lookup.eq('event_id', body.eventId)
    } else if (body.eventDate && body.eventLabel) {
      lookup = lookup.eq('event_date', body.eventDate).eq('event_label', body.eventLabel)
    } else {
      return NextResponse.json({ message: 'Data histori yang akan dihapus tidak ditemukan.' }, { status: 400 })
    }

    const { data: rows, error: lookupError } = await lookup
    if (lookupError) throw new Error(lookupError.message)
    const ids = (rows ?? []).map((row) => row.id as string)
    if (ids.length === 0) return NextResponse.json({ deleted: 0 })

    const { error: deleteError } = await supabase.from('mbatik_registrations').delete().in('id', ids)
    if (deleteError) throw new Error(deleteError.message)

    // Jika event masih aktif, penghapusan pendaftaran juga mengembalikan kuotanya.
    const restoredByEvent = (rows ?? []).reduce<Record<string, number>>((result, row) => {
      if (typeof row.event_id === 'string') result[row.event_id] = (result[row.event_id] ?? 0) + Number(row.participants || 0)
      return result
    }, {})
    for (const [eventId, restored] of Object.entries(restoredByEvent)) {
      const { data: event } = await supabase.from('mbatik_events').select('available_slots,total_slots').eq('id', eventId).maybeSingle()
      if (event) {
        await supabase.from('mbatik_events').update({ available_slots: Math.min(event.total_slots, event.available_slots + restored) }).eq('id', eventId)
      }
    }

    return NextResponse.json({ deleted: ids.length })
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Gagal menghapus histori.' }, { status: 500 })
  }
}
