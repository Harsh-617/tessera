import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { getProgrammes } from '../../services/programmes.service'

export default function Programmes() {
  const navigate = useNavigate()
  const [programmes, setProgrammes] = useState([])

  useEffect(() => {
    getProgrammes().then(setProgrammes).catch(() => {})
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Programmes</h1>
          <button
            onClick={() => navigate('/admin/programmes/new')}
            style={{ padding: '10px 24px', borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
          >
            + New Programme
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {programmes.map(p => (
            <div
              key={p.id}
              onClick={() => navigate(`/admin/programmes/${p.id}`)}
              style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', cursor: 'pointer' }}
            >
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{p.type} · {p.country}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
                {p.start_date} → {p.end_date}
              </div>
              <div style={{ marginTop: 12 }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 600,
                  background: p.status === 'active' ? '#f0fdf4' : p.status === 'draft' ? '#fef9c3' : '#f3f4f6',
                  color: p.status === 'active' ? '#16a34a' : p.status === 'draft' ? '#ca8a04' : '#6b7280',
                }}>{p.status}</span>
              </div>
            </div>
          ))}
          {programmes.length === 0 && (
            <div style={{ color: '#9ca3af', fontSize: 14 }}>No programmes yet.</div>
          )}
        </div>
      </main>
    </div>
  )
}
