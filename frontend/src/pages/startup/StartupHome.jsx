import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Reveal from '../../components/Reveal'
import { getLinks } from '../../services/links.service'

const C = { green: '#22c55e', amber: '#f59e0b', blue: '#60a5fa' }

const MOCK_LINKS = [{
  id: 'link-1',
  mentor_initials: 'NH', mentor_name: 'Nurul Huda',
  mentor_sub: 'Healthtech · 8 yrs · ex-KKM consultant',
  why: "Nurul's regulatory experience at KKM directly addresses your MOH pilot path. Past cohorts with this pairing pattern achieved approval 2× faster.",
  health: 70, sessions: 6,
  status: 'active', last_session: '2 days ago', next_due: '5 days',
}]

const STARTUP_STATS = [
  { label: 'Health score',    value: '70',  valueSuffix: null, delta: 'Healthy',          valueColor: C.green },
  { label: 'Mentor sessions', value: '6',   valueSuffix: null, delta: 'Of 8 required',    valueColor: null },
  { label: 'Milestones',      value: '2',   valueSuffix: '/3', delta: '1 due 30 Jun',     valueColor: null },
  { label: 'Programme week',  value: '1',   valueSuffix: '/26',delta: 'Cradle CIP 2026',  valueColor: null },
]

const WHATS_NEXT = [
  { month: 'May', day: '19', title: 'Session with Nurul Huda',        sub: '10:00 AM · MOH application review', urgent: false },
  { month: 'Jun', day: '30', title: 'Submit MOH pilot application',   sub: 'Outstanding milestone · ~45 days remaining', urgent: true },
]

function hColor(v) {
  if (v >= 70) return C.green
  if (v >= 40) return C.amber
  return '#ef4444'
}

export default function StartupHome() {
  const navigate = useNavigate()
  const [links, setLinks] = useState(MOCK_LINKS)

  useEffect(() => {
    getLinks().then(d => { if (d?.length) setLinks(d) }).catch(() => {})
  }, [])

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
            <div className="text-[11px] text-[#5b5b62] tracking-[0.24em] uppercase mb-2">CareLoop · Healthtech</div>
            <h1 className="font-fraunces font-light text-[#ededee] m-0 leading-tight" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.03em' }}>
              Welcome back.
            </h1>
            <p className="text-[14px] text-[#8a8a92] mt-2 m-0">
              You're 2 weeks into <strong className="text-[#ededee] font-medium">Cradle CIP 2026</strong>. Your MOH pilot milestone is due in 45 days.
            </p>
          </div>
          <button
            onClick={() => navigate(`/startup/links/${links[0]?.id ?? 'link-1'}`)}
            className="h-9 px-4 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-0 flex-shrink-0"
            style={{ background: '#ededee', color: '#0b0b0c' }}
          >
            + Log check-in
          </button>
        </header>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          {STARTUP_STATS.map((s, i) => (
            <div key={i} className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <div className="text-[12px] text-[#5b5b62] tracking-[0.16em] uppercase mb-3">{s.label}</div>
              <div className="font-fraunces font-light text-[36px] leading-none tracking-[-0.03em] mb-3"
                style={{ color: s.valueColor ?? '#ededee' }}>
                {s.value}
                {s.valueSuffix && <span className="text-[24px] text-[#5b5b62]">{s.valueSuffix}</span>}
              </div>
              <div className="text-[12px] text-[#5b5b62]">{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Your mentors */}
        <Reveal><section className="mb-8">
          <h2 className="font-fraunces font-normal text-[#ededee] text-[22px] m-0 mb-3.5" style={{ letterSpacing: '-0.01em' }}>Your mentors</h2>
          <div className="grid grid-cols-2 gap-[18px]">
            {links.map(link => {
              const hc = hColor(link.health ?? link.health_score ?? 0)
              const health = link.health ?? link.health_score ?? 0
              const sessions = link.sessions ?? 0
              return (
                <article
                  key={link.id}
                  onClick={() => navigate(`/startup/links/${link.id}`)}
                  className="rounded-2xl border border-[#232327] p-[22px] flex flex-col gap-4 cursor-pointer transition-all duration-200"
                  style={cardBg}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a3a40'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#232327'; e.currentTarget.style.transform = '' }}
                >
                  {/* Head */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-[14px] flex-shrink-0 flex items-center justify-center font-fraunces text-[18px] text-[#ededee]"
                      style={{ background: 'linear-gradient(135deg, #3a3a40, #1d1d21)' }}>
                      {link.mentor_initials ?? link.mentor?.full_name?.slice(0, 2).toUpperCase() ?? 'NH'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[16px] font-medium text-[#ededee]">{link.mentor_name ?? link.mentor?.full_name}</div>
                      <div className="text-[12.5px] text-[#8a8a92] mt-0.5">{link.mentor_sub ?? link.mentor?.job_title}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full tracking-[0.1em] uppercase flex-shrink-0"
                      style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: C.green }}>
                      Active
                    </span>
                  </div>

                  {/* Why this match */}
                  {link.why && (
                    <div className="rounded-r-lg py-3 px-3.5" style={{ borderLeft: `2px solid ${C.blue}`, background: 'rgba(96,165,250,0.04)' }}>
                      <div className="text-[11px] tracking-[0.18em] uppercase mb-1.5" style={{ color: C.blue }}>Why this match</div>
                      <p className="font-fraunces font-normal text-[14px] leading-[1.5] text-[#8a8a92] m-0">{link.why}</p>
                    </div>
                  )}

                  {/* Health row */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#5b5b62] tracking-[0.22em] uppercase">Health</div>
                      <div className="font-fraunces font-normal text-[22px] leading-[1.2]" style={{ color: hc }}>{health}</div>
                    </div>
                    <div className="flex-1 px-5">
                      <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${health}%`, background: hc }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-[#5b5b62] tracking-[0.22em] uppercase">Sessions</div>
                      <div className="font-fraunces font-normal text-[22px] leading-[1.2] text-[#ededee]">{sessions}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#232327] pt-3.5 text-[12.5px] text-[#5b5b62]">
                    <span>Last session · {link.last_session ?? '—'}</span>
                    <span>Next due in {link.next_due ?? '—'}</span>
                  </div>
                </article>
              )
            })}

            {/* Empty slot */}
            <article className="rounded-2xl p-[22px] flex items-center justify-center opacity-70"
              style={{ border: '1px dashed #232327', background: 'transparent' }}>
              <div className="text-center px-4 py-8">
                <div className="font-fraunces font-normal text-[18px] text-[#ededee] mb-1.5">Need more help?</div>
                <p className="text-[13px] text-[#5b5b62] m-0 leading-[1.55] max-w-[280px] mb-3.5">
                  If your support needs change, update your profile and you'll appear in future match runs.
                </p>
                <button
                  onClick={e => { e.stopPropagation(); navigate('/startup/profile') }}
                  className="h-7 px-3.5 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[11px] transition-colors cursor-pointer bg-transparent"
                >
                  Update profile
                </button>
              </div>
            </article>
          </div>
        </section></Reveal>

        {/* What's next */}
        <Reveal delay={80}><section>
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
                  onClick={() => navigate(`/startup/links/${links[0]?.id ?? 'link-1'}`)}
                  className="h-7 px-3.5 rounded-full text-[11px] font-medium cursor-pointer border-0 transition-colors"
                  style={item.urgent
                    ? { background: '#ededee', color: '#0b0b0c' }
                    : { background: 'transparent', border: '1px solid #232327', color: '#8a8a92' }
                  }
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </section></Reveal>

      </main>
    </div>
  )
}
