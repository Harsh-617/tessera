import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { getProgramme, getProgrammeActors } from '../../services/programmes.service'

const C = { green: '#22c55e', amber: '#f59e0b', red: '#ef4444', blue: '#60a5fa' }

const MOCK_PROGRAMME = {
  id: 'prog-1', name: 'Cradle CIP Accelerator 2026', status: 'active',
  type: 'Accelerator', country: 'Malaysia', cohort: 'Cohort 1',
  start_date: '12 May 2026', end_date: '12 Nov 2026', weeks: 26,
  rules: { max_startups_per_mentor: 2, required_expertise: 'Healthtech, Fintech', min_checkins: 8, milestones_required: 3 },
  snapshot: { mentors: 5, startups: 5, links: 5, avg_health: 71 },
}
const MOCK_MENTORS = [
  { id: 'm1', initials: 'AR', name: 'Ahmad Razif',  sub: 'Fintech · 14 yrs · VP, Maybank' },
  { id: 'm2', initials: 'PN', name: 'Priya Nair',   sub: 'SaaS · 10 yrs · Head of Product, Grab' },
  { id: 'm3', initials: 'JT', name: 'James Tan',    sub: 'Deeptech · 12 yrs · CTO, hardware' },
  { id: 'm4', initials: 'NH', name: 'Nurul Huda',   sub: 'Healthtech · 8 yrs · ex-KKM' },
  { id: 'm5', initials: 'DL', name: 'David Lim',    sub: 'E-commerce · 11 yrs · 2× founder' },
]
const MOCK_STARTUPS = [
  { id: 's1', initials: 'PP', name: 'PayNow Pro',   sub: 'Fintech · Seed · Embedded payments' },
  { id: 's2', initials: 'CL', name: 'CareLoop',     sub: 'Healthtech · MVP · Remote monitoring' },
  { id: 's3', initials: 'MC', name: 'MeshCloud',    sub: 'SaaS · Seed · Infra tooling' },
  { id: 's4', initials: 'GH', name: 'GreenHarvest', sub: 'Agritech · Idea · IoT crops' },
  { id: 's5', initials: 'SS', name: 'ShopSwift',    sub: 'E-comm · Series A · Social commerce' },
]
const MOCK_LINKS = [
  { id: 'l1', initials: 'NH', mentor: 'Nurul Huda',  startup: 'CareLoop',     health: 70, status: 'active',  score: '0.90', last: '2 days ago' },
  { id: 'l2', initials: 'AR', mentor: 'Ahmad Razif', startup: 'PayNow Pro',   health: 92, status: 'active',  score: '0.94', last: '2 days ago' },
  { id: 'l3', initials: 'PN', mentor: 'Priya Nair',  startup: 'MeshCloud',    health: 81, status: 'active',  score: '0.86', last: '4 days ago' },
  { id: 'l4', initials: 'JT', mentor: 'James Tan',   startup: 'GreenHarvest', health: 28, status: 'at_risk', score: '0.71', last: '17 days ago' },
  { id: 'l5', initials: 'DL', mentor: 'David Lim',   startup: 'ShopSwift',    health: 36, status: 'at_risk', score: '0.83', last: '15 days ago' },
]

function healthColor(v) {
  if (v >= 70) return C.green
  if (v >= 40) return C.amber
  return C.red
}

function Badge({ status }) {
  const cfg = {
    active:   { bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)',  color: C.green, label: 'Active' },
    at_risk:  { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: C.amber, label: 'At risk' },
    completed:{ bg: 'rgba(255,255,255,0.04)', border: '#232327', color: '#8a8a92', label: 'Completed' },
  }
  const s = cfg[status] ?? cfg.active
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full tracking-[0.1em] uppercase"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {s.label}
    </span>
  )
}

