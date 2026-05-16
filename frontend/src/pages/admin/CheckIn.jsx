import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

const C = { green: '#22c55e', amber: '#f59e0b', blue: '#60a5fa' }

const MOCK_LINK = {
  mentor_name: 'Nurul Huda',
  startup_name: 'CareLoop',
  startup_stage: 'MVP',
  startup_focus: 'MOH pilot approval, regulatory pathway, clinical partnerships in KL',
  health: 70,
  sessions: 6,
  status: 'active',
}

const SESSION_TYPES = [
  { id: 'sync',     label: 'Weekly Sync' },
  { id: 'strategy', label: 'Strategy Call' },
  { id: 'review',   label: 'Review Session' },
  { id: 'adhoc',    label: 'Ad-hoc Check-in' },
]

const MOCK_TIMELINE = [
  {
    id: '1',
    type: 'Strategy Call',
    time: '2 days ago',
    note: 'Deep dive into MOH pilot documentation requirements. Nurul mapped out the approval pathway timeline — 3 months realistic if submissions are complete by end of June.',
    author: 'Nurul Huda',
    fresh: false,
  },
  {
    id: '2',
    type: 'Weekly Sync',
    time: '9 days ago',
    note: 'Stakeholder mapping for the two KL pilot clinics. Identified the Head of Nursing as the key internal champion at each site.',
    author: 'Nurul Huda',
    fresh: false,
  },
  {
    id: '3',
    type: 'Weekly Sync',
    time: '16 days ago',
    note: 'First structured session. Set 90-day goals: regulatory submission draft, two signed LOIs from pilot clinics, and a warm intro to MOH Digital Health division.',
    author: 'Nurul Huda',
    fresh: false,
  },
]

