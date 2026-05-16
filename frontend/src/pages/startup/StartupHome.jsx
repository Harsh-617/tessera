import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import HealthGauge from '../../components/HealthGauge'
import StatusBadge from '../../components/StatusBadge'
import { getLinks } from '../../services/links.service'

export default function StartupHome() {
  const navigate = useNavigate()
  const [links, setLinks] = useState([])

  useEffect(() => {
    getLinks().then(setLinks).catch(() => {})
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28 }}>My Mentor Connections</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {links.map(link => (
            <div
              key={link.id}
              onClick={() => navigate(`/startup/links/${link.id}`)}
              style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer', border: '1px solid #f3f4f6' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{link.mentor?.full_name}</div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{link.mentor?.job_title} · {link.mentor?.current_company}</div>
                </div>
                <HealthGauge score={link.health_score ?? 0} size={64} />
              </div>
              <StatusBadge status={link.status} />
            </div>
          ))}
          {links.length === 0 && <div style={{ color: '#9ca3af', fontSize: 14 }}>No active connections yet.</div>}
        </div>
      </main>
    </div>
  )
}
