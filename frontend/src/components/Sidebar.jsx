import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../hooks/useAuth'

const ADMIN_NAV = [
  { label: 'Dashboard',   path: '/admin/dashboard',  icon: 'dashboard' },
  { label: 'Programmes',  path: '/admin/programmes', icon: 'folder_open' },
  { label: 'DNA Library', path: '/admin/dna',        icon: 'biotech' },
  { label: 'Actors',      path: '/admin/actors',     icon: 'diversity_3' },
]

const MENTOR_NAV = [
  { label: 'My Links', path: '/mentor',         icon: 'handshake' },
  { label: 'Profile',  path: '/mentor/profile', icon: 'person' },
]

const STARTUP_NAV = [
  { label: 'My Links', path: '/startup',         icon: 'handshake' },
  { label: 'Profile',  path: '/startup/profile', icon: 'person' },
]

const PARTNER_NAV = [
  { label: 'Overview', path: '/partner', icon: 'analytics' },
]

const NAV_BY_ROLE = { admin: ADMIN_NAV, mentor: MENTOR_NAV, startup: STARTUP_NAV, partner: PARTNER_NAV }

function inferRole() {
  const p = window.location.pathname
  if (p.startsWith('/admin')) return 'admin'
  if (p.startsWith('/mentor')) return 'mentor'
  if (p.startsWith('/startup')) return 'startup'
  if (p.startsWith('/partner')) return 'partner'
  return 'admin'
}

export default function Sidebar() {
  const { role: authRole } = useAuth()
  const navigate = useNavigate()
  const role = authRole || inferRole()
  const links = NAV_BY_ROLE[role] ?? ADMIN_NAV

  const handleSignOut = async () => {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <nav
      className="fixed left-0 top-0 h-full w-[240px] flex flex-col z-30 border-r border-[#232327]"
      style={{ background: 'rgba(11,11,12,0.96)', backdropFilter: 'blur(12px)', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Wordmark */}
      <div className="px-6 pt-7 pb-5 border-b border-[#232327]">
        <div
          className="font-fraunces font-light text-[#ededee] text-[22px] leading-none"
          style={{ letterSpacing: '-0.03em' }}
        >
          tessera
          <span
            className="inline-block rounded-full bg-[#ededee] ml-[2px]"
            style={{ width: '4px', height: '4px', transform: 'translateY(-6px)', verticalAlign: 'baseline' }}
          />
        </div>
        <div className="text-[11px] text-[#5b5b62] tracking-[0.2em] uppercase mt-2 capitalize" style={{ letterSpacing: '0.2em' }}>
          {role}
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 px-3 pt-4 flex flex-col gap-0.5">
        {links.map(({ label, path, icon }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#ededee] text-[14px] font-medium bg-white/[0.07] cursor-pointer no-underline'
                : 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#8a8a92] text-[14px] hover:text-[#ededee] hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer no-underline'
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-[18px] flex-shrink-0"
                  style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 500" } : { fontVariationSettings: "'wght' 300" }}
                >
                  {icon}
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 pb-6 flex flex-col gap-0.5 border-t border-[#232327] pt-4">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#5b5b62] text-[14px] hover:text-[#ededee] hover:bg-white/[0.04] transition-colors duration-150 w-full text-left cursor-pointer bg-transparent border-0"
        >
          <span className="material-symbols-outlined text-[18px] flex-shrink-0" style={{ fontVariationSettings: "'wght' 300" }}>
            logout
          </span>
          Sign out
        </button>
      </div>
    </nav>
  )
}
