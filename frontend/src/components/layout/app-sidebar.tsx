import { NavLink, useLocation } from 'react-router-dom'
import { FileText, Upload, Rocket, Mail, Users, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useAuth } from '@/contexts/use-auth'
import { Button } from '@/components/ui/button'
import type { UserRole } from '@/types/auth'

interface NavItem {
  title: string
  url: string
  icon: React.ElementType
  minRole: UserRole[]
}

const navItems: NavItem[] = [
  { title: 'Documents', url: '/', icon: FileText, minRole: ['BASIC', 'PREMIUM', 'ADMIN'] },
  { title: 'Upload', url: '/upload', icon: Upload, minRole: ['BASIC', 'PREMIUM', 'ADMIN'] },
  { title: 'Smart Resume', url: '/smart-resume', icon: Rocket, minRole: ['BASIC', 'PREMIUM', 'ADMIN'] },
  { title: 'Cover Letter', url: '/cover-letter', icon: Mail, minRole: ['PREMIUM', 'ADMIN'] },
  { title: 'Admin Panel', url: '/admin/users', icon: Users, minRole: ['ADMIN'] },
]

export function AppSidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const visibleItems = navItems.filter(
    (item) => user && item.minRole.includes(user.role)
  )

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Header */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <FileText className="h-5 w-5 text-primary" />
        <span className="font-semibold">Profile Builder</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {visibleItems.map((item) => {
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

      {/* Footer — user info + theme toggle + logout */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        {user && (
          <div className="px-3 py-1">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{user.username}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
            <span className="mt-1 inline-block rounded-sm bg-sidebar-accent px-1.5 py-0.5 text-xs font-medium text-sidebar-accent-foreground">
              {user.role}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between px-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground hover:text-destructive"
            onClick={logout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}
