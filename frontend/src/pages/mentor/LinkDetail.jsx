import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import HealthGauge from '../../components/HealthGauge'
import StatusBadge from '../../components/StatusBadge'
import { getLink } from '../../services/links.service'
import { getCheckins, getMilestones, createCheckin, updateMilestone } from '../../services/activity.service'

const TABS = ['Activity', 'Milestones']

export default function MentorLinkDetail() {
  const { id } = useParams()
  const [link, setLink] = useState(null)
  const [checkins, setCheckins] = useState([])
  const [milestones, setMilestones] = useState([])
  const [tab, setTab] = useState('Activity')
  const [form, setForm] = useState({ session_date: '', duration_minutes: '', topics_discussed: '', notes: '' })

  useEffect(() => {
    getLink(id).then(setLink).catch(() => {})
    getCheckins(id).then(setCheckins).catch(() => {})
    getMilestones(id).then(setMilestones).catch(() => {})
  }, [id])

  const submitCheckin = async (e) => {
    e.preventDefault()
    await createCheckin(id, { ...form, duration_minutes: parseInt(form.duration_minutes) })
    setCheckins(await getCheckins(id).catch(() => checkins))
    setForm({ session_date: '', duration_minutes: '', topics_discussed: '', notes: '' })
  }

  const toggleMilestone = async (m) => {
    const next = m.status === 'completed' ? 'pending' : 'completed'
    await updateMilestone(m.id, { status: next })
    setMilestones(ms => ms.map(x => x.id === m.id ? { ...x, status: next } : x))
  }

  if (!link) return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 48, color: '#6b7280' }}>Loading…</main>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <HealthGauge score={link.health_score ?? 0} size={80} />
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800 }}>{link.startup?.company_name}</h1>
            <StatusBadge status={link.status} />
          </div>
        </div>

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
                <input type="date" value={form.session_date} onChange={e => setForm(f => ({ ...f, session_date: e.target.value }))} required style={inputStyle} />
                <input type="number" placeholder="Duration (min)" value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))} required style={inputStyle} />
              </div>
              <input placeholder="Topics" value={form.topics_discussed} onChange={e => setForm(f => ({ ...f, topics_discussed: e.target.value }))} style={{ ...inputStyle, width: '100%', marginBottom: 14, boxSizing: 'border-box' }} />
              <textarea placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} style={{ ...inputStyle, width: '100%', resize: 'vertical', boxSizing: 'border-box', marginBottom: 14 }} />
              <button type="submit" style={{ padding: '9px 24px', borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Log</button>
            </form>
            {checkins.map(c => (
              <div key={c.id} style={{ background: '#fff', borderRadius: 10, padding: 16, marginBottom: 10, fontSize: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ fontWeight: 600 }}>{c.session_date} · {c.duration_minutes} min</div>
                <div style={{ color: '#6b7280', marginTop: 4 }}>{c.topics_discussed}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Milestones' && (
          <div>
            {milestones.map(m => (
              <div key={m.id} style={{ background: '#fff', borderRadius: 10, padding: '14px 18px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <input type="checkbox" checked={m.status === 'completed'} onChange={() => toggleMilestone(m)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, textDecoration: m.status === 'completed' ? 'line-through' : 'none', color: m.status === 'completed' ? '#9ca3af' : '#111' }}>{m.title}</div>
                  {m.due_date && <div style={{ fontSize: 12, color: '#9ca3af' }}>Due {m.due_date}</div>}
                </div>
              </div>
            ))}
            {milestones.length === 0 && <div style={{ color: '#9ca3af', fontSize: 14 }}>No milestones yet.</div>}
          </div>
        )}
      </main>
    </div>
  )
}

const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }
