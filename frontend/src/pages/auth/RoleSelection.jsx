import { useNavigate } from 'react-router-dom'
import { setRole } from '../../services/auth.service'

const ROLES = [
  { id: 'admin',   label: 'Admin',   desc: 'Programme owner / ecosystem manager' },
  { id: 'mentor',  label: 'Mentor',  desc: 'Expert guiding startups' },
  { id: 'startup', label: 'Startup', desc: 'Company seeking support' },
  { id: 'partner', label: 'Partner', desc: 'Corporate, investor, or service provider' },
]

export default function RoleSelection() {
  const navigate = useNavigate()

  const handleSelect = async (role) => {
    await setRole(role)
    if (role === 'admin') navigate('/admin/dashboard')
    else if (role === 'mentor') navigate('/onboarding/mentor')
    else if (role === 'startup') navigate('/onboarding/startup')
    else navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f9fafb',
    }}>
      <div style={{ maxWidth: 560, width: '100%', padding: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Who are you?</h1>
        <p style={{ color: '#6b7280', marginBottom: 32 }}>
          Select your role — this cannot be changed later.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {ROLES.map(r => (
            <button
              key={r.id}
              onClick={() => handleSelect(r.id)}
              style={{
                padding: 24, borderRadius: 12, border: '2px solid #e5e7eb',
                background: '#fff', textAlign: 'left', cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{r.label}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{r.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
