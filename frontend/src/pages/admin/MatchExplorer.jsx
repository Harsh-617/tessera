import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { generateMatches, approveMatch } from '../../services/matching.service'

const MOCK = [
  {
    startup_id: 's1',
    startup: {
      company_name: 'PayNow Pro',
      icon: 'payments',
      industry: 'Fintech',
      stage: 'Seed',
      description: 'AI-powered SME payment orchestration. Consolidating fragmented payment gateways into a single API for Southeast Asian merchants.',
      challenges: [
        { text: 'Navigating Bank Negara Malaysia regulatory compliance.', level: 'error' },
        { text: 'Scaling B2B merchant acquisition effectively.', level: 'tertiary' },
      ],
    },
    suggestions: [
      {
        mentor_id: 'm1',
        mentor: { full_name: 'Ahmad Razif', job_title: 'VP of Digital Innovation', current_company: 'Maybank' },
        embedding_score: 0.94, dna_score: 0.88, combined_score: 0.92,
        reasoning: "Ahmad's deep experience in Malaysian banking regulations directly matches PayNow's regulatory bottleneck pattern identified in DNA-42. His recent work on Open API frameworks aligns perfectly with their orchestration model.",
        isBest: true,
      },
      {
        mentor_id: 'm2',
        mentor: { full_name: 'Sarah Chen', job_title: 'Ex-Stripe, Founder of PayFlow', current_company: '' },
        embedding_score: 0.86, dna_score: 0.82, combined_score: 0.84,
        reasoning: 'Strong technical fit, but lacks direct local regulatory network.',
        isBest: false,
      },
      {
        mentor_id: 'm3',
        mentor: { full_name: 'James Loh', job_title: 'Partner', current_company: 'FinTech Ventures' },
        embedding_score: 0.78, dna_score: 0.74, combined_score: 0.76,
        reasoning: 'Good stage fit, primarily focused on B2C models.',
        isBest: false,
      },
    ],
  },
]

function initials(name) {
  return (name ?? '?').split(' ').map(w => w[0]).slice(0, 2).join('')
}

