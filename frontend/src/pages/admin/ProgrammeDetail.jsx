import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import ActorCard from '../../components/ActorCard'
import StatusBadge from '../../components/StatusBadge'
import { getProgramme, getProgrammeActors } from '../../services/programmes.service'

const TABS = ['Actors', 'Links']

export default function ProgrammeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [programme, setProgramme] = useState(null)
  const [actors, setActors] = useState({ mentors: [], startups: [] })
  const [tab, setTab] = useState('Actors')

  useEffect(() => {
    getProgramme(id).then(setProgramme).catch(() => {})
    getProgrammeActors(id).then(setActors).catch(() => {})
  }, [id])

  if (!programme) return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 48, color: '#6b7280' }}>Loading…</main>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{programme.name}</h1>
              <div style={{ fontSize: 14, color: '#6b7280' }}>{programme.type} · {programme.country} · {programme.start_date} → {programme.end_date}</div>
            </div>
            <button
              onClick={() => navigate(`/admin/match/${id}`)}
              style={{ padding: '10px 24px', borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              Generate Matches
            </button>
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

        {tab === 'Actors' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>Mentors ({actors.mentors?.length ?? 0})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {actors.mentors?.map(a => <ActorCard key={a.user_id} actor={a} role="mentor" compact />)}
              </div>
            </div>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 15 }}>Startups ({actors.startups?.length ?? 0})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {actors.startups?.map(a => <ActorCard key={a.user_id} actor={a} role="startup" compact />)}
              </div>
            </div>
          </div>
        )}

        {tab === 'Links' && (
          <div style={{ color: '#9ca3af', fontSize: 14 }}>Links view coming soon.</div>
        )}
      </main>
    </div>
  )
}
