import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { createProgramme } from '../../services/programmes.service'

const PROG_TYPES = [
  { id: 'accelerator', label: 'Accelerator', desc: 'Time-bound cohort with structured curriculum and milestones.' },
  { id: 'mentorship',  label: 'Mentorship',  desc: '1:1 advisory relationships with flexible cadence.' },
  { id: 'grant',       label: 'Grant',       desc: 'Funding-focused programme with grant application milestones.' },
  { id: 'incubator',   label: 'Incubator',   desc: 'Pre-launch programme for idea-stage founders.' },
]
const COUNTRIES = ['Malaysia', 'Singapore', 'Indonesia', 'Thailand']

export default function ProgrammeSetup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', start_date: '', end_date: '', country: 'Malaysia',
    type: 'accelerator',
    max_startups_per_mentor: '2', required_expertise: '',
    min_checkins: '8', milestones_required: '3',
  })
  const [loading, setLoading] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleCreate = async (status) => {
    setLoading(status)
    try {
      const p = await createProgramme({
        name: form.name, country: form.country, type: form.type,
        start_date: form.start_date, end_date: form.end_date,
        status,
        rules: {
          max_startups_per_mentor: parseInt(form.max_startups_per_mentor),
          required_expertise: form.required_expertise,
        },
        success_metrics: {
          min_checkins: parseInt(form.min_checkins),
          milestones_required: parseInt(form.milestones_required),
        },
      })
      navigate(`/admin/programmes/${p.id}`)
    } catch (err) {
      console.error(err)
      navigate('/admin/programmes')
    } finally {
      setLoading(null)
    }
  }

  const inputCls = 'w-full bg-[#0b0b0c] border border-[#232327] rounded-xl px-3.5 py-2.5 text-[13px] text-[#ededee] placeholder:text-[#5b5b62] focus:border-[#3a3a40] focus:outline-none transition-colors'
  const labelCls = 'block text-[11px] text-[#5b5b62] tracking-[0.16em] uppercase mb-2'
  const cardBg = { background: 'linear-gradient(180deg, #18181c 0%, #131316 100%)' }

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0c', color: '#ededee', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="ds-bg" />
      <div className="ds-grid" />
      <Sidebar />

      <main className="ml-[240px] min-h-screen relative z-10 p-10 pt-12 page-enter">

        {/* Page header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/admin/programmes')}
              className="flex items-center gap-1.5 text-[12px] text-[#5b5b62] tracking-[0.18em] uppercase hover:text-[#8a8a92] transition-colors cursor-pointer bg-transparent border-0 p-0 mb-2.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Programmes
            </button>
            <h1 className="font-fraunces font-light text-[#ededee] m-0 leading-tight" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.03em' }}>
              New programme
            </h1>
            <p className="text-[14px] text-[#8a8a92] mt-2 m-0">
              Configure how this cohort will run. Rules and success metrics apply to all enrolled actors.
            </p>
          </div>
          <div className="flex gap-2.5 flex-shrink-0">
            <button
              onClick={() => handleCreate('draft')}
              disabled={!!loading}
              className="h-9 px-4 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[13px] font-medium transition-colors cursor-pointer bg-transparent"
            >
              {loading === 'draft' ? 'Saving…' : 'Save as draft'}
            </button>
            <button
              onClick={() => handleCreate('active')}
              disabled={!!loading}
              className="h-9 px-4 rounded-full text-[13px] font-medium transition-colors cursor-pointer border-0"
              style={{ background: '#ededee', color: '#0b0b0c', opacity: loading ? 0.6 : 1 }}
            >
              {loading === 'active' ? 'Creating…' : 'Create programme'}
            </button>
          </div>
        </header>

        {/* Form card */}
        <div className="max-w-[880px] rounded-2xl border border-[#232327] p-8" style={cardBg}>

          {/* Programme details */}
          <section>
            <h2 className="font-fraunces font-normal text-[#ededee] text-[18px] m-0 mb-4" style={{ letterSpacing: '-0.01em' }}>Programme details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>Name</label>
                <input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Cradle CIP Accelerator 2026" />
              </div>
              <div>
                <label className={labelCls}>Start date</label>
                <input className={inputCls} type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>End date</label>
                <input className={inputCls} type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Country</label>
                <select className={inputCls} value={form.country} onChange={e => set('country', e.target.value)} style={{ cursor: 'pointer', appearance: 'none' }}>
                  {COUNTRIES.map(c => <option key={c} value={c} className="bg-[#131316]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Admin owner</label>
                <select className={inputCls} style={{ cursor: 'pointer', appearance: 'none' }}>
                  <option className="bg-[#131316]">Amir Hakim (you)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Programme type */}
          <section className="mt-7 pt-6 border-t border-[#232327]">
            <h2 className="font-fraunces font-normal text-[#ededee] text-[18px] m-0 mb-4" style={{ letterSpacing: '-0.01em' }}>Programme type</h2>
            <div className="grid grid-cols-4 gap-2.5">
              {PROG_TYPES.map(t => {
                const sel = form.type === t.id
                return (
                  <button
                    key={t.id} type="button"
                    onClick={() => set('type', t.id)}
                    className="p-4 rounded-xl border text-left flex flex-col gap-1.5 transition-all cursor-pointer bg-transparent"
                    style={sel
                      ? { borderColor: '#ededee', background: 'rgba(255,255,255,0.05)' }
                      : { borderColor: '#232327' }
                    }
                  >
                    <div className="text-[14px] font-medium text-[#ededee]">{t.label}</div>
                    <div className="text-[11.5px] text-[#5b5b62] leading-[1.4]">{t.desc}</div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Matching rules */}
          <section className="mt-7 pt-6 border-t border-[#232327]">
            <h2 className="font-fraunces font-normal text-[#ededee] text-[18px] m-0 mb-4" style={{ letterSpacing: '-0.01em' }}>Matching rules</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Max startups per mentor</label>
                <input className={inputCls} type="number" value={form.max_startups_per_mentor} onChange={e => set('max_startups_per_mentor', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Required expertise</label>
                <input className={inputCls} value={form.required_expertise} onChange={e => set('required_expertise', e.target.value)} placeholder="e.g. fintech, healthtech" />
                <div className="text-[11px] text-[#5b5b62] mt-1.5">Comma separated. Mentors without matching expertise are excluded.</div>
              </div>
            </div>
          </section>

          {/* Success metrics */}
          <section className="mt-7 pt-6 border-t border-[#232327]">
            <h2 className="font-fraunces font-normal text-[#ededee] text-[18px] m-0 mb-1" style={{ letterSpacing: '-0.01em' }}>Success metrics</h2>
            <p className="text-[12.5px] text-[#5b5b62] mb-4 m-0">A link is considered successful only when these are hit. Successful links generate DNA blueprints.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Minimum check-ins</label>
                <input className={inputCls} type="number" value={form.min_checkins} onChange={e => set('min_checkins', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Milestones required</label>
                <input className={inputCls} type="number" value={form.milestones_required} onChange={e => set('milestones_required', e.target.value)} />
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
