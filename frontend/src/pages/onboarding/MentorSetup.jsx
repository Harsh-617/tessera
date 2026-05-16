import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMentorProfile } from '../../services/profiles.service'
import MultiSelectChip from '../../components/MultiSelectChip'

const INDUSTRY_OPTIONS = ['Fintech', 'SaaS', 'Deeptech', 'Healthtech', 'E-commerce', 'Agritech', 'Edtech']
const EXPERTISE_OPTIONS = ['Fundraising', 'Product', 'Go-to-market', 'Tech', 'Sales', 'Operations', 'Regulatory', 'Investor Relations']

export default function MentorSetup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    bio: '', industry: [], expertise_areas: [],
    years_experience: '', current_company: '', job_title: '',
    country: '', availability_hours: '', mentoring_style: '', linkedin_url: '',
  })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createMentorProfile({
        ...form,
        years_experience: parseInt(form.years_experience),
        availability_hours: parseInt(form.availability_hours),
      })
      navigate('/mentor')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '48px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 40, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Set up your mentor profile</h1>
        <p style={{ color: '#6b7280', marginBottom: 32, fontSize: 14 }}>
          This is used by the AI matching engine — fill it in accurately.
        </p>
        <form onSubmit={handleSubmit}>
          <Field label="Job Title" value={form.job_title} onChange={v => set('job_title', v)} required />
          <Field label="Current Company" value={form.current_company} onChange={v => set('current_company', v)} required />
          <Field label="Years of Experience" value={form.years_experience} onChange={v => set('years_experience', v)} type="number" required />
          <Field label="Country" value={form.country} onChange={v => set('country', v)} required />
          <Field label="Availability (hours/month)" value={form.availability_hours} onChange={v => set('availability_hours', v)} type="number" required />
          <Field label="Bio" value={form.bio} onChange={v => set('bio', v)} multiline required placeholder="Your background, what you've built, who you've helped…" />
          <Field label="Mentoring Style" value={form.mentoring_style} onChange={v => set('mentoring_style', v)} multiline placeholder="How do you mentor? What's your approach?" />
          <Field label="LinkedIn URL" value={form.linkedin_url} onChange={v => set('linkedin_url', v)} />

          <MultiSelectChip label="Industries" options={INDUSTRY_OPTIONS} value={form.industry} onChange={v => set('industry', v)} />
          <MultiSelectChip label="Expertise Areas" options={EXPERTISE_OPTIONS} value={form.expertise_areas} onChange={v => set('expertise_areas', v)} />

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '13px 0', borderRadius: 10,
              background: '#6366f1', color: '#fff', border: 'none',
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
