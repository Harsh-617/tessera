import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Reveal from '../../components/Reveal'
import api from '../../services/api'
import { auth } from '../../firebase'

// ── Colors ────────────────────────────────────────────────────────────────
const C = { red: '#ef4444', amber: '#f59e0b', green: '#22c55e', blue: '#60a5fa' }

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_STATS = [
  { label: 'Active links',   value: 42, delta: '+8 this week',       up: true },
  { label: 'At risk',        value: 3,  delta: '+2 vs last week',    down: true },
  { label: 'Programmes',     value: 7,  delta: '2 active · 5 completed' },
  { label: 'DNA blueprints', value: 24, delta: '+3 from MaGIC C6',   up: true },
]

const HEALTH_BUCKETS = [
  { pct: 8,  color: C.red   },
  { pct: 4,  color: C.red   },
  { pct: 6,  color: C.red   },
  { pct: 14, color: C.amber },
  { pct: 20, color: C.amber },
  { pct: 34, color: C.amber },
  { pct: 48, color: C.green },
  { pct: 78, color: C.green },
  { pct: 96, color: C.green },
  { pct: 64, color: C.green },
]

const DNA_PATTERNS = [
  { text: 'Fintech mentors with 10+ yrs and active investor networks correlate with seed-stage funding within 6 months.', from: 'MaGIC Cohort 6', pair: 'Ahmad × FundBridge' },
  { text: 'Healthtech founders paired with regulatory-experienced mentors achieve pilot approval 2× faster.', from: 'MaGIC Cohort 6', pair: 'Nurul × MediTrack' },
  { text: 'SaaS GTM frameworks transfer cleanly when mentor and startup share a target persona.', from: 'MaGIC Cohort 6', pair: 'Priya × DeskOps' },
]

const MOCK_LINKS = [
  { id: '1', mentor: { name: 'James Tan',    sub: 'CTO · Hardware'           }, startup: { name: 'GreenHarvest', sub: 'Agritech · Idea'      }, programme: 'Cradle CIP 2026', region: 'Malaysia',        health: 28,  status: 'at_risk',   lastActivity: '17 days ago' },
  { id: '2', mentor: { name: 'David Lim',    sub: 'Founder · E-comm'         }, startup: { name: 'ShopSwift',    sub: 'E-comm · Series A'    }, programme: 'Cradle CIP 2026', region: 'Malaysia',        health: 36,  status: 'at_risk',   lastActivity: '15 days ago' },
  { id: '3', mentor: { name: 'Ahmad Razif',  sub: 'VP · Maybank'             }, startup: { name: 'PayNow Pro',   sub: 'Fintech · Seed'       }, programme: 'Cradle CIP 2026', region: 'Malaysia',        health: 92,  status: 'active',    lastActivity: '2 days ago'  },
  { id: '4', mentor: { name: 'Priya Nair',   sub: 'Head of Product · Grab'   }, startup: { name: 'MeshCloud',    sub: 'SaaS · Seed'          }, programme: 'Cradle CIP 2026', region: 'Malaysia',        health: 81,  status: 'active',    lastActivity: '4 days ago'  },
  { id: '5', mentor: { name: 'Nurul Huda',   sub: 'ex-KKM · Healthcare'      }, startup: { name: 'CareLoop',     sub: 'Healthtech · MVP'     }, programme: 'Cradle CIP 2026', region: 'Malaysia',        health: 58,  status: 'warn',      lastActivity: '6 days ago'  },
  { id: '6', mentor: { name: 'Ahmad Razif',  sub: 'VP · Maybank'             }, startup: { name: 'FundBridge',   sub: 'Fintech · Seed'       }, programme: 'MaGIC Cohort 6',  region: 'Malaysia · 2024', health: 100, status: 'completed', lastActivity: '2024 · Successful' },
]

// ── Helpers ────────────────────────────────────────────────────────────────
function initials(name) {
  const parts = name.split(' ')
  return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase()
}

function timeGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function healthColor(score) {
  if (score >= 70) return C.green
  if (score >= 40) return C.amber
  return C.red
}

// ── Sub-components ─────────────────────────────────────────────────────────
function HealthBar({ score }) {
  const color = healthColor(score)
  return (
    <div className="flex items-center gap-3">
      <div className="w-[72px] h-1 rounded-full bg-white/[0.08]">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-[12px] font-medium" style={{ color }}>{score}</span>
    </div>
  )
}

