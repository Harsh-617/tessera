import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { getLink } from '../../services/links.service'
import { getCheckins, getMilestones, createCheckin, updateMilestone } from '../../services/activity.service'

const C = { green: '#22c55e', amber: '#f59e0b', blue: '#60a5fa' }
const CIRC = 2 * Math.PI * 50

const MOCK_LINK = {
  id: 'link-1', health: 70, status: 'active',
  startup_name: 'CareLoop', startup_initials: 'CL',
  startup_sub: 'Healthtech · MVP · 5 people · Founded 2024',
  tags: ['remote monitoring', 'chronic care', 'b2b clinical'],
  programme: 'Cradle CIP 2026',
  role_note: "You're matched as the regulatory mentor for their MOH pilot path.",
}
const MOCK_CHECKINS = [
  { id: 'c1', duration: 90, topics: 'MOH submission review',  notes: 'Stakeholder confirmed, draft ready for legal review.', when: '2d ago' },
  { id: 'c2', duration: 75, topics: 'clinical workflow',       notes: 'Alert thresholds, nurse onboarding draft.', when: '9d ago' },
  { id: 'c3', duration: 60, topics: 'stakeholder mapping',     notes: 'Identified 4 contacts at KKM; intros scheduled.', when: '3w ago' },
]
const MOCK_MILESTONES = [
  { id: 'm1', title: 'Map regulatory stakeholders at KKM', status: 'completed', note: 'Completed 14 days ago', due_label: 'Done' },
  { id: 'm2', title: 'Identify 3 pilot clinic partners',   status: 'completed', note: 'Completed 4 days ago',  due_label: 'Done' },
  { id: 'm3', title: 'Submit MOH pilot application',       status: 'pending',   note: 'Due 30 Jun 2026',       due_label: 'In 45 days' },
]
const MOCK_HISTORY = [
  { id: 'h1', title: 'Link created',                               meta: 'Match approved by admin · combined score 0.90', date: '12 May 2026', type: 'default' },
  { id: 'h2', title: 'Link activated',                             meta: 'Both parties accepted',                         date: '13 May 2026', type: 'success' },
  { id: 'h3', title: 'First check-in',                            meta: 'Logged by you · 60 min',                         date: '15 May 2026', type: 'default' },
  { id: 'h4', title: 'Milestone completed · stakeholder mapping',  meta: 'Marked done by CareLoop',                       date: '2 May 2026',  type: 'default' },
]

function dotColor(type) {
  if (type === 'success') return C.green
  if (type === 'warning') return C.amber
  return '#3a3a40'
}

