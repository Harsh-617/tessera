import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../hooks/useAuth'
import { getMentorProfile, updateMentorProfile } from '../../services/profiles.service'
import MultiSelectChip from '../../components/MultiSelectChip'

const INDUSTRY_OPTIONS = ['Fintech', 'SaaS', 'Deeptech', 'Healthtech', 'E-commerce', 'Agritech', 'Edtech']
const EXPERTISE_OPTIONS = ['Fundraising', 'Product', 'Go-to-market', 'Tech', 'Sales', 'Operations', 'Regulatory', 'Investor Relations']

export default function MentorProfile() {
  const { user } = useAuth()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) getMentorProfile(user.uid).then(setForm).catch(() => {})
  }, [user])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateMentorProfile(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (!form) return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 48, color: '#6b7280' }}>Loading profile…</main>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 32 }}>My Profile</h1>
        <div style={{ maxWidth: 640, background: '#fff', borderRadius: 14, padding: 36, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleSubmit}>
            {[
              { k: 'job_title', label: 'Job Title' },
              { k: 'current_company', label: 'Current Company' },
              { k: 'years_experience', label: 'Years of Experience', type: 'number' },
              { k: 'country', label: 'Country' },
              { k: 'availability_hours', label: 'Availability (hours/month)', type: 'number' },
            ].map(({ k, label, type = 'text' }) => (
              <div key={k} style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>{label}</label>
                <input type={type} value={form[k] ?? ''} onChange={e => set(k, e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
            ))}
            {['bio', 'mentoring_style'].map(k => (
              <div key={k} style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#374151' }}>{k === 'bio' ? 'Bio' : 'Mentoring Style'}</label>
                <textarea value={form[k] ?? ''} onChange={e => set(k, e.target.value)} rows={3} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            ))}
            <MultiSelectChip label="Industries" options={INDUSTRY_OPTIONS} value={form.industry ?? []} onChange={v => set('industry', v)} />
            <MultiSelectChip label="Expertise Areas" options={EXPERTISE_OPTIONS} value={form.expertise_areas ?? []} onChange={v => set('expertise_areas', v)} />
            <button type="submit" disabled={saving} style={{ width: '100%', padding: '12px 0', borderRadius: 10, background: saved ? '#22c55e' : '#6366f1', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
              {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Profile'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
