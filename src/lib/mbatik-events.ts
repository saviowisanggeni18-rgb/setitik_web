import { getSupabaseAdmin } from '@/lib/site-updates'

export type MbatikEventStatus = 'open' | 'full' | 'coming-soon'

export type MbatikEvent = {
  id: string
  date: string
  displayDate: string
  time: string
  location: string
  totalSlots: number
  availableSlots: number
  status: MbatikEventStatus
}

type MbatikEventRow = {
  id: string
  event_date: string
  time: string
  location: string
  total_slots: number
  available_slots: number
  status: MbatikEventStatus
}

export type MbatikRegistrationInput = {
  eventId: string
  name: string
  whatsapp: string
  email: string
  participants: number
  notes: string
}

export const defaultMbatikEvents: MbatikEvent[] = [
  {
    id: 'mbatik-juni-2026',
    date: '2026-06-18',
    displayDate: 'Kamis, 18 Juni 2026',
    time: '09.00-12.00 WIB',
    location: 'Taman Srigunting, Kota Lama Semarang',
    totalSlots: 20,
    availableSlots: 3,
    status: 'open',
  },
  {
    id: 'mbatik-juli-2026',
    date: '2026-07-16',
    displayDate: 'Kamis, 16 Juli 2026',
    time: '09.00-12.00 WIB',
    location: 'Taman Srigunting, Kota Lama Semarang',
    totalSlots: 20,
    availableSlots: 20,
    status: 'open',
  },
  {
    id: 'mbatik-agustus-2026',
    date: '2026-08-20',
    displayDate: 'Kamis, 20 Agustus 2026',
    time: '09.00-12.00 WIB',
    location: 'Taman Srigunting, Kota Lama Semarang',
    totalSlots: 20,
    availableSlots: 20,
    status: 'coming-soon',
  },
]

function formatDisplayDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

function toMbatikEvent(row: MbatikEventRow): MbatikEvent {
  return {
    id: row.id,
    date: row.event_date,
    displayDate: formatDisplayDate(row.event_date),
    time: row.time,
    location: row.location,
    totalSlots: row.total_slots,
    availableSlots: row.available_slots,
    status: row.status,
  }
}

function getSheetsWebhookUrl() {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

  if (!webhookUrl || webhookUrl.includes('isi-webhook-apps-script')) {
    return null
  }

  return webhookUrl
}

function getMbatikSheetName(event: Pick<MbatikEvent, 'date'>) {
  return `Mbatik ${event.date}`
}

async function cleanupExpiredMbatikEvents() {
  const supabase = getSupabaseAdmin()

  if (!supabase) return

  const today = new Date().toISOString().split('T')[0]
  await supabase.from('mbatik_events').delete().lt('event_date', today)
}

async function sendRegistrationToSheet({
  event,
  registration,
}: {
  event: MbatikEvent
  registration: MbatikRegistrationInput
}) {
  const webhookUrl = getSheetsWebhookUrl()

  if (!webhookUrl) {
    return { synced: false, reason: 'Google Sheets webhook belum dikonfigurasi.' }
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      action: 'appendRegistration',
      secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET ?? '',
      sheetName: getMbatikSheetName(event),
      submittedAt: new Date().toISOString(),
      eventDate: event.date,
      eventLabel: event.displayDate,
      eventTime: event.time,
      eventLocation: event.location,
      name: registration.name,
      whatsapp: registration.whatsapp,
      email: registration.email,
      participants: registration.participants,
      notes: registration.notes,
    }),
  })

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        'Pendaftaran tersimpan, tetapi Apps Script menolak akses. Ubah akses deployment Web App menjadi “Siapa saja”, lalu deploy ulang.'
      )
    }

    throw new Error(`Pendaftaran tersimpan, tetapi Google Sheets merespons HTTP ${response.status}.`)
  }

  const result = (await response.json().catch(() => null)) as
    | { ok?: boolean; message?: string }
    | null

  if (!result?.ok) {
    throw new Error(
      result?.message === 'Unauthorized'
        ? 'Pendaftaran tersimpan, tetapi secret Apps Script tidak sama dengan GOOGLE_SHEETS_WEBHOOK_SECRET.'
        : `Pendaftaran tersimpan, tetapi Apps Script gagal memproses data${result?.message ? `: ${result.message}` : '.'}`
    )
  }

  return { synced: true, reason: null }
}

