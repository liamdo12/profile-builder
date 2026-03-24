// Component: LandingHeader (named export)
// Sticky glassmorphism navbar for the light landing page

import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/use-auth'

export function LandingHeader() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <span className="font-semibold text-gray-900">Profile Builder</span>
        </Link>

        {/* Right: Auth-aware actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white" asChild>
              <Link to="/documents">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900" asChild>
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
