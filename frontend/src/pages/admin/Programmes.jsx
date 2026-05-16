import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Reveal from '../../components/Reveal'
import { getProgrammes } from '../../services/programmes.service'

const C = { green: '#22c55e', blue: '#60a5fa', amber: '#f59e0b' }

const MOCK_PROGRAMMES = [
  {
    id: 'prog-1',
    name: 'Cradle CIP Accelerator 2026',
    type: 'Accelerator',
    status: 'active',
    meta: 'Cohort 1 · Malaysia · 12 May 2026 – 12 Nov 2026',
    progress: 4,
    progress_label: 'Week 1 of 26',
    outcome_label: null,
    mentors: 5, startups: 5, links: 5,
    stat4: { k: 'Avg health', v: '71', color: C.green },
  },
  {
    id: 'prog-2',
    name: 'MDEC Fintech Bridge 2026',
    type: 'Mentorship',
    status: 'active',
    meta: 'Cohort 3 · Malaysia × Singapore · 1 Apr 2026 – 1 Oct 2026',
    progress: 28,
    progress_label: 'Week 7 of 26',
    outcome_label: null,
    mentors: 12, startups: 10, links: 14,
    stat4: { k: 'Avg health', v: '78', color: C.green },
  },
  {
    id: 'prog-3',
    name: 'MaGIC Accelerator Cohort 6',
    type: 'Accelerator',
    status: 'completed',
    meta: 'Malaysia · Jan 2024 – Jul 2024 · 3 DNA blueprints',
    progress: 75,
    progress_label: null,
    outcome_label: '3 of 4 successful',
    mentors: 8, startups: 8, links: 4,
    stat4: { k: 'Blueprints', v: '3', color: C.blue },
  },
  {
    id: 'prog-4',
    name: 'Cradle Deeptech 2024',
    type: 'Grant',
    status: 'completed',
    meta: 'Malaysia · Mar 2024 – Sep 2024 · 4 DNA blueprints',
    progress: 67,
    progress_label: null,
    outcome_label: '4 of 6 successful',
    mentors: 6, startups: 6, links: 6,
    stat4: { k: 'Blueprints', v: '4', color: C.blue },
  },
]

function Badge({ status }) {
  const styles = {
    active:    { background: 'rgba(34,197,94,0.1)',    border: '1px solid rgba(34,197,94,0.3)',    color: C.green },
    completed: { background: 'rgba(255,255,255,0.04)', border: '1px solid #232327',                color: '#8a8a92' },
    draft:     { background: 'rgba(245,158,11,0.1)',   border: '1px solid rgba(245,158,11,0.3)',   color: C.amber },
  }
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full tracking-[0.1em] uppercase" style={styles[status] ?? styles.draft}>
      {status}
    </span>
  )
}

export default function Programmes() {
  const navigate = useNavigate()
  const [programmes, setProgrammes] = useState(MOCK_PROGRAMMES)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getProgrammes().then(d => { if (d?.length) setProgrammes(d) }).catch(() => {})
  }, [])

  const counts = {
    all: programmes.length,
    active: programmes.filter(p => p.status === 'active').length,
    draft: programmes.filter(p => p.status === 'draft').length,
    completed: programmes.filter(p => p.status === 'completed').length,
  }
  const filtered = filter === 'all' ? programmes : programmes.filter(p => p.status === filter)

  const cardBg = { background: 'linear-gradient(180deg, #18181c 0%, #131316 100%)' }
  const eyebrow = 'text-[11px] text-[#5b5b62] tracking-[0.24em] uppercase'

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0c', color: '#ededee', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="ds-bg" />
      <div className="ds-grid" />
      <Sidebar />

      <main className="ml-[240px] min-h-screen relative z-10 p-10 pt-12 page-enter">

        {/* Page header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <div className={`${eyebrow} mb-2`}>Programmes</div>
            <h1 className="font-fraunces font-light text-[#ededee] m-0 leading-tight" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.03em' }}>
              Cohorts &amp; initiatives
            </h1>
            <p className="text-[14px] text-[#8a8a92] mt-2 m-0">
              {counts.all} programmes · {counts.active} active · {counts.completed} completed. Each completed programme contributes blueprints to the DNA library.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/programmes/new')}
            className="h-9 px-4 rounded-full text-[13px] font-medium flex items-center gap-2 transition-colors cursor-pointer border-0 flex-shrink-0"
            style={{ background: '#ededee', color: '#0b0b0c' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New programme
          </button>
        </header>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { key: 'all',       label: `All · ${counts.all}` },
            { key: 'active',    label: `Active · ${counts.active}` },
            { key: 'draft',     label: `Draft · ${counts.draft}` },
            { key: 'completed', label: `Completed · ${counts.completed}` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className="h-8 px-3.5 rounded-full border text-[12px] font-medium transition-colors cursor-pointer bg-transparent"
              style={filter === tab.key
                ? { borderColor: '#ededee', color: '#ededee' }
                : { borderColor: '#232327', color: '#8a8a92' }
              }
            >{tab.label}</button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
          {filtered.map(p => (
            <article
              key={p.id}
              onClick={() => navigate(`/admin/programmes/${p.id}`)}
              className="rounded-2xl border border-[#232327] p-6 flex flex-col gap-[18px] cursor-pointer transition-all duration-200"
              style={cardBg}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3a3a40'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#232327'; e.currentTarget.style.transform = '' }}
            >
              {/* Head */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge status={p.status} />
                  <h3 className="font-fraunces font-normal text-[#ededee] text-[22px] leading-[1.2] mt-2.5 mb-0" style={{ letterSpacing: '-0.02em' }}>
                    {p.name}
                  </h3>
                  <div className="text-[12.5px] text-[#8a8a92] mt-1">{p.meta}</div>
                </div>
                <div className="text-[11px] text-[#5b5b62] tracking-[0.18em] uppercase flex-shrink-0">{p.type}</div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-[11.5px] text-[#5b5b62] mb-1.5">
                  <span>{p.status === 'completed' ? 'Outcome' : 'Programme progress'}</span>
                  <span>{p.status === 'completed' ? p.outcome_label : p.progress_label}</span>
                </div>
                <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${p.progress}%`,
                      background: p.status === 'completed' ? C.green : 'rgba(255,255,255,0.3)',
                    }}
                  />
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3 border-t border-[#232327] pt-4">
                {[
                  { k: 'Mentors',  v: p.mentors,  color: null },
                  { k: 'Startups', v: p.startups, color: null },
                  { k: 'Links',    v: p.links,    color: null },
                  p.stat4,
                ].map(s => (
                  <div key={s.k}>
                    <div className="text-[10px] text-[#5b5b62] tracking-[0.22em] uppercase">{s.k}</div>
                    <div className="font-fraunces font-normal text-[20px] text-[#ededee] mt-0.5" style={s.color ? { color: s.color } : {}}>
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-[#5b5b62] text-[14px]">
              No programmes match the current filter.
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
