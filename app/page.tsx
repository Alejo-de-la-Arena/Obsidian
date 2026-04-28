import { HeroSection } from '@/components/sections/HeroSection'
import { ManifestoSection } from '@/components/sections/ManifestoSection'
import { ModelosSection } from '@/components/sections/ModelosSection'
import { ProcesoSection } from '@/components/sections/ProcesoSection'
import { EdicionLimitadaSection } from '@/components/sections/EdicionLimitadaSection'
import { TestimoniosSection } from '@/components/sections/TestimoniosSection'
import { ContactoSection } from '@/components/sections/ContactoSection'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <ManifestoSection />
        <ModelosSection />
        <ProcesoSection />
        <EdicionLimitadaSection />
        <TestimoniosSection />
        <ContactoSection />
      </main>
      <Footer />
    </>
  )
}
