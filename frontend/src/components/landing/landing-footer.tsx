import { Sparkles } from 'lucide-react'

// Footer — simple centered copyright and brand tagline
export function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-20 w-full border-t border-gray-200/50 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Sparkles className="size-3.5 text-indigo-400" />
          <span>Built with AI</span>
        </div>
        <p className="text-xs text-gray-400">
          &copy; {year} Profile Builder. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
