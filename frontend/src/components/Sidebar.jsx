import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../hooks/useAuth'

const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
  { label: 'Mentors', path: '/admin/actors', icon: 'diversity_3' },
  { label: 'Startups', path: '/admin/actors', icon: 'rocket_launch' },
  { label: 'Matches', path: '/admin/programmes', icon: 'handshake' },
  { label: 'Analytics', path: '/admin/dna', icon: 'analytics' },
]

const MENTOR_NAV = [
  { label: 'My Links', path: '/mentor', icon: 'handshake' },
  { label: 'Profile', path: '/mentor/profile', icon: 'person' },
]

const STARTUP_NAV = [
  { label: 'My Links', path: '/startup', icon: 'handshake' },
  { label: 'Profile', path: '/startup/profile', icon: 'person' },
]

const NAV_BY_ROLE = { admin: ADMIN_NAV, mentor: MENTOR_NAV, startup: STARTUP_NAV }

export default function Sidebar() {
  const { role } = useAuth()
  const navigate = useNavigate()
  const links = NAV_BY_ROLE[role] ?? []

  const handleSignOut = async () => {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <nav className="fixed left-0 top-0 h-full w-sidebar-width bg-surface-container-lowest border-r border-outline-variant flex flex-col gap-element-gap py-container-padding z-20">
      <div className="px-4 mb-4">
        <h1 className="text-title-lg font-black text-on-background tracking-tighter">tessera</h1>
        <p className="text-label-sm text-on-surface-variant mt-1">AI Mentor Hub</p>
      </div>

      <div className="flex-1 flex flex-col gap-1 px-2">
        {links.map(({ label, path, icon }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              isActive
                ? 'bg-surface-container-high text-on-surface border-l-2 border-primary font-title-md flex items-center px-4 py-2 rounded-r'
                : 'text-on-surface-variant hover:text-on-surface flex items-center px-4 py-2 text-body-md hover:bg-surface-container transition-all duration-150 rounded'
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined mr-3 text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {icon}
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="mt-auto px-2 flex flex-col gap-1">
        <a className="text-on-surface-variant hover:text-on-surface flex items-center px-4 py-2 text-body-md hover:bg-surface-container transition-all duration-150 rounded cursor-pointer">
          <span className="material-symbols-outlined mr-3 text-[20px]">help</span>
          Help
        </a>
        <button
          onClick={handleSignOut}
          className="text-on-surface-variant hover:text-on-surface flex items-center px-4 py-2 text-body-md hover:bg-surface-container transition-all duration-150 rounded w-full text-left"
        >
          <span className="material-symbols-outlined mr-3 text-[20px]">logout</span>
          Logout
        </button>
      </div>
    </nav>
  )
}
