import type { Metadata } from 'next'
import AboutAnimated from '@/components/sections/AboutAnimated'
import CollaborationEventsSection from '@/components/sections/CollaborationEventsSection'
import TargetedUpdatesSection from '@/components/sections/TargetedUpdatesSection'
import { listHomepageSections } from '@/lib/homepage-sections'
import CustomHomepageSection from '@/components/sections/CustomHomepageSection'
import SectionTextOverrides from '@/components/sections/SectionTextOverrides'

export const metadata: Metadata = {
  title: 'Tentang',
  description: 'Tentang Setitik Cultureware — founder, visi, perjalanan, dan klien institusional.',
}

export default async function AboutPage() {
  const sections = await listHomepageSections({ visibleOnly: true })
  const aboutSections = sections
    .filter((item) => item.page === 'about')
    .sort((a, b) => a.sortOrder - b.sortOrder)
  return (
    <>
      {aboutSections.map((item, index) => {
        if (item.sectionKey === 'about-main') {
          return <SectionTextOverrides key={item.id} section={item}><AboutAnimated section={item} /></SectionTextOverrides>
        }
        if (item.sectionKey === 'collaboration-events') {
          return <SectionTextOverrides key={item.id} section={item}><CollaborationEventsSection section={item} /></SectionTextOverrides>
        }
        if (item.kind === 'custom') {
          return <SectionTextOverrides key={item.id} section={item}><CustomHomepageSection section={item} index={index} /></SectionTextOverrides>
        }
        return null
      })}
      <TargetedUpdatesSection
        target="collaboration"
        eyebrow="Update Kolaborasi"
        title="Kabar terbaru dari ruang kolaborasi."
        description="Event, presentasi, pameran, klien institusional, dan kerja sama terbaru Setitik."
        tone="cream"
      />
    </>
  )
}
export const dynamic = 'force-dynamic'
