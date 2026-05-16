import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { createProgramme } from '../../services/programmes.service'

export default function ProgrammeSetup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', type: '', country: '', start_date: '', end_date: '',
  })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const p = await createProgramme({ ...form, rules: {}, success_metrics: {} })
      navigate(`/admin/programmes/${p.id}`)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 32 }}>New Programme</h1>
        <div style={{ maxWidth: 560, background: '#fff', borderRadius: 14, padding: 36, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleSubmit}>
            {[
              { k: 'name', label: 'Programme Name', placeholder: 'e.g. MaGIC Accelerator Cohort 7' },
              { k: 'country', label: 'Country' },
              { k: 'start_date', label: 'Start Date', type: 'date' },
              { k: 'end_date', label: 'End Date', type: 'date' },
            ].map(({ k, label, placeholder, type = 'text' }) => (
              <div key={k} style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>{label}</label>
                <input
                  type={type} value={form[k]} onChange={e => set(k, e.target.value)}
                  placeholder={placeholder} required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} required style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }}>
                <option value="">Select type…</option>
                {['accelerator', 'mentorship', 'grant', 'incubator'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '12px 0', borderRadius: 10, background: '#6366f1', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creating…' : 'Create Programme'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
