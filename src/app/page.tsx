import HeroSection from '@/components/sections/HeroSection'
import BuildingToFabricSection from '@/components/sections/BuildingToFabricSection'
import InspirationMapSection from '@/components/sections/InspirationMapSection'
import FounderQuoteSection from '@/components/sections/FounderQuoteSection'
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection'
import MbatikBarengHighlight from '@/components/sections/MbatikBarengHighlight'

export default function Home() {
  return (
    <>
      <HeroSection />
      <BuildingToFabricSection />
      <InspirationMapSection />
      <FounderQuoteSection />
      <FeaturedProductsSection />
      <MbatikBarengHighlight />
    </>
  )
}
