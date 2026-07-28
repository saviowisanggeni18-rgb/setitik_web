import type { Metadata } from 'next'
import ImpactAnimated from '@/components/sections/ImpactAnimated'
import { listHomepageSections } from '@/lib/homepage-sections'
import CustomHomepageSection from '@/components/sections/CustomHomepageSection'

export const metadata: Metadata = {
  title: 'Dampak',
  description: 'Dampak sosial dan budaya Setitik Cultureware — pemberdayaan komunitas dan pelestarian cagar budaya.',
}

export default async function ImpactPage() {
  const sections = await listHomepageSections({ visibleOnly: true })
  const impactSections = sections.filter((item) => item.page === 'impact')
  return (
    <>
      <ImpactAnimated section={impactSections.find((item) => item.sectionKey === 'impact-main')} />
      {impactSections.filter((item) => item.kind === 'custom').map((item, index) => (
        <CustomHomepageSection key={item.id} section={item} index={index} />
      ))}
    </>
  )
}
export const dynamic = 'force-dynamic'