function ActorMini({ actor }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[#232327] transition-colors"
      style={{ background: '#0f0f12' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#3a3a40'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#232327'}>
      <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[12px] font-medium text-[#ededee]"
        style={{ background: 'linear-gradient(135deg, #3a3a40, #1d1d21)' }}>
        {actor.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] text-[#ededee]">{actor.name}</div>
        <div className="text-[11.5px] text-[#8a8a92] mt-0.5">{actor.sub}</div>
      </div>
      <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#232327] text-[#8a8a92] tracking-[0.12em] uppercase flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.04)' }}>
        Matched
      </span>
    </div>
  )
}

export default function ProgrammeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [programme, setProgramme] = useState(MOCK_PROGRAMME)
  const [actors, setActors] = useState({ mentors: MOCK_MENTORS, startups: MOCK_STARTUPS })
  const [tab, setTab] = useState('actors')
  const [settings, setSettings] = useState({ name: MOCK_PROGRAMME.name, start_date: '2026-05-12', end_date: '2026-11-12' })

  useEffect(() => {
    getProgramme(id).then(d => { if (d) setProgramme(d) }).catch(() => {})
    getProgrammeActors(id).then(d => { if (d) setActors(d) }).catch(() => {})
  }, [id])

  const { name, status, type, country, cohort, start_date, end_date, weeks, rules, snapshot } = programme
  const cardBg = { background: 'linear-gradient(180deg, #18181c 0%, #131316 100%)' }
  const inputCls = 'w-full bg-[#0b0b0c] border border-[#232327] rounded-xl px-3.5 py-2.5 text-[13px] text-[#ededee] placeholder:text-[#5b5b62] focus:border-[#3a3a40] focus:outline-none transition-colors'
  const labelCls = 'block text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-2'
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
            <button
              onClick={() => navigate('/admin/programmes')}
              className="flex items-center gap-1.5 text-[12px] text-[#5b5b62] tracking-[0.18em] uppercase hover:text-[#8a8a92] transition-colors cursor-pointer bg-transparent border-0 p-0 mb-2.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Programmes
            </button>
            <h1 className="font-fraunces font-light text-[#ededee] m-0 leading-tight" style={{ fontSize: 'clamp(24px, 2.5vw, 36px)', letterSpacing: '-0.03em' }}>
              {name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-[13.5px] text-[#8a8a92]">
              <Badge status={status} />
              <span>{cohort} · {country} · {start_date} – {end_date} · {weeks} weeks</span>
            </div>
          </div>
          <div className="flex gap-2.5 flex-shrink-0">
            <button
              onClick={() => setTab('settings')}
              className="h-9 px-4 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[13px] font-medium transition-colors cursor-pointer bg-transparent">
              Edit programme
            </button>
            <button
              onClick={() => navigate(`/admin/match/${id}`)}
              className="h-9 px-4 rounded-full text-[13px] font-medium flex items-center gap-2 transition-colors cursor-pointer border-0"
              style={{ background: '#ededee', color: '#0b0b0c' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/>
              </svg>
              Generate matches
            </button>
          </div>
        </header>

        {/* Top 2-col cards */}
        <div className="grid grid-cols-2 gap-5 mb-6">

          {/* Programme rules */}
          <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
            <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-4">Programme rules</div>
            <div className="grid grid-cols-2 gap-x-7">
              {[
                { k: 'Type',                    v: type },
                { k: 'Country',                 v: country },
                { k: 'Max startups / mentor',   v: rules.max_startups_per_mentor },
                { k: 'Required expertise',      v: rules.required_expertise },
                { k: 'Min check-ins',           v: rules.min_checkins },
                { k: 'Milestones required',     v: rules.milestones_required },
              ].map((r, i) => (
                <div key={r.k} className="flex justify-between gap-4 py-2.5 text-[13px]"
                  style={{ borderBottom: i < 4 ? '1px solid #232327' : 'none' }}>
                  <span className="text-[#5b5b62]">{r.k}</span>
                  <span className="text-[#ededee] text-right">{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Programme snapshot */}
          <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
            <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-4">Programme snapshot</div>
            <div className="grid grid-cols-3 gap-5 pb-5">
              {[
                { k: 'Mentors',      v: snapshot.mentors },
                { k: 'Startups',     v: snapshot.startups },
                { k: 'Active links', v: snapshot.links },
              ].map(s => (
                <div key={s.k}>
                  <div className="text-[10px] text-[#5b5b62] tracking-[0.22em] uppercase">{s.k}</div>
                  <div className="font-fraunces font-light text-[38px] leading-none mt-1.5 text-[#ededee]">{s.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-auto">
              <div className="flex justify-between text-[11.5px] text-[#5b5b62] mb-1.5">
                <span>Avg cohort health</span>
                <span>{snapshot.avg_health} / 100</span>
              </div>
              <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${snapshot.avg_health}%`, background: C.green }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex gap-0 mb-5 border-b border-[#232327]">
          {[{ k: 'actors', label: 'Actors' }, { k: 'links', label: 'Links' }, { k: 'settings', label: 'Settings' }].map(t => (
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

        {/* Actors tab */}
        {tab === 'actors' && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-baseline justify-between mb-3.5">
                <h3 className="font-fraunces font-normal text-[18px] text-[#ededee] m-0" style={{ letterSpacing: '-0.01em' }}>
                  Mentors · {(actors.mentors ?? MOCK_MENTORS).length}
                </h3>
                <button
                  onClick={() => navigate('/admin/actors')}
                  className="h-7 px-3 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[11px] transition-colors cursor-pointer bg-transparent">
                  Enroll mentor
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {(actors.mentors ?? MOCK_MENTORS).map(a => <ActorMini key={a.id ?? a.user_id} actor={a} />)}
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-3.5">
                <h3 className="font-fraunces font-normal text-[18px] text-[#ededee] m-0" style={{ letterSpacing: '-0.01em' }}>
                  Startups · {(actors.startups ?? MOCK_STARTUPS).length}
                </h3>
                <button
                  onClick={() => navigate('/admin/actors')}
                  className="h-7 px-3 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[11px] transition-colors cursor-pointer bg-transparent">
                  Enroll startup
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {(actors.startups ?? MOCK_STARTUPS).map(a => <ActorMini key={a.id ?? a.user_id} actor={a} />)}
              </div>
            </div>
          </div>
        )}

        {/* Links tab */}
        {tab === 'links' && (
          <div className="rounded-2xl border border-[#232327] overflow-hidden" style={cardBg}>
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid #232327' }}>
                  {['Pairing', 'Health', 'Status', 'Combined score', 'Last activity'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] text-[#5b5b62] tracking-[0.12em] uppercase font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_LINKS.map((l, i) => {
                  const atRisk = l.status === 'at_risk'
                  const hc = healthColor(l.health)
                  const statusCfg = atRisk
                    ? { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', color: C.amber, label: 'At risk' }
                    : { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', color: C.green, label: 'Active' }
                  return (
                    <tr
                      key={l.id}
                      onClick={() => navigate(`/admin/links/${l.id}`)}
                      className="cursor-pointer transition-colors"
                      style={{
                        borderBottom: i < MOCK_LINKS.length - 1 ? '1px solid #232327' : 'none',
                        background: atRisk ? 'rgba(245,158,11,0.03)' : 'transparent',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = atRisk ? 'rgba(245,158,11,0.03)' : 'transparent'}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-medium text-[#ededee]"
                            style={{ background: 'linear-gradient(135deg, #3a3a40, #1d1d21)' }}>
                            {l.initials}
                          </div>
                          <span className="text-[13px] text-[#ededee]">{l.mentor} × {l.startup}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full" style={{ width: `${l.health}%`, background: hc }} />
                          </div>
                          <span className="text-[13px]" style={{ color: hc }}>{l.health}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full tracking-[0.1em] uppercase"
                          style={{ background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, color: statusCfg.color }}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-[#ededee]">{l.score}</td>
                      <td className="px-5 py-3.5 text-[13px] text-[#5b5b62]">{l.last}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Settings tab */}
        {tab === 'settings' && (
          <div className="max-w-[560px] rounded-2xl border border-[#232327] p-6" style={cardBg}>
            <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-5">Programme settings</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>Programme name</label>
                <input className={inputCls} value={settings.name} onChange={e => setSettings(s => ({ ...s, name: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Start date</label>
                <input className={inputCls} type="date" value={settings.start_date} onChange={e => setSettings(s => ({ ...s, start_date: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>End date</label>
                <input className={inputCls} type="date" value={settings.end_date} onChange={e => setSettings(s => ({ ...s, end_date: e.target.value }))} />
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-[#232327]">
              <div className="text-[11px] text-[#ef4444] tracking-[0.16em] uppercase mb-3">Danger zone</div>
              <div className="flex gap-2.5">
                <button
                  onClick={() => { if (window.confirm('Archive this programme? This cannot be undone.')) setProgramme(p => ({ ...p, status: 'completed' })) }}
                  className="h-8 px-3.5 rounded-full text-[12px] font-medium cursor-pointer border-0 transition-colors"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                  Archive programme
                </button>
                <button
                  onClick={() => setProgramme(p => ({ ...p, status: 'completed' }))}
                  className="h-8 px-3.5 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[12px] transition-colors cursor-pointer bg-transparent">
                  Mark as completed
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
