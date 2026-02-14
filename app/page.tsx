import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { HeroSection } from "@/components/public/hero-section"
import { ProgramsSection } from "@/components/public/programs-section"
import { StatsSection } from "@/components/public/stats-section"
import { CampusLifeSection } from "@/components/public/campus-life-section"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProgramsSection />
        <StatsSection />
        <CampusLifeSection />
      </main>
      <Footer />
    </>
  )
}
