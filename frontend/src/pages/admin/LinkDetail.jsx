import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { getLink, getLinkEvents, completeLink, activateLink } from '../../services/links.service'
import { getCheckins, getMilestones, createCheckin, createMilestone, updateMilestone } from '../../services/activity.service'

/* ── Mock data ─────────────────────────────────────────────────────── */
const MOCK_ACTIVE = {
  id: '1', health_score: 88, status: 'active',
  embedding_score: 0.91, dna_score: 0.88, combined_score: 0.90,
  match_reasoning: "Strong alignment in distributed systems background. Ahmad's experience directly addresses PayNow's current scaling bottlenecks.",
  mentor:  { full_name: 'Ahmad Razif',   job_title: 'Ex-CTO', current_company: 'FinTech Ventures', industry: ['Architecture', 'Scaling'] },
  startup: { company_name: 'PayNow Pro', description: 'B2B Payment Gateway', industry: 'FinTech', stage: 'seed' },
  programme: { name: 'Cradle CIP 2026', type: 'accelerator' },
}

const MOCK_AT_RISK = {
  id: '2', health_score: 32, status: 'at_risk', match_id: 'M-8942',
  embedding_score: 0.78, dna_score: 0.65, combined_score: 0.73,
  match_reasoning: 'Misalignment in communication cadence has led to repeated missed check-ins.',
  mentor:  { full_name: 'Elena Rostova', job_title: 'Partner', current_company: 'DeepVC', industry: ['DeepTech'] },
  startup: { company_name: 'QuantumLeap Inc.', description: 'Quantum computing infrastructure', industry: 'DeepTech', stage: 'seed' },
  programme: { name: 'Cradle CIP 2026', type: 'accelerator' },
  inactivity_logs: [
    { id: '1', icon: 'event_busy',        icon_color: '#ef4444', title: 'Missed Milestone Sync',   body: 'Neither party joined the scheduled video call via platform integration.',                    time: '2 days ago' },
    { id: '2', icon: 'mark_email_unread', icon_color: '#ffb783', title: 'Unanswered Message',      body: 'Elena Rostova sent an update request. QuantumLeap Inc. has not read or replied.',          time: '8 days ago' },
  ],
}

const MOCK_CHECKINS = [
  { id: '1', created_at: 'Today, 10:30 AM', notes: 'Reviewed the Q3 architectural refactor plan. PayNow team has successfully implemented the message queue changes suggested last week. Latency dropped by 14%.' },
  { id: '2', created_at: 'Oct 12, 2:00 PM', notes: 'Initial technical deep-dive. Discussed current database bottlenecks. Ahmad recommended looking into read-replicas for the reporting service.' },
]

const TABS = ['Activity', 'Milestones', 'History']
const CIRCUMFERENCE = 2 * Math.PI * 45

