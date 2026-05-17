import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const C = { green: '#22c55e', amber: '#f59e0b', blue: '#60a5fa' }

const MOCK_ACTORS = [
  { id: 'ar', initials: 'AR', name: 'Ahmad Razif',  sub: '14 yrs · VP, Maybank',          role: 'mentor',  focus: 'Fintech · Fundraising',    country: 'Malaysia', links: 1, profile: 'complete' },
  { id: 'pn', initials: 'PN', name: 'Priya Nair',   sub: '10 yrs · Head of Product, Grab', role: 'mentor',  focus: 'SaaS · Product, GTM',       country: 'Malaysia', links: 1, profile: 'complete' },
  { id: 'jt', initials: 'JT', name: 'James Tan',    sub: '12 yrs · CTO, hardware',         role: 'mentor',  focus: 'Deeptech · R&D, IP',        country: 'Malaysia', links: 1, profile: 'complete' },
  { id: 'nh', initials: 'NH', name: 'Nurul Huda',   sub: '8 yrs · ex-KKM consultant',      role: 'mentor',  focus: 'Healthtech · Regulatory',   country: 'Malaysia', links: 1, profile: 'complete' },
  { id: 'dl', initials: 'DL', name: 'David Lim',    sub: '11 yrs · 2× founder',            role: 'mentor',  focus: 'E-commerce · Scaling',      country: 'Malaysia', links: 1, profile: 'complete' },
  { id: 'pp', initials: 'PP', name: 'PayNow Pro',   sub: 'Seed · Embedded payments',       role: 'startup', focus: 'Fintech',                   country: 'Malaysia', links: 1, profile: 'complete' },
  { id: 'cl', initials: 'CL', name: 'CareLoop',     sub: 'MVP · Remote monitoring',        role: 'startup', focus: 'Healthtech',                country: 'Malaysia', links: 1, profile: 'complete' },
  { id: 'mc', initials: 'MC', name: 'MeshCloud',    sub: 'Seed · B2B infra tooling',       role: 'startup', focus: 'SaaS',                      country: 'Malaysia', links: 1, profile: 'complete' },
  { id: 'gh', initials: 'GH', name: 'GreenHarvest', sub: 'Idea · IoT crop monitoring',     role: 'startup', focus: 'Agritech',                  country: 'Malaysia', links: 1, profile: 'partial'  },
  { id: 'ss', initials: 'SS', name: 'ShopSwift',    sub: 'Series A · Social commerce',     role: 'startup', focus: 'E-commerce',                country: 'Malaysia', links: 1, profile: 'complete' },
  { id: 'mv', initials: 'MV', name: 'Maju Ventures',sub: 'VC · seed-stage SEA',            role: 'partner', focus: 'Investor',                  country: 'Malaysia', links: 0, profile: 'minimal'  },
]

const ROLE_BADGE = {
  mentor:  { bg: 'rgba(96,165,250,0.08)',   border: 'rgba(96,165,250,0.2)',   color: C.blue,  label: 'Mentor'  },
  startup: { bg: 'rgba(34,197,94,0.08)',    border: 'rgba(34,197,94,0.2)',    color: C.green, label: 'Startup' },
  partner: { bg: 'rgba(255,255,255,0.04)',  border: '#232327',                color: '#8a8a92', label: 'Partner' },
}

const PROFILE_STATUS = {
  complete: { icon: '✓', label: 'Complete', color: C.green  },
  partial:  { icon: '✓', label: 'Partial',  color: C.amber  },
  minimal:  { icon: '↓', label: 'Minimal',  color: '#5b5b62' },
}

const INDUSTRIES = ['Fintech', 'Healthtech', 'SaaS', 'Deeptech', 'Agritech', 'E-commerce']
const COUNTRIES  = ['Malaysia', 'Singapore', 'Indonesia']

