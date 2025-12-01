import { NavLink } from 'react-router-dom'
import { Headphones, Disc3, GraduationCap, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
  badge?: number
}

const navItems: NavItem[] = [
  { path: '/listen', label: 'Listen', icon: <Headphones className="w-5 h-5" /> },
  { path: '/dj', label: 'Create', icon: <Disc3 className="w-5 h-5" /> },
  { path: '/learn', label: 'Learn', icon: <GraduationCap className="w-5 h-5" /> },
  { path: '/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
]

export function ListenBottomNav() {
  return (
    <Card className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/95 border-zinc-800 backdrop-blur-xl rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.1)] px-2 py-2 z-50">
      <nav className="flex items-center gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-br from-cyan-500/20 to-pink-500/20 text-white'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator pill */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                )}

                {/* Icon with optional badge */}
                <div className="relative">
                  {item.icon}
                  {item.badge && item.badge > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[9px] bg-pink-500 border-0">
                      {item.badge}
                    </Badge>
                  )}
                </div>

                {/* Label */}
                <span className={`text-[10px] font-medium transition-all ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </span>

                {/* Active glow effect */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/10 to-pink-500/10 blur-sm -z-10" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </Card>
  )
}
