import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Reveal from '../../components/Reveal'
import { getDnaBlueprints } from '../../services/dna.service'

const C = { blue: '#60a5fa', green: '#22c55e', amber: '#f59e0b' }

const MOCK_BLUEPRINTS = [
  {
    id: 'DNA-7f2a', confidence: 0.91,
    tags: [{ label: 'fintech', geo: false }, { label: 'accelerator', geo: false }, { label: 'Malaysia', geo: true }],
    industry: 'fintech', programmeType: 'accelerator', geography: 'Malaysia',
    summary: 'Fintech mentors with 10+ years in banking and active investor networks consistently unlock seed-stage funding within 6 months. The pattern holds across both B2B and consumer fintech.',
    stats: { checkins: 12, avgSession: '75m', duration: '8mo' },
    source: 'MaGIC Cohort 6', pair: 'Ahmad Razif × FundBridge', outcome: 'Raised RM600k pre-seed',
  },
  {
    id: 'DNA-3e91', confidence: 0.88,
    tags: [{ label: 'healthtech', geo: false }, { label: 'accelerator', geo: false }, { label: 'Malaysia', geo: true }],
    industry: 'healthtech', programmeType: 'accelerator', geography: 'Malaysia',
    summary: 'Healthtech founders paired with regulatory-experienced mentors achieve pilot approval roughly 2× faster than peers. Early stakeholder mapping at the ministry is the dominant signal.',
    stats: { checkins: 11, avgSession: '90m', duration: '7mo' },
    source: 'MaGIC Cohort 6', pair: 'Nurul Huda × MediTrack', outcome: 'MOH pilot approved',
  },
  {
    id: 'DNA-c1d8', confidence: 0.84,
    tags: [{ label: 'saas', geo: false }, { label: 'accelerator', geo: false }, { label: 'Malaysia', geo: true }],
    industry: 'saas', programmeType: 'accelerator', geography: 'Malaysia',
    summary: 'SaaS GTM frameworks transfer cleanly when mentor and startup share a target persona. Misalignment on ICP — even with strong mentor seniority — predicts cohort under-performance.',
    stats: { checkins: 9, avgSession: '60m', duration: '5mo' },
    source: 'MaGIC Cohort 6', pair: 'Priya Nair × DeskOps', outcome: '3 enterprise clients signed',
  },
  {
    id: 'DNA-92ab', confidence: 0.79,
    tags: [{ label: 'fintech', geo: false }, { label: 'mentorship', geo: false }, { label: 'Singapore', geo: true }],
    industry: 'fintech', programmeType: 'mentorship', geography: 'Singapore',
    summary: 'Cross-border fintech pairings work when the mentor has direct compliance experience in the target market. Generic seniority does not transfer across regulatory regimes.',
    stats: { checkins: 14, avgSession: '55m', duration: '9mo' },
    source: 'SG Fintech Bridge 2025', pair: 'Wei Lin × CrossPay', outcome: 'MAS sandbox approved',
  },
  {
    id: 'DNA-5f0c', confidence: 0.76,
    tags: [{ label: 'deeptech', geo: false }, { label: 'grant', geo: false }, { label: 'Malaysia', geo: true }],
    industry: 'deeptech', programmeType: 'grant', geography: 'Malaysia',
    summary: 'Deeptech founders benefit most when mentors actively reshape the technical narrative for grant reviewers. Engineering depth alone — without translation skill — correlates with grant rejection.',
    stats: { checkins: 8, avgSession: '80m', duration: '6mo' },
    source: 'Cradle Deeptech 2024', pair: 'Dr. Faizal × NeuroGrid', outcome: 'RM250k grant secured',
  },
  {
    id: 'DNA-b403', confidence: 0.72,
    tags: [{ label: 'e-commerce', geo: false }, { label: 'incubator', geo: false }, { label: 'Indonesia', geo: true }],
    industry: 'e-commerce', programmeType: 'incubator', geography: 'Indonesia',
    summary: 'For marketplace startups, mentor utility peaks during the supply-side cold start. Pairings introduced after liquidity is achieved deliver materially lower outcomes.',
    stats: { checkins: 10, avgSession: '65m', duration: '7mo' },
    source: 'BEKUP 2024', pair: 'Rina P. × TaniSwap', outcome: '4× GMV growth',
  },
]

