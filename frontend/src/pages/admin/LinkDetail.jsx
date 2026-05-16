import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import HealthGauge from '../../components/HealthGauge'
import StatusBadge from '../../components/StatusBadge'
import ActorCard from '../../components/ActorCard'
import ScoreBar from '../../components/ScoreBar'
import { getLink, getLinkEvents, completeLink } from '../../services/links.service'
import { getCheckins, getMilestones, createCheckin, createMilestone, updateMilestone } from '../../services/activity.service'

const TABS = ['Activity', 'Milestones', 'History']

export default function LinkDetail() {
  const { id } = useParams()
  const [link, setLink] = useState(null)
  const [checkins, setCheckins] = useState([])
  const [milestones, setMilestones] = useState([])
  const [events, setEvents] = useState([])
  const [tab, setTab] = useState('Activity')
  const [checkinForm, setCheckinForm] = useState({ session_date: '', duration_minutes: '', topics_discussed: '', notes: '' })
  const [milestoneForm, setMilestoneForm] = useState({ title: '', due_date: '' })

  useEffect(() => {
    getLink(id).then(setLink).catch(() => {})
    getCheckins(id).then(setCheckins).catch(() => {})
    getMilestones(id).then(setMilestones).catch(() => {})
    getLinkEvents(id).then(setEvents).catch(() => {})
  }, [id])

  const submitCheckin = async (e) => {
    e.preventDefault()
    await createCheckin(id, { ...checkinForm, duration_minutes: parseInt(checkinForm.duration_minutes) })
    setCheckins(await getCheckins(id).catch(() => checkins))
    setCheckinForm({ session_date: '', duration_minutes: '', topics_discussed: '', notes: '' })
  }

  const submitMilestone = async (e) => {
    e.preventDefault()
    await createMilestone(id, milestoneForm)
    setMilestones(await getMilestones(id).catch(() => milestones))
    setMilestoneForm({ title: '', due_date: '' })
  }

  const toggleMilestone = async (m) => {
    const next = m.status === 'completed' ? 'pending' : 'completed'
    await updateMilestone(m.id, { status: next })
    setMilestones(ms => ms.map(x => x.id === m.id ? { ...x, status: next } : x))
  }

  const handleComplete = async (outcome) => {
    const notes = window.prompt('Outcome notes (optional):') ?? ''
    await completeLink(id, { outcome, outcome_notes: notes })
    setLink(l => ({ ...l, status: 'completed', outcome }))
  }

  if (!link) return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 48, color: '#6b7280' }}>Loading link…</main>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px' }}>
        {/* Header */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 28, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'center', marginBottom: 20 }}>
            <ActorCard actor={link.mentor} role="mentor" />
            <div style={{ textAlign: 'center' }}>
              <HealthGauge score={link.health_score ?? 0} size={100} />
              <div style={{ marginTop: 10 }}><StatusBadge status={link.status} /></div>
            </div>
            <ActorCard actor={link.startup} role="startup" />
          </div>
          <ScoreBar embeddingScore={link.embedding_score} dnaScore={link.dna_score} combinedScore={link.combined_score} />
          {link.match_reasoning && (
            <div style={{ marginTop: 16, padding: '12px 16px', background: '#eff6ff', borderLeft: '3px solid #6366f1', borderRadius: '0 8px 8px 0', fontSize: 13, color: '#1e40af', fontStyle: 'italic' }}>
              "{link.match_reasoning}"
            </div>
          )}
          {link.status === 'active' && (
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={() => handleComplete('successful')} style={{ padding: '8px 20px', borderRadius: 8, background: '#22c55e', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Mark Successful</button>
              <button onClick={() => handleComplete('unsuccessful')} style={{ padding: '8px 20px', borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Mark Failed</button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: '#fff', borderRadius: 10, padding: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', width: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === t ? '#6366f1' : 'transparent',
              color: tab === t ? '#fff' : '#6b7280', fontWeight: tab === t ? 600 : 400, fontSize: 14,
            }}>{t}</button>
          ))}
        </div>

        {tab === 'Activity' && (
          <div>
            <form onSubmit={submitCheckin} style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Log Check-in</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <input type="date" value={checkinForm.session_date} onChange={e => setCheckinForm(f => ({ ...f, session_date: e.target.value }))} required style={inputStyle} />
                <input type="number" placeholder="Duration (min)" value={checkinForm.duration_minutes} onChange={e => setCheckinForm(f => ({ ...f, duration_minutes: e.target.value }))} required style={inputStyle} />
              </div>
              <input placeholder="Topics discussed" value={checkinForm.topics_discussed} onChange={e => setCheckinForm(f => ({ ...f, topics_discussed: e.target.value }))} style={{ ...inputStyle, width: '100%', marginBottom: 14, boxSizing: 'border-box' }} />
              <textarea placeholder="Notes" value={checkinForm.notes} onChange={e => setCheckinForm(f => ({ ...f, notes: e.target.value }))} rows={2} style={{ ...inputStyle, width: '100%', resize: 'vertical', boxSizing: 'border-box', marginBottom: 14 }} />
              <button type="submit" style={{ padding: '9px 24px', borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Log</button>
            </form>
            {checkins.map(c => (
              <div key={c.id} style={{ background: '#fff', borderRadius: 10, padding: 18, marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', fontSize: 14 }}>
                <div style={{ fontWeight: 600 }}>{c.session_date} · {c.duration_minutes} min</div>
                <div style={{ color: '#6b7280', marginTop: 4 }}>{c.topics_discussed}</div>
                {c.notes && <div style={{ color: '#374151', marginTop: 6 }}>{c.notes}</div>}
              </div>
            ))}
          </div>
        )}

        {tab === 'Milestones' && (
          <div>
            <form onSubmit={submitMilestone} style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <input placeholder="Milestone title" value={milestoneForm.title} onChange={e => setMilestoneForm(f => ({ ...f, title: e.target.value }))} required style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} />
              </div>
              <input type="date" value={milestoneForm.due_date} onChange={e => setMilestoneForm(f => ({ ...f, due_date: e.target.value }))} style={inputStyle} />
              <button type="submit" style={{ padding: '9px 20px', borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Add</button>
            </form>
            {milestones.map(m => (
              <div key={m.id} style={{ background: '#fff', borderRadius: 10, padding: '14px 18px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <input type="checkbox" checked={m.status === 'completed'} onChange={() => toggleMilestone(m)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, textDecoration: m.status === 'completed' ? 'line-through' : 'none', color: m.status === 'completed' ? '#9ca3af' : '#111' }}>{m.title}</div>
                  {m.due_date && <div style={{ fontSize: 12, color: m.status === 'overdue' ? '#ef4444' : '#9ca3af' }}>Due {m.due_date}</div>}
                </div>
                <span style={{ fontSize: 12, color: m.status === 'completed' ? '#22c55e' : m.status === 'overdue' ? '#ef4444' : '#9ca3af', fontWeight: 600 }}>{m.status}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'History' && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
            {events.length === 0 && <div style={{ color: '#9ca3af', fontSize: 14 }}>No events yet.</div>}
            {events.map((ev, i) => (
              <div key={ev.id} style={{ display: 'flex', gap: 16, paddingBottom: i < events.length - 1 ? 20 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1', marginTop: 4 }} />
                  {i < events.length - 1 && <div style={{ width: 2, flex: 1, background: '#e5e7eb', margin: '4px 0' }} />}
                </div>
                <div style={{ fontSize: 13 }}>
                  <div style={{ fontWeight: 600 }}>{ev.from_status} → {ev.to_status}</div>
                  <div style={{ color: '#6b7280' }}>{ev.reason} · {ev.triggered_by}</div>
                  <div style={{ color: '#9ca3af', fontSize: 11 }}>{ev.created_at}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }
