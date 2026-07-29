import type { Metadata } from 'next'
import MbatikBarengAnimated from '@/components/sections/MbatikBarengAnimated'
import { listMbatikEvents } from '@/lib/mbatik-events'
import { loadMbatikPageContent } from '@/lib/mbatik-page-content'

export const metadata: Metadata = {
  title: 'Mbatik Bareng',
  description: 'Ikut Mbatik Bareng — kegiatan membatik langsung di tepi jalan Kota Lama Semarang, setiap Kamis minggu ketiga.',
}

export default async function MbatikBarengPage() {
  const [events, content] = await Promise.all([listMbatikEvents(), loadMbatikPageContent()])

  return (
    <>
      <MbatikBarengAnimated events={events} content={content} />
    </>
  )
}

export const dynamic = 'force-dynamic'