const DNA_STATS = [
  { label: 'Blueprints',        value: '24',  valueSuffix: null, delta: '+3 this month',       up: true  },
  { label: 'Industries covered',value: '7',   valueSuffix: null, delta: 'Fintech leads',        up: false },
  { label: 'Avg match boost',   value: '+18', valueSuffix: '%',  delta: 'vs embedding-only',   up: true  },
  { label: 'Source programmes', value: '5',   valueSuffix: null, delta: '3 countries',          up: false },
]

export default function DnaLibrary() {
  const navigate = useNavigate()
  const [blueprints, setBlueprints] = useState(MOCK_BLUEPRINTS)
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('')
  const [progType, setProgType] = useState('')
  const [geography, setGeography] = useState('')
  const [toast, setToast] = useState(null)
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    getDnaBlueprints({}).then(d => { if (d?.length) setBlueprints(d) }).catch(() => {})
  }, [])

  const filtered = blueprints.filter(b => {
    const q = search.toLowerCase()
    if (q && !b.summary.toLowerCase().includes(q) && !b.tags.some(t => t.label.includes(q))) return false
    if (industry && b.industry !== industry) return false
    if (progType && b.programmeType !== progType) return false
    if (geography && b.geography !== geography) return false
    return true
  })

  const cardBg = { background: 'linear-gradient(180deg, #18181c 0%, #131316 100%)' }
  const eyebrow = 'text-[11px] text-[#5b5b62] tracking-[0.24em] uppercase'
  const selectCls = 'bg-transparent border border-[#232327] rounded-xl px-3 py-2 text-[13px] text-[#8a8a92] focus:outline-none focus:border-[#3a3a40] appearance-none cursor-pointer min-w-[140px]'

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0c', color: '#ededee', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl border border-[#232327] text-[#ededee] text-[13px] flex items-center gap-3"
          style={{ background: 'linear-gradient(180deg, #18181c 0%, #131316 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          {toast}
          <button onClick={() => setToast(null)} className="text-[#5b5b62] hover:text-[#ededee] bg-transparent border-0 cursor-pointer ml-1">✕</button>
        </div>
      )}
      <div className="ds-bg" />
      <div className="ds-grid" />
      <Sidebar />

      <main className="ml-[240px] min-h-screen relative z-10 p-10 pt-12 page-enter">

        {/* Page header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <div className={`${eyebrow} mb-2`}>Pattern intelligence</div>
            <h1 className="font-fraunces font-light text-[#ededee] m-0 leading-tight" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.03em' }}>
              DNA Library
            </h1>
            <p className="text-[14px] text-[#8a8a92] mt-2 m-0">
              {blueprints.length} blueprints extracted from successful relationships. Each compounds on the next cohort's matching.
            </p>
          </div>
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(blueprints, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a'); a.href = url; a.download = 'tessera-dna-library.json'; a.click()
              URL.revokeObjectURL(url)
            }}
            className="h-9 px-4 rounded-full border border-[#2c2c32] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[13px] font-medium flex items-center gap-2 transition-colors cursor-pointer bg-transparent flex-shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export library
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          {DNA_STATS.map((s, i) => (
            <div key={i} className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <div className="text-[12px] text-[#5b5b62] tracking-[0.16em] uppercase mb-3">{s.label}</div>
              <div className="font-fraunces font-light text-[36px] leading-none tracking-[-0.03em] text-[#ededee] mb-3">
                {s.value}
                {s.valueSuffix && <span className="text-[24px] text-[#5b5b62]">{s.valueSuffix}</span>}
              </div>
              <div className="flex items-center gap-1.5 text-[12px]" style={{ color: s.up ? C.green : '#5b5b62' }}>
                {s.up && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 15 12 9 18 15"/>
                  </svg>
                )}
                {s.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <Reveal><div className="flex items-center gap-3 mb-6 p-4 rounded-2xl border border-[#232327] flex-wrap" style={cardBg}>
          <div className="flex items-center gap-2.5 flex-1 min-w-[220px] text-[#5b5b62]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search patterns… (e.g. 'regulatory mentor', 'series A handoff')"
              className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#ededee] placeholder:text-[#5b5b62]"
            />
          </div>
          <select value={industry} onChange={e => setIndustry(e.target.value)} className={selectCls}>
            <option value="">All industries</option>
            {['fintech', 'healthtech', 'saas', 'deeptech', 'e-commerce'].map(o => <option key={o} value={o} className="bg-[#131316]">{o}</option>)}
          </select>
          <select value={progType} onChange={e => setProgType(e.target.value)} className={selectCls}>
            <option value="">All programmes</option>
            {['accelerator', 'mentorship', 'grant', 'incubator'].map(o => <option key={o} value={o} className="bg-[#131316]">{o}</option>)}
          </select>
          <select value={geography} onChange={e => setGeography(e.target.value)} className={selectCls}>
            <option value="">All geographies</option>
            {['Malaysia', 'Singapore', 'Indonesia'].map(o => <option key={o} value={o} className="bg-[#131316]">{o}</option>)}
          </select>
        </div></Reveal>

        {/* Cards grid */}
        <Reveal delay={80}><div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
          {filtered.map(b => (
            <article
              key={b.id}
              onClick={() => navigate(`/admin/dna/${b.id}`)}
              className="rounded-2xl border border-[#232327] p-[22px] flex flex-col gap-4 relative overflow-hidden cursor-pointer transition-all duration-200"
              style={cardBg}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a3a40'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#232327'; e.currentTarget.style.transform = '' }}
            >
              {/* Blue radial accent top-right */}
              <div className="absolute top-0 right-0 w-[140px] h-[140px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.10), transparent 70%)' }} />

              {/* Head */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-1.5 flex-wrap">
                  {b.tags.map(t => (
                    <span
                      key={t.label}
                      className="text-[10px] px-2 py-0.5 rounded-full border tracking-[0.08em] uppercase"
                      style={t.geo
                        ? { background: 'rgba(255,255,255,0.04)', borderColor: '#232327', color: '#8a8a92' }
                        : { background: 'rgba(96,165,250,0.08)', borderColor: 'rgba(96,165,250,0.2)', color: C.blue }
                      }
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
                <span className="text-[10.5px] text-[#5b5b62] font-mono flex-shrink-0">{b.id} · {b.confidence} confidence</span>
              </div>

              {/* Summary */}
              <p className="font-fraunces font-normal text-[17px] leading-[1.4] tracking-[-0.01em] text-[#ededee] m-0">{b.summary}</p>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { k: 'Check-ins', v: b.stats.checkins },
                  { k: 'Avg session', v: b.stats.avgSession },
                  { k: 'Duration', v: b.stats.duration },
                ].map(s => (
                  <div key={s.k}>
                    <div className="text-[10px] text-[#5b5b62] tracking-[0.22em] uppercase">{s.k}</div>
                    <div className="font-fraunces font-normal text-[22px] leading-[1.2] text-[#ededee] mt-0.5">{s.v}</div>
                  </div>
                ))}
              </div>

              {/* Source */}
              <div className="text-[12px] text-[#5b5b62] leading-relaxed border-t border-[#232327] pt-3">
                From <strong className="text-[#8a8a92] font-medium">{b.source}</strong> · {b.pair} · {b.outcome}
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-[#5b5b62] text-[14px]">
              No blueprints match the current filters.
            </div>
          )}
        </div></Reveal>

        {filtered.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
            onClick={() => showToast('All blueprints loaded — no more available.')}
            className="h-10 px-6 rounded-full border border-[#232327] text-[#8a8a92] hover:text-[#ededee] hover:border-[#3a3a40] text-[13px] font-medium transition-colors cursor-pointer bg-transparent">
              Load 18 more blueprints
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
