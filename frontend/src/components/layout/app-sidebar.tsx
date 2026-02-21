import { NavLink, useLocation } from 'react-router-dom'
import { FileText, Upload, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/layout/theme-toggle'

const navItems = [
  { title: 'Documents', url: '/', icon: FileText },
  { title: 'Upload', url: '/upload', icon: Upload },
  { title: 'Smart Resume', url: '/smart-resume', icon: Rocket },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Header */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <FileText className="h-5 w-5 text-primary" />
        <span className="font-semibold">Profile Builder</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.url ||
            (item.url !== '/' && location.pathname.startsWith(item.url))
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <ThemeToggle />
      </div>
    </aside>
  )
}
