import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMentorProfile } from '../../services/profiles.service'

const INDUSTRIES = ['Fintech', 'Healthtech', 'SaaS', 'Deeptech', 'E-commerce', 'Agritech', 'Edtech', 'Climate']
const EXPERTISE = ['Regulatory', 'Clinical partnerships', 'Fundraising', 'Investor relations', 'Product strategy', 'Go-to-market', 'Growth', 'Technical architecture', 'IP strategy', 'Healthcare ops']
const COUNTRIES = ['Malaysia', 'Singapore', 'Indonesia', 'Thailand']

const STEPS = [
  { label: 'Sign in', done: true },
  { label: 'Role', done: true },
  { label: 'Profile', done: false, active: true },
]

export default function MentorSetup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '', country: 'Malaysia', current_company: '', job_title: '',
    years_experience: '', availability_hours: '', linkedin_url: '',
    industry: [], expertise_areas: [], bio: '', mentoring_style: '',
  })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleChip = (field, val) => {
    setForm(f => {
      const arr = f[field]
      return { ...f, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
    })
  }

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

  const inputCls = 'w-full bg-[#0b0b0c] border border-[#232327] rounded-xl px-3.5 py-2.5 text-[13px] text-[#ededee] placeholder:text-[#5b5b62] focus:border-[#3a3a40] focus:outline-none transition-colors'
  const labelCls = 'block text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-2'

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0c', color: '#ededee', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="ds-bg" />
      <div className="ds-grid" />

      <div className="relative z-10 max-w-[760px] mx-auto px-6 py-8 pb-20">

        {/* Top strip */}
        <div className="flex items-center justify-between mb-12">
          <div className="font-fraunces font-light text-[20px] text-[#ededee] flex items-baseline gap-[2px]" style={{ letterSpacing: '-0.02em' }}>
            tessera
            <span className="inline-block rounded-full bg-[#ededee] self-end mb-1" style={{ width: 4, height: 4 }} />
          </div>
          <div className="flex gap-7">
            {STEPS.map(s => (
              <span
                key={s.label}
                className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase"
                style={{ color: s.active ? '#ededee' : '#8a8a92' }}
              >
                {(s.done || s.active) && <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />}
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Heading */}
        <div className="text-[11px] text-[#5b5b62] tracking-[0.24em] uppercase mb-2.5">Step 2 of 2</div>
        <h1 className="font-fraunces font-light text-[#ededee] leading-tight m-0" style={{ fontSize: 42, letterSpacing: '-0.03em' }}>
          Set up your mentor profile.
        </h1>
        <p className="text-[14.5px] text-[#8a8a92] mt-2.5 mb-0 max-w-[540px]">
          Your bio, expertise, and mentoring style become the basis of how Tessera matches you to startups. Be specific — vague profiles match poorly.
        </p>

        {/* AI note */}
        <div className="mt-4 mb-7 p-3.5 rounded-xl flex gap-3 items-start text-[13px] text-[#8a8a92] leading-[1.55]"
          style={{ background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.18)' }}>
          <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(96,165,250,0.12)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/>
            </svg>
          </div>
          <div>
            When you save, Tessera generates a 3072-dimensional embedding of your profile using Gemini's{' '}
            <span className="font-mono text-[12px] text-[#ededee]">text-embedding-004</span> model. This is what powers semantic matching against startups.
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Basics */}
          <section>
            <h2 className="font-fraunces font-normal text-[#ededee] text-[20px] m-0 mb-1" style={{ letterSpacing: '-0.01em' }}>Basics</h2>
            <p className="text-[13px] text-[#5b5b62] mb-4 m-0">Public information shown on your profile and match cards.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full name</label>
                <input className={inputCls} value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="e.g. Nurul Huda" />
              </div>
              <div>
                <label className={labelCls}>Country</label>
                <select className={inputCls} value={form.country} onChange={e => set('country', e.target.value)} style={{ cursor: 'pointer', appearance: 'none' }}>
                  {COUNTRIES.map(c => <option key={c} value={c} className="bg-[#131316]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Current company</label>
                <input className={inputCls} value={form.current_company} onChange={e => set('current_company', e.target.value)} placeholder="e.g. Maybank" />
              </div>
              <div>
                <label className={labelCls}>Job title</label>
                <input className={inputCls} value={form.job_title} onChange={e => set('job_title', e.target.value)} placeholder="e.g. VP, Digital Banking" />
              </div>
              <div>
                <label className={labelCls}>Years of experience</label>
                <input className={inputCls} type="number" value={form.years_experience} onChange={e => set('years_experience', e.target.value)} placeholder="10" />
              </div>
              <div>
                <label className={labelCls}>Availability (hrs/month)</label>
                <input className={inputCls} type="number" value={form.availability_hours} onChange={e => set('availability_hours', e.target.value)} placeholder="8" />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>LinkedIn URL</label>
                <input className={inputCls} value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/…" />
                <div className="text-[11px] text-[#5b5b62] mt-1.5">Admin reference only — never shown publicly.</div>
              </div>
            </div>
          </section>

          {/* Expertise */}
          <section className="mt-8 pt-6 border-t border-[#232327]">
            <h2 className="font-fraunces font-normal text-[#ededee] text-[20px] m-0 mb-1" style={{ letterSpacing: '-0.01em' }}>Expertise</h2>
            <p className="text-[13px] text-[#5b5b62] mb-5 m-0">Pick the industries and areas where you can meaningfully help. These feed both your embedding and matching filters.</p>
            <div className="mb-5">
              <label className={labelCls}>Industries</label>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map(ind => {
                  const sel = form.industry.includes(ind)
                  return (
                    <button
                      key={ind} type="button"
                      onClick={() => toggleChip('industry', ind)}
                      className="text-[12px] px-3 py-1 rounded-full border transition-all cursor-pointer bg-transparent"
                      style={sel
                        ? { background: 'rgba(96,165,250,0.15)', borderColor: 'rgba(96,165,250,0.4)', color: '#60a5fa' }
                        : { borderColor: '#232327', color: '#8a8a92' }
                      }
                    >{ind}</button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className={labelCls}>Expertise areas</label>
              <div className="flex flex-wrap gap-2">
                {EXPERTISE.map(exp => {
                  const sel = form.expertise_areas.includes(exp)
                  return (
                    <button
                      key={exp} type="button"
                      onClick={() => toggleChip('expertise_areas', exp)}
                      className="text-[12px] px-3 py-1 rounded-full border transition-all cursor-pointer bg-transparent"
                      style={sel
                        ? { background: 'rgba(96,165,250,0.15)', borderColor: 'rgba(96,165,250,0.4)', color: '#60a5fa' }
                        : { borderColor: '#232327', color: '#8a8a92' }
                      }
                    >{exp}</button>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Your story */}
          <section className="mt-8 pt-6 border-t border-[#232327]">
            <h2 className="font-fraunces font-normal text-[#ededee] text-[20px] m-0 mb-1" style={{ letterSpacing: '-0.01em' }}>Your story</h2>
            <p className="text-[13px] text-[#5b5b62] mb-5 m-0">These two fields are the primary signal for AI matching. Specific examples and approaches match better than generic statements.</p>
            <div className="mb-4">
              <label className={labelCls}>Bio</label>
              <textarea
                className={`${inputCls} resize-none`} rows={4}
                value={form.bio} onChange={e => set('bio', e.target.value)}
                placeholder="Background, what you've built, what problems you love. ~3 sentences works best."
              />
              <div className="text-[11px] text-[#5b5b62] mt-1.5">{form.bio.length} / 600 characters · used in your embedding</div>
            </div>
            <div>
              <label className={labelCls}>Mentoring style</label>
              <textarea
                className={`${inputCls} resize-none`} rows={3}
                value={form.mentoring_style} onChange={e => set('mentoring_style', e.target.value)}
                placeholder="How you work with founders — cadence, format, what you push on."
              />
              <div className="text-[11px] text-[#5b5b62] mt-1.5">{form.mentoring_style.length} / 400 characters · used in your embedding</div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-[#232327] flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="h-9 px-4 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[13px] font-medium flex items-center gap-2 transition-colors cursor-pointer bg-transparent"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
            <button
              type="submit" disabled={loading}
              className="h-10 px-6 rounded-full text-[13px] font-medium flex items-center gap-2 transition-all border-0"
              style={{
                background: loading ? '#232327' : '#ededee',
                color: loading ? '#5b5b62' : '#0b0b0c',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Generating embedding…' : 'Save & generate embedding'}
              {!loading && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
