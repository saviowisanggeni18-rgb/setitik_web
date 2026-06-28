import type { Metadata } from 'next'
import MbatikBarengAnimated from '@/components/sections/MbatikBarengAnimated'

export const metadata: Metadata = {
  title: 'Mbatik Bareng',
  description: 'Ikut Mbatik Bareng — kegiatan membatik langsung di tepi jalan Kota Lama Semarang, setiap Kamis minggu ketiga.',
}

export default function MbatikBarengPage() {
  return <MbatikBarengAnimated />
}
