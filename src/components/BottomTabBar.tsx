import { NavLink } from 'react-router-dom'
import { House, Wand2, BookOpen, User } from 'lucide-react'

const tabs = [
  { to: '/listen', label: 'Listen', Icon: House },
  { to: '/create', label: 'Create', Icon: Wand2 },
  { to: '/learn',  label: 'Learn',  Icon: BookOpen },
  { to: '/profile',label: 'Profile',Icon: User },
]

export default function BottomTabBar() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <ul className="grid grid-cols-4">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 text-xs ${isActive ? 'text-black font-semibold' : 'text-neutral-500'}`
              }
            >
              <Icon size={20} />
              <span className="mt-0.5">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
