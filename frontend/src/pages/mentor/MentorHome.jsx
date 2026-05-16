import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Reveal from '../../components/Reveal'
import { getLinks } from '../../services/links.service'

const C = { green: '#22c55e', amber: '#f59e0b', blue: '#60a5fa' }

const MOCK_LINKS = [{
  id: 'link-1',
  startup_initials: 'CL', startup_name: 'CareLoop',
  startup_sub: 'Healthtech · MVP · Malaysia',
  description: 'Remote patient monitoring for chronic-care clinics. Moving toward MOH pilot approval.',
  health: 70, milestones_done: 2, milestones_total: 3,
  status: 'active', last_checkin: '2 days ago', next_due: '5 days',
}]

const MENTOR_STATS = [
  { label: 'Active links',       value: '1',  valueSuffix: null, delta: 'CareLoop',          up: false },
  { label: 'This month',         value: '3',  valueSuffix: null, delta: 'Check-ins logged',  up: false },
  { label: 'Avg session',        value: '75', valueSuffix: 'm',  delta: 'Across all links',  up: false },
  { label: 'Successful matches', value: '3',  valueSuffix: null, delta: '+1 DNA blueprint',  up: true  },
]

const UPCOMING = [
  { month: 'May', day: '19', title: 'Check-in with CareLoop',                       sub: '10:00 AM · MOH application review', urgent: false },
  { month: 'Jun', day: '30', title: 'CareLoop milestone · Submit MOH pilot application', sub: 'Outstanding milestone',             urgent: false },
]

const COMPLETED = [
  { initials: 'MT', startup: 'MediTrack', startup_sub: 'Healthtech', programme: 'MaGIC Cohort 6 · 2024', outcome: 'Successful', duration: '7 months', dna: 'DNA-3e91 contributed' },
]

function timeGreeting(name) {
  const h = new Date().getHours()
  if (h < 12) return `Good morning, ${name}.`
  if (h < 18) return `Good afternoon, ${name}.`
  return `Good evening, ${name}.`
}

function hColor(v) {
  if (v >= 70) return C.green
  if (v >= 40) return C.amber
  return '#ef4444'
}