function Toast({ msg, onClose }) {
  return (
    <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl border border-[#232327] text-[#ededee] text-[13px] flex items-center gap-3"
      style={{ background: 'linear-gradient(180deg, #18181c 0%, #131316 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      {msg}
      <button onClick={onClose} className="text-[#5b5b62] hover:text-[#ededee] bg-transparent border-0 cursor-pointer ml-1">✕</button>
    </div>
  )
}

export default function Actors() {
  const navigate = useNavigate()
  const [actors, setActors] = useState(MOCK_ACTORS)
  const [toast, setToast] = useState(null)
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }
  const [tab, setTab]       = useState('all')
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('')
  const [country, setCountry]   = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/profiles/mentor').catch(() => ({ data: [] })),
      api.get('/profiles/startup').catch(() => ({ data: [] })),
    ]).then(([m, s]) => {
      const merged = [
        ...(m.data ?? []).map(a => ({ ...a, role: 'mentor' })),
        ...(s.data ?? []).map(a => ({ ...a, role: 'startup' })),
      ]
      if (merged.length) setActors(merged)
    }).catch(() => {})
  }, [])

  const counts = {
    all:     actors.length,
    mentors: actors.filter(a => a.role === 'mentor').length,
    startups:actors.filter(a => a.role === 'startup').length,
    partners:actors.filter(a => a.role === 'partner').length,
  }

  const filtered = actors.filter(a => {
    if (tab === 'mentors' && a.role !== 'mentor') return false
    if (tab === 'startups' && a.role !== 'startup') return false
    if (tab === 'partners' && a.role !== 'partner') return false
    if (search) {
      const q = search.toLowerCase()
      if (!a.name.toLowerCase().includes(q) && !(a.focus ?? '').toLowerCase().includes(q)) return false
    }
    if (industry && !(a.focus ?? '').toLowerCase().includes(industry.toLowerCase())) return false
    if (country && a.country !== country) return false
    return true
  })

  const cardBg = { background: 'linear-gradient(180deg, #18181c 0%, #131316 100%)' }
  const selectCls = 'bg-transparent border border-[#232327] rounded-xl px-3 py-2 text-[13px] text-[#8a8a92] focus:outline-none focus:border-[#3a3a40] appearance-none cursor-pointer'

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0c', color: '#ededee', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      <div className="ds-bg" />
      <div className="ds-grid" />
      <Sidebar />

      <main className="ml-[240px] min-h-screen relative z-10 p-10 pt-12 page-enter">

        {/* Page header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <div className="text-[11px] text-[#5b5b62] tracking-[0.24em] uppercase mb-2">Directory</div>
            <h1 className="font-fraunces font-light text-[#ededee] m-0 leading-tight" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.03em' }}>
              All actors
            </h1>
            <p className="text-[14px] text-[#8a8a92] mt-2 m-0">
              The full matching pool — mentors, startups, and partners across all programmes.
            </p>
          </div>
          <div className="flex gap-2.5 flex-shrink-0">
            <button
              onClick={() => showToast('Invitation email sent.')}
              className="h-9 px-4 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[13px] font-medium transition-colors cursor-pointer bg-transparent">
              Invite by email
            </button>
            <button
              onClick={() => navigate('/role-selection')}
              className="h-9 px-4 rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer border-0"
              style={{ background: '#ededee', color: '#0b0b0c' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add actor
            </button>
          </div>
        </header>

        {/* Tabs */}
        <nav className="flex gap-0 border-b border-[#232327] mb-5">
          {[
            { k: 'all',      label: `All · ${counts.all}` },
            { k: 'mentors',  label: `Mentors · ${counts.mentors}` },
            { k: 'startups', label: `Startups · ${counts.startups}` },
            { k: 'partners', label: `Partners · ${counts.partners}` },
          ].map(t => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className="px-4 py-2.5 text-[13px] font-medium transition-colors cursor-pointer bg-transparent border-0 border-b-2 -mb-px"
              style={tab === t.k
                ? { color: '#ededee', borderBottomColor: '#ededee' }
                : { color: '#5b5b62', borderBottomColor: 'transparent' }
              }
            >{t.label}</button>
          ))}
        </nav>

        {/* Search + filters */}
        <div className="flex gap-2.5 mb-5">
          <div className="flex-1 flex items-center gap-2.5 px-3.5 rounded-xl border border-[#232327] h-10 text-[#5b5b62]"
            style={{ background: '#0f0f12' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search actors…"
              className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#ededee] placeholder:text-[#5b5b62]"
            />
          </div>
          <select value={industry} onChange={e => setIndustry(e.target.value)} className={selectCls} style={{ minWidth: 160 }}>
            <option value="">All industries</option>
            {INDUSTRIES.map(i => <option key={i} value={i} className="bg-[#131316]">{i}</option>)}
          </select>
          <select value={country} onChange={e => setCountry(e.target.value)} className={selectCls} style={{ minWidth: 160 }}>
            <option value="">All countries</option>
            {COUNTRIES.map(c => <option key={c} value={c} className="bg-[#131316]">{c}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-[#232327] overflow-hidden" style={cardBg}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid #232327' }}>
                {['Name', 'Role', 'Industry / focus', 'Country', 'Active links', 'Profile'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] text-[#5b5b62] tracking-[0.12em] uppercase font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => {
                const roleCfg    = ROLE_BADGE[a.role] ?? ROLE_BADGE.partner
                const profileCfg = PROFILE_STATUS[a.profile] ?? PROFILE_STATUS.minimal
                return (
                  <tr
                    key={a.id ?? a.user_id}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid #232327' : 'none' }}
                    onClick={() => navigate(`/admin/actors/${a.id ?? a.user_id}`)}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[12px] font-medium text-[#ededee]"
                          style={{ background: 'linear-gradient(135deg, #3a3a40, #1d1d21)' }}>
                          {a.initials ?? (a.name ?? '?').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-[13.5px] text-[#ededee]">{a.name}</div>
                          <div className="text-[11.5px] text-[#8a8a92] mt-0.5">{a.sub}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full tracking-[0.1em] uppercase"
                        style={{ background: roleCfg.bg, border: `1px solid ${roleCfg.border}`, color: roleCfg.color }}>
                        {roleCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#8a8a92]">{a.focus ?? '—'}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#5b5b62]">{a.country ?? '—'}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#ededee]">{a.links ?? 0}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] tracking-[0.16em] uppercase" style={{ color: profileCfg.color }}>
                        {profileCfg.icon} {profileCfg.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-[14px] text-[#5b5b62]">
                    No actors match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}
