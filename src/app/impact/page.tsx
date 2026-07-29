import type { Metadata } from 'next'
import ImpactAnimated from '@/components/sections/ImpactAnimated'
import { listHomepageSections } from '@/lib/homepage-sections'
import CustomHomepageSection from '@/components/sections/CustomHomepageSection'
import SectionTextOverrides from '@/components/sections/SectionTextOverrides'

export const metadata: Metadata = {
  title: 'Dampak',
  description: 'Dampak sosial dan budaya Setitik Cultureware — pemberdayaan komunitas dan pelestarian cagar budaya.',
}

export default async function ImpactPage() {
  const sections = await listHomepageSections({ visibleOnly: true })
  const impactSections = sections.filter((item) => item.page === 'impact')
  return (
    <>
      {impactSections.find((item) => item.sectionKey === 'impact-main') && (() => { const section = impactSections.find((item) => item.sectionKey === 'impact-main')!; return <SectionTextOverrides section={section}><ImpactAnimated section={section} /></SectionTextOverrides> })()}
      {impactSections.filter((item) => item.kind === 'custom').map((item, index) => (
        <SectionTextOverrides key={item.id} section={item}><CustomHomepageSection section={item} index={index} /></SectionTextOverrides>
      ))}
    </>
  )
}
export const dynamic = 'force-dynamic'
