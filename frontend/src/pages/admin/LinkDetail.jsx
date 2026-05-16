import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { getLink, getLinkEvents, completeLink } from '../../services/links.service'
import { getCheckins, getMilestones, createCheckin, createMilestone, updateMilestone } from '../../services/activity.service'

const MOCK_LINK = {
  id: '1', health_score: 88, status: 'active',
  embedding_score: 0.91, dna_score: 0.88, combined_score: 0.90,
  match_reasoning: "Strong alignment in distributed systems background. Ahmad's experience directly addresses PayNow's current scaling bottlenecks.",
  mentor: { full_name: 'Ahmad Razif', job_title: 'Ex-CTO', current_company: 'FinTech Ventures', industry: ['Architecture', 'Scaling'] },
  startup: { company_name: 'PayNow Pro', description: 'B2B Payment Gateway', industry: 'FinTech', stage: 'seed' },
  programme: { name: 'Cradle CIP 2026', type: 'accelerator' },
}

const MOCK_CHECKINS = [
  { id: '1', created_at: 'Today, 10:30 AM', notes: 'Reviewed the Q3 architectural refactor plan. PayNow team has successfully implemented the message queue changes suggested last week. Latency dropped by 14%.' },
  { id: '2', created_at: 'Oct 12, 2:00 PM',  notes: 'Initial technical deep-dive. Discussed current database bottlenecks. Ahmad recommended looking into read-replicas for the reporting service.' },
]

const TABS = ['Activity', 'Milestones', 'History']
const CIRCUMFERENCE = 2 * Math.PI * 45  // ≈ 282.7

