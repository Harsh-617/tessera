import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../hooks/useAuth'
import { getStartupProfile, updateStartupProfile } from '../../services/profiles.service'

const C = { green: '#22c55e', amber: '#f59e0b', blue: '#60a5fa' }

const MOCK_PROFILE = {
  company_name: 'CareLoop', initials: 'CL',
  industry: 'Healthtech', stage: 'MVP', country: 'Malaysia',
  founded_year: 2024, team_size: 5, website: 'careloop.my',
  tags: ['Remote monitoring', 'Chronic care', 'B2B clinical'],
  description: 'Remote patient monitoring for chronic-care clinics in Malaysia. We capture vitals from at-home devices, surface deterioration trends to nurses in near-real-time, and replace the manual paper-based check-ins most clinics still do. Currently piloting with two private clinics in KL while pursuing MOH approval.',
  support_needed: ['Regulatory', 'Clinical partnerships'],
  all_support: ['Regulatory', 'Clinical partnerships', 'Fundraising', 'Enterprise sales'],
  embedding_dim: 3072, embedding_synced: '4d ago',
  sessions: 6, milestones_done: 2, milestones_total: 3, health: 70,
}

const SUPPORT_ALL = ['Regulatory', 'Clinical partnerships', 'Fundraising', 'Product / market fit', 'Market access', 'Technical architecture', 'Enterprise sales', 'Grant applications', 'Hiring']

