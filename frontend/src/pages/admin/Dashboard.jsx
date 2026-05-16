import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import StatusBadge from '../../components/StatusBadge'
import api from '../../services/api'

const MOCK_STATS = { active_links: 12, at_risk: 3, programmes: 2, dna_blueprints: 3 }
const MOCK_LINKS = [
  { id: '1', mentor: 'Ahmad Razif', startup: 'PayNow Pro', programme: 'Cradle CIP 2026', health_score: 84, status: 'active', last_activity: '2 days ago' },
  { id: '2', mentor: 'Priya Nair', startup: 'MeshCloud', programme: 'Cradle CIP 2026', health_score: 61, status: 'active', last_activity: '5 days ago' },
  { id: '3', mentor: 'Nurul Huda', startup: 'CareLoop', programme: 'Cradle CIP 2026', health_score: 28, status: 'at_risk', last_activity: '16 days ago' },
  { id: '4', mentor: 'James Tan', startup: 'GreenHarvest', programme: 'Cradle CIP 2026', health_score: 72, status: 'active', last_activity: '1 day ago' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(MOCK_STATS)
  const [links, setLinks] = useState(MOCK_LINKS)

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {})
    api.get('/dashboard/links').then(r => setLinks(r.data)).catch(() => {})
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 32 }}>Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
          {[
            { label: 'Active Links', value: stats.active_links, color: '#22c55e' },
            { label: 'At Risk', value: stats.at_risk, color: '#ef4444' },
            { label: 'Programmes', value: stats.programmes, color: '#6366f1' },
            { label: 'DNA Blueprints', value: stats.dna_blueprints, color: '#f59e0b' },
          ].map(c => (
            <div key={c.label} style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: c.color }}>{c.value}</div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', fontWeight: 700 }}>All Links</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', fontSize: 12, color: '#6b7280', textAlign: 'left' }}>
                {['Mentor', 'Startup', 'Programme', 'Health', 'Status', 'Last Activity'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {links.map(link => (
                <tr
                  key={link.id}
                  onClick={() => navigate(`/admin/links/${link.id}`)}
                  style={{
                    borderTop: '1px solid #f3f4f6', cursor: 'pointer',
                    background: link.status === 'at_risk' ? '#fef2f2' : '#fff',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = link.status === 'at_risk' ? '#fde8e8' : '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = link.status === 'at_risk' ? '#fef2f2' : '#fff'}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 14 }}>{link.mentor}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14 }}>{link.startup}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b7280' }}>{link.programme}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 3,
                          width: `${link.health_score}%`,
                          background: link.health_score >= 70 ? '#22c55e' : link.health_score >= 40 ? '#f59e0b' : '#ef4444',
                        }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{link.health_score}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={link.status} /></td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b7280' }}>{link.last_activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
