import { NavLink } from 'react-router-dom'
import { House, Wand2, BookOpen, User } from 'lucide-react'

const items = [
  { to: '/listen', label: 'Listen', Icon: House },
  { to: '/create', label: 'Create', Icon: Wand2 },
  { to: '/learn',  label: 'Learn',  Icon: BookOpen },
  { to: '/profile',label: 'Profile',Icon: User },
]

export default function SidebarNav() {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-56 border-r bg-white/80 backdrop-blur p-4">
      <nav className="w-full">
        <div className="mb-6 font-extrabold tracking-tight text-lg">RMXR</div>
        <ul className="space-y-1">
          {items.map(({ to, label, Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 ${isActive ? 'bg-black text-white' : 'hover:bg-neutral-100'}`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
