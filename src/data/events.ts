export interface Event {
  id: string
  date: string
  displayDate: string
  time: string
  location: string
  totalSlots: number
  availableSlots: number
  status: 'open' | 'full' | 'coming-soon'
}

export const events: Event[] = [
  {
    id: 'mbatik-juni-2026',
    date: '2026-06-18',
    displayDate: 'Kamis, 18 Juni 2026',
    time: '09.00–12.00 WIB',
    location: 'Taman Srigunting, Kota Lama Semarang',
    totalSlots: 20,
    availableSlots: 3,
    status: 'open',
  },
  {
    id: 'mbatik-juli-2026',
    date: '2026-07-16',
    displayDate: 'Kamis, 16 Juli 2026',
    time: '09.00–12.00 WIB',
    location: 'Taman Srigunting, Kota Lama Semarang',
    totalSlots: 20,
    availableSlots: 20,
    status: 'open',
  },
  {
    id: 'mbatik-agustus-2026',
    date: '2026-08-20',
    displayDate: 'Kamis, 20 Agustus 2026',
    time: '09.00–12.00 WIB',
    location: 'Taman Srigunting, Kota Lama Semarang',
    totalSlots: 20,
    availableSlots: 20,
    status: 'coming-soon',
  },
]

export function getUpcomingEvents(): Event[] {
  const today = new Date().toISOString().split('T')[0]
  return events.filter((e) => e.date >= today)
}

export function getOpenEvents(): Event[] {
  return events.filter((e) => e.status === 'open' && e.availableSlots > 0)
}
