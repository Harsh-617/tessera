import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Reveal from '../../components/Reveal'

const C = { green: '#22c55e', amber: '#f59e0b', blue: '#60a5fa', red: '#ef4444' }

const MOCK_STATS = [
  { label: 'Programmes',       value: '2',  suffix: null,  delta: '1 active · 1 completed' },
  { label: 'Startups tracked', value: '12', suffix: null,  delta: 'Across 2 programmes' },
  { label: 'Portfolio health', value: '76', suffix: null,  delta: 'Avg health score', valueColor: C.green },
  { label: 'Events',           value: '4',  suffix: null,  delta: 'This quarter' },
]

const MOCK_PROGRAMMES = [
  {
    id: 'p1',
    name: 'Cradle CIP 2026',
    status: 'active',
    region: 'Malaysia',
    type: 'Accelerator',
    startups: 8,
    mentors: 6,
    health: 74,
    progress: 38,
  },
  {
    id: 'p2',
    name: 'MaGIC Cohort 6',
    status: 'completed',
    region: 'Malaysia',
    type: 'Accelerator',
    startups: 12,
    mentors: 10,
    health: 82,
    progress: 100,
  },
]

const MOCK_PORTFOLIO = [
  { id: 's1', initials: 'CL', name: 'CareLoop',   sector: 'Healthtech · MVP',   mentor: 'Nurul Huda',    health: 70, stage: 'MVP',   programme: 'Cradle CIP 2026' },
  { id: 's2', initials: 'FB', name: 'FundBridge',  sector: 'Fintech · Seed',     mentor: 'Ahmad Razif',   health: 85, stage: 'Seed',  programme: 'MaGIC Cohort 6' },
  { id: 's3', initials: 'AG', name: 'AgroSense',   sector: 'Agritech · Idea',    mentor: 'Priya Nair',    health: 52, stage: 'Idea',  programme: 'Cradle CIP 2026' },
  { id: 's4', initials: 'MT', name: 'MediTrack',   sector: 'Healthtech · Series A', mentor: 'Nurul Huda', health: 91, stage: 'Series A', programme: 'MaGIC Cohort 6' },
]

const WHATS_NEXT = [
  { month: 'Jun', day: '30', title: 'Cradle CIP 2026 Demo Day',       sub: 'KL Convention Centre · 8 startups presenting', urgent: true },
  { month: 'Jul', day: '15', title: 'Mid-programme review call',       sub: 'Portfolio health check · Cradle team', urgent: false },
  { month: 'Aug', day: '01', title: 'Cohort 7 nomination deadline',    sub: 'Submit startup referrals for next intake', urgent: false },
]

function hColor(v) {
  if (v >= 70) return C.green
  if (v >= 40) return C.amber
  return C.red
}

function StatusBadge({ status }) {
  const s = status === 'active'
    ? { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', color: C.green, label: 'Active' }
    : { bg: 'rgba(255,255,255,0.05)', border: '#3a3a40', color: '#8a8a92', label: 'Completed' }
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full tracking-[0.1em] uppercase flex-shrink-0"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {s.label}
    </span>
  )
}

