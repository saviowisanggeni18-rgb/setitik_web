import type { Metadata } from 'next'
import AboutAnimated from '@/components/sections/AboutAnimated'

export const metadata: Metadata = {
  title: 'Tentang',
  description: 'Tentang Setitik Cultureware — founder, visi, perjalanan, dan klien institusional.',
}

export default function AboutPage() {
  return <AboutAnimated />
}
