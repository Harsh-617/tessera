import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../hooks/useAuth'
import { getMentorProfile, updateMentorProfile } from '../../services/profiles.service'

const C = { green: '#22c55e', amber: '#f59e0b', blue: '#60a5fa' }

const MOCK_PROFILE = {
  full_name: 'Nurul Huda', initials: 'NH',
  job_title: 'Regulatory Consultant', current_company: 'ex-KKM',
  years_experience: 8, availability_hours: 12, country: 'Malaysia',
  linkedin_url: '',
  industry: ['Healthtech'],
  expertise_areas: ['Regulatory', 'Clinical partnerships', 'Healthcare ops'],
  bio: '8 years advising Malaysian healthtech founders on regulatory pathways, with prior consulting experience inside KKM. Led the regulatory workstream for two MOH pilot approvals (telehealth, remote monitoring). Comfortable in the messy middle between clinical reality and a startup\'s runway pressure.',
  mentoring_style: 'Weekly 60-min calls, written follow-ups within 24h. I push hard on stakeholder mapping early and pull back once the founder is owning the rhythm.',
  embedding_dim: 3072, embedding_synced: '4d ago',
  active_links: 1, successful_matches: 3, avg_session: '75m',
}

const INDUSTRIES = ['Fintech', 'Healthtech', 'SaaS', 'Deeptech', 'E-commerce', 'Agritech', 'Edtech', 'Climate']
const EXPERTISE  = ['Regulatory', 'Clinical partnerships', 'Fundraising', 'Investor relations', 'Product strategy', 'Go-to-market', 'Growth', 'Technical architecture', 'IP strategy', 'Healthcare ops']