export default function StartupProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(MOCK_PROFILE)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) {
      getStartupProfile(user.uid).then(d => { if (d) { setProfile(d); setForm(d) } }).catch(() => {})
    }
  }, [user])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleSupport = (val) => {
    setForm(f => ({
      ...f,
      support_needed: (f.support_needed ?? []).includes(val)
        ? f.support_needed.filter(x => x !== val)
        : [...(f.support_needed ?? []), val],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateStartupProfile(form)
      setProfile(f => ({ ...f, ...form }))
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
              How mentors see you
            </h1>
            <p className="text-[14px] text-[#8a8a92] mt-2 m-0">
              This profile drives semantic matching. Updating it re-runs your embedding and influences future match suggestions.
            </p>
          </div>
          {!editing ? (
            <div className="flex gap-2.5 flex-shrink-0">
              <button className="h-9 px-4 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[13px] font-medium transition-colors cursor-pointer bg-transparent">
                Preview match card
              </button>
              <button
                onClick={startEdit}
                className="h-9 px-4 rounded-full text-[13px] font-medium cursor-pointer border-0"
                style={{ background: '#ededee', color: '#0b0b0c' }}
              >
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
            <section className="grid gap-5 items-center rounded-2xl border border-[#232327] p-7 mb-6" style={{ ...cardBg, gridTemplateColumns: 'auto 1fr auto' }}>
              <div className="w-[88px] h-[88px] rounded-[22px] flex items-center justify-center font-fraunces text-[32px] font-normal text-[#ededee]"
                style={{ background: 'linear-gradient(135deg, #3a3a40, #1d1d21)', border: '1px solid #2c2c32' }}>
                {profile.initials ?? profile.company_name?.slice(0, 2).toUpperCase() ?? 'CL'}
              </div>
              <div>
                <div className="font-fraunces font-normal text-[32px] text-[#ededee] leading-tight" style={{ letterSpacing: '-0.02em' }}>
                  {profile.company_name}
                </div>
                <div className="text-[14px] text-[#8a8a92] mt-1.5">
                  {[profile.industry, profile.stage, profile.country, profile.founded_year ? `Founded ${profile.founded_year}` : null, profile.team_size ? `Team of ${profile.team_size}` : null].filter(Boolean).join(' · ')}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {(profile.tags ?? []).map(tag => (
                    <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full border border-[#232327] text-[#8a8a92]"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>{tag}</span>
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
              {/* Left: description + support */}
              <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
                <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-4">What we're building</div>
                <p className="font-fraunces font-normal text-[16px] leading-[1.55] text-[#8a8a92] m-0">
                  {profile.description}
                </p>
                <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mt-6 mb-3">Support we need</div>
                <div className="flex flex-wrap gap-2">
                  {(profile.all_support ?? profile.support_needed ?? []).map(s => {
                    const sel = (profile.support_needed ?? []).includes(s)
                    return (
                      <span key={s} className="text-[12px] px-3 py-1 rounded-full border"
                        style={sel
                          ? { background: 'rgba(96,165,250,0.15)', borderColor: 'rgba(96,165,250,0.4)', color: C.blue }
                          : { borderColor: '#232327', color: '#5b5b62' }
                        }>{s}</span>
                    )
                  })}
                </div>
              </div>

              {/* Right: company details + programme stats */}
              <div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
                <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-4">Company details</div>
                <div className="grid grid-cols-2 gap-x-7">
                  {[
                    { k: 'Industry', v: profile.industry },
                    { k: 'Stage',    v: profile.stage },
                    { k: 'Country',  v: profile.country },
                    { k: 'Founded',  v: profile.founded_year },
                    { k: 'Team size',v: profile.team_size },
                    { k: 'Website',  v: profile.website },
                  ].map((r, i) => (
                    <div key={r.k} className="flex justify-between gap-4 py-3 text-[13px]"
                      style={{ borderBottom: i < 4 ? '1px solid #232327' : 'none' }}>
                      <span className="text-[#5b5b62]">{r.k}</span>
                      <span className="text-[#ededee] text-right">{r.v ?? '—'}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mt-6 mb-4">Programme progress</div>
                <div className="grid grid-cols-3 gap-3.5">
                  {[
                    { k: 'Sessions',   v: profile.sessions ?? '—' },
                    { k: 'Milestones', v: `${profile.milestones_done ?? '—'}/${profile.milestones_total ?? '—'}` },
                    { k: 'Health',     v: profile.health ?? '—', color: C.green },
                  ].map(s => (
                    <div key={s.k}>
                      <div className="text-[10px] text-[#5b5b62] tracking-[0.22em] uppercase">{s.k}</div>
                      <div className="font-fraunces font-normal text-[24px] mt-1" style={{ color: s.color ?? '#ededee' }}>{s.v}</div>
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
              <div className="col-span-2">
                <label className={labelCls}>Company name</label>
                <input className={inputCls} value={form?.company_name ?? ''} onChange={e => set('company_name', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Industry</label>
                <input className={inputCls} value={form?.industry ?? ''} onChange={e => set('industry', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Stage</label>
                <select className={inputCls} value={form?.stage ?? ''} onChange={e => set('stage', e.target.value)} style={{ appearance: 'none', cursor: 'pointer' }}>
                  {['idea', 'mvp', 'seed', 'series_a', 'series_b'].map(s => <option key={s} value={s} className="bg-[#131316]">{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Country</label>
                <input className={inputCls} value={form?.country ?? ''} onChange={e => set('country', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Team size</label>
                <input className={inputCls} type="number" value={form?.team_size ?? ''} onChange={e => set('team_size', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Founded year</label>
                <input className={inputCls} type="number" value={form?.founded_year ?? ''} onChange={e => set('founded_year', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Website</label>
                <input className={inputCls} value={form?.website ?? ''} onChange={e => set('website', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Description</label>
                <textarea className={`${inputCls} resize-none`} rows={4}
                  value={form?.description ?? ''} onChange={e => set('description', e.target.value)}
                  placeholder="What you do, who for, and why it matters." />
                <div className="text-[11px] text-[#5b5b62] mt-1.5">{(form?.description ?? '').length} / 800 characters · used in your embedding</div>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Support you need</label>
                <div className="flex flex-wrap gap-2">
                  {SUPPORT_ALL.map(s => {
                    const sel = (form?.support_needed ?? []).includes(s)
                    return (
                      <button key={s} type="button" onClick={() => toggleSupport(s)}
                        className="text-[12px] px-3 py-1 rounded-full border transition-all cursor-pointer bg-transparent"
                        style={sel
                          ? { background: 'rgba(96,165,250,0.15)', borderColor: 'rgba(96,165,250,0.4)', color: C.blue }
                          : { borderColor: '#232327', color: '#8a8a92' }
                        }>{s}</button>
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
