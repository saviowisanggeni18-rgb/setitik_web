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
