import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { getLink, getLinkEvents, completeLink } from '../../services/links.service'
import { getCheckins, getMilestones, createCheckin, createMilestone, updateMilestone } from '../../services/activity.service'

const C = { red: '#ef4444', amber: '#f59e0b', green: '#22c55e', blue: '#60a5fa' }
const CIRC = 2 * Math.PI * 50

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_LINK = {
  id: '1', health_score: 70, status: 'active',
  embedding_score: 0.91, dna_score: 0.88, combined_score: 0.90,
  check_ins: 6, milestones_done: 2, milestones_total: 3, last_activity: '2 days ago',
  started: '12 May 2026',
  programme: { name: 'Cradle CIP 2026', region: 'Malaysia' },
  mentor:  { full_name: 'Nurul Huda',  sub: 'ex-KKM consultant · 8 yrs · Malaysia', tags: ['regulatory', 'clinical partnerships'] },
  startup: { company_name: 'CareLoop', sub: 'Healthtech · MVP · Malaysia',           tags: ['remote monitoring', 'healthtech'] },
}

const MOCK_CHECKINS = [
  { id: '1', what: '90 min check-in · logged by Nurul',    topics: 'MOH application review, regulatory pathway, pilot partner shortlist.', when: '2 days ago'  },
  { id: '2', what: '75 min check-in · logged by CareLoop', topics: 'Clinical workflow alignment, alert thresholds, nurse onboarding.',       when: '9 days ago'  },
  { id: '3', what: '60 min check-in · logged by Nurul',    topics: 'Stakeholder mapping at KKM, vendor list, timing for pilot proposal.',    when: '3 weeks ago' },
]

const MOCK_MILESTONES = [
  { id: '1', title: 'Map regulatory stakeholders at KKM', status: 'completed', completedAgo: '14 days ago', due: null },
  { id: '2', title: 'Identify 3 pilot clinic partners',   status: 'completed', completedAgo: '4 days ago',  due: null },
  { id: '3', title: 'Submit MOH pilot application',       status: 'pending',   completedAgo: null,          due: '30 Jun 2026', dueIn: 'In 45 days' },
]

const MOCK_HISTORY = [
  { id: '1', title: 'Match approved & link created',    meta: 'Status set to proposed by Amir Hakim · combined score 0.90', ts: '12 May 2026 · 14:22', type: 'blue'    },
  { id: '2', title: 'Both parties accepted',            meta: 'Status auto-transitioned to active',                         ts: '13 May 2026 · 09:08', type: 'green'   },
  { id: '3', title: 'First check-in logged by Nurul',  meta: 'Health score recalculated · 100',                            ts: '15 May 2026 · 16:40', type: 'default' },
  { id: '4', title: 'Inactivity warning',               meta: 'No check-in for 12 days · health score decayed to 70',      ts: '2 days ago · 02:00 (system)', type: 'warn' },
]

// ── Helpers ─────────────────────────────────────────────────────────────────
function healthColor(score) {
  if (score >= 70) return C.green
  if (score >= 40) return C.amber
  return C.red
}

function initials(name) {
  return (name ?? '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function Tag({ label }) {
  return (
    <span className="text-[11px] px-2 py-0.5 rounded-full border"
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: '#232327', color: '#8a8a92' }}>
      {label}
    </span>
  )
}

function BigAvatar({ name, size = 64 }) {
  return (
    <div
      className="rounded-[18px] border border-[#2c2c32] flex items-center justify-center font-fraunces font-normal text-[22px] text-[#ededee] flex-shrink-0"
      style={{ width: size, height: size, background: 'linear-gradient(135deg, #3a3a40, #1d1d21)' }}
    >
      {initials(name)}
    </div>
  )
}

const inputCls = 'w-full bg-[#0b0b0c] border border-[#232327] rounded-xl px-3.5 py-2.5 text-[13px] text-[#ededee] placeholder:text-[#5b5b62] focus:border-[#3a3a40] focus:outline-none transition-colors'

