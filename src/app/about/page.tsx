import type { Metadata } from 'next'
import AboutAnimated from '@/components/sections/AboutAnimated'
import CollaborationEventsSection from '@/components/sections/CollaborationEventsSection'
import TargetedUpdatesSection from '@/components/sections/TargetedUpdatesSection'
import { listHomepageSections } from '@/lib/homepage-sections'
import CustomHomepageSection from '@/components/sections/CustomHomepageSection'

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
          return <AboutAnimated key={item.id} section={item} />
        }
        if (item.sectionKey === 'collaboration-events') {
          return <CollaborationEventsSection key={item.id} />
        }
        if (item.kind === 'custom') {
          return <CustomHomepageSection key={item.id} section={item} index={index} />
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
