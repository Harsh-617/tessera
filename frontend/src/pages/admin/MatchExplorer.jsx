import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import ActorCard from '../../components/ActorCard'
import ScoreBar from '../../components/ScoreBar'
import { generateMatches, approveMatch } from '../../services/matching.service'

const MOCK = [
  {
    startup: { full_name: 'PayNow Pro', company_name: 'PayNow Pro', industry: 'Fintech', stage: 'seed', country: 'Malaysia', description: 'Embedded payments for SMEs.' },
    suggestions: [
      {
        mentor_id: 'm1',
        mentor: { full_name: 'Ahmad Razif', job_title: 'VP', current_company: 'Maybank', industry: ['Fintech'], expertise_areas: ['Fundraising', 'Investor Relations'], country: 'Malaysia' },
        embedding_score: 0.91, dna_score: 0.88, combined_score: 0.90,
        reasoning: 'Ahmad\'s deep fintech expertise at Maybank directly aligns with PayNow Pro\'s SME payments focus. A past blueprint shows his investor network accelerated a similar startup\'s pre-seed round by 3 months.',
      },
      {
        mentor_id: 'm2',
        mentor: { full_name: 'David Lim', job_title: '2x Founder', current_company: 'Independent', industry: ['E-commerce'], expertise_areas: ['Fundraising', 'Scaling'], country: 'Malaysia' },
        embedding_score: 0.74, dna_score: 0.65, combined_score: 0.70,
        reasoning: 'David\'s fundraising success as a repeat founder provides strong general-purpose mentoring value, though his primary domain is e-commerce rather than fintech.',
      },
      {
        mentor_id: 'm3',
        mentor: { full_name: 'Priya Nair', job_title: 'Head of Product', current_company: 'Grab', industry: ['SaaS'], expertise_areas: ['Product Strategy', 'Go-to-market'], country: 'Malaysia' },
        embedding_score: 0.68, dna_score: 0.60, combined_score: 0.65,
        reasoning: 'Priya\'s product and GTM expertise at Grab offers strong growth guidance once PayNow Pro achieves initial traction, with secondary relevance to fintech payments.',
      },
    ],
  },
]

export default function MatchExplorer() {
  const { programmeId } = useParams()
  const navigate = useNavigate()
  const [results, setResults] = useState(MOCK)
  const [current, setCurrent] = useState(0)
  const [approving, setApproving] = useState(null)
  const [loading, setLoading] = useState(false)

  const runMatches = async () => {
    setLoading(true)
    try {
      const data = await generateMatches(programmeId)
      if (data?.length) setResults(data)
    } catch {
      // keep mock data
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (programmeId && programmeId !== 'demo') runMatches()
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Match Explorer</h1>
            <div style={{ fontSize: 14, color: '#6b7280' }}>
              Startup {current + 1} of {results.length} — review AI suggestions and approve
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
              style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', opacity: current === 0 ? 0.4 : 1 }}
            >← Prev</button>
            <button
              onClick={() => setCurrent(c => Math.min(results.length - 1, c + 1))} disabled={current === results.length - 1}
              style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', opacity: current === results.length - 1 ? 0.4 : 1 }}
            >Next →</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 28 }}>
          {/* Left — startup */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Startup</div>
            <ActorCard actor={row.startup} role="startup" />
          </div>

          {/* Right — suggestions */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Top Mentor Suggestions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {row.suggestions.map((s, i) => (
                <div
                  key={s.mentor_id}
                  style={{
                    background: '#fff', borderRadius: 14, padding: 24,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    border: i === 0 ? '2px solid #6366f1' : '1px solid #e5e7eb',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <ActorCard actor={s.mentor} role="mentor" compact />
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                      <div style={{
                        fontSize: 28, fontWeight: 800,
                        color: s.combined_score >= 0.8 ? '#22c55e' : s.combined_score >= 0.6 ? '#f59e0b' : '#ef4444',
                      }}>
                        {Math.round(s.combined_score * 100)}%
                      </div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>combined</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <ScoreBar
                      embeddingScore={s.embedding_score}
                      dnaScore={s.dna_score}
                      combinedScore={s.combined_score}
                    />
                  </div>

                  <div style={{
                    background: '#eff6ff', borderLeft: '3px solid #6366f1',
                    borderRadius: '0 8px 8px 0', padding: '12px 16px',
                    fontSize: 13, color: '#1e40af', lineHeight: 1.6, marginBottom: 16,
                    fontStyle: 'italic',
                  }}>
                    "{s.reasoning}"
                  </div>

                  <button
                    onClick={() => handleApprove(s.mentor_id, s)}
                    disabled={approving === s.mentor_id}
                    style={{
                      width: '100%', padding: '10px 0', borderRadius: 8,
                      background: i === 0 ? '#6366f1' : '#fff',
                      color: i === 0 ? '#fff' : '#6366f1',
                      border: i === 0 ? 'none' : '2px solid #6366f1',
                      fontWeight: 600, fontSize: 14, cursor: 'pointer',
                      opacity: approving ? 0.7 : 1,
                    }}
                  >
                    {approving === s.mentor_id ? 'Approving…' : 'Approve Match'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