export default function PartnerHome() {
  const navigate = useNavigate()
  const [portfolio] = useState(MOCK_PORTFOLIO)
  const cardBg = { background: 'linear-gradient(180deg, #18181c 0%, #131316 100%)' }

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0c', color: '#ededee', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="ds-bg" />
      <div className="ds-grid" />
      <Sidebar />

      <main className="ml-[240px] min-h-screen relative z-10 p-10 pt-12 page-enter">

        {/* Page header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <div className="text-[11px] text-[#5b5b62] tracking-[0.24em] uppercase mb-2">Partner · Ecosystem view</div>
            <h1 className="font-fraunces font-light text-[#ededee] m-0 leading-tight" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.03em' }}>
              Portfolio overview.
            </h1>
            <p className="text-[14px] text-[#8a8a92] mt-2 m-0">
              You're linked to <strong className="text-[#ededee] font-medium">2 programmes</strong>. 12 startups across your portfolio.
            </p>
          </div>
        </header>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          {MOCK_STATS.map((s, i) => (
            <div key={i} className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <div className="text-[12px] text-[#5b5b62] tracking-[0.16em] uppercase mb-3">{s.label}</div>
              <div className="font-fraunces font-light text-[36px] leading-none tracking-[-0.03em] mb-3"
                style={{ color: s.valueColor ?? '#ededee' }}>
                {s.value}
                {s.suffix && <span className="text-[24px] text-[#5b5b62]">{s.suffix}</span>}
              </div>
              <div className="text-[12px] text-[#5b5b62]">{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Linked programmes */}
        <Reveal><section className="mb-8">
          <h2 className="font-fraunces font-normal text-[#ededee] text-[22px] m-0 mb-3.5" style={{ letterSpacing: '-0.01em' }}>
            Linked programmes
          </h2>
          <div className="grid grid-cols-2 gap-[18px]">
            {MOCK_PROGRAMMES.map(prog => {
              const hc = hColor(prog.health)
              const barColor = prog.status === 'completed' ? C.green : '#ededee'
              return (
                <article
                  key={prog.id}
                  className="rounded-2xl border border-[#232327] p-[22px] flex flex-col gap-4 cursor-pointer transition-all duration-200"
                  style={cardBg}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a3a40'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#232327'; e.currentTarget.style.transform = '' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[17px] font-medium text-[#ededee] font-fraunces leading-tight">{prog.name}</div>
                      <div className="text-[12.5px] text-[#8a8a92] mt-1">{prog.type} · {prog.region}</div>
                    </div>
                    <StatusBadge status={prog.status} />
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-[#5b5b62] mb-1.5">
                      <span>Programme progress</span>
                      <span>{prog.progress}%</span>
                    </div>
                    <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${prog.progress}%`, background: barColor }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-1 border-t border-[#232327]">
                    {[
                      { k: 'Startups', v: prog.startups },
                      { k: 'Mentors',  v: prog.mentors },
                      { k: 'Health',   v: prog.health, color: hc },
                    ].map(s => (
                      <div key={s.k}>
                        <div className="text-[10px] text-[#5b5b62] tracking-[0.2em] uppercase">{s.k}</div>
                        <div className="font-fraunces font-normal text-[22px] mt-0.5" style={{ color: s.color ?? '#ededee' }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </section></Reveal>

        {/* Portfolio startups */}
        <Reveal delay={80}><section className="mb-8">
          <h2 className="font-fraunces font-normal text-[#ededee] text-[22px] m-0 mb-3.5" style={{ letterSpacing: '-0.01em' }}>
            Portfolio startups
          </h2>
          <div className="rounded-2xl border border-[#232327] overflow-hidden" style={cardBg}>
            {portfolio.map((s, i) => {
              const hc = hColor(s.health)
              return (
                <div
                  key={s.id}
                  className="grid items-center px-[22px] py-[16px] transition-colors duration-150 cursor-default"
                  style={{
                    gridTemplateColumns: '40px 1fr 160px 120px 80px',
                    gap: '16px',
                    borderBottom: i < portfolio.length - 1 ? '1px solid #232327' : 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center font-fraunces text-[13px] text-[#ededee] flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #3a3a40, #1d1d21)' }}>
                    {s.initials}
                  </div>

                  {/* Name + sector */}
                  <div className="min-w-0">
                    <div className="text-[14px] font-medium text-[#ededee] truncate">{s.name}</div>
                    <div className="text-[12px] text-[#8a8a92] mt-0.5 truncate">{s.sector}</div>
                  </div>

                  {/* Programme */}
                  <div className="text-[12px] text-[#5b5b62] truncate">{s.programme}</div>

                  {/* Mentor */}
                  <div className="text-[12px] text-[#8a8a92] truncate">{s.mentor}</div>

                  {/* Health */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${s.health}%`, background: hc }} />
                    </div>
                    <span className="text-[12px] font-medium flex-shrink-0" style={{ color: hc }}>{s.health}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section></Reveal>

        {/* What's next */}
        <Reveal delay={160}><section>
          <h2 className="font-fraunces font-normal text-[#ededee] text-[22px] m-0 mb-3.5" style={{ letterSpacing: '-0.01em' }}>What's next</h2>
          <div className="rounded-2xl border border-[#232327] overflow-hidden" style={cardBg}>
            {WHATS_NEXT.map((item, i) => (
              <div key={i}
                className="grid items-center px-[22px] py-[18px]"
                style={{
                  gridTemplateColumns: '80px 1fr auto',
                  gap: '18px',
                  borderBottom: i < WHATS_NEXT.length - 1 ? '1px solid #232327' : 'none',
                  background: item.urgent ? 'rgba(245,158,11,0.03)' : 'transparent',
                }}>
                <div className="text-center">
                  <div className="text-[10px] tracking-[0.18em] uppercase" style={{ color: item.urgent ? C.amber : '#5b5b62' }}>{item.month}</div>
                  <div className="font-fraunces font-light text-[28px] leading-none mt-0.5" style={{ color: item.urgent ? C.amber : '#ededee' }}>
                    {item.day}
                  </div>
                </div>
                <div>
                  <div className="text-[14px] text-[#ededee]">{item.title}</div>
                  <div className="text-[12px] text-[#5b5b62] mt-0.5">{item.sub}</div>
                </div>
                <button
                  className="h-7 px-3.5 rounded-full text-[11px] font-medium cursor-pointer border-0 transition-colors"
                  style={item.urgent
                    ? { background: '#ededee', color: '#0b0b0c' }
                    : { background: 'transparent', border: '1px solid #232327', color: '#8a8a92' }
                  }
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </section></Reveal>

      </main>
    </div>
  )
}
