import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'

const MOCK_STATS = { active_links: 12, at_risk: 3, programmes: 2, dna_blueprints: 3 }

const MOCK_LINKS = [
  { id: '1', mentor: 'Dr. Sarah Chen',  startup: 'NeuroTech Inc.', programme: 'Bio-Accelerator Q3',      health_score: 92, status: 'active',  last_activity: '2h ago'   },
  { id: '2', mentor: 'Marcus Johnson',  startup: 'LogisAI',        programme: 'Supply Chain Innovators', health_score: 38, status: 'at_risk', last_activity: '4d ago'   },
  { id: '3', mentor: 'Elena Rostova',   startup: 'FinBlock',       programme: 'FinTech Seed 2024',       health_score: 75, status: 'active',  last_activity: '12h ago'  },
  { id: '4', mentor: 'Alex Peterson',   startup: 'GreenGrid',      programme: 'Clean Energy Init.',      health_score: null, status: 'pending', last_activity: 'Just now' },
]

const STATS_META = [
  { key: 'active_links',   label: 'Active Links',   icon: 'link',        iconClass: 'text-on-surface-variant' },
  { key: 'at_risk',        label: 'At Risk',         icon: 'warning',     iconClass: 'text-error' },
  { key: 'programmes',     label: 'Programmes',      icon: 'folder_open', iconClass: 'text-on-surface-variant' },
  { key: 'dna_blueprints', label: 'DNA Blueprints',  icon: 'biotech',     iconClass: 'text-on-surface-variant' },
]

function initials(name) {
  const parts = name.replace(/^Dr\. /, '').split(' ')
  return (parts[0][0] + (parts[parts.length - 1][0] ?? '')).toUpperCase()
}

function HealthBar({ score }) {
  if (score == null) return (
    <div className="flex items-center gap-3">
      <div className="w-[48px] h-1.5 bg-surface-variant rounded-full" />
      <span className="text-body-sm text-outline font-medium">--</span>
    </div>
  )
  const barColor = score >= 70 ? 'bg-primary' : score >= 40 ? 'bg-tertiary' : 'bg-error'
  return (
    <div className="flex items-center gap-3">
      <div className="w-[48px] h-1.5 bg-surface-variant rounded-full overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-body-sm text-on-surface-variant font-medium">{score}</span>
    </div>
  )
}

function StatusBadge({ status }) {
  if (status === 'active') return (
    <span className="inline-flex items-center px-2 py-1 rounded border border-primary/30 text-label-sm text-primary bg-primary/10">
      Active
    </span>
  )
  if (status === 'at_risk') return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-error/30 text-label-sm text-error bg-error/10">
      <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
      At Risk
    </span>
  )
  return (
    <span className="inline-flex items-center px-2 py-1 rounded border border-outline/30 text-label-sm text-outline bg-outline/10">
      Pending Intro
    </span>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(MOCK_STATS)
  const [links, setLinks] = useState(MOCK_LINKS)

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {})
    api.get('/dashboard/links').then(r => setLinks(r.data)).catch(() => {})
  }, [])

  return (
    <div className="bg-background text-on-background flex h-screen overflow-hidden">
      <Sidebar />

      <main className="ml-sidebar-width mt-14 w-full h-[calc(100vh-56px)] overflow-y-auto bg-background p-10">

        {/* Page Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-title-lg font-semibold text-on-surface tracking-tight">System Overview</h2>
            <p className="text-body-md text-on-surface-variant mt-1">Real-time monitoring of all active mentor-startup engagements.</p>
          </div>
          <button className="btn-active bg-primary text-on-primary h-9 px-4 rounded font-title-md hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Link
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {STATS_META.map(({ key, label, icon, iconClass }) => (
            <div key={key} className="bg-surface border border-outline-variant p-5 rounded flex flex-col justify-between h-[104px]">
              <div className="flex justify-between items-start">
                <span className="text-body-sm text-on-surface-variant uppercase tracking-wider">{label}</span>
                <span className={`material-symbols-outlined text-[18px] ${iconClass}`}>{icon}</span>
              </div>
              <div className="text-[32px] leading-none font-bold text-on-surface tracking-tight">
                {stats[key]}
              </div>
            </div>
          ))}
        </div>

        {/* All Links Table */}
        <div className="bg-surface border border-outline-variant rounded overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <h3 className="text-title-md text-on-surface font-medium">All Links</h3>
            <button className="text-body-sm text-primary hover:opacity-80 transition-opacity flex items-center gap-1">
              View Full Archive
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-lowest">
                  {['Mentor', 'Startup', 'Programme', 'Health', 'Status', 'Last Activity', ''].map((h, i) => (
                    <th key={i} className={`px-5 py-3 text-label-caps text-on-surface-variant uppercase tracking-wider ${i === 6 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {links.map(link => (
                  <tr
                    key={link.id}
                    onClick={() => navigate(`/admin/links/${link.id}`)}
                    className={`transition-colors duration-150 group cursor-pointer ${
                      link.status === 'at_risk'
                        ? 'bg-error/[0.03] hover:bg-error/[0.06]'
                        : 'hover:bg-surface-container'
                    }`}
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-label-caps text-on-surface">
                          {initials(link.mentor)}
                        </div>
                        <span className="text-body-md text-on-surface font-medium">{link.mentor}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-body-md text-on-surface-variant">{link.startup}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-body-md text-on-surface-variant">{link.programme}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <HealthBar score={link.health_score} />
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={link.status} />
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-body-sm text-on-surface-variant">{link.last_activity}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <button
                        onClick={e => e.stopPropagation()}
                        className="text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-on-surface transition-all duration-200"
                      >
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Fixed top bar (matches header in design) */}
      <header className="fixed top-0 left-sidebar-width flex justify-between items-center h-14 w-[calc(100%-240px)] px-gutter bg-surface border-b border-outline-variant z-20" style={{ left: '240px' }}>
        <div className="flex items-center w-64 bg-surface-container border border-outline-variant rounded h-8 px-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-2">search</span>
          <input className="bg-transparent border-none outline-none text-body-md text-on-surface placeholder:text-outline w-full p-0 m-0 focus:ring-0" placeholder="Search..." type="text" />
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors p-1.5 rounded relative">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
          </button>
          <button className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors p-1.5 rounded">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <div className="h-8 w-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center ml-2">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
          </div>
        </div>
      </header>
    </div>
  )
}
