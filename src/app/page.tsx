import HeroSection from '@/components/sections/HeroSection'
import BuildingToFabricSection from '@/components/sections/BuildingToFabricSection'
import FounderQuoteSection from '@/components/sections/FounderQuoteSection'
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection'
import MbatikBarengTeaser from '@/components/sections/MbatikBarengTeaser'

export default function Home() {
  return (
    <>
      <HeroSection />
      <BuildingToFabricSection />
      <FounderQuoteSection />
      <FeaturedProductsSection />
      <MbatikBarengTeaser />
    </>
  )
}