export default function MentorLinkDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [link, setLink] = useState(MOCK_LINK)
  const [checkins, setCheckins] = useState(MOCK_CHECKINS)
  const [milestones, setMilestones] = useState(MOCK_MILESTONES)
  const [tab, setTab] = useState('checkin')
  const [form, setForm] = useState({ session_date: '', duration_minutes: '', topics_discussed: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getLink(id).then(d => { if (d) setLink(d) }).catch(() => {})
    getCheckins(id).then(d => { if (d?.length) setCheckins(d) }).catch(() => {})
    getMilestones(id).then(d => { if (d?.length) setMilestones(d) }).catch(() => {})
  }, [id])

  const submitCheckin = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createCheckin(id, { ...form, duration_minutes: parseInt(form.duration_minutes) })
      const fresh = await getCheckins(id).catch(() => checkins)
      setCheckins(fresh)
      setForm({ session_date: '', duration_minutes: '', topics_discussed: '', notes: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleMilestone = async (m) => {
    const next = m.status === 'completed' ? 'pending' : 'completed'
    setMilestones(ms => ms.map(x => x.id === m.id ? { ...x, status: next } : x))
    await updateMilestone(m.id, { status: next }).catch(() => {})
  }

  const health = link.health ?? link.health_score ?? 0
  const gaugeColor = health >= 70 ? C.green : health >= 40 ? C.amber : '#ef4444'
  const gaugeOffset = CIRC * (1 - health / 100)

  const cardBg = { background: 'linear-gradient(180deg, #18181c 0%, #131316 100%)' }
  const inputCls = 'w-full bg-[#0b0b0c] border border-[#232327] rounded-xl px-3.5 py-2.5 text-[13px] text-[#ededee] placeholder:text-[#5b5b62] focus:border-[#3a3a40] focus:outline-none transition-colors'
  const labelCls = 'block text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-1.5'

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0c', color: '#ededee', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="ds-bg" />
      <div className="ds-grid" />
      <Sidebar />

      <main className="ml-[240px] min-h-screen relative z-10 p-10 pt-12 page-enter">

        {/* Page header */}
        <header className="mb-6">
          <button
            onClick={() => navigate('/mentor')}
            className="flex items-center gap-1.5 text-[12px] text-[#5b5b62] tracking-[0.18em] uppercase hover:text-[#8a8a92] transition-colors cursor-pointer bg-transparent border-0 p-0 mb-2.5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Home
          </button>
          <h1 className="font-fraunces font-light text-[#ededee] m-0 leading-tight" style={{ fontSize: 'clamp(24px, 2.5vw, 36px)', letterSpacing: '-0.03em' }}>
            Link with {link.startup_name ?? link.startup?.company_name}
          </h1>
          <p className="text-[13.5px] text-[#8a8a92] mt-1.5 m-0">
            {link.programme} · {link.role_note}
          </p>
        </header>

        {/* Partner card */}
        <section className="flex items-center gap-4 rounded-2xl border border-[#232327] p-[22px] mb-6" style={cardBg}>
          <div className="w-[60px] h-[60px] rounded-[18px] flex-shrink-0 flex items-center justify-center font-fraunces text-[22px] text-[#ededee]"
            style={{ background: 'linear-gradient(135deg, #3a3a40, #1d1d21)' }}>
            {link.startup_initials ?? link.startup?.company_name?.slice(0, 2).toUpperCase() ?? 'CL'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-medium text-[#ededee]">{link.startup_name ?? link.startup?.company_name}</div>
            <div className="text-[13px] text-[#8a8a92] mt-1">{link.startup_sub ?? link.startup?.description?.slice(0, 60)}</div>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {(link.tags ?? []).map(tag => (
                <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full border border-[#232327] text-[#8a8a92]"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {/* Mini gauge */}
          <div className="relative flex-shrink-0" style={{ width: 96, height: 96 }}>
            <svg viewBox="0 0 120 120" width="96" height="96" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={gaugeColor} strokeWidth="6"
                strokeDasharray={CIRC} strokeDashoffset={gaugeOffset} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-fraunces font-light text-[26px] leading-none" style={{ color: gaugeColor }}>{health}</span>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <nav className="flex gap-0 border-b border-[#232327] mb-5">
          {[{ k: 'checkin', label: 'Log check-in' }, { k: 'milestones', label: 'Milestones' }, { k: 'history', label: 'History' }].map(t => (
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

        {/* Log check-in tab */}
        {tab === 'checkin' && (
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-5">New check-in</div>
              <form onSubmit={submitCheckin}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className={labelCls}>Session date</label>
                    <input className={inputCls} type="date" value={form.session_date}
                      onChange={e => setForm(f => ({ ...f, session_date: e.target.value }))} required />
                  </div>
                  <div>
                    <label className={labelCls}>Duration (min)</label>
                    <input className={inputCls} type="number" value={form.duration_minutes} placeholder="60"
                      onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className={labelCls}>Topics discussed</label>
                  <input className={inputCls} value={form.topics_discussed}
                    placeholder="e.g. MOH application review, clinical pilot scope"
                    onChange={e => setForm(f => ({ ...f, topics_discussed: e.target.value }))} />
                </div>
                <div className="mb-4">
                  <label className={labelCls}>Notes</label>
                  <textarea className={`${inputCls} resize-none`} rows={3} value={form.notes}
                    placeholder="Decisions made, next steps, owner per action…"
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <div className="flex justify-end gap-2.5">
                  <button type="button" onClick={() => setForm({ session_date: '', duration_minutes: '', topics_discussed: '', notes: '' })}
                    className="h-8 px-3.5 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] text-[12px] transition-colors cursor-pointer bg-transparent">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="h-8 px-3.5 rounded-full text-[12px] font-medium cursor-pointer border-0 transition-all"
                    style={{ background: submitting ? '#232327' : '#ededee', color: submitting ? '#5b5b62' : '#0b0b0c' }}>
                    {submitting ? 'Logging…' : 'Log check-in'}
                  </button>
                </div>
              </form>
              <p className="text-[11.5px] text-[#5b5b62] mt-3.5 m-0 leading-[1.5]">
                Logging a check-in recalculates the health score and resets the inactivity counter for this link.
              </p>
            </div>

            <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-4">
                Recent check-ins · {checkins.length}
              </div>
              <div>
                {checkins.map((c, i) => (
                  <div key={c.id} className="grid items-start gap-3.5 py-4"
                    style={{
                      gridTemplateColumns: '32px 1fr auto',
                      borderBottom: i < checkins.length - 1 ? '1px solid #232327' : 'none',
                    }}>
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12l3-6h12l3 6v8H3z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[13.5px] text-[#ededee]">{c.duration ?? c.duration_minutes} min · {c.topics ?? c.topics_discussed}</div>
                      <div className="text-[12px] text-[#5b5b62] mt-1">{c.notes}</div>
                    </div>
                    <div className="text-[11px] text-[#5b5b62] flex-shrink-0">{c.when ?? c.session_date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Milestones tab */}
        {tab === 'milestones' && (
          <div className="max-w-[640px]">
            <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-4">
                Milestones · {milestones.filter(m => m.status === 'completed').length} of {milestones.length} complete
              </div>
              <div className="flex flex-col gap-2">
                {milestones.map(m => {
                  const done = m.status === 'completed'
                  return (
                    <div key={m.id} className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-colors"
                      style={{
                        background: '#0f0f12',
                        borderColor: done ? 'rgba(34,197,94,0.2)' : '#232327',
                      }}>
                      <button
                        onClick={() => toggleMilestone(m)}
                        className="w-5 h-5 rounded-[6px] flex-shrink-0 flex items-center justify-center cursor-pointer border-0 transition-colors"
                        style={done
                          ? { background: C.green, color: '#0b0b0c' }
                          : { background: 'transparent', border: '1.5px solid #3a3a40' }
                        }
                      >
                        {done && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px]" style={{ color: done ? '#5b5b62' : '#ededee', textDecoration: done ? 'line-through' : 'none' }}>
                          {m.title}
                        </div>
                        <div className="text-[11.5px] text-[#5b5b62] mt-0.5">{m.note ?? m.due_date}</div>
                      </div>
                      <span className="text-[12px] text-[#5b5b62] flex-shrink-0">{m.due_label ?? (done ? 'Done' : '')}</span>
                    </div>
                  )
                })}
              </div>
              <button className="mt-3.5 h-7 px-3.5 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] text-[11px] transition-colors cursor-pointer bg-transparent">
                + Add milestone
              </button>
            </div>
          </div>
        )}

        {/* History tab */}
        {tab === 'history' && (
          <div className="max-w-[640px]">
            <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-5">Activity history</div>
              <div className="relative pl-5" style={{ borderLeft: '1px solid #232327' }}>
                {MOCK_HISTORY.map((h, i) => (
                  <div key={h.id} className={i < MOCK_HISTORY.length - 1 ? 'mb-6' : ''}>
                    <div className="absolute -left-[5px] w-2.5 h-2.5 rounded-full border-2 border-[#0b0b0c]"
                      style={{ background: dotColor(h.type) }} />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[13.5px] text-[#ededee]">{h.title}</div>
                        <div className="text-[12px] text-[#5b5b62] mt-0.5">{h.meta}</div>
                      </div>
                      <div className="text-[11px] text-[#5b5b62] flex-shrink-0 mt-0.5">{h.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