export default function LinkDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [link, setLink]         = useState(MOCK_LINK)
  const [checkins, setCheckins] = useState(MOCK_CHECKINS)
  const [milestones, setMilestones] = useState([])
  const [events, setEvents]     = useState([])
  const [tab, setTab]           = useState('Activity')
  const [noteText, setNoteText] = useState('')
  const [milestoneForm, setMilestoneForm] = useState({ title: '', due_date: '' })

  // Gauge animation — start at full offset (hidden), animate to target
  const score = link?.health_score ?? 0
  const targetOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE
  const [gaugeOffset, setGaugeOffset] = useState(CIRCUMFERENCE)

  // Tab indicator
  const tabRefs = useRef([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [fading, setFading] = useState(false)

  useEffect(() => {
    getLink(id).then(setLink).catch(() => {})
    getCheckins(id).then(c => { if (c?.length) setCheckins(c) }).catch(() => {})
    getMilestones(id).then(setMilestones).catch(() => {})
    getLinkEvents(id).then(setEvents).catch(() => {})
  }, [id])

  // Animate gauge after mount
  useEffect(() => {
    const t = setTimeout(() => setGaugeOffset(targetOffset), 150)
    return () => clearTimeout(t)
  }, [targetOffset])

  // Update tab indicator whenever tab changes
  useEffect(() => {
    const idx = TABS.indexOf(tab)
    const el = tabRefs.current[idx]
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
  }, [tab])

  // Initialise indicator on first render
  useEffect(() => {
    const el = tabRefs.current[0]
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
  }, [])

  const switchTab = (t) => {
    if (t === tab) return
    setFading(true)
    setTimeout(() => { setTab(t); setFading(false) }, 300)
  }

  const submitCheckin = () => {
    if (!noteText.trim()) return
    const entry = { id: Date.now().toString(), created_at: 'Just now', notes: noteText }
    setCheckins(c => [entry, ...c])
    setNoteText('')
    createCheckin(id, { notes: noteText, session_date: new Date().toISOString().slice(0, 10), duration_minutes: 60 }).catch(() => {})
  }

  const submitMilestone = async (e) => {
    e.preventDefault()
    await createMilestone(id, milestoneForm).catch(() => {})
    setMilestones(await getMilestones(id).catch(() => milestones))
    setMilestoneForm({ title: '', due_date: '' })
  }

  const toggleMilestone = async (m) => {
    const next = m.status === 'completed' ? 'pending' : 'completed'
    await updateMilestone(m.id, { status: next }).catch(() => {})
    setMilestones(ms => ms.map(x => x.id === m.id ? { ...x, status: next } : x))
  }

  const handleComplete = async (outcome) => {
    const notes = window.prompt('Outcome notes (optional):') ?? ''
    await completeLink(id, { outcome, outcome_notes: notes }).catch(() => {})
    setLink(l => ({ ...l, status: 'completed', outcome }))
  }

  const mentorInitials = (link?.mentor?.full_name ?? '?').split(' ').map(w => w[0]).slice(0, 2).join('')

  return (
    <div className="bg-background text-on-background min-h-screen flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-sidebar-width h-screen">
        {/* Top App Bar */}
        <header className="animate-fade-in flex justify-between items-center h-14 w-full px-gutter bg-surface border-b border-outline-variant shrink-0 z-10">
          <div className="relative flex items-center text-on-surface-variant">
            <span className="material-symbols-outlined absolute left-3 text-[18px]">search</span>
            <input
              className="bg-surface-container border border-linear text-body-sm text-on-surface rounded pl-9 pr-3 py-1.5 focus:border-primary focus:outline-none transition-colors w-64"
              placeholder="Search..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <button className="btn-active hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="btn-active hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
            <div className="btn-active h-7 w-7 rounded-full bg-surface-container border border-linear overflow-hidden ml-2 flex items-center justify-center cursor-pointer">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
            </div>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-container-padding bg-background">
          <div className="max-w-5xl mx-auto">

            {/* Page Header */}
            <div className="mb-6 animate-fade-in">
              <button
                onClick={() => navigate(-1)}
                className="text-on-surface-variant hover:text-on-surface text-label-caps flex items-center gap-1 mb-3 transition-colors uppercase tracking-widest w-max"
              >
                <span className="material-symbols-outlined text-[14px]">arrow_back</span> All Matches
              </button>
              <h2 className="text-title-lg font-semibold text-on-background tracking-tight">
                {link?.mentor?.full_name} + {link?.startup?.company_name}
              </h2>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-8">
              {/* Mentor Card */}
              <div className="animate-slide-up-fade delay-1 hover-card-effect bg-linear-surface border border-linear rounded p-5 flex flex-col cursor-default">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded bg-surface-container border border-linear flex items-center justify-center">
                    <span className="text-title-md font-bold text-primary">{mentorInitials}</span>
                  </div>
                  <span className="text-label-caps px-2 py-0.5 rounded border border-surface-variant bg-surface-container text-on-surface-variant uppercase">Mentor</span>
                </div>
                <h3 className="text-title-md text-on-background">{link?.mentor?.full_name}</h3>
                <p className="text-body-sm text-on-surface-variant mt-1">{link?.mentor?.job_title}, {link?.mentor?.current_company}</p>
                <div className="mt-auto pt-4 flex gap-2 flex-wrap">
                  {link?.mentor?.industry?.map(tag => (
                    <span key={tag} className="text-label-sm text-primary border border-primary/20 bg-primary/10 px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Health Gauge Card */}
              <div className="animate-slide-up-fade delay-2 hover-card-effect bg-linear-surface border border-linear rounded p-6 flex flex-col items-center justify-center cursor-default">
                <div className="text-label-caps text-on-surface-variant mb-4 uppercase tracking-widest">Match Health</div>
                <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="none" r="45" stroke="#201f1f" strokeWidth="6" />
                    <circle
                      className="gauge-circle stroke-primary"
                      cx="50" cy="50" fill="none" r="45"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={gaugeOffset}
                      strokeLinecap="round"
                      strokeWidth="6"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-title-lg text-primary font-bold">{score}</span>
                  </div>
                </div>
                <div className="text-body-sm text-on-surface-variant mb-5">
                  Embedding {Math.round((link?.embedding_score ?? 0) * 100)}%
                  <span className="mx-1 opacity-50">·</span>
                  DNA {Math.round((link?.dna_score ?? 0) * 100)}%
                </div>
                <div className="bg-surface-container-low border-l-2 border-primary p-3 w-full relative">
                  <span className="material-symbols-outlined absolute top-3 right-3 text-[14px] text-primary opacity-50">auto_awesome</span>
                  <p className="text-body-sm text-on-surface-variant pr-6 leading-relaxed italic">
                    "{link?.match_reasoning}"
                  </p>
                </div>
              </div>

              {/* Startup Card */}
              <div className="animate-slide-up-fade delay-3 hover-card-effect bg-linear-surface border border-linear rounded p-5 flex flex-col cursor-default">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded bg-surface-container border border-linear flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px] text-on-surface">payments</span>
                  </div>
                  <span className="text-label-caps px-2 py-0.5 rounded border border-surface-variant bg-surface-container text-on-surface-variant uppercase">Startup</span>
                </div>
                <h3 className="text-title-md text-on-background">{link?.startup?.company_name}</h3>
                <p className="text-body-sm text-on-surface-variant mt-1">{link?.startup?.description}</p>
                <div className="mt-auto pt-4 flex gap-2 flex-wrap">
                  <span className="text-label-sm text-tertiary border border-tertiary/20 bg-tertiary/10 px-2 py-1 rounded capitalize">{link?.startup?.stage} Stage</span>
                  <span className="text-label-sm text-on-surface-variant border border-linear px-2 py-1 rounded">{link?.startup?.industry}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="animate-fade-in">
              <div className="flex border-b border-linear mb-6 relative">
                {TABS.map((t, i) => (
                  <button
                    key={t}
                    ref={el => tabRefs.current[i] = el}
                    onClick={() => switchTab(t)}
                    className={
                      tab === t
                        ? 'px-4 py-3 text-body-md font-title-md text-primary transition-colors'
                        : 'px-4 py-3 text-body-md text-on-surface-variant hover:text-on-surface transition-colors'
                    }
                  >
                    {t}
                  </button>
                ))}
                {/* Sliding indicator */}
                <div
                  className="tab-indicator"
                  style={{ left: indicator.left, width: indicator.width }}
                />
                {/* Admin actions */}
                {link?.status === 'active' && (
                  <div className="ml-auto flex items-center gap-2 pb-1">
                    <button onClick={() => handleComplete('successful')} className="btn-active text-label-caps px-3 py-1 rounded border border-primary/30 text-primary hover:bg-primary/10 transition-colors uppercase tracking-widest">Complete</button>
                    <button onClick={() => handleComplete('unsuccessful')} className="btn-active text-label-caps px-3 py-1 rounded border border-error/30 text-error hover:bg-error/10 transition-colors uppercase tracking-widest">Fail</button>
                  </div>
                )}
              </div>

              {/* Tab content with crossfade */}
              <div className={`tab-pane${fading ? ' fade-out' : ''}`}>

                {/* ── Activity ── */}
                {tab === 'Activity' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 flex flex-col gap-6">
                      {/* Log form */}
                      <div className="bg-linear-surface border border-linear rounded p-5">
                        <h4 className="text-body-md font-title-md text-on-background mb-4">Log Check-in</h4>
                        <textarea
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                          className="w-full bg-background border border-linear rounded p-3 text-body-sm text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px] resize-y mb-4 transition-all"
                          placeholder="Summarize the latest meeting or interaction..."
                        />
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <button className="btn-active p-2 border border-linear rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
                              <span className="material-symbols-outlined text-[18px]">attach_file</span>
                            </button>
                            <button className="btn-active p-2 border border-linear rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
                              <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                            </button>
                          </div>
                          <button
                            onClick={submitCheckin}
                            className="btn-active bg-primary text-[#131313] px-4 py-2 rounded text-body-md font-title-md hover:opacity-90 transition-opacity"
                          >
                            Submit Log
                          </button>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="relative pl-4 mt-4">
                        <div className="absolute left-[7px] top-2 bottom-0 w-[1px] border-l border-linear" />
                        {checkins.map((c, i) => (
                          <div key={c.id} className="relative pl-6 mb-8">
                            <div className={`absolute left-[-5px] top-1.5 w-2 h-2 rounded-full border-2 border-background z-10 ${i === 0 ? 'bg-primary' : 'bg-surface-variant'}`} />
                            <div className="text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">{c.created_at}</div>
                            <div className="bg-linear-surface border border-linear rounded p-4 check-in-item cursor-default">
                              <p className="text-body-sm text-on-surface leading-relaxed">{c.notes}</p>
                            </div>
                          </div>
                        ))}
                        <div className="relative pl-6 mb-2">
                          <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-surface-variant border-2 border-background z-10" />
                          <div className="bg-linear-surface border border-linear rounded p-4 flex items-center gap-3 check-in-item cursor-default">
                            <span className="material-symbols-outlined text-primary text-[20px]">handshake</span>
                            <p className="text-body-sm text-on-surface">Match formally accepted by both parties.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right metadata */}
                    <div className="lg:col-span-4 hidden lg:flex flex-col gap-4">
                      <div className="hover-card-effect bg-linear-surface border border-linear rounded p-4 cursor-default">
                        <h5 className="text-label-caps text-on-surface-variant uppercase tracking-widest mb-3">Engagement Details</h5>
                        <ul className="flex flex-col gap-3 text-body-sm">
                          {[
                            { label: 'Programme', value: link?.programme?.name },
                            { label: 'Type',      value: link?.programme?.type },
                            { label: 'Status',    value: link?.status, isStatus: true },
                          ].map(({ label, value, isStatus }) => (
                            <li key={label} className="flex justify-between border-b border-linear pb-2 last:border-0 last:pb-0">
                              <span className="text-on-surface-variant">{label}</span>
                              {isStatus ? (
                                <span className="text-primary flex items-center gap-1">
                                  <span className="status-dot w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                                  {value}
                                </span>
                              ) : (
                                <span className="text-on-surface capitalize">{value}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Milestones ── */}
                {tab === 'Milestones' && (
                  <div className="max-w-2xl">
                    <form onSubmit={submitMilestone} className="bg-linear-surface border border-linear rounded p-5 mb-6 flex gap-3 items-end">
                      <div className="flex-1">
                        <input
                          placeholder="Milestone title"
                          value={milestoneForm.title}
                          onChange={e => setMilestoneForm(f => ({ ...f, title: e.target.value }))}
                          required
                          className="w-full bg-background border border-linear rounded p-2.5 text-body-sm text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                      </div>
                      <input
                        type="date"
                        value={milestoneForm.due_date}
                        onChange={e => setMilestoneForm(f => ({ ...f, due_date: e.target.value }))}
                        className="bg-background border border-linear rounded p-2.5 text-body-sm text-on-surface focus:border-primary outline-none"
                      />
                      <button type="submit" className="btn-active bg-primary text-[#131313] px-4 py-2.5 rounded text-body-md font-title-md hover:opacity-90 transition-opacity whitespace-nowrap">
                        Add
                      </button>
                    </form>
                    <div className="flex flex-col gap-2">
                      {milestones.map(m => (
                        <div key={m.id} className="hover-card-effect bg-linear-surface border border-linear rounded p-4 flex items-center gap-4 cursor-default">
                          <input type="checkbox" checked={m.status === 'completed'} onChange={() => toggleMilestone(m)} className="w-4 h-4 accent-primary cursor-pointer" />
                          <div className="flex-1">
                            <div className={`text-body-md ${m.status === 'completed' ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>{m.title}</div>
                            {m.due_date && <div className={`text-label-sm mt-0.5 ${m.status === 'overdue' ? 'text-error' : 'text-on-surface-variant'}`}>Due {m.due_date}</div>}
                          </div>
                          <span className={`text-label-caps uppercase tracking-widest ${m.status === 'completed' ? 'text-primary' : m.status === 'overdue' ? 'text-error' : 'text-on-surface-variant'}`}>{m.status}</span>
                        </div>
                      ))}
                      {milestones.length === 0 && <div className="text-body-sm text-on-surface-variant text-center py-8">No milestones yet.</div>}
                    </div>
                  </div>
                )}

                {/* ── History ── */}
                {tab === 'History' && (
                  <div className="relative pl-4 max-w-2xl">
                    <div className="absolute left-[7px] top-2 bottom-0 w-[1px] border-l border-linear" />
                    {events.length === 0 && <div className="text-body-sm text-on-surface-variant pl-6">No state transitions yet.</div>}
                    {events.map(ev => (
                      <div key={ev.id} className="relative pl-6 mb-8">
                        <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-primary border-2 border-background z-10" />
                        <div className="text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">{ev.created_at}</div>
                        <div className="bg-linear-surface border border-linear rounded p-4 check-in-item cursor-default">
                          <p className="text-body-sm text-on-surface font-medium">{ev.from_status} → {ev.to_status}</p>
                          <p className="text-body-sm text-on-surface-variant mt-1">{ev.reason} · {ev.triggered_by}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
