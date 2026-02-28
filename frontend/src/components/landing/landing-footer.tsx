import { Sparkles } from 'lucide-react'

// Footer — simple centered copyright and brand tagline
export function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-20 w-full border-t border-white/5 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-1.5 text-sm text-zinc-500">
          <Sparkles className="size-3.5 text-indigo-400/50" />
          <span>Built with AI</span>
        </div>
        <p className="text-xs text-zinc-600">
          &copy; {year} Profile Builder. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