export default function MentorProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(MOCK_PROFILE)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) {
      getMentorProfile(user.uid).then(d => { if (d) { setProfile(d); } }).catch(() => {})
    }
  }, [user])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleChip = (field, val) => {
    setForm(f => {
      const arr = f[field] ?? []
      return { ...f, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateMentorProfile({ ...form, years_experience: parseInt(form.years_experience), availability_hours: parseInt(form.availability_hours) })
      setProfile(p => ({ ...p, ...form }))
      setSaved(true)
      setTimeout(() => { setSaved(false); setEditing(false) }, 1200)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const startEdit = () => { setForm({ ...profile }); setEditing(true) }
  const cancelEdit = () => setEditing(false)

  const cardBg = { background: 'linear-gradient(180deg, #18181c 0%, #131316 100%)' }
  const inputCls = 'w-full bg-[#0b0b0c] border border-[#232327] rounded-xl px-3.5 py-2.5 text-[13px] text-[#ededee] placeholder:text-[#5b5b62] focus:border-[#3a3a40] focus:outline-none transition-colors'
  const labelCls = 'block text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-1.5'

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0c', color: '#ededee', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="ds-bg" />
      <div className="ds-grid" />
      <Sidebar />

      <main className="ml-[240px] min-h-screen relative z-10 p-10 pt-12 page-enter">

        {/* Page header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <div className="text-[11px] text-[#5b5b62] tracking-[0.24em] uppercase mb-2">Your profile</div>
            <h1 className="font-fraunces font-light text-[#ededee] m-0 leading-tight" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.03em' }}>
              How founders see you
            </h1>
            <p className="text-[14px] text-[#8a8a92] mt-2 m-0">
              This profile powers your embedding. Updating it re-runs matching and changes which startups you're suggested for.
            </p>
          </div>
          {!editing ? (
            <div className="flex gap-2.5 flex-shrink-0">
              <button className="h-9 px-4 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[13px] font-medium transition-colors cursor-pointer bg-transparent">
                Preview match card
              </button>
              <button onClick={startEdit}
                className="h-9 px-4 rounded-full text-[13px] font-medium cursor-pointer border-0"
                style={{ background: '#ededee', color: '#0b0b0c' }}>
                Edit profile
              </button>
            </div>
          ) : (
            <div className="flex gap-2.5 flex-shrink-0">
              <button onClick={cancelEdit}
                className="h-9 px-4 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] text-[13px] font-medium transition-colors cursor-pointer bg-transparent">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="h-9 px-4 rounded-full text-[13px] font-medium cursor-pointer border-0 transition-all"
                style={{ background: saved ? C.green : saving ? '#232327' : '#ededee', color: saved || saving ? (saved ? '#0b0b0c' : '#5b5b62') : '#0b0b0c' }}>
                {saved ? 'Saved!' : saving ? 'Saving…' : 'Save & re-embed'}
              </button>
            </div>
          )}
        </header>

        {!editing ? (
          <>
            {/* Hero */}
            <section className="grid gap-5 items-center rounded-2xl border border-[#232327] p-7 mb-6"
              style={{ ...cardBg, gridTemplateColumns: 'auto 1fr auto' }}>
              <div className="w-[88px] h-[88px] rounded-[22px] flex items-center justify-center font-fraunces text-[32px] font-normal text-[#ededee]"
                style={{ background: 'linear-gradient(135deg, #3a3a40, #1d1d21)', border: '1px solid #2c2c32' }}>
                {profile.initials ?? profile.full_name?.slice(0, 2).toUpperCase() ?? 'NH'}
              </div>
              <div>
                <div className="font-fraunces font-normal text-[32px] text-[#ededee] leading-tight" style={{ letterSpacing: '-0.02em' }}>
                  {profile.full_name}
                </div>
                <div className="text-[14px] text-[#8a8a92] mt-1.5">
                  {[profile.job_title, profile.current_company, profile.country, profile.years_experience ? `${profile.years_experience} yrs` : null, profile.availability_hours ? `${profile.availability_hours} hrs/month` : null].filter(Boolean).join(' · ')}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {(profile.expertise_areas ?? []).map(e => (
                    <span key={e} className="text-[11px] px-2.5 py-1 rounded-full border border-[#232327] text-[#8a8a92]"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>{e}</span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#5b5b62] tracking-[0.22em] uppercase">Embedding</div>
                <div className="font-mono text-[12px] text-[#ededee] mt-1.5">{profile.embedding_dim ?? 3072}-d · synced {profile.embedding_synced ?? '—'}</div>
                <div className="flex items-center justify-end gap-1.5 mt-2" style={{ color: C.green }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span className="text-[11px]">In matching pool</span>
                </div>
              </div>
            </section>

            {/* 2-col body */}
            <div className="grid grid-cols-2 gap-5">
              {/* Left: bio + mentoring style */}
              <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
                <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-4">Bio</div>
                <p className="font-fraunces font-normal text-[16px] leading-[1.55] text-[#8a8a92] m-0">{profile.bio}</p>
                <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mt-6 mb-3">Mentoring style</div>
                <p className="text-[13.5px] text-[#8a8a92] leading-[1.6] m-0">{profile.mentoring_style}</p>
                <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mt-6 mb-3">Industries</div>
                <div className="flex flex-wrap gap-2">
                  {(profile.industry ?? []).map(i => (
                    <span key={i} className="text-[12px] px-3 py-1 rounded-full border"
                      style={{ background: 'rgba(96,165,250,0.15)', borderColor: 'rgba(96,165,250,0.4)', color: C.blue }}>{i}</span>
                  ))}
                </div>
              </div>

              {/* Right: details + track record */}
              <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
                <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-4">Details</div>
                <div className="grid grid-cols-2 gap-x-7">
                  {[
                    { k: 'Country',       v: profile.country },
                    { k: 'Experience',    v: profile.years_experience ? `${profile.years_experience} yrs` : '—' },
                    { k: 'Availability',  v: profile.availability_hours ? `${profile.availability_hours} hrs/mo` : '—' },
                    { k: 'Company',       v: profile.current_company },
                    { k: 'Title',         v: profile.job_title },
                    { k: 'LinkedIn',      v: profile.linkedin_url ? 'Linked' : '—' },
                  ].map((r, i) => (
                    <div key={r.k} className="flex justify-between gap-4 py-3 text-[13px]"
                      style={{ borderBottom: i < 4 ? '1px solid #232327' : 'none' }}>
                      <span className="text-[#5b5b62]">{r.k}</span>
                      <span className="text-[#ededee] text-right">{r.v ?? '—'}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mt-6 mb-4">Track record</div>
                <div className="grid grid-cols-3 gap-3.5">
                  {[
                    { k: 'Active links',       v: profile.active_links ?? '—' },
                    { k: 'Successful matches', v: profile.successful_matches ?? '—' },
                    { k: 'Avg session',        v: profile.avg_session ?? '—' },
                  ].map(s => (
                    <div key={s.k}>
                      <div className="text-[10px] text-[#5b5b62] tracking-[0.22em] uppercase">{s.k}</div>
                      <div className="font-fraunces font-normal text-[24px] mt-1 text-[#ededee]">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Edit mode */
          <div className="max-w-[760px] rounded-2xl border border-[#232327] p-8" style={cardBg}>
            <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-6">Edit profile</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full name</label>
                <input className={inputCls} value={form?.full_name ?? ''} onChange={e => set('full_name', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Country</label>
                <input className={inputCls} value={form?.country ?? ''} onChange={e => set('country', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Current company</label>
                <input className={inputCls} value={form?.current_company ?? ''} onChange={e => set('current_company', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Job title</label>
                <input className={inputCls} value={form?.job_title ?? ''} onChange={e => set('job_title', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Years of experience</label>
                <input className={inputCls} type="number" value={form?.years_experience ?? ''} onChange={e => set('years_experience', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Availability (hrs/month)</label>
                <input className={inputCls} type="number" value={form?.availability_hours ?? ''} onChange={e => set('availability_hours', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Bio</label>
                <textarea className={`${inputCls} resize-none`} rows={4} value={form?.bio ?? ''}
                  onChange={e => set('bio', e.target.value)} placeholder="Background, what you've built, what problems you love." />
                <div className="text-[11px] text-[#5b5b62] mt-1.5">{(form?.bio ?? '').length} / 600 characters · used in your embedding</div>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Mentoring style</label>
                <textarea className={`${inputCls} resize-none`} rows={3} value={form?.mentoring_style ?? ''}
                  onChange={e => set('mentoring_style', e.target.value)} placeholder="How you work with founders — cadence, format, what you push on." />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Industries</label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map(i => {
                    const sel = (form?.industry ?? []).includes(i)
                    return (
                      <button key={i} type="button" onClick={() => toggleChip('industry', i)}
                        className="text-[12px] px-3 py-1 rounded-full border transition-all cursor-pointer bg-transparent"
                        style={sel
                          ? { background: 'rgba(96,165,250,0.15)', borderColor: 'rgba(96,165,250,0.4)', color: C.blue }
                          : { borderColor: '#232327', color: '#8a8a92' }
                        }>{i}</button>
                    )
                  })}
                </div>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Expertise areas</label>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE.map(e => {
                    const sel = (form?.expertise_areas ?? []).includes(e)
                    return (
                      <button key={e} type="button" onClick={() => toggleChip('expertise_areas', e)}
                        className="text-[12px] px-3 py-1 rounded-full border transition-all cursor-pointer bg-transparent"
                        style={sel
                          ? { background: 'rgba(96,165,250,0.15)', borderColor: 'rgba(96,165,250,0.4)', color: C.blue }
                          : { borderColor: '#232327', color: '#8a8a92' }
                        }>{e}</button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
