import type { Metadata } from 'next'
import ImpactAnimated from '@/components/sections/ImpactAnimated'

export const metadata: Metadata = {
  title: 'Dampak',
  description: 'Dampak sosial dan budaya Setitik Cultureware — pemberdayaan komunitas dan pelestarian cagar budaya.',
}

export default function ImpactPage() {
  return <ImpactAnimated />
}
