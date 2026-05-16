import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStartupProfile } from '../../services/profiles.service'
import MultiSelectChip from '../../components/MultiSelectChip'

const INDUSTRY_OPTIONS = ['Fintech', 'SaaS', 'Deeptech', 'Healthtech', 'E-commerce', 'Agritech', 'Edtech']
const SUPPORT_OPTIONS = ['Fundraising', 'Product', 'Market Access', 'Tech', 'Regulatory', 'Sales', 'Grant Applications']
const STAGE_OPTIONS = ['idea', 'mvp', 'seed', 'series_a', 'series_b']

export default function StartupSetup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    company_name: '', description: '', industry: '', stage: '',
    country: '', team_size: '', founded_year: '', support_needed: [], website: '',
  })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createStartupProfile({
        ...form,
        team_size: parseInt(form.team_size),
        founded_year: parseInt(form.founded_year),
      })
      navigate('/startup')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '48px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 40, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Set up your startup profile</h1>
        <p style={{ color: '#6b7280', marginBottom: 32, fontSize: 14 }}>
          The AI uses this to find your best-fit mentor match.
        </p>
        <form onSubmit={handleSubmit}>
          <Field label="Company Name" value={form.company_name} onChange={v => set('company_name', v)} required />
          <Field label="Website" value={form.website} onChange={v => set('website', v)} />
          <Field label="Country" value={form.country} onChange={v => set('country', v)} required />
          <Field label="Founded Year" value={form.founded_year} onChange={v => set('founded_year', v)} type="number" />
          <Field label="Team Size" value={form.team_size} onChange={v => set('team_size', v)} type="number" />

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
              Industry <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={form.industry} onChange={e => set('industry', e.target.value)} required
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
            >
              <option value="">Select industry…</option>
              {INDUSTRY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
              Stage <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={form.stage} onChange={e => set('stage', e.target.value)} required
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
            >
              <option value="">Select stage…</option>
              {STAGE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <Field label="Description" value={form.description} onChange={v => set('description', v)} multiline required placeholder="What do you do, what problem do you solve, what's your traction?" />
          <MultiSelectChip label="Support Needed" options={SUPPORT_OPTIONS} value={form.support_needed} onChange={v => set('support_needed', v)} />

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '13px 0', borderRadius: 10,
              background: '#0ea5e9', color: '#fff', border: 'none',
              fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, marginTop: 8,
            }}
          >
            {loading ? 'Saving…' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', multiline, required, placeholder }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>
        {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {multiline ? (
        <textarea
          value={value} onChange={e => onChange(e.target.value)}
          required={required} placeholder={placeholder} rows={3}
          style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
        />
      ) : (
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          required={required} placeholder={placeholder}
          style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
        />
      )}
    </div>
  )
}
