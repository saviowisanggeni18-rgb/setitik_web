import HeroSection from '@/components/sections/HeroSection'
import BuildingToFabricSection from '@/components/sections/BuildingToFabricSection'
import InspirationMapSection from '@/components/sections/InspirationMapSection'
import FounderQuoteSection from '@/components/sections/FounderQuoteSection'
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection'
import MbatikBarengHighlight from '@/components/sections/MbatikBarengHighlight'
import LatestUpdatesSection from '@/components/sections/LatestUpdatesSection'
import CustomHomepageSection from '@/components/sections/CustomHomepageSection'
import LocationNavigationSection from '@/components/sections/LocationNavigationSection'
import TargetedUpdatesSection from '@/components/sections/TargetedUpdatesSection'
import { listHomepageSections, type HomepageSection } from '@/lib/homepage-sections'
import { listMbatikEvents, type MbatikEvent } from '@/lib/mbatik-events'
import SectionReveal from '@/components/animations/SectionReveal'
import SectionTextOverrides from '@/components/sections/SectionTextOverrides'

export const dynamic = 'force-dynamic'

function renderSection(section: HomepageSection, mbatikEvents: MbatikEvent[]) {
  switch (section.sectionKey) {
    case 'hero':
      return <HeroSection key={section.id} section={section} />
    case 'building-to-fabric':
      return <BuildingToFabricSection key={section.id} section={section} />
    case 'inspiration-map':
      return <InspirationMapSection key={section.id} section={section} />
    case 'founder-quote':
      return <FounderQuoteSection key={section.id} section={section} />
    case 'featured-products':
      return <FeaturedProductsSection key={section.id} section={section} />
    case 'latest-updates':
      return (
        <div key={section.id}>
          <LatestUpdatesSection section={section} />
          <TargetedUpdatesSection
            target="story"
            eyebrow="Cerita Beranda"
            title="Cerita kecil dari Setitik."
            description="Ruang untuk cerita pendek, catatan proses, atau narasi baru yang ingin dibaca pengunjung di halaman utama."
            tone="silk"
            limit={3}
          />
        </div>
      )
    case 'mbatik-bareng':
      return <MbatikBarengHighlight key={section.id} events={mbatikEvents} section={section} />
    case 'location-navigation':
      return <LocationNavigationSection key={section.id} section={section} />
    default:
      return <CustomHomepageSection key={section.id} section={section} />
  }
}

export default async function Home() {
  const [allSections, mbatikEvents] = await Promise.all([
    listHomepageSections({ visibleOnly: true }),
    listMbatikEvents(),
  ])
  const sections = allSections.filter((section) => (section.page ?? 'home') === 'home')

  return (
    <>
      {sections.map((section, index) => (
        <SectionReveal
          key={section.id}
          delay={index * 0.025}
          direction={index % 3 === 1 ? 'left' : index % 3 === 2 ? 'right' : 'up'}
          showDivider={index > 0}
        >
          <SectionTextOverrides section={section}>
            {renderSection(section, mbatikEvents)}
          </SectionTextOverrides>
        </SectionReveal>
      ))}
    </>
  )
}
