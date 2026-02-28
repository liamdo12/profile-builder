// Component: LandingHeader (named export)
// Sticky glassmorphism navbar for the always-dark landing page

import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useAuth } from '@/contexts/use-auth'

export function LandingHeader() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-400" />
          <span className="font-semibold text-white">Profile Builder</span>
        </Link>

        {/* Right: Auth-aware actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white" asChild>
              <Link to="/documents">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-zinc-300 hover:bg-white/5 hover:text-white" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
