import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import ActorCard from '../../components/ActorCard'
import api from '../../services/api'

export default function Actors() {
  const [mentors, setMentors] = useState([])
  const [startups, setStartups] = useState([])
  const [tab, setTab] = useState('Mentors')

  useEffect(() => {
    api.get('/profiles/mentor').then(r => setMentors(r.data)).catch(() => {})
    api.get('/profiles/startup').then(r => setStartups(r.data)).catch(() => {})
  }, [])

  const list = tab === 'Mentors' ? mentors : startups
  const role = tab === 'Mentors' ? 'mentor' : 'startup'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28 }}>Actors</h1>

        <div style={{ display: 'flex', gap: 0, marginBottom: 28, background: '#fff', borderRadius: 10, padding: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', width: 'fit-content' }}>
          {['Mentors', 'Startups'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 24px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === t ? '#6366f1' : 'transparent',
              color: tab === t ? '#fff' : '#6b7280', fontWeight: tab === t ? 600 : 400, fontSize: 14,
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {list.map(a => <ActorCard key={a.user_id ?? a.id} actor={a} role={role} />)}
          {list.length === 0 && <div style={{ color: '#9ca3af', fontSize: 14 }}>No {role}s found.</div>}
        </div>
      </main>
    </div>
  )
}