export default function MatchExplorer() {
  const { programmeId } = useParams()
  const navigate = useNavigate()
  const [results, setResults] = useState(MOCK)
  const [current, setCurrent] = useState(0)
  const [approving, setApproving] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (programmeId && programmeId !== 'demo') {
      generateMatches(programmeId).then(d => { if (d?.length) setResults(d) }).catch(() => {})
    }
  }, [programmeId])

  const row = results[current]
  if (!row) return null

  const handleApprove = async (mentorId, suggestion) => {
    setApproving(mentorId)
    try {
      await approveMatch(programmeId, { startup_id: row.startup_id, mentor_id: mentorId, ...suggestion })
      if (current < results.length - 1) setCurrent(c => c + 1)
      else navigate('/admin/dashboard')
    } catch (err) {
      console.error(err)
    } finally {
      setApproving(null)
    }
  }

  const progressPct = Math.round(((current + 1) / results.length) * 100)

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-background">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-sidebar-width h-screen">

        {/* Top App Bar */}
        <header className="flex justify-between items-center h-14 w-full px-gutter bg-surface border-b border-outline-variant z-40 shrink-0 sticky top-0">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-surface-container border border-outline-variant text-on-surface text-body-sm pl-10 pr-4 py-1.5 rounded focus:border-primary focus:outline-none w-64 transition-colors"
              placeholder="Search matches..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-on-surface transition-colors p-1">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="text-on-surface-variant hover:text-on-surface transition-colors p-1">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
            <div className="h-8 w-8 rounded-full border border-outline-variant bg-surface-container-high flex items-center justify-center ml-2">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
            </div>
          </div>
        </header>

        {/* Canvas */}
        <main className="flex-1 overflow-y-auto p-container-padding">

          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-title-lg text-on-surface">Match Explorer</h2>
              <p className="text-body-sm text-on-surface-variant mt-1">Reviewing potential mentors for current batch.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrent(c => Math.max(0, c - 1))}
                disabled={current === 0}
                className="bg-surface-container border border-outline-variant text-on-surface px-4 py-2 rounded text-body-sm hover:bg-surface-container-high transition-colors disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrent(c => Math.min(results.length - 1, c + 1))}
                disabled={current === results.length - 1}
                className="bg-surface-container border border-outline-variant text-on-surface px-4 py-2 rounded text-body-sm hover:bg-surface-container-high transition-colors disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-gutter h-[calc(100vh-180px)]">

            {/* Left — Startup Panel */}
            <div className="col-span-4 flex flex-col">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-label-caps text-on-surface-variant">
                    STARTUP {current + 1} OF {results.length}
                  </span>
                  <div className="w-1/3 bg-surface-container h-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded bg-surface-container flex items-center justify-center border border-outline-variant shrink-0">
                    <span className="material-symbols-outlined text-[32px] text-primary">
                      {row.startup.icon ?? 'business'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-title-lg text-on-surface leading-tight">{row.startup.company_name}</h3>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="border border-outline-variant bg-surface-container px-2 py-0.5 rounded text-label-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">account_balance</span>
                        {row.startup.industry}
                      </span>
                      <span className="border border-outline-variant bg-surface-container px-2 py-0.5 rounded text-label-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">eco</span>
                        {row.startup.stage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-label-caps text-on-surface-variant mb-2">Description</h4>
                    <p className="text-body-md text-on-surface">{row.startup.description}</p>
                  </div>
                  {row.startup.challenges?.length > 0 && (
                    <div className="pt-4 border-t border-outline-variant">
                      <h4 className="text-label-caps text-on-surface-variant mb-2">Key Challenges</h4>
                      <ul className="space-y-2">
                        {row.startup.challenges.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-body-sm text-on-surface">
                            <span className={`material-symbols-outlined text-[16px] mt-0.5 ${c.level === 'error' ? 'text-error' : 'text-tertiary'}`}>
                              warning
                            </span>
                            {c.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right — Mentor Cards */}
            <div className="col-span-8 flex flex-col gap-4 overflow-y-auto pr-2">
              {row.suggestions.map((s) => {
                const pct = n => `${Math.round(n * 100)}%`
                const score = Math.round(s.combined_score * 100)
                const ini = initials(s.mentor.full_name)

                if (s.isBest) return (
                  <div key={s.mentor_id} className="bg-surface-container-lowest border border-primary rounded-lg p-5 relative">
                    {/* Best Match badge */}
                    <div className="absolute top-0 right-0 bg-primary/10 border-b border-l border-primary px-3 py-1 rounded-bl-lg">
                      <span className="text-label-caps text-primary tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        BEST MATCH
                      </span>
                    </div>

                    <div className="flex justify-between items-start mb-6 pt-2">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center shrink-0">
                          <span className="text-title-md font-bold text-primary">{ini}</span>
                        </div>
                        <div>
                          <h3 className="text-title-md text-on-surface font-semibold">{s.mentor.full_name}</h3>
                          <p className="text-body-sm text-on-surface-variant">
                            {s.mentor.job_title}{s.mentor.current_company ? `, ${s.mentor.current_company}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[32px] leading-none font-black text-primary mb-1">{score}</div>
                        <span className="text-label-caps text-on-surface-variant">COMBINED SCORE</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-6">
                      <div>
                        <div className="flex justify-between text-body-sm mb-1">
                          <span className="text-on-surface-variant">Embedding Score</span>
                          <span className="text-on-surface">{pct(s.embedding_score)}</span>
                        </div>
                        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full transition-all duration-700" style={{ width: pct(s.embedding_score) }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-body-sm mb-1">
                          <span className="text-on-surface-variant">DNA Score</span>
                          <span className="text-on-surface">{pct(s.dna_score)}</span>
                        </div>
                        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary opacity-70 h-full transition-all duration-700" style={{ width: pct(s.dna_score) }} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface-container border-l-2 border-primary p-4 rounded-r mb-6">
                      <p className="text-body-sm text-on-surface italic flex items-start gap-2">
                        <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">auto_awesome</span>
                        "{s.reasoning}"
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleApprove(s.mentor_id, s)}
                        disabled={!!approving}
                        className="btn-active bg-primary text-on-primary px-6 py-2 rounded text-body-md font-title-md hover:opacity-90 transition-opacity flex items-center gap-2 h-9 disabled:opacity-60"
                      >
                        {approving === s.mentor_id ? 'Approving…' : 'Approve Match'}
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )

                return (
                  <div key={s.mentor_id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 opacity-90 hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-on-surface-variant font-bold shrink-0">
                          {ini}
                        </div>
                        <div>
                          <h3 className="text-title-md text-on-surface font-semibold">{s.mentor.full_name}</h3>
                          <p className="text-body-sm text-on-surface-variant">
                            {s.mentor.job_title}{s.mentor.current_company ? `, ${s.mentor.current_company}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-[24px] leading-none font-bold text-on-surface">{score}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-4">
                      <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                        <div className="bg-secondary h-full" style={{ width: pct(s.embedding_score) }} />
                      </div>
                      <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                        <div className="bg-secondary opacity-70 h-full" style={{ width: pct(s.dna_score) }} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-body-sm text-on-surface-variant truncate w-2/3">{s.reasoning}</p>
                      <button
                        onClick={() => handleApprove(s.mentor_id, s)}
                        disabled={!!approving}
                        className="btn-active bg-surface-container border border-outline-variant text-on-surface px-4 py-1.5 rounded text-body-sm hover:bg-surface-container-high transition-colors disabled:opacity-60"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