async function createEventSheet(event: MbatikEvent) {
  const webhookUrl = getSheetsWebhookUrl()

  if (!webhookUrl) {
    return { synced: false, reason: 'Google Sheets webhook belum dikonfigurasi.' }
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      action: 'createEventSheet',
      secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET ?? '',
      sheetName: getMbatikSheetName(event),
      eventDate: event.date,
      eventLabel: event.displayDate,
      eventTime: event.time,
      eventLocation: event.location,
      totalSlots: event.totalSlots,
      availableSlots: event.availableSlots,
      status: event.status,
    }),
  })

  if (!response.ok) {
    return { synced: false, reason: 'Jadwal tersimpan, tetapi tab Google Sheets gagal dibuat.' }
  }

  return { synced: true, reason: null }
}

export function getDefaultUpcomingMbatikEvents() {
  const today = new Date().toISOString().split('T')[0]
  return defaultMbatikEvents.filter((event) => event.date >= today)
}

export async function listMbatikEvents({ fallbackToDefault = true } = {}) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    if (!fallbackToDefault) {
      throw new Error('Admin belum memakai Supabase service role/secret key.')
    }

    return getDefaultUpcomingMbatikEvents()
  }

  try {
    await cleanupExpiredMbatikEvents()

    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('mbatik_events')
      .select('id,event_date,time,location,total_slots,available_slots,status')
      .gte('event_date', today)
      .order('event_date', { ascending: true })

    if (error) throw new Error(error.message)

    return (data ?? []).map((row) => toMbatikEvent(row as MbatikEventRow))
  } catch (error) {
    if (!fallbackToDefault) {
      throw error
    }

    return getDefaultUpcomingMbatikEvents()
  }
}

export async function createMbatikEvent({
  date,
  time,
  location,
  totalSlots,
  availableSlots,
  status,
}: {
  date: string
  time: string
  location: string
  totalSlots: number
  availableSlots: number
  status: MbatikEventStatus
}) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    throw new Error('Modul jadwal Mbatik belum terhubung ke Supabase.')
  }

  const { data, error } = await supabase
    .from('mbatik_events')
    .insert({
      event_date: date,
      time,
      location,
      total_slots: totalSlots,
      available_slots: availableSlots,
      status,
    })
    .select('id,event_date,time,location,total_slots,available_slots,status')
    .single()

  if (error) throw new Error(error.message)

  const event = toMbatikEvent(data as MbatikEventRow)
  const sheet = await createEventSheet(event)

  return { event, sheet }
}

export async function submitMbatikRegistration(input: MbatikRegistrationInput) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    throw new Error('Modul pendaftaran Mbatik belum terhubung ke Supabase.')
  }

  const { data, error } = await supabase
    .from('mbatik_events')
    .select('id,event_date,time,location,total_slots,available_slots,status')
    .eq('id', input.eventId)
    .single()

  if (error || !data) {
    throw new Error('Jadwal tidak ditemukan.')
  }

  const event = toMbatikEvent(data as MbatikEventRow)
  const today = new Date().toISOString().split('T')[0]

  if (event.date < today) {
    throw new Error('Jadwal ini sudah lewat.')
  }

  if (event.status !== 'open') {
    throw new Error('Pendaftaran untuk jadwal ini belum dibuka.')
  }

  if (event.availableSlots < input.participants) {
    throw new Error('Sisa tempat tidak mencukupi.')
  }

  const nextAvailableSlots = event.availableSlots - input.participants
  const nextStatus: MbatikEventStatus = nextAvailableSlots === 0 ? 'full' : event.status

  const { error: updateError } = await supabase
    .from('mbatik_events')
    .update({
      available_slots: nextAvailableSlots,
      status: nextStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', event.id)
    .eq('available_slots', event.availableSlots)

  if (updateError) {
    throw new Error(updateError.message)
  }

  const { error: insertError } = await supabase.from('mbatik_registrations').insert({
    event_id: event.id,
    event_date: event.date,
    event_label: event.displayDate,
    name: input.name,
    whatsapp: input.whatsapp,
    email: input.email || null,
    participants: input.participants,
    notes: input.notes || null,
  })

  if (insertError) {
    throw new Error(insertError.message)
  }

  const sheet = await sendRegistrationToSheet({ event, registration: input })

  return {
    event: {
      ...event,
      availableSlots: nextAvailableSlots,
      status: nextStatus,
    },
    sheet,
  }
}

export async function deleteMbatikEvent(id: string) {
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    throw new Error('Modul jadwal Mbatik belum terhubung ke Supabase.')
  }

  const { error } = await supabase.from('mbatik_events').delete().eq('id', id)

  if (error) throw new Error(error.message)
}

export function isMbatikEventStatus(value: string): value is MbatikEventStatus {
  return value === 'open' || value === 'full' || value === 'coming-soon'
}
