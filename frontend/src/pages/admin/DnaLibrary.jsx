import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { getDnaBlueprints } from '../../services/dna.service'

const MOCK_BLUEPRINTS = [
  {
    id: '1',
    tags: ['Fintech', 'Accelerator', 'Malaysia'],
    industry: 'Fintech', programme_type: 'Accelerator', geography: 'Malaysia',
    pattern_summary: 'Extracted pattern from successfully funded fintech cohorts showing 3x success rate when mentors have C-level experience.',
    relationship_stats: { total_checkins: 12, avg_duration: 75, milestones_completed: 3 },
  },
  {
    id: '2',
    tags: ['SaaS', 'Seed', 'Remote'],
    industry: 'SaaS', programme_type: 'Seed', geography: 'Remote',
    pattern_summary: 'B2B SaaS startups exhibiting a 40% reduction in churn when matching algorithm prioritizes mentors with direct competitor exit experience.',
    relationship_stats: { total_checkins: 8, avg_duration: 45, milestones_completed: 2 },
  },
  {
    id: '3',
    tags: ['Healthtech', 'Series A', 'US'],
    industry: 'Healthtech', programme_type: 'Series A', geography: 'US',
    pattern_summary: 'Regulatory compliance navigation speed increased by 60% in cohorts utilizing structured weekly asynchronous updates over live calls.',
    relationship_stats: { total_checkins: 24, avg_duration: null, milestones_completed: 5, async: true },
  },
  {
    id: '4',
    tags: ['EdTech', 'Pre-seed', 'Europe'],
    industry: 'EdTech', programme_type: 'Pre-seed', geography: 'Europe',
    pattern_summary: 'Early product-market fit validation timeline shortened by 3 months when mentors introduce direct pilot school connections in month 1.',
    relationship_stats: { total_checkins: 6, avg_duration: 90, milestones_completed: 1 },
  },
]

const FILTERS_CONFIG = [
  { key: 'industry',  label: 'Industry',  opts: ['Fintech', 'SaaS', 'Healthtech', 'EdTech'] },
  { key: 'type',      label: 'Type',       opts: ['Accelerator', 'Seed', 'Series A', 'Pre-seed'] },
  { key: 'geography', label: 'Geography',  opts: ['Malaysia', 'Remote', 'US', 'Europe'] },
]

export default function DnaLibrary() {
  const [blueprints, setBlueprints] = useState(MOCK_BLUEPRINTS)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ industry: '', type: '', geography: '' })

  useEffect(() => {
    getDnaBlueprints({}).then(d => { if (d?.length) setBlueprints(d) }).catch(() => {})
  }, [])

  const filtered = blueprints.filter(b => {
    const q = search.toLowerCase()
    const matchesSearch = !q || b.pattern_summary.toLowerCase().includes(q) || b.tags.some(t => t.toLowerCase().includes(q))
    const matchesIndustry = !filters.industry || b.industry === filters.industry
    const matchesType = !filters.type || b.programme_type === filters.type
    const matchesGeo = !filters.geography || b.geography === filters.geography
    return matchesSearch && matchesIndustry && matchesType && matchesGeo
  })

  const statsLabel = (s) => {
    const parts = [`${s.total_checkins} check-ins`]
    if (s.async) parts.push('async')
    else if (s.avg_duration) parts.push(`avg ${s.avg_duration} min`)
    parts.push(`${s.milestones_completed} milestone${s.milestones_completed !== 1 ? 's' : ''}`)
    return parts.join(' · ')
  }

  return (
    <div className="bg-surface-container-lowest text-on-background h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-sidebar-width h-screen overflow-hidden">

        {/* Top App Bar */}
        <header className="flex justify-between items-center h-14 w-full px-gutter bg-surface border-b border-outline-variant z-10 shrink-0">
          <h2 className="text-title-md font-bold tracking-tight text-on-surface">DNA Library</h2>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant text-on-surface text-body-sm rounded pl-9 pr-3 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all w-64 placeholder:text-on-surface-variant"
                placeholder="Search patterns..."
                type="text"
              />
            </div>
            <button className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container p-1.5 rounded transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container p-1.5 rounded transition-colors">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
            <div className="w-8 h-8 rounded bg-surface-container-high border border-outline-variant ml-2 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
            </div>
          </div>
        </header>

        {/* Canvas */}
        <main className="flex-1 overflow-y-auto p-container-padding bg-surface-container-lowest">
          <div className="max-w-[1400px] mx-auto">

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 mb-8 items-center border-b border-surface-container pb-4">
              {FILTERS_CONFIG.map(({ key, label, opts }) => (
                <div key={key} className="relative">
                  <select
                    value={filters[key]}
                    onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
                    className="appearance-none bg-surface border border-surface-container text-on-surface text-body-sm rounded pl-3 pr-8 py-2 focus:outline-none focus:border-primary cursor-pointer hover:bg-surface-container-high transition-colors"
                  >
                    <option value="">{label}: All</option>
                    {opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[16px]">expand_more</span>
                </div>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-body-sm text-on-surface-variant">{filtered.length} patterns found</span>
                <button className="bg-surface border border-surface-container text-on-surface text-body-sm rounded px-3 py-2 hover:bg-surface-container-high transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">sort</span> Sort
                </button>
              </div>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(b => (
                <div key={b.id} className="hover-card-effect bg-surface border border-surface-container rounded p-5 flex flex-col cursor-pointer">
                  <div className="flex gap-2 flex-wrap mb-4">
                    {b.tags.map(tag => (
                      <span key={tag} className="bg-surface-container-low border border-surface-container text-secondary text-label-sm px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-body-md text-on-surface leading-relaxed flex-1">{b.pattern_summary}</p>
                  <div className="mt-6 pt-4 border-t border-surface-container flex items-center text-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px] mr-1.5 opacity-70">vital_signs</span>
                    {statsLabel(b.relationship_stats)}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-body-sm text-on-surface-variant text-center py-12">
                  No patterns match the filters.
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
