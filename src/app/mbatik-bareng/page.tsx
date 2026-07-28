import type { Metadata } from 'next'
import MbatikBarengAnimated from '@/components/sections/MbatikBarengAnimated'
import { listMbatikEvents } from '@/lib/mbatik-events'

export const metadata: Metadata = {
  title: 'Mbatik Bareng',
  description: 'Ikut Mbatik Bareng — kegiatan membatik langsung di tepi jalan Kota Lama Semarang, setiap Kamis minggu ketiga.',
}

export default async function MbatikBarengPage() {
  const events = await listMbatikEvents()

  return (
    <>
      <MbatikBarengAnimated events={events} />
    </>
  )
}
