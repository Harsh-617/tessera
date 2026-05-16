import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import { setRole as setRoleApi } from '../../services/auth.service'
import { useAuth } from '../../hooks/useAuth'

const ROLES = [
  {
    id: 'admin',
    label: 'Admin',
    desc: 'Run programmes, approve matches, and oversee ecosystem health.',
    meta: 'Programme owners',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h18M3 12h18M3 17h12"/>
      </svg>
    ),
  },
  {
    id: 'mentor',
    label: 'Mentor',
    desc: 'Guide startups, log check-ins, and track milestones.',
    meta: 'Experts & advisors',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="3.2"/>
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>
      </svg>
    ),
  },
  {
    id: 'startup',
    label: 'Startup',
    desc: 'Get matched with mentors and progress through programmes.',
    meta: 'Founders & teams',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 21V9l7-5 7 5v12"/>
        <path d="M10 21v-6h4v6"/>
      </svg>
    ),
  },
  {
    id: 'partner',
    label: 'Partner',
    desc: 'Corporates, investors, and service providers linking to initiatives.',
    meta: 'Sponsors & investors',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 10a3 3 0 1 1 6 0v3a3 3 0 1 1-6 0z"/>
        <path d="M5 13a3 3 0 1 0 0 6h14a3 3 0 1 0 0-6"/>
      </svg>
    ),
  },
]

function userInitial() {
  const email = auth.currentUser?.email || ''
  return email.charAt(0).toUpperCase() || '?'
}

export default function RoleSelection() {
  const navigate = useNavigate()
  const { setRole } = useAuth()
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (!selected || loading) return
    setLoading(true)
    setRole(selected)
    try {
      await setRoleApi(selected)
    } catch {
      // Backend unreachable — continue anyway
    }
    if (selected === 'admin') navigate('/admin/dashboard')
    else if (selected === 'mentor') navigate('/onboarding/mentor')
    else if (selected === 'startup') navigate('/onboarding/startup')
    else if (selected === 'partner') navigate('/partner')
    else navigate('/')
  }

  const email = auth.currentUser?.email || ''
  const initial = userInitial()

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-[#ededee]" style={{ fontFamily: 'Inter, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      <div className="ds-bg" />
      <div className="ds-grid" />
      <div className="ds-vignette" />

      <header className="relative z-10 flex items-center justify-between px-9 py-6 text-[12px] tracking-[0.14em] uppercase text-[#8a8a92]">
        <div
          className="font-fraunces font-normal text-[20px] tracking-[-0.02em] text-[#ededee] normal-case"
          style={{ letterSpacing: '-0.02em' }}
        >
          tessera
          <span
            className="inline-block rounded-full bg-[#ededee] ml-0.5"
            style={{ width: '4px', height: '4px', transform: 'translateY(-7px)', verticalAlign: 'baseline' }}
          />
        </div>
        <div className="flex items-center gap-2.5 normal-case tracking-normal text-[13px] text-[#8a8a92]">
          <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#3a3a40] to-[#1d1d21] border border-[#232327] flex items-center justify-center text-[11px] text-[#ededee] font-medium">
            {initial}
          </div>
          {email && <span>{email}</span>}
          <button
            onClick={() => navigate('/login')}
            className="text-[#5b5b62] hover:text-[#ededee] transition-colors duration-200 ml-2 pl-3 border-l border-[#232327] bg-transparent border-y-0 border-r-0 cursor-pointer text-[12px] tracking-[0.14em] uppercase"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="relative z-10 px-9 pt-20 pb-16 flex flex-col items-center">
        <div className="text-center mb-14 max-w-[720px]">
          <div className="text-[#8a8a92] text-[11px] tracking-[0.28em] uppercase mb-4">Step 1 of 2</div>
          <h1 className="font-fraunces font-light text-[#ededee] m-0 mb-4 tracking-[-0.03em] leading-[1.05]" style={{ fontSize: 'clamp(40px, 5.4vw, 64px)' }}>
            Choose your role
          </h1>
          <p className="text-[#8a8a92] text-[15px] leading-relaxed max-w-[540px] mx-auto m-0">
            Tessera tailors your experience based on how you'll use the platform.{' '}
            <strong className="text-[#ededee] font-medium">This is set once and can't be changed later</strong>, so pick what fits best.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px] w-full max-w-[1080px]">
          {ROLES.map(role => (
            <button
              key={role.id}
              onClick={() => setSelected(role.id)}
              className="text-left font-[inherit] text-[inherit] cursor-pointer rounded-[20px] p-[26px_24px_24px] flex flex-col gap-[18px] min-h-[240px] relative transition-all duration-200 border"
              style={{
                background: selected === role.id
                  ? 'linear-gradient(180deg, #1e1e22 0%, #161619 100%)'
                  : 'linear-gradient(180deg, #18181c 0%, #131316 100%)',
                borderColor: selected === role.id ? '#e9e9ec' : '#232327',
                boxShadow: selected === role.id ? '0 0 0 1px rgba(255,255,255,0.08) inset' : 'none',
                transform: selected !== role.id ? undefined : undefined,
              }}
              onMouseEnter={e => {
                if (selected !== role.id) {
                  e.currentTarget.style.borderColor = '#3a3a40'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.background = 'linear-gradient(180deg, #1c1c20 0%, #16161a 100%)'
                }
              }}
              onMouseLeave={e => {
                if (selected !== role.id) {
                  e.currentTarget.style.borderColor = '#232327'
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.background = 'linear-gradient(180deg, #18181c 0%, #131316 100%)'
                }
              }}
            >
              {/* Check indicator */}
              <span
                className="absolute top-[22px] right-[22px] w-[22px] h-[22px] rounded-full bg-[#ededee] text-[#0b0b0c] flex items-center justify-center transition-all duration-200"
                style={{ opacity: selected === role.id ? 1 : 0, transform: selected === role.id ? 'scale(1)' : 'scale(0.7)' }}
                aria-hidden="true"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>

              <span className="w-10 h-10 rounded-xl bg-white/[0.04] border border-[#232327] flex items-center justify-center text-[#ededee]">
                {role.icon}
              </span>

              <div className="text-[18px] font-medium tracking-[-0.01em]">{role.label}</div>

              <div className="text-[13px] text-[#8a8a92] leading-[1.55] -mt-2">{role.desc}</div>

              <div className="mt-auto text-[11px] text-[#5b5b62] tracking-[0.18em] uppercase flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#5b5b62] flex-shrink-0" />
                {role.meta}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-11 flex items-center justify-between w-full max-w-[1080px]">
          <div className="text-[#5b5b62] text-[12px]">
            You can update your profile details later, but your role is permanent.
          </div>
          <button
            onClick={handleContinue}
            disabled={!selected || loading}
            className="h-12 px-[22px] rounded-full bg-[#ededee] text-[#0b0b0c] font-medium text-[14px] flex items-center gap-2.5 hover:bg-white transition-colors duration-200 disabled:opacity-35 disabled:cursor-not-allowed active:translate-y-px border-0 cursor-pointer"
          >
            {loading ? 'Setting up…' : 'Continue'}
            {!loading && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            )}
          </button>
        </div>
      </main>
    </div>
  )
}