export default function AdminCheckIn() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [link] = useState(MOCK_LINK)
  const [timeline, setTimeline] = useState(MOCK_TIMELINE)
  const [sessionType, setSessionType] = useState('')
  const [notes, setNotes] = useState('')
  const [followUp, setFollowUp] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const cardBg = { background: 'linear-gradient(180deg, #18181c 0%, #131316 100%)' }
  const inputCls = 'w-full bg-[#0b0b0c] border border-[#232327] rounded-xl px-3.5 py-2.5 text-[13px] text-[#ededee] placeholder:text-[#5b5b62] focus:border-[#3a3a40] focus:outline-none transition-colors'
  const labelCls = 'block text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-1.5'

  const handleSubmit = async () => {
    if (!sessionType) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    const entry = {
      id: Date.now().toString(),
      type: SESSION_TYPES.find(s => s.id === sessionType)?.label ?? sessionType,
      time: 'Just now',
      note: notes || '—',
      author: 'Admin',
      fresh: true,
    }
    setTimeline(prev => [entry, ...prev.map(t => ({ ...t, fresh: false }))])
    setSaved(true)
    setSaving(false)
    setSessionType('')
    setNotes('')
    setFollowUp(false)
    setTimeout(() => setSaved(false), 3500)
  }

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0c', color: '#ededee', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="ds-bg" />
      <div className="ds-grid" />
      <Sidebar />

      <main className="ml-[240px] min-h-screen relative z-10 p-10 pt-12 page-enter">

        {/* Page header */}
        <header className="mb-8">
          <button
            onClick={() => navigate(`/admin/links/${id}`)}
            className="text-[11px] text-[#5b5b62] tracking-[0.18em] uppercase mb-4 hover:text-[#8a8a92] transition-colors cursor-pointer bg-transparent border-0 p-0 flex items-center gap-1.5"
          >
            ← Back to link
          </button>
          <div className="text-[11px] text-[#5b5b62] tracking-[0.24em] uppercase mb-2">Admin · Log session</div>
          <h1 className="font-fraunces font-light text-[#ededee] m-0 leading-tight" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.03em' }}>
            {link.mentor_name} × {link.startup_name}
          </h1>
          <p className="text-[14px] text-[#8a8a92] mt-2 m-0">
            Log a session on behalf of this mentorship link. Entries are visible to both the mentor and startup.
          </p>
        </header>

        {/* 2-col layout */}
        <div className="grid gap-5" style={{ gridTemplateColumns: '380px 1fr' }}>

          {/* Left col */}
          <div className="flex flex-col gap-5">

            {/* Log session form */}
            <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-5">Log session</div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Session type</label>
                  <select
                    className={inputCls}
                    value={sessionType}
                    onChange={e => setSessionType(e.target.value)}
                    style={{ appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="" disabled className="bg-[#131316]">Select type…</option>
                    {SESSION_TYPES.map(s => (
                      <option key={s.id} value={s.id} className="bg-[#131316]">{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Session notes</label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={5}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Key discussion points, decisions, blockers, next steps."
                  />
                  <div className="text-[11px] text-[#5b5b62] mt-1.5">{notes.length} characters</div>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div
                    onClick={() => setFollowUp(f => !f)}
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all cursor-pointer"
                    style={{
                      background: followUp ? C.green : 'transparent',
                      border: `1px solid ${followUp ? C.green : '#3a3a40'}`,
                    }}
                  >
                    {followUp && <span style={{ color: '#0b0b0c', fontSize: 10, lineHeight: 1, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span className="text-[13px] text-[#8a8a92]">Requires follow-up</span>
                </label>
                <button
                  onClick={handleSubmit}
                  disabled={!sessionType || saving}
                  className="h-9 rounded-full text-[13px] font-medium border-0 transition-all mt-1"
                  style={{
                    background: saved ? C.green : (!sessionType || saving) ? '#232327' : '#ededee',
                    color: saved ? '#0b0b0c' : (!sessionType || saving) ? '#5b5b62' : '#0b0b0c',
                    cursor: !sessionType || saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saved ? 'Logged!' : saving ? 'Logging…' : 'Log session'}
                </button>
              </div>
            </div>

            {/* Link context */}
            <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-4">Link context</div>
              <div className="flex flex-col gap-0">
                {[
                  { k: 'Startup',      v: link.startup_name },
                  { k: 'Mentor',       v: link.mentor_name },
                  { k: 'Stage',        v: link.startup_stage },
                  { k: 'Sessions',     v: link.sessions },
                  { k: 'Health',       v: link.health, color: C.green },
                  { k: 'Status',       v: link.status, color: C.green },
                ].map((r, i, arr) => (
                  <div key={r.k} className="flex justify-between text-[13px] py-3"
                    style={{ borderBottom: i < arr.length - 1 ? '1px solid #232327' : 'none' }}>
                    <span className="text-[#5b5b62]">{r.k}</span>
                    <span style={{ color: r.color ?? '#ededee' }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#232327]">
                <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-2">Current focus</div>
                <p className="text-[13px] text-[#8a8a92] leading-[1.55] m-0">{link.startup_focus}</p>
              </div>
            </div>

          </div>

          {/* Right col: timeline */}
          <div className="rounded-2xl border border-[#232327] flex flex-col" style={{ ...cardBg, minHeight: 500 }}>
            <div className="px-6 py-4 border-b border-[#232327] flex items-center justify-between">
              <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase">Activity timeline</div>
              <div className="text-[12px] text-[#5b5b62]">{timeline.length} entries</div>
            </div>
            <div className="p-6 flex-1">

              {/* Success banner */}
              {saved && (
                <div className="rounded-xl px-4 py-3 mb-6 flex items-start gap-3"
                  style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)' }}>
                  <span className="text-[13px] mt-px" style={{ color: C.green }}>✓</span>
                  <div>
                    <div className="text-[13px] font-medium" style={{ color: C.green }}>Session logged</div>
                    <div className="text-[12px] text-[#8a8a92] mt-0.5">Timeline updated for both mentor and startup.</div>
                  </div>
                </div>
              )}

              {/* Timeline entries */}
              <div className="relative pl-5" style={{ borderLeft: '1px solid #232327' }}>
                {timeline.map((entry, i) => (
                  <div key={entry.id} className={`relative ${i < timeline.length - 1 ? 'mb-7' : ''}`}>
                    <span
                      className="absolute top-1 w-2 h-2 rounded-full"
                      style={{ left: -24, background: entry.fresh ? C.green : '#3a3a40' }}
                    />
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-[#ededee]">{entry.type}</span>
                        {entry.fresh && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full tracking-[0.1em] uppercase"
                            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: C.green }}>
                            Just now
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#5b5b62]">{entry.time}</span>
                    </div>
                    <p className="text-[13px] text-[#8a8a92] leading-[1.55] m-0 mb-1.5">{entry.note}</p>
                    {entry.author && (
                      <div className="text-[11px] text-[#5b5b62]">{entry.author}</div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

      </main>
    </div>
  )
}