// ── Main component ───────────────────────────────────────────────────────────
export default function LinkDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [link, setLink]             = useState(MOCK_LINK)
  const [checkins, setCheckins]     = useState(MOCK_CHECKINS)
  const [milestones, setMilestones] = useState(MOCK_MILESTONES)
  const [events, setEvents]         = useState(MOCK_HISTORY)
  const [tab, setTab]               = useState('Activity')
  const [gaugeOffset, setGaugeOffset] = useState(CIRC)

  const [checkinForm, setCheckinForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    duration: '60',
    topics: '',
    notes: '',
  })
  const [milestoneForm, setMilestoneForm] = useState({ title: '', due_date: '', status: 'Pending', description: '' })

  useEffect(() => {
    getLink(id).then(setLink).catch(() => {})
    getCheckins(id).then(c => { if (c?.length) setCheckins(c) }).catch(() => {})
    getMilestones(id).then(m => { if (m?.length) setMilestones(m) }).catch(() => {})
    getLinkEvents(id).then(e => { if (e?.length) setEvents(e) }).catch(() => {})
  }, [id])

  useEffect(() => {
    const t = setTimeout(() => setGaugeOffset(CIRC * (1 - (link?.health_score ?? 0) / 100)), 150)
    return () => clearTimeout(t)
  }, [link?.health_score])

  const submitCheckin = () => {
    if (!checkinForm.topics.trim() && !checkinForm.notes.trim()) return
    const label = `${checkinForm.duration} min check-in · logged by Admin`
    setCheckins(c => [{ id: Date.now().toString(), what: label, topics: checkinForm.topics, when: 'Just now' }, ...c])
    setCheckinForm(f => ({ ...f, topics: '', notes: '' }))
    createCheckin(id, { notes: checkinForm.notes, topics: checkinForm.topics, session_date: checkinForm.date, duration_minutes: parseInt(checkinForm.duration) }).catch(() => {})
  }

  const submitMilestone = async (e) => {
    e.preventDefault()
    if (!milestoneForm.title.trim()) return
    await createMilestone(id, { title: milestoneForm.title, due_date: milestoneForm.due_date }).catch(() => {})
    setMilestones(ms => [...ms, { id: Date.now().toString(), title: milestoneForm.title, status: 'pending', due: milestoneForm.due_date, completedAgo: null }])
    setMilestoneForm({ title: '', due_date: '', status: 'Pending', description: '' })
  }

  const toggleMilestone = async (m) => {
    const next = m.status === 'completed' ? 'pending' : 'completed'
    setMilestones(ms => ms.map(x => x.id === m.id ? { ...x, status: next } : x))
    updateMilestone(m.id, { status: next }).catch(() => {})
  }

  const score = link?.health_score ?? 0
  const gaugeColor = healthColor(score)
  const cardBg = { background: 'linear-gradient(180deg, #131316 0%, #0f0f12 100%)' }
  const eyebrow = 'text-[11px] text-[#5b5b62] tracking-[0.24em] uppercase'

  const historyDotColor = (type) => {
    if (type === 'green') return C.green
    if (type === 'blue') return C.blue
    if (type === 'warn') return C.amber
    return '#3a3a40'
  }

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
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-[12px] text-[#5b5b62] tracking-[0.18em] uppercase hover:text-[#8a8a92] transition-colors cursor-pointer bg-transparent border-0 p-0 mb-2.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              All links
            </button>
            <h1 className="font-fraunces font-light text-[#ededee] m-0 leading-tight mt-2.5" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.03em' }}>
              Mentor × Startup link
            </h1>
            <p className="text-[14px] text-[#8a8a92] mt-2 m-0">
              {link?.programme?.name} · {link?.programme?.region} · Created {link?.started}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-8">
            <button className="h-9 px-4 rounded-full border border-[#2c2c32] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[13px] font-medium flex items-center gap-2 transition-colors cursor-pointer bg-transparent">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Mark at risk
            </button>
            <button
              className="h-9 px-4 rounded-full text-[#0b0b0c] text-[13px] font-medium transition-colors cursor-pointer border-0"
              style={{ background: '#ededee' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff'}
              onMouseLeave={e => e.currentTarget.style.background = '#ededee'}
            >
              Mark complete
            </button>
          </div>
        </header>

        {/* Header block: mentor | gauge | startup */}
        <div className="rounded-t-2xl border border-[#232327] p-7" style={cardBg}>
          <div className="grid gap-6 items-center" style={{ gridTemplateColumns: '1fr auto 1fr' }}>

            {/* Mentor */}
            <div className="flex gap-4 items-center">
              <BigAvatar name={link?.mentor?.full_name ?? ''} />
              <div className="min-w-0">
                <div className={`${eyebrow} mb-1`}>Mentor</div>
                <div className="text-[18px] font-medium text-[#ededee]">{link?.mentor?.full_name}</div>
                <div className="text-[12.5px] text-[#8a8a92] mt-0.5">{link?.mentor?.sub}</div>
                <div className="flex gap-1.5 mt-2.5 flex-wrap">
                  {link?.mentor?.tags?.map(t => <Tag key={t} label={t} />)}
                </div>
              </div>
            </div>

            {/* Gauge */}
            <div className="flex flex-col items-center gap-3 px-6">
              <div className="relative w-[120px] h-[120px]">
                <svg viewBox="0 0 120 120" className="w-full h-full" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={gaugeColor} strokeWidth="6"
                    strokeDasharray={CIRC} strokeDashoffset={gaugeOffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-fraunces font-light text-[36px] leading-none" style={{ color: gaugeColor }}>{score}</div>
                  <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mt-1">Health</div>
                </div>
              </div>
              <span
                className="text-[11px] tracking-wide px-3 py-1 rounded-full border font-medium"
                style={{ color: C.green, borderColor: `${C.green}33`, background: `${C.green}12` }}
              >
                Active
              </span>
            </div>

            {/* Startup (right-aligned) */}
            <div className="flex gap-4 items-center flex-row-reverse text-right">
              <BigAvatar name={link?.startup?.company_name ?? ''} />
              <div className="min-w-0">
                <div className={`${eyebrow} mb-1`}>Startup</div>
                <div className="text-[18px] font-medium text-[#ededee]">{link?.startup?.company_name}</div>
                <div className="text-[12.5px] text-[#8a8a92] mt-0.5">{link?.startup?.sub}</div>
                <div className="flex gap-1.5 mt-2.5 flex-wrap justify-end">
                  {link?.startup?.tags?.map(t => <Tag key={t} label={t} />)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meta strip */}
        <div
          className="flex gap-6 px-7 py-4 border border-[#232327] border-t-0 rounded-b-2xl -mt-px"
          style={{ background: '#0f0f12' }}
        >
          {[
            { k: 'Combined match score', v: link?.combined_score?.toFixed(2) },
            { k: 'Embedding', v: link?.embedding_score?.toFixed(2) },
            { k: 'DNA', v: link?.dna_score?.toFixed(2) },
            { k: 'Check-ins', v: link?.check_ins },
            { k: 'Milestones', v: `${link?.milestones_done} of ${link?.milestones_total}` },
            { k: 'Last activity', v: link?.last_activity, ml: true },
          ].map(item => (
            <div key={item.k} className={item.ml ? 'ml-auto' : ''}>
              <span className="text-[10px] text-[#5b5b62] tracking-[0.22em] uppercase block mb-1">{item.k}</span>
              <span className="text-[13.5px] text-[#ededee]">{item.v}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <nav className="flex border-b border-[#232327] mt-8">
          {['Activity', 'Milestones', 'History'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-3 text-[14px] transition-colors relative cursor-pointer bg-transparent border-0"
              style={{ color: tab === t ? '#ededee' : '#5b5b62' }}
            >
              {t}
              {tab === t && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ededee] rounded-t" />}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div className="mt-6">

          {/* ── Activity ── */}
          {tab === 'Activity' && (
            <div className="grid grid-cols-2 gap-[18px]">
              {/* Log form */}
              <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
                <div className="text-[13px] font-medium text-[#ededee] uppercase tracking-[0.1em] mb-5">Log a check-in</div>
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] text-[#5b5b62] uppercase tracking-[0.18em] block mb-1.5">Session date</label>
                    <input type="date" value={checkinForm.date} onChange={e => setCheckinForm(f => ({ ...f, date: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#5b5b62] uppercase tracking-[0.18em] block mb-1.5">Duration (min)</label>
                    <input type="number" value={checkinForm.duration} onChange={e => setCheckinForm(f => ({ ...f, duration: e.target.value }))} className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] text-[#5b5b62] uppercase tracking-[0.18em] block mb-1.5">Topics discussed</label>
                    <input value={checkinForm.topics} onChange={e => setCheckinForm(f => ({ ...f, topics: e.target.value }))} placeholder="e.g. MOH submission, clinical partner outreach" className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] text-[#5b5b62] uppercase tracking-[0.18em] block mb-1.5">Session notes</label>
                    <textarea value={checkinForm.notes} onChange={e => setCheckinForm(f => ({ ...f, notes: e.target.value }))} placeholder="What was discussed, decisions made, next steps…" rows={4} className={`${inputCls} resize-y`} />
                  </div>
                  <div className="col-span-2 flex justify-end gap-2.5 mt-1">
                    <button
                      onClick={() => setCheckinForm(f => ({ ...f, topics: '', notes: '' }))}
                      className="h-9 px-4 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] text-[13px] transition-colors cursor-pointer bg-transparent"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitCheckin}
                      className="h-9 px-4 rounded-full text-[#0b0b0c] text-[13px] font-medium cursor-pointer border-0 transition-colors"
                      style={{ background: '#ededee' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.background = '#ededee'}
                    >
                      Log check-in
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
                <div className="flex items-center justify-between mb-5">
                  <div className="text-[13px] font-medium text-[#ededee] uppercase tracking-[0.1em]">
                    Recent check-ins · {checkins.length} total
                  </div>
                  <span className="text-[12px] text-[#5b5b62]">Avg 68 min</span>
                </div>
                <div>
                  {checkins.map((c, i) => (
                    <div key={c.id} className="grid gap-3.5 py-4 border-b border-[#232327] last:border-b-0"
                         style={{ gridTemplateColumns: '32px 1fr auto', alignItems: 'flex-start' }}>
                      <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
                           style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: C.green }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 12l3-6h12l3 6v8H3z"/><path d="M9 12h6"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-[13.5px] text-[#ededee]">{c.what}</div>
                        <div className="text-[12px] text-[#8a8a92] mt-1">{c.topics}</div>
                      </div>
                      <div className="text-[11px] text-[#5b5b62] text-right whitespace-nowrap">{c.when}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Milestones ── */}
          {tab === 'Milestones' && (
            <div className="grid grid-cols-2 gap-[18px]">
              {/* Add form */}
              <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
                <div className="text-[13px] font-medium text-[#ededee] uppercase tracking-[0.1em] mb-5">Add milestone</div>
                <form onSubmit={submitMilestone} className="grid grid-cols-2 gap-3.5">
                  <div className="col-span-2">
                    <label className="text-[11px] text-[#5b5b62] uppercase tracking-[0.18em] block mb-1.5">Title</label>
                    <input value={milestoneForm.title} onChange={e => setMilestoneForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Submit MOH pilot application" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#5b5b62] uppercase tracking-[0.18em] block mb-1.5">Due date</label>
                    <input type="date" value={milestoneForm.due_date} onChange={e => setMilestoneForm(f => ({ ...f, due_date: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#5b5b62] uppercase tracking-[0.18em] block mb-1.5">Status</label>
                    <select value={milestoneForm.status} onChange={e => setMilestoneForm(f => ({ ...f, status: e.target.value }))}
                            className={`${inputCls} appearance-none`}>
                      <option className="bg-[#131316]">Pending</option>
                      <option className="bg-[#131316]">Completed</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] text-[#5b5b62] uppercase tracking-[0.18em] block mb-1.5">Description</label>
                    <textarea value={milestoneForm.description} onChange={e => setMilestoneForm(f => ({ ...f, description: e.target.value }))} placeholder="What needs to happen, success criteria…" rows={3} className={`${inputCls} resize-y`} />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button type="submit" className="h-9 px-5 rounded-full text-[#0b0b0c] text-[13px] font-medium cursor-pointer border-0"
                            style={{ background: '#ededee' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fff'}
                            onMouseLeave={e => e.currentTarget.style.background = '#ededee'}>
                      Add milestone
                    </button>
                  </div>
                </form>
              </div>

              {/* Milestones list */}
              <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
                <div className="text-[13px] font-medium text-[#ededee] uppercase tracking-[0.1em] mb-5">
                  Milestones · {milestones.filter(m => m.status === 'completed').length} of {milestones.length} complete
                </div>
                <div className="flex flex-col gap-2">
                  {milestones.map(m => (
                    <div
                      key={m.id}
                      className="flex items-center gap-3.5 p-4 rounded-xl border transition-colors"
                      style={{
                        background: '#0f0f12',
                        borderColor: m.status === 'overdue' ? 'rgba(239,68,68,0.3)' : '#232327',
                        background: m.status === 'overdue' ? 'rgba(239,68,68,0.03)' : '#0f0f12',
                      }}
                    >
                      <button
                        onClick={() => toggleMilestone(m)}
                        className="w-5 h-5 rounded-[6px] border flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
                        style={m.status === 'completed'
                          ? { background: C.green, borderColor: C.green }
                          : { background: 'transparent', borderColor: '#3a3a40' }
                        }
                      >
                        {m.status === 'completed' && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0b0b0c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px]" style={{ color: m.status === 'completed' ? '#5b5b62' : '#ededee', textDecoration: m.status === 'completed' ? 'line-through' : 'none', textDecorationColor: '#3a3a40' }}>
                          {m.title}
                        </div>
                        <div className="text-[11.5px] mt-0.5" style={{ color: m.status === 'completed' ? '#3a3a40' : '#5b5b62' }}>
                          {m.status === 'completed' ? `Completed ${m.completedAgo}` : `Due ${m.due}`}
                        </div>
                      </div>
                      <span className="text-[12px] ml-auto" style={{ color: m.status === 'completed' ? '#5b5b62' : m.status === 'overdue' ? C.red : '#5b5b62' }}>
                        {m.status === 'completed' ? 'Done' : m.dueIn ?? m.due}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── History ── */}
          {tab === 'History' && (
            <div className="rounded-2xl border border-[#232327] p-6 max-w-[720px]" style={cardBg}>
              <div className="text-[13px] font-medium text-[#ededee] uppercase tracking-[0.1em] mb-6">State transition history</div>
              <div className="relative pl-5">
                <div className="absolute left-[7px] top-2 bottom-2 w-px" style={{ background: '#232327' }} />
                {events.map(ev => (
                  <div key={ev.id} className="relative pl-6 pb-7 last:pb-0">
                    <div
                      className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full border-2"
                      style={{ background: historyDotColor(ev.type), borderColor: '#0b0b0c' }}
                    />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[14px] text-[#ededee] font-medium">{ev.title}</div>
                        <div className="text-[12px] text-[#5b5b62] mt-1" dangerouslySetInnerHTML={{
                          __html: ev.meta
                            .replace('proposed', `<strong style="color:${C.blue}">proposed</strong>`)
                            .replace('active', `<strong style="color:${C.green}">active</strong>`)
                        }} />
                      </div>
                      <div className="text-[11px] text-[#5b5b62] whitespace-nowrap flex-shrink-0">{ev.ts}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