function StatusBadge({ status }) {
  if (status === 'active') return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide border"
          style={{ color: C.green, borderColor: `${C.green}33`, background: `${C.green}12` }}>
      Active
    </span>
  )
  if (status === 'at_risk') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide border"
          style={{ color: C.amber, borderColor: `${C.amber}33`, background: `${C.amber}12` }}>
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.amber }} />
      At risk
    </span>
  )
  if (status === 'warn') return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide border"
          style={{ color: C.amber, borderColor: `${C.amber}33`, background: `${C.amber}12` }}>
      Warning
    </span>
  )
  if (status === 'completed') return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide border"
          style={{ color: '#8a8a92', borderColor: '#23232780', background: '#23232740' }}>
      Completed
    </span>
  )
  return null
}

function Avatar({ name, size = 28 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-[#ededee] font-medium flex-shrink-0"
      style={{
        width: size, height: size, fontSize: size < 32 ? 10 : 12,
        background: 'linear-gradient(135deg, #2a2a30, #1a1a20)',
        border: '1px solid #2c2c32',
      }}
    >
      {initials(name)}
    </div>
  )
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const userName = auth.currentUser?.displayName?.split(' ')[0] || 'Admin'

  const filteredLinks = MOCK_LINKS.filter(l => {
    if (filter === 'at_risk') return l.status === 'at_risk'
    if (filter === 'proposed') return l.status === 'pending'
    return true
  })

  const card = 'rounded-2xl border border-[#232327] p-6'
  const cardBg = { background: 'linear-gradient(180deg, #131316 0%, #0f0f12 100%)' }
  const eyebrow = 'text-[11px] text-[#5b5b62] tracking-[0.24em] uppercase'

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0c', color: '#ededee', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="ds-bg" />
      <div className="ds-grid" />
      <Sidebar />

      <main className="ml-[240px] min-h-screen relative z-10 p-10 pt-12 page-enter">

        {/* Page header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <div className={`${eyebrow} mb-2`}>Admin overview</div>
            <h1 className="font-fraunces font-light text-[#ededee] m-0 leading-tight" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.03em' }}>
              {timeGreeting()}, {userName}.
            </h1>
            <p className="text-[14px] text-[#8a8a92] mt-2 m-0">
              3 links transitioned to{' '}
              <strong style={{ color: C.amber }}>at-risk</strong>{' '}
              in the last 24 hours · Cradle CIP 2026 cohort is awaiting matches.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-8">
            <button className="h-9 px-4 rounded-full border border-[#2c2c32] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[13px] font-medium flex items-center gap-2 transition-colors cursor-pointer bg-transparent">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export
            </button>
            <button
              onClick={() => navigate('/admin/programmes')}
              className="h-9 px-4 rounded-full text-[#0b0b0c] text-[13px] font-medium flex items-center gap-2 transition-colors cursor-pointer border-0"
              style={{ background: '#ededee' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff'}
              onMouseLeave={e => e.currentTarget.style.background = '#ededee'}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/>
              </svg>
              Generate matches
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          {MOCK_STATS.map((s, i) => (
            <div key={i} className={card} style={cardBg}>
              <div className="text-[12px] text-[#5b5b62] tracking-[0.16em] uppercase mb-3">{s.label}</div>
              <div
                className="text-[36px] font-light leading-none mb-3 font-fraunces"
                style={{ color: s.down ? C.amber : '#ededee', letterSpacing: '-0.03em' }}
              >
                {s.value}
              </div>
              <div className="flex items-center gap-1.5 text-[12px]" style={{ color: s.up ? C.green : s.down ? C.amber : '#5b5b62' }}>
                {s.up && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 15 12 9 18 15"/>
                  </svg>
                )}
                {s.down && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                )}
                {s.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Middle row */}
        <Reveal delay={80}><div className="grid grid-cols-2 gap-5 mb-6">

          {/* Health histogram */}
          <div className={card} style={cardBg}>
            <div className="text-[14px] font-medium text-[#ededee] mb-4">Cohort health distribution</div>
            <div className="flex items-end gap-1.5 h-[120px] pt-2 pb-1">
              {HEALTH_BUCKETS.map((b, i) => (
                <div key={i} className="flex-1 rounded-t-[3px]" style={{ height: `${b.pct}%`, background: b.color, opacity: 0.8 }} />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-[#5b5b62] tracking-[0.18em] uppercase mt-1.5 mb-4">
              <span>0</span><span>50</span><span>100</span>
            </div>
            <div className="flex gap-5 text-[12px] text-[#8a8a92]">
              {[{ color: C.red, label: 'At risk (3)' }, { color: C.amber, label: 'Warning (8)' }, { color: C.green, label: 'Healthy (31)' }].map(l => (
                <span key={l.label} className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-[2px]" style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>

          {/* DNA patterns */}
          <div className={card} style={cardBg}>
            <div className="flex items-center justify-between mb-5">
              <div className="text-[14px] font-medium text-[#ededee]">Recently learned patterns</div>
              <button
                onClick={() => navigate('/admin/dna')}
                className="text-[11px] text-[#5b5b62] hover:text-[#8a8a92] transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                View library →
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {DNA_PATTERNS.map((p, i) => (
                <div key={i} className="flex gap-3.5 items-start">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: C.blue }} />
                  <div>
                    <div className="text-[13.5px] text-[#ededee] leading-snug">{p.text}</div>
                    <div className="text-[11.5px] text-[#5b5b62] mt-1">
                      From <span className="text-[#8a8a92]">{p.from}</span> · {p.pair}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div></Reveal>

        {/* Links table */}
        <Reveal delay={160}><section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className={`${eyebrow} mb-1.5`}>All links</div>
              <h2 className="font-fraunces font-normal text-[#ededee] m-0" style={{ fontSize: '22px', letterSpacing: '-0.02em' }}>
                Active relationships
              </h2>
            </div>
            <div className="flex gap-2">
              {[
                { key: 'all',      label: 'All · 42',    amber: false },
                { key: 'at_risk',  label: 'At risk · 3', amber: true  },
                { key: 'proposed', label: 'Proposed · 5', amber: false },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="h-8 px-3 rounded-full text-[12px] border transition-colors cursor-pointer bg-transparent"
                  style={{
                    color: filter === f.key ? (f.amber ? C.amber : '#ededee') : (f.amber ? C.amber : '#8a8a92'),
                    borderColor: filter === f.key ? (f.amber ? C.amber : '#3a3a40') : (f.amber ? `${C.amber}60` : '#232327'),
                    background: filter === f.key ? (f.amber ? `${C.amber}12` : 'rgba(255,255,255,0.06)') : 'transparent',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#232327] overflow-hidden" style={cardBg}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#232327]">
                    {['Pairing', 'Programme', 'Health', 'Status', 'Last activity', ''].map((h, i) => (
                      <th
                        key={i}
                        className="px-5 py-3.5 text-[11px] text-[#5b5b62] tracking-[0.2em] uppercase font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map(link => (
                    <tr
                      key={link.id}
                      onClick={() => navigate(`/admin/links/${link.id}`)}
                      className="border-b border-[#232327] last:border-b-0 cursor-pointer group transition-colors"
                      style={link.status === 'at_risk' ? { background: `${C.amber}05` } : {}}
                      onMouseEnter={e => e.currentTarget.style.background = link.status === 'at_risk' ? `${C.amber}0a` : 'rgba(255,255,255,0.025)'}
                      onMouseLeave={e => e.currentTarget.style.background = link.status === 'at_risk' ? `${C.amber}05` : ''}
                    >
                      {/* Pairing */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Avatar name={link.mentor.name} />
                            <div>
                              <div className="text-[13px] text-[#ededee] font-medium leading-tight">{link.mentor.name}</div>
                              <div className="text-[11px] text-[#5b5b62] mt-0.5">{link.mentor.sub}</div>
                            </div>
                          </div>
                          <span className="text-[#2c2c32] text-[16px] flex-shrink-0">→</span>
                          <div className="flex items-center gap-2">
                            <Avatar name={link.startup.name} />
                            <div>
                              <div className="text-[13px] text-[#ededee] font-medium leading-tight">{link.startup.name}</div>
                              <div className="text-[11px] text-[#5b5b62] mt-0.5">{link.startup.sub}</div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Programme */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-[13px] text-[#8a8a92]">{link.programme}</div>
                        <div className="text-[11px] text-[#5b5b62] mt-0.5">{link.region}</div>
                      </td>

                      {/* Health */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <HealthBar score={link.health} />
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={link.status} />
                      </td>

                      {/* Last activity */}
                      <td className="px-5 py-4 whitespace-nowrap text-[13px] text-[#5b5b62]">
                        {link.lastActivity}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <span className="text-[#2c2c32] group-hover:text-[#5b5b62] transition-colors text-[16px]">→</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center px-5 py-3.5 border-t border-[#232327] text-[12px] text-[#5b5b62]">
              <span>Showing {filteredLinks.length} of 42 links</span>
              <button className="text-[#8a8a92] hover:text-[#ededee] transition-colors cursor-pointer bg-transparent border-0 p-0">
                View all →
              </button>
            </div>
          </div>
        </section></Reveal>
      </main>
    </div>
  )
}
