import { NavLink } from 'react-router-dom'
import { House, Wand2, BookOpen, User } from 'lucide-react'

const tabs = [
  { to: '/stream', label: 'Listen', Icon: House },
  { to: '/create', label: 'Create', Icon: Wand2 },
  { to: '/learn',  label: 'Learn',  Icon: BookOpen },
  { to: '/profile',label: 'Profile',Icon: User },
]

export default function BottomTabBar() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-line bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/90">
      <ul className="grid grid-cols-4">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-3 text-xs transition-all ${
                  isActive
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-accentFrom to-accentTo font-bold'
                    : 'text-muted hover:text-text'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    className={isActive ? 'mb-1' : 'mb-1'}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