/* ── Component ──────────────────────────────────────────────────────── */
export default function LinkDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Pick mock based on route id for demo (id=2 → at_risk)
  const [link, setLink]         = useState(id === '2' ? MOCK_AT_RISK : MOCK_ACTIVE)
  const [checkins, setCheckins] = useState(MOCK_CHECKINS)
  const [milestones, setMilestones] = useState([])
  const [events, setEvents]     = useState([])
  const [tab, setTab]           = useState('Activity')
  const [noteText, setNoteText] = useState('')
  const [milestoneForm, setMilestoneForm] = useState({ title: '', due_date: '' })
  const [dismissed, setDismissed] = useState(false)

  // Gauge animation
  const score = link?.health_score ?? 0
  const targetOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE
  const [gaugeOffset, setGaugeOffset] = useState(CIRCUMFERENCE)

  // Tab indicator
  const tabRefs  = useRef([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [fading, setFading]       = useState(false)

  useEffect(() => {
    getLink(id).then(setLink).catch(() => {})
    getCheckins(id).then(c => { if (c?.length) setCheckins(c) }).catch(() => {})
    getMilestones(id).then(setMilestones).catch(() => {})
    getLinkEvents(id).then(setEvents).catch(() => {})
  }, [id])

  useEffect(() => {
    const t = setTimeout(() => setGaugeOffset(targetOffset), 150)
    return () => clearTimeout(t)
  }, [targetOffset])

  useEffect(() => {
    const idx = TABS.indexOf(tab)
    const el = tabRefs.current[idx]
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
  }, [tab])

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
    setCheckins(c => [{ id: Date.now().toString(), created_at: 'Just now', notes: noteText }, ...c])
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

  const isAtRisk = link?.status === 'at_risk'
  const mentorInitials = (link?.mentor?.full_name ?? '?').split(' ').map(w => w[0]).slice(0, 2).join('')

  /* ── Shared shell ─────────────────────────────────────────────────── */
  return (
    <div className="bg-background text-on-background min-h-screen flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-sidebar-width h-screen">
        {/* Top App Bar */}
        <header className="animate-fade-in bg-surface border-b border-outline-variant sticky top-0 z-10">
          <div className="flex justify-between items-center h-14 w-full px-gutter">
            <div className="relative flex items-center text-on-surface-variant">
              <span className="material-symbols-outlined absolute left-3 text-[18px]">search</span>
              <input className="bg-surface-container border border-outline-variant text-body-sm text-on-surface rounded pl-9 pr-3 py-1.5 focus:border-primary focus:outline-none transition-colors w-64" placeholder="Search..." type="text" />
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <button className="btn-active hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-[20px]">notifications</span></button>
              <button className="btn-active hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-[20px]">settings</span></button>
              <div className="w-8 h-8 rounded bg-surface-container-high border border-outline-variant overflow-hidden ml-2 flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable canvas */}
        <main className="flex-1 overflow-y-auto p-container-padding bg-background">
          <div className="max-w-5xl mx-auto">

            {/* ── AT RISK VIEW ─────────────────────────────────────────── */}
            {isAtRisk ? (
              <AtRiskView
                link={link}
                dismissed={dismissed}
                onDismiss={() => setDismissed(true)}
                onBack={() => navigate(-1)}
                onComplete={handleComplete}
              />
            ) : (
            /* ── ACTIVE VIEW ─────────────────────────────────────────── */
              <ActiveView
                link={link}
                mentorInitials={mentorInitials}
                score={score}
                gaugeOffset={gaugeOffset}
                tab={tab}
                tabRefs={tabRefs}
                indicator={indicator}
                fading={fading}
                switchTab={switchTab}
                checkins={checkins}
                milestones={milestones}
                events={events}
                noteText={noteText}
                setNoteText={setNoteText}
                submitCheckin={submitCheckin}
                milestoneForm={milestoneForm}
                setMilestoneForm={setMilestoneForm}
                submitMilestone={submitMilestone}
                toggleMilestone={toggleMilestone}
                handleComplete={handleComplete}
                onBack={() => navigate(-1)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

/* ── At Risk View ───────────────────────────────────────────────────── */
function AtRiskView({ link, dismissed, onDismiss, onBack, onComplete }) {
  const score = link?.health_score ?? 0
  const circumference = CIRCUMFERENCE
  // At-risk gauge uses stroke-dasharray directly
  const dashFilled = (score / 100) * circumference

  return (
    <>
      {/* Warning Banner */}
      {!dismissed && (
        <div className="w-full bg-[#ef4444]/[0.08] border border-[#ef4444]/20 rounded p-4 flex items-start gap-3 mb-6 animate-slide-up-fade">
          <span className="material-symbols-outlined text-[#ef4444] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          <div className="flex-1">
            <h4 className="text-[#ef4444] font-title-md text-title-md mb-1">
              Warning: This relationship has been inactive for 14 days. Immediate intervention recommended.
            </h4>
            <p className="text-[#ef4444]/80 text-body-sm">
              Automated match health check failed. Both parties have missed two scheduled check-ins.
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="ml-auto bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30 px-3 py-1.5 rounded text-label-sm uppercase tracking-wider transition-colors whitespace-nowrap"
          >
            Intervene
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <button onClick={onBack} className="text-on-surface-variant hover:text-on-surface text-label-caps flex items-center gap-1 mb-2 transition-colors uppercase tracking-widest">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span> All Matches
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-widest">Match ID: {link?.match_id ?? 'M-????'}</span>
            <div className="flex items-center gap-1.5 border border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444] px-2 py-0.5 rounded text-label-caps">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
              At Risk
            </div>
          </div>
          <h2 className="text-title-lg font-semibold text-on-background tracking-tight">
            {link?.mentor?.full_name} <span className="text-on-surface-variant font-normal">×</span> {link?.startup?.company_name}
          </h2>
        </div>
        <div className="flex gap-2">
          <button className="bg-surface text-on-surface border border-outline-variant hover:bg-surface-container px-4 py-2 rounded text-body-md font-title-md transition-colors">
            View History
          </button>
          <button className="bg-primary text-on-primary px-4 py-2 rounded text-body-md font-title-md hover:opacity-90 transition-opacity">
            Message Both
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Health Gauge */}
        <div className="animate-slide-up-fade delay-1 bg-surface border border-outline-variant rounded p-6 flex flex-col items-center">
          <h3 className="text-label-caps text-on-surface-variant uppercase w-full text-left mb-6 border-b border-outline-variant pb-2">Match Health</h3>
          <div className="relative w-40 h-40 flex items-center justify-center mt-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="45" stroke="#2a2a2a" strokeWidth="8" />
              <circle
                cx="50" cy="50" fill="none" r="45"
                stroke="#ef4444"
                strokeDasharray={`${dashFilled} ${circumference}`}
                strokeLinecap="round"
                strokeWidth="8"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[40px] font-bold text-[#ef4444] leading-none tracking-tighter">{score}</span>
              <span className="text-label-sm text-on-surface-variant mt-1">/ 100</span>
            </div>
          </div>
          <div className="mt-6 w-full flex justify-between text-label-sm text-on-surface-variant">
            <span>Trend: Down</span>
            <span className="text-[#ef4444] flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_down</span> -12 pts
            </span>
          </div>
        </div>

        {/* Inactivity Log */}
        <div className="animate-slide-up-fade delay-2 bg-surface border border-outline-variant rounded p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-outline-variant pb-2">
            <h3 className="text-label-caps text-on-surface-variant uppercase">Recent Inactivity Logs</h3>
            <button className="text-label-sm text-primary hover:opacity-80 transition-opacity">View All</button>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {link?.inactivity_logs?.map((log, i) => (
              <div key={log.id} className={`flex gap-4 items-start pb-4 ${i < link.inactivity_logs.length - 1 ? 'border-b border-outline-variant/50' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]" style={{ color: log.icon_color }}>{log.icon}</span>
                </div>
                <div>
                  <p className="text-body-md font-title-md text-on-surface">{log.title}</p>
                  <p className="text-body-sm text-on-surface-variant mt-1">{log.body}</p>
                  <span className="text-label-sm text-outline mt-2 block">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="animate-slide-up-fade delay-3 bg-surface border border-outline-variant rounded p-6 flex flex-col">
          <h3 className="text-label-caps text-on-surface-variant uppercase mb-6 border-b border-outline-variant pb-2">Recommended Actions</h3>
          <div className="flex flex-col gap-3 flex-1">
            {[
              { label: 'Send Nudge Email',   sub: 'Automated template', icon: 'send',            danger: false },
              { label: 'Schedule Check-in',  sub: 'Admin mediated',     icon: 'calendar_add_on', danger: false },
            ].map(a => (
              <button key={a.label} className="w-full text-left bg-surface-container hover:bg-surface-container-high border border-outline-variant p-3 rounded transition-colors group flex items-center justify-between">
                <div>
                  <span className="block text-body-md font-title-md text-on-surface group-hover:text-primary transition-colors">{a.label}</span>
                  <span className="block text-label-sm text-on-surface-variant mt-0.5">{a.sub}</span>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">{a.icon}</span>
              </button>
            ))}
            <button
              onClick={() => onComplete('unsuccessful')}
              className="mt-auto w-full text-left bg-surface-container hover:bg-surface-container-high border border-[#ef4444]/30 p-3 rounded transition-colors group flex items-center justify-between"
            >
              <div>
                <span className="block text-body-md font-title-md text-[#ef4444]">Dissolve Match</span>
                <span className="block text-label-sm text-on-surface-variant mt-0.5">Free up resources</span>
              </div>
              <span className="material-symbols-outlined text-[#ef4444]">heart_broken</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Active View ────────────────────────────────────────────────────── */
function ActiveView({
  link, mentorInitials, score, gaugeOffset,
  tab, tabRefs, indicator, fading, switchTab,
  checkins, milestones, events,
  noteText, setNoteText, submitCheckin,
  milestoneForm, setMilestoneForm, submitMilestone, toggleMilestone,
  handleComplete, onBack,
}) {
  const navigate = useNavigate()
  const { id } = useParams()
  return (
    <>
      {/* Page Header */}
      <div className="mb-6 animate-fade-in">
        <button onClick={onBack} className="text-on-surface-variant hover:text-on-surface text-label-caps flex items-center gap-1 mb-3 transition-colors uppercase tracking-widest w-max">
          <span className="material-symbols-outlined text-[14px]">arrow_back</span> All Matches
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-title-lg font-semibold text-on-background tracking-tight mb-1">
              {link?.startup?.company_name} &amp; {link?.mentor?.full_name}
            </h2>
            <div className="flex items-center gap-3 text-body-md text-on-surface-variant flex-wrap">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                Initiated Oct 12, 2023
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Active Relationship
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="bg-surface text-on-surface border border-outline-variant px-3 py-1.5 rounded hover:bg-surface-container text-body-sm font-title-md transition-colors">
              Manage
            </button>
            <button
              onClick={() => navigate(`/admin/links/${id}/checkin`)}
              className="btn-active bg-primary text-on-primary px-3 py-1.5 rounded hover:opacity-90 text-body-sm font-title-md transition-opacity"
            >
              New Check-in
            </button>
          </div>
        </div>
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

        {/* Health Gauge */}
        <div className="animate-slide-up-fade delay-2 hover-card-effect bg-linear-surface border border-linear rounded p-6 flex flex-col items-center justify-center cursor-default">
          <div className="text-label-caps text-on-surface-variant mb-4 uppercase tracking-widest">Match Health</div>
          <div className="relative w-20 h-20 flex items-center justify-center mb-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="45" stroke="#201f1f" strokeWidth="6" />
              <circle className="gauge-circle stroke-primary" cx="50" cy="50" fill="none" r="45" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={gaugeOffset} strokeLinecap="round" strokeWidth="6" />
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
            <p className="text-body-sm text-on-surface-variant pr-6 leading-relaxed italic">"{link?.match_reasoning}"</p>
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
              className={tab === t
                ? 'px-4 py-3 text-body-md font-title-md text-primary transition-colors'
                : 'px-4 py-3 text-body-md text-on-surface-variant hover:text-on-surface transition-colors'}
            >
              {t}
            </button>
          ))}
          <div className="tab-indicator" style={{ left: indicator.left, width: indicator.width }} />
          {link?.status === 'active' && (
            <div className="ml-auto flex items-center gap-2 pb-1">
              <button onClick={() => handleComplete('successful')} className="btn-active text-label-caps px-3 py-1 rounded border border-primary/30 text-primary hover:bg-primary/10 transition-colors uppercase tracking-widest">Complete</button>
              <button onClick={() => handleComplete('unsuccessful')} className="btn-active text-label-caps px-3 py-1 rounded border border-error/30 text-error hover:bg-error/10 transition-colors uppercase tracking-widest">Fail</button>
            </div>
          )}
        </div>

        <div className={`tab-pane${fading ? ' fade-out' : ''}`}>
          {tab === 'Activity' && checkins.length === 0 && (
            <div className="bg-surface border border-outline-variant rounded-lg flex flex-col items-center justify-center p-12 min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant mb-6">
                <span className="material-symbols-outlined text-[32px] text-outline" style={{ fontVariationSettings: "'wght' 200" }}>pending_actions</span>
              </div>
              <h3 className="text-title-lg text-on-surface mb-2">No activity yet</h3>
              <p className="text-body-md text-on-surface-variant max-w-sm text-center mb-6">
                Check-ins and milestones will appear here once the relationship begins.
              </p>
              <button
                onClick={() => navigate(`/admin/links/${id}/checkin`)}
                className="btn-active bg-surface text-on-surface border border-outline-variant px-4 py-2 rounded hover:bg-surface-container text-body-md font-title-md transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Log First Interaction
              </button>
            </div>
          )}
          {tab === 'Activity' && checkins.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-linear-surface border border-linear rounded p-5">
                  <h4 className="text-body-md font-title-md text-on-background mb-4">Log Check-in</h4>
                  <textarea value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full bg-background border border-linear rounded p-3 text-body-sm text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px] resize-y mb-4 transition-all" placeholder="Summarize the latest meeting or interaction..." />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <button className="btn-active p-2 border border-linear rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-[18px]">attach_file</span></button>
                      <button className="btn-active p-2 border border-linear rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-[18px]">bar_chart</span></button>
                    </div>
                    <button onClick={submitCheckin} className="btn-active bg-primary text-[#131313] px-4 py-2 rounded text-body-md font-title-md hover:opacity-90 transition-opacity">Submit Log</button>
                  </div>
                </div>
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
                          <span className="text-primary flex items-center gap-1"><span className="status-dot w-1.5 h-1.5 rounded-full bg-primary inline-block" />{value}</span>
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

          {tab === 'Milestones' && (
            <div className="max-w-2xl">
              <form onSubmit={submitMilestone} className="bg-linear-surface border border-linear rounded p-5 mb-6 flex gap-3 items-end">
                <div className="flex-1">
                  <input placeholder="Milestone title" value={milestoneForm.title} onChange={e => setMilestoneForm(f => ({ ...f, title: e.target.value }))} required className="w-full bg-background border border-linear rounded p-2.5 text-body-sm text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
                <input type="date" value={milestoneForm.due_date} onChange={e => setMilestoneForm(f => ({ ...f, due_date: e.target.value }))} className="bg-background border border-linear rounded p-2.5 text-body-sm text-on-surface focus:border-primary outline-none" />
                <button type="submit" className="btn-active bg-primary text-[#131313] px-4 py-2.5 rounded text-body-md font-title-md hover:opacity-90 transition-opacity whitespace-nowrap">Add</button>
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
    </>
  )
}