export default function MentorHome() {
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
            <div className="text-[11px] text-[#5b5b62] tracking-[0.24em] uppercase mb-2">Mentor view</div>
            <h1 className="font-fraunces font-light text-[#ededee] m-0 leading-tight" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.03em' }}>
              {timeGreeting('Nurul')}
            </h1>
            <p className="text-[14px] text-[#8a8a92] mt-2 m-0">
              You have <strong className="text-[#ededee] font-medium">{links.length} active link{links.length !== 1 ? 's' : ''}</strong> and one check-in coming up this week.
            </p>
          </div>
          <div className="flex gap-2.5 flex-shrink-0">
            <button className="h-9 px-4 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[13px] font-medium flex items-center gap-2 transition-colors cursor-pointer bg-transparent">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Schedule
            </button>
            <button
              onClick={() => navigate(`/mentor/links/${links[0]?.id ?? 'link-1'}`)}
              className="h-9 px-4 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-0"
              style={{ background: '#ededee', color: '#0b0b0c' }}
            >
              + Log check-in
            </button>
          </div>
        </header>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          {MENTOR_STATS.map((s, i) => (
            <div key={i} className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <div className="text-[12px] text-[#5b5b62] tracking-[0.16em] uppercase mb-3">{s.label}</div>
              <div className="font-fraunces font-light text-[36px] leading-none tracking-[-0.03em] text-[#ededee] mb-3">
                {s.value}
                {s.valueSuffix && <span className="text-[24px] text-[#5b5b62]">{s.valueSuffix}</span>}
              </div>
              <div className="flex items-center gap-1.5 text-[12px]" style={{ color: s.up ? C.green : '#5b5b62' }}>
                {s.up && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 15 12 9 18 15"/>
                  </svg>
                )}
                {s.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Active links */}
        <Reveal><section className="mb-8">
          <h2 className="font-fraunces font-normal text-[#ededee] text-[22px] m-0 mb-3.5" style={{ letterSpacing: '-0.01em' }}>Active links</h2>
          <div className="grid grid-cols-2 gap-[18px]">
            {links.map(link => {
              const hc = hColor(link.health ?? link.health_score ?? 0)
              const health = link.health ?? link.health_score ?? 0
              return (
                <article
                  key={link.id}
                  onClick={() => navigate(`/mentor/links/${link.id}`)}
                  className="rounded-2xl border border-[#232327] p-[22px] flex flex-col gap-4 cursor-pointer transition-all duration-200"
                  style={cardBg}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a3a40'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#232327'; e.currentTarget.style.transform = '' }}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-[14px] flex-shrink-0 flex items-center justify-center font-fraunces text-[18px] text-[#ededee]"
                      style={{ background: 'linear-gradient(135deg, #3a3a40, #1d1d21)' }}>
                      {link.startup_initials ?? link.startup?.company_name?.slice(0, 2).toUpperCase() ?? 'CL'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[16px] font-medium text-[#ededee]">{link.startup_name ?? link.startup?.company_name}</div>
                      <div className="text-[12.5px] text-[#8a8a92] mt-0.5">{link.startup_sub ?? link.startup?.industry}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full tracking-[0.1em] uppercase flex-shrink-0"
                      style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: C.green }}>
                      Active
                    </span>
                  </div>
                  {link.description && (
                    <p className="text-[13px] text-[#8a8a92] leading-[1.55] m-0">{link.description}</p>
                  )}
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
                      <div className="text-[10px] text-[#5b5b62] tracking-[0.22em] uppercase">Milestones</div>
                      <div className="font-fraunces font-normal text-[22px] leading-[1.2] text-[#ededee]">
                        {link.milestones_done ?? '—'} / {link.milestones_total ?? '—'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#232327] pt-3.5 text-[12.5px] text-[#5b5b62]">
                    <span>Last check-in · {link.last_checkin ?? '—'}</span>
                    <span>Next due in {link.next_due ?? '—'}</span>
                  </div>
                </article>
              )
            })}

            {/* Empty slot */}
            <article className="rounded-2xl p-[22px] flex items-center justify-center opacity-70"
              style={{ border: '1px dashed #232327', background: 'transparent' }}>
              <div className="text-center px-4 py-8">
                <div className="font-fraunces font-normal text-[18px] text-[#ededee] mb-1.5">No other active links</div>
                <p className="text-[13px] text-[#5b5b62] m-0 leading-[1.55] max-w-[280px]">
                  You'll appear in match suggestions for any future programme that needs healthtech regulatory expertise.
                </p>
              </div>
            </article>
          </div>
        </section></Reveal>

        {/* Upcoming */}
        <Reveal delay={80}><section className="mb-8">
          <h2 className="font-fraunces font-normal text-[#ededee] text-[22px] m-0 mb-3.5" style={{ letterSpacing: '-0.01em' }}>Upcoming</h2>
          <div className="rounded-2xl border border-[#232327] overflow-hidden" style={cardBg}>
            {UPCOMING.map((u, i) => (
              <div key={i} className="grid items-center gap-4.5 px-[22px] py-[18px]"
                style={{
                  gridTemplateColumns: '80px 1fr auto',
                  borderBottom: i < UPCOMING.length - 1 ? '1px solid #232327' : 'none',
                }}>
                <div className="text-center">
                  <div className="text-[10px] text-[#5b5b62] tracking-[0.18em] uppercase">{u.month}</div>
                  <div className="font-fraunces font-light text-[28px] leading-none text-[#ededee] mt-0.5">{u.day}</div>
                </div>
                <div>
                  <div className="text-[14px] text-[#ededee]">{u.title}</div>
                  <div className="text-[12px] text-[#5b5b62] mt-0.5">{u.sub}</div>
                </div>
                <button
                  onClick={() => navigate(`/mentor/links/${links[0]?.id ?? 'link-1'}`)}
                  className="h-7 px-3.5 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[11px] transition-colors cursor-pointer bg-transparent"
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </section></Reveal>

        {/* Completed */}
        <Reveal delay={160}><section>
          <h2 className="font-fraunces font-normal text-[#ededee] text-[22px] m-0 mb-3.5" style={{ letterSpacing: '-0.01em' }}>Completed</h2>
          <div className="rounded-2xl border border-[#232327] overflow-hidden" style={cardBg}>
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid #232327' }}>
                  {['Startup', 'Programme', 'Outcome', 'Duration', 'DNA'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] text-[#5b5b62] tracking-[0.12em] uppercase font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPLETED.map((c, i) => (
                  <tr key={i} style={{ borderBottom: i < COMPLETED.length - 1 ? '1px solid #232327' : 'none' }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-medium text-[#ededee]"
                          style={{ background: 'linear-gradient(135deg, #3a3a40, #1d1d21)' }}>
                          {c.initials}
                        </div>
                        <div>
                          <div className="text-[13.5px] text-[#ededee]">{c.startup}</div>
                          <div className="text-[11.5px] text-[#8a8a92] mt-0.5">{c.startup_sub}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-[#8a8a92]">{c.programme}</td>
                    <td className="px-5 py-3.5 text-[13px]" style={{ color: C.green }}>✓ {c.outcome}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#5b5b62]">{c.duration}</td>
                    <td className="px-5 py-3.5 text-[12px]" style={{ color: C.blue }}>{c.dna}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section></Reveal>

      </main>
    </div>
  )
}
