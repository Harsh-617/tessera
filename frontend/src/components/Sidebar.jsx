import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../hooks/useAuth'

const NAV = {
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Programmes', path: '/admin/programmes' },
    { label: 'Actors', path: '/admin/actors' },
    { label: 'DNA Library', path: '/admin/dna' },
  ],
  mentor: [
    { label: 'My Links', path: '/mentor' },
    { label: 'Profile', path: '/mentor/profile' },
  ],
  startup: [
    { label: 'My Links', path: '/startup' },
    { label: 'Profile', path: '/startup/profile' },
  ],
}

export default function Sidebar() {
  const { role, user } = useAuth()
  const navigate = useNavigate()
  const links = NAV[role] ?? []

  const handleSignOut = async () => {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: '#18181b',
      color: '#fff', display: 'flex', flexDirection: 'column',
      padding: '24px 0', flexShrink: 0,
    }}>
      <div style={{ padding: '0 24px', marginBottom: 32 }}>
        <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.5, color: '#a5b4fc' }}>
          tessera
        </div>
        <div style={{ fontSize: 11, color: '#71717a', marginTop: 2, textTransform: 'uppercase', letterSpacing: 1 }}>
          {role}
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        {links.map(({ label, path }) => (
          <NavLink
            key={path} to={path}
            style={({ isActive }) => ({
              display: 'block', padding: '10px 24px',
              color: isActive ? '#a5b4fc' : '#a1a1aa',
              background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
              textDecoration: 'none', fontSize: 14, fontWeight: isActive ? 600 : 400,
              borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
              transition: 'all 0.15s',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px 24px', borderTop: '1px solid #27272a' }}>
        <div style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.email}
        </div>
        <button
          onClick={handleSignOut}
          style={{
            width: '100%', padding: '7px 0', borderRadius: 8,
            background: 'transparent', color: '#71717a',
            border: '1px solid #27272a', fontSize: 13, cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
