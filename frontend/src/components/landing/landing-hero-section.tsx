import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/use-auth'

// Hero section — primary landing banner with AI-focused messaging and auth-aware CTAs
export function LandingHeroSection() {
  const { isAuthenticated } = useAuth()

  const primaryHref = isAuthenticated ? '/documents' : '/register'

  const handleLearnMore = () => {
    const featuresEl = document.getElementById('features')
    if (featuresEl) {
      featuresEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative z-20 flex min-h-[70vh] w-full flex-col items-center justify-center px-4 py-20 text-center">
      {/* Badge */}
      <div className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300">
        <Sparkles className="size-4 text-indigo-400" />
        <span>Powered by Claude, GPT-4, and Gemini</span>
      </div>

      {/* Glow behind heading */}
      <div className="absolute left-1/2 top-1/3 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[100px]" />

      {/* Heading */}
      <h1 className="mb-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
        AI-Powered Resume Builder
      </h1>

      {/* Subheading */}
      <p className="mb-10 max-w-2xl text-lg text-zinc-400 sm:text-xl">
        Powered by Claude, GPT-4, and Gemini — create professional, ATS-friendly resumes in minutes
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40" asChild>
          <Link to={primaryHref}>
            <Sparkles className="size-4" />
            {isAuthenticated ? 'Go to Documents' : 'Get Started Free'}
          </Link>
        </Button>

        <Button size="lg" variant="outline" className="border-white/20 text-zinc-300 hover:bg-white/5 hover:text-white" onClick={handleLearnMore}>
          Learn More
        </Button>
      </div>
    </section>
  )
}
