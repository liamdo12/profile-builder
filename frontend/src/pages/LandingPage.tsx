import { LandingGradientBackground } from '@/components/landing/landing-gradient-background'
import { LandingHeader } from '@/components/landing/landing-header'
import { LandingHeroSection } from '@/components/landing/landing-hero-section'
import { LandingFeaturesSection } from '@/components/landing/landing-features-section'
import { LandingHowItWorksSection } from '@/components/landing/landing-how-it-works-section'
import { LandingStatsSection } from '@/components/landing/landing-stats-section'
import { LandingCtaSection } from '@/components/landing/landing-cta-section'
import { LandingFooter } from '@/components/landing/landing-footer'

// Public landing page — soft pastel light aesthetic
export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-gray-900">
      <LandingGradientBackground />
      <LandingHeader />
      <main className="relative z-20">
        <LandingHeroSection />
        <LandingFeaturesSection />
        <LandingHowItWorksSection />
        <LandingStatsSection />
        <LandingCtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
