import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { getDnaBlueprints } from '../../services/dna.service'

const MOCK_BLUEPRINTS = [
  {
    id: '1', industry: 'Fintech', programme_type: 'accelerator', geography: 'Malaysia',
    pattern_summary: 'Mentor with deep investor network in local fintech ecosystem paired with pre-seed startup seeking institutional funding. Weekly structured sessions focused on investor narrative and warm introductions.',
    relationship_stats: { total_checkins: 12, avg_duration: 75, milestones_completed: 3 },
  },
  {
    id: '2', industry: 'SaaS', programme_type: 'accelerator', geography: 'Malaysia',
    pattern_summary: 'Product-focused mentor from a regional super-app paired with B2B SaaS startup at GTM stage. Mentor applied a structured customer discovery framework that led to 3 enterprise pilots.',
    relationship_stats: { total_checkins: 9, avg_duration: 60, milestones_completed: 2 },
  },
  {
    id: '3', industry: 'Healthtech', programme_type: 'accelerator', geography: 'Malaysia',
    pattern_summary: 'Former healthcare ministry consultant mentoring a digital health startup through regulatory approval. Deep domain knowledge of MOH processes was the critical differentiator.',
    relationship_stats: { total_checkins: 11, avg_duration: 90, milestones_completed: 3 },
  },
]

export default function DnaLibrary() {
  const [blueprints, setBlueprints] = useState(MOCK_BLUEPRINTS)
  const [filters, setFilters] = useState({ industry: '', programme_type: '', geography: '' })

  useEffect(() => {
    getDnaBlueprints(filters).then(d => { if (d?.length) setBlueprints(d) }).catch(() => {})
  }, [filters])

  const setFilter = (k, v) => setFilters(f => ({ ...f, [k]: v }))

  const filtered = blueprints.filter(b =>
    (!filters.industry || b.industry === filters.industry) &&
    (!filters.programme_type || b.programme_type === filters.programme_type) &&
    (!filters.geography || b.geography === filters.geography)
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>DNA Library</h1>
        <p style={{ color: '#6b7280', marginBottom: 28, fontSize: 14 }}>
          Reusable success patterns extracted from completed mentor-startup relationships.
        </p>

        <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
          {[
            { k: 'industry', label: 'Industry', opts: ['Fintech', 'SaaS', 'Healthtech', 'Deeptech', 'E-commerce', 'Agritech'] },
            { k: 'programme_type', label: 'Type', opts: ['accelerator', 'mentorship', 'grant', 'incubator'] },
            { k: 'geography', label: 'Geography', opts: ['Malaysia', 'Singapore', 'Indonesia'] },
          ].map(({ k, label, opts }) => (
            <select
              key={k} value={filters[k]} onChange={e => setFilter(k, e.target.value)}
              style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, background: '#fff' }}
            >
              <option value="">All {label}</option>
              {opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
          <button onClick={() => setFilters({ industry: '', programme_type: '', geography: '' })} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', fontSize: 13, cursor: 'pointer', color: '#6b7280' }}>Clear</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filtered.map(b => (
            <div key={b.id} style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ padding: '3px 10px', borderRadius: 9999, background: '#eff6ff', color: '#3b82f6', fontSize: 11, fontWeight: 700 }}>{b.industry}</span>
                <span style={{ padding: '3px 10px', borderRadius: 9999, background: '#f0fdf4', color: '#16a34a', fontSize: 11, fontWeight: 700 }}>{b.programme_type}</span>
                <span style={{ padding: '3px 10px', borderRadius: 9999, background: '#fef9c3', color: '#ca8a04', fontSize: 11, fontWeight: 700 }}>{b.geography}</span>
              </div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 16 }}>
                {b.pattern_summary?.slice(0, 200)}…
              </p>
              <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#9ca3af' }}>
                <span>{b.relationship_stats?.total_checkins} check-ins</span>
                <span>avg {b.relationship_stats?.avg_duration} min</span>
                <span>{b.relationship_stats?.milestones_completed} milestones</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ color: '#9ca3af', fontSize: 14 }}>No blueprints match the filters.</div>}
        </div>
      </main>
    </div>
  )
}
