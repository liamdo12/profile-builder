import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/use-auth'

// CTA section — bottom conversion prompt with auth-aware destination
export function LandingCtaSection() {
  const { isAuthenticated } = useAuth()
  const ctaHref = isAuthenticated ? '/documents' : '/register'
  const ctaLabel = isAuthenticated ? 'Go to Documents' : 'Start Building for Free'

  return (
    <section className="relative z-20 w-full px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        {/* Glow behind CTA */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="h-64 w-96 rounded-full bg-purple-500/15 blur-[100px]" />
        </div>

        <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to Build Your Perfect Resume?
        </h2>
        <p className="mb-8 text-lg text-zinc-400">
          Join thousands of job seekers who have landed their dream jobs with AI-powered resumes.
        </p>
        <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40" asChild>
          <Link to={ctaHref}>
            <Sparkles className="size-4" />
            {ctaLabel}
          </Link>
        </Button>
      </div>
    </section>
  )
}
