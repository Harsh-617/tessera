import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStartupProfile } from '../../services/profiles.service'

const INDUSTRIES = ['Healthtech', 'Fintech', 'SaaS', 'Deeptech', 'E-commerce', 'Agritech']
const COUNTRIES = ['Malaysia', 'Singapore', 'Indonesia']
const SUPPORT = ['Regulatory', 'Clinical partnerships', 'Fundraising', 'Product / market fit', 'Market access', 'Technical architecture', 'Enterprise sales', 'Grant applications', 'Hiring']
const STAGES = [
  { id: 'idea',     label: 'Idea',     sub: 'Pre-product' },
  { id: 'mvp',      label: 'MVP',      sub: 'Testing'     },
  { id: 'seed',     label: 'Seed',     sub: 'First raise' },
  { id: 'series_a', label: 'Series A', sub: 'Scaling'     },
  { id: 'series_b', label: 'Series B', sub: 'Expansion'   },
]

const STEPS = [
  { label: 'Sign in', done: true },
  { label: 'Role', done: true },
  { label: 'Profile', done: false, active: true },
]

export default function StartupSetup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    company_name: '', industry: 'Healthtech', country: 'Malaysia',
    founded_year: '', team_size: '', website: '',
    stage: '', description: '', support_needed: [],
  })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleSupport = (val) => {
    setForm(f => ({
      ...f,
      support_needed: f.support_needed.includes(val)
        ? f.support_needed.filter(x => x !== val)
        : [...f.support_needed, val],
    }))
  }

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
          Tell us about your startup.
        </h1>
        <p className="text-[14.5px] text-[#8a8a92] mt-2.5 mb-0 max-w-[540px]">
          Your description and the support you need become the basis of how Tessera matches you with mentors. Honesty beats positioning here.
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
            On save, your profile is embedded via Gemini and joins the matching pool. You'll appear in match suggestions for any compatible programme.
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Company basics */}
          <section>
            <h2 className="font-fraunces font-normal text-[#ededee] text-[20px] m-0 mb-1" style={{ letterSpacing: '-0.01em' }}>Company basics</h2>
            <p className="text-[13px] text-[#5b5b62] mb-4 m-0">The public-facing identity of your startup.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>Company name</label>
                <input className={inputCls} value={form.company_name} onChange={e => set('company_name', e.target.value)} placeholder="e.g. CareLoop" />
              </div>
              <div>
                <label className={labelCls}>Industry</label>
                <select className={inputCls} value={form.industry} onChange={e => set('industry', e.target.value)} style={{ cursor: 'pointer', appearance: 'none' }}>
                  {INDUSTRIES.map(i => <option key={i} value={i} className="bg-[#131316]">{i}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Country</label>
                <select className={inputCls} value={form.country} onChange={e => set('country', e.target.value)} style={{ cursor: 'pointer', appearance: 'none' }}>
                  {COUNTRIES.map(c => <option key={c} value={c} className="bg-[#131316]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Founded year</label>
                <input className={inputCls} type="number" value={form.founded_year} onChange={e => set('founded_year', e.target.value)} placeholder="2024" />
              </div>
              <div>
                <label className={labelCls}>Team size</label>
                <input className={inputCls} type="number" value={form.team_size} onChange={e => set('team_size', e.target.value)} placeholder="5" />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Website</label>
                <input className={inputCls} value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://careloop.my" />
                <div className="text-[11px] text-[#5b5b62] mt-1.5">Admin reference only.</div>
              </div>
            </div>
          </section>

          {/* Stage */}
          <section className="mt-8 pt-6 border-t border-[#232327]">
            <h2 className="font-fraunces font-normal text-[#ededee] text-[20px] m-0 mb-1" style={{ letterSpacing: '-0.01em' }}>Stage</h2>
            <p className="text-[13px] text-[#5b5b62] mb-4 m-0">Where are you right now? Stage matters more than vanity metrics.</p>
            <div className="grid grid-cols-5 gap-2">
              {STAGES.map(s => {
                const sel = form.stage === s.id
                return (
                  <button
                    key={s.id} type="button"
                    onClick={() => set('stage', s.id)}
                    className="text-center py-3 px-1.5 rounded-xl border transition-all cursor-pointer"
                    style={sel
                      ? { background: '#ededee', borderColor: '#ededee', color: '#0b0b0c' }
                      : { background: 'rgba(255,255,255,0.02)', borderColor: '#232327', color: '#8a8a92' }
                    }
                  >
                    <div className="font-medium text-[13px]">{s.label}</div>
                    <div className="text-[10px] tracking-[0.1em] uppercase mt-0.5 opacity-70">{s.sub}</div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* What you're building */}
          <section className="mt-8 pt-6 border-t border-[#232327]">
            <h2 className="font-fraunces font-normal text-[#ededee] text-[20px] m-0 mb-1" style={{ letterSpacing: '-0.01em' }}>What you're building</h2>
            <p className="text-[13px] text-[#5b5b62] mb-4 m-0">Your description is the primary signal for semantic matching. Lead with the problem, then the solution.</p>
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                className={`${inputCls} resize-none`} rows={5}
                value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="What you do, who for, and why it matters. ~3 sentences."
              />
              <div className="text-[11px] text-[#5b5b62] mt-1.5">{form.description.length} / 800 characters · used in your embedding</div>
            </div>
          </section>

          {/* Support needed */}
          <section className="mt-8 pt-6 border-t border-[#232327]">
            <h2 className="font-fraunces font-normal text-[#ededee] text-[20px] m-0 mb-1" style={{ letterSpacing: '-0.01em' }}>Support you need</h2>
            <p className="text-[13px] text-[#5b5b62] mb-4 m-0">These tags drive matching priority. Pick what's actually limiting you right now — not everything.</p>
            <div>
              <label className={labelCls}>Support areas</label>
              <div className="flex flex-wrap gap-2">
                {SUPPORT.map(s => {
                  const sel = form.support_needed.includes(s)
                  return (
                    <button
                      key={s} type="button"
                      onClick={() => toggleSupport(s)}
                      className="text-[12px] px-3 py-1 rounded-full border transition-all cursor-pointer bg-transparent"
                      style={sel
                        ? { background: 'rgba(96,165,250,0.15)', borderColor: 'rgba(96,165,250,0.4)', color: '#60a5fa' }
                        : { borderColor: '#232327', color: '#8a8a92' }
                      }
                    >{s}</button>
                  )
                })}
              </div>
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
