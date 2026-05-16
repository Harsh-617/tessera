import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Reveal from '../../components/Reveal'

const C = { blue: '#60a5fa', green: '#22c55e', amber: '#f59e0b' }

const MOCK_BLUEPRINTS = {
  'DNA-7f2a': {
    id: 'DNA-7f2a', confidence: 0.91,
    tags: [{ label: 'fintech', geo: false }, { label: 'accelerator', geo: false }, { label: 'Malaysia', geo: true }],
    industry: 'fintech', programmeType: 'accelerator', geography: 'Malaysia',
    summary: 'Fintech mentors with 10+ years in banking and active investor networks consistently unlock seed-stage funding within 6 months. The pattern holds across both B2B and consumer fintech.',
    detail: 'This blueprint was extracted from three high-performing pairs across MaGIC Cohort 5 and 6. The common thread is mentor credibility inside the investor community — not just domain knowledge. Startups in this pattern received warm introductions to lead investors within the first 8 weeks, dramatically compressing the fundraising timeline.',
    signals: [
      { label: 'Mentor has active deal flow', weight: 'High' },
      { label: 'Mentor has 10+ yrs in sector', weight: 'High' },
      { label: 'Startup is at seed stage', weight: 'Medium' },
      { label: 'Programme type is accelerator', weight: 'Medium' },
      { label: 'Geography: Malaysia or SEA', weight: 'Low' },
    ],
    stats: { checkins: 12, avgSession: '75m', duration: '8mo' },
    source: 'MaGIC Cohort 6', pair: 'Ahmad Razif × FundBridge', outcome: 'Raised RM600k pre-seed',
    appliedTo: [
      { pair: 'Ahmad Razif × FundBridge', programme: 'MaGIC Cohort 6', result: 'Raised RM600k pre-seed' },
      { pair: 'Wei Lin × CrossPay', programme: 'SG Fintech Bridge 2025', result: 'MAS sandbox approved' },
    ],
  },
  'DNA-3e91': {
    id: 'DNA-3e91', confidence: 0.88,
    tags: [{ label: 'healthtech', geo: false }, { label: 'accelerator', geo: false }, { label: 'Malaysia', geo: true }],
    industry: 'healthtech', programmeType: 'accelerator', geography: 'Malaysia',
    summary: 'Healthtech founders paired with regulatory-experienced mentors achieve pilot approval roughly 2× faster than peers. Early stakeholder mapping at the ministry is the dominant signal.',
    detail: 'Analysis of 4 healthtech pairs across MaGIC Cohort 5 and 6 revealed that regulatory outcome speed is almost entirely determined by whether the mentor has direct ministry contacts and knows the internal approval workflow. Technical product quality had almost no correlation with approval speed.',
    signals: [
      { label: 'Mentor has direct MOH contacts', weight: 'High' },
      { label: 'Mentor has regulatory approval experience', weight: 'High' },
      { label: 'Startup targeting public health facilities', weight: 'High' },
      { label: 'Early stakeholder mapping (<8 weeks)', weight: 'Medium' },
      { label: 'Programme type is accelerator', weight: 'Low' },
    ],
    stats: { checkins: 11, avgSession: '90m', duration: '7mo' },
    source: 'MaGIC Cohort 6', pair: 'Nurul Huda × MediTrack', outcome: 'MOH pilot approved',
    appliedTo: [
      { pair: 'Nurul Huda × MediTrack', programme: 'MaGIC Cohort 6', result: 'MOH pilot approved' },
      { pair: 'Nurul Huda × CareLoop', programme: 'Cradle CIP 2026', result: 'In progress' },
    ],
  },
  'DNA-c1d8': {
    id: 'DNA-c1d8', confidence: 0.84,
    tags: [{ label: 'saas', geo: false }, { label: 'accelerator', geo: false }, { label: 'Malaysia', geo: true }],
    industry: 'saas', programmeType: 'accelerator', geography: 'Malaysia',
    summary: 'SaaS GTM frameworks transfer cleanly when mentor and startup share a target persona. Misalignment on ICP — even with strong mentor seniority — predicts cohort under-performance.',
    detail: 'Three SaaS pairs were studied. The two that succeeded had mentors who had personally sold to the same buyer profile the startup was targeting. The one that underperformed had a highly senior mentor whose experience was in enterprise sales while the startup was targeting SMBs — despite strong individual fit scores.',
    signals: [
      { label: 'Mentor sold to same buyer persona', weight: 'High' },
      { label: 'ICP alignment confirmed at intake', weight: 'High' },
      { label: 'Startup is pre-revenue or early revenue', weight: 'Medium' },
      { label: 'Mentor has GTM playbook for segment', weight: 'Medium' },
    ],
    stats: { checkins: 9, avgSession: '60m', duration: '5mo' },
    source: 'MaGIC Cohort 6', pair: 'Priya Nair × DeskOps', outcome: '3 enterprise clients signed',
    appliedTo: [
      { pair: 'Priya Nair × DeskOps', programme: 'MaGIC Cohort 6', result: '3 enterprise clients signed' },
    ],
  },
  'DNA-92ab': {
    id: 'DNA-92ab', confidence: 0.79,
    tags: [{ label: 'fintech', geo: false }, { label: 'mentorship', geo: false }, { label: 'Singapore', geo: true }],
    industry: 'fintech', programmeType: 'mentorship', geography: 'Singapore',
    summary: 'Cross-border fintech pairings work when the mentor has direct compliance experience in the target market. Generic seniority does not transfer across regulatory regimes.',
    detail: 'Cross-border pairs underperform by default unless the mentor has operated directly in the target regulatory environment. A mentor with 15 years of Malaysian fintech experience added zero value to a startup pursuing MAS sandbox approval. The pattern is sharp: market-specific compliance knowledge, not general fintech seniority, is the predictor.',
    signals: [
      { label: 'Mentor has operated in target market', weight: 'High' },
      { label: 'Mentor has compliance credentials in target jurisdiction', weight: 'High' },
      { label: 'Startup is pursuing cross-border expansion', weight: 'High' },
    ],
    stats: { checkins: 14, avgSession: '55m', duration: '9mo' },
    source: 'SG Fintech Bridge 2025', pair: 'Wei Lin × CrossPay', outcome: 'MAS sandbox approved',
    appliedTo: [
      { pair: 'Wei Lin × CrossPay', programme: 'SG Fintech Bridge 2025', result: 'MAS sandbox approved' },
    ],
  },
  'DNA-5f0c': {
    id: 'DNA-5f0c', confidence: 0.76,
    tags: [{ label: 'deeptech', geo: false }, { label: 'grant', geo: false }, { label: 'Malaysia', geo: true }],
    industry: 'deeptech', programmeType: 'grant', geography: 'Malaysia',
    summary: 'Deeptech founders benefit most when mentors actively reshape the technical narrative for grant reviewers. Engineering depth alone — without translation skill — correlates with grant rejection.',
    detail: 'Grant reviewers at Cradle and MOSTI are non-technical. Deeptech founders who lead with technical depth consistently fail at the narrative stage. Mentors who succeeded in this pattern had specific experience writing or evaluating grants — they knew how to reframe engineering achievements as economic impact.',
    signals: [
      { label: 'Mentor has grant writing or evaluation experience', weight: 'High' },
      { label: 'Mentor can translate technical work to impact narrative', weight: 'High' },
      { label: 'Startup has strong IP or novel research', weight: 'Medium' },
      { label: 'Programme is grant or R&D track', weight: 'Medium' },
    ],
    stats: { checkins: 8, avgSession: '80m', duration: '6mo' },
    source: 'Cradle Deeptech 2024', pair: 'Dr. Faizal × NeuroGrid', outcome: 'RM250k grant secured',
    appliedTo: [
      { pair: 'Dr. Faizal × NeuroGrid', programme: 'Cradle Deeptech 2024', result: 'RM250k grant secured' },
    ],
  },
  'DNA-b403': {
    id: 'DNA-b403', confidence: 0.72,
    tags: [{ label: 'e-commerce', geo: false }, { label: 'incubator', geo: false }, { label: 'Indonesia', geo: true }],
    industry: 'e-commerce', programmeType: 'incubator', geography: 'Indonesia',
    summary: 'For marketplace startups, mentor utility peaks during the supply-side cold start. Pairings introduced after liquidity is achieved deliver materially lower outcomes.',
    detail: 'Timing of the mentor pairing matters as much as the mentor quality for marketplace models. The supply-side cold start is the hardest problem — once a marketplace achieves liquidity, growth becomes more systematic. Mentors introduced post-liquidity reported feeling underutilised and pairs showed lower check-in frequency and health scores.',
    signals: [
      { label: 'Startup is at cold-start / pre-liquidity phase', weight: 'High' },
      { label: 'Mentor has marketplace supply-side experience', weight: 'High' },
      { label: 'Pairing happens within first 4 weeks', weight: 'Medium' },
    ],
    stats: { checkins: 10, avgSession: '65m', duration: '7mo' },
    source: 'BEKUP 2024', pair: 'Rina P. × TaniSwap', outcome: '4× GMV growth',
    appliedTo: [
      { pair: 'Rina P. × TaniSwap', programme: 'BEKUP 2024', result: '4× GMV growth' },
    ],
  },
}

const WEIGHT_COLOR = { High: C.blue, Medium: C.amber, Low: '#5b5b62' }

export default function DnaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cardBg = { background: 'linear-gradient(180deg, #18181c 0%, #131316 100%)' }

  const bp = MOCK_BLUEPRINTS[id] ?? null

  if (!bp) {
    return (
      <div className="min-h-screen" style={{ background: '#0b0b0c', color: '#ededee', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="ds-bg" /><div className="ds-grid" /><Sidebar />
        <main className="ml-[240px] min-h-screen relative z-10 p-10 pt-12 flex items-center justify-center">
          <div className="text-center">
            <div className="font-fraunces font-light text-[28px] text-[#ededee] mb-2">Blueprint not found</div>
            <button onClick={() => navigate('/admin/dna')} className="text-[13px] text-[#5b5b62] hover:text-[#ededee] transition-colors cursor-pointer bg-transparent border-0">
              ← Back to DNA Library
            </button>
          </div>
        </main>
      </div>
    )
  }

  const confidencePct = Math.round(bp.confidence * 100)

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0c', color: '#ededee', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="ds-bg" />
      <div className="ds-grid" />
      <Sidebar />

      <main className="ml-[240px] min-h-screen relative z-10 p-10 pt-12 page-enter">

        {/* Back */}
        <button
          onClick={() => navigate('/admin/dna')}
          className="flex items-center gap-2 text-[13px] text-[#5b5b62] hover:text-[#ededee] transition-colors cursor-pointer bg-transparent border-0 p-0 mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          DNA Library
        </button>

        {/* Header */}
        <div className="rounded-2xl border border-[#232327] p-7 mb-6 relative overflow-hidden" style={cardBg}>
          <div className="absolute top-0 right-0 w-[200px] h-[200px] pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.10), transparent 70%)' }} />

          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex gap-1.5 flex-wrap">
              {bp.tags.map(t => (
                <span key={t.label} className="text-[10px] px-2 py-0.5 rounded-full border tracking-[0.08em] uppercase"
                  style={t.geo
                    ? { background: 'rgba(255,255,255,0.04)', borderColor: '#232327', color: '#8a8a92' }
                    : { background: 'rgba(96,165,250,0.08)', borderColor: 'rgba(96,165,250,0.2)', color: C.blue }
                  }>
                  {t.label}
                </span>
              ))}
            </div>
            <span className="text-[11px] text-[#5b5b62] font-mono flex-shrink-0">{bp.id}</span>
          </div>

          <p className="font-fraunces font-normal text-[22px] leading-[1.4] tracking-[-0.01em] text-[#ededee] m-0 mb-5 max-w-[680px]">
            {bp.summary}
          </p>

          <div className="flex items-center gap-6">
            <div>
              <div className="text-[10px] text-[#5b5b62] tracking-[0.2em] uppercase mb-1">Confidence</div>
              <div className="flex items-center gap-2.5">
                <div className="w-32 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${confidencePct}%`, background: C.blue }} />
                </div>
                <span className="font-fraunces font-normal text-[20px] leading-none" style={{ color: C.blue }}>
                  {confidencePct}%
                </span>
              </div>
            </div>
            <div className="w-px h-8 bg-[#232327]" />
            {[
              { k: 'Check-ins', v: bp.stats.checkins },
              { k: 'Avg session', v: bp.stats.avgSession },
              { k: 'Duration', v: bp.stats.duration },
            ].map(s => (
              <div key={s.k}>
                <div className="text-[10px] text-[#5b5b62] tracking-[0.2em] uppercase mb-1">{s.k}</div>
                <div className="font-fraunces font-normal text-[20px] leading-none text-[#ededee]">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-6">

          {/* Left */}
          <div className="flex flex-col gap-6">

            {/* Full analysis */}
            <Reveal><div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <h2 className="font-fraunces font-normal text-[18px] text-[#ededee] m-0 mb-3" style={{ letterSpacing: '-0.01em' }}>Pattern analysis</h2>
              <p className="text-[14px] text-[#8a8a92] leading-[1.7] m-0">{bp.detail}</p>
            </div></Reveal>

            {/* Applied to */}
            <Reveal delay={80}><div className="rounded-2xl border border-[#232327] overflow-hidden" style={cardBg}>
              <div className="px-6 py-4 border-b border-[#232327]">
                <h2 className="font-fraunces font-normal text-[18px] text-[#ededee] m-0" style={{ letterSpacing: '-0.01em' }}>Applied to</h2>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ borderBottom: '1px solid #232327' }}>
                    {['Pair', 'Programme', 'Result'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] text-[#5b5b62] tracking-[0.12em] uppercase font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bp.appliedTo.map((a, i) => (
                    <tr key={i} style={{ borderBottom: i < bp.appliedTo.length - 1 ? '1px solid #232327' : 'none' }}>
                      <td className="px-5 py-3.5 text-[13.5px] text-[#ededee]">{a.pair}</td>
                      <td className="px-5 py-3.5 text-[13px] text-[#8a8a92]">{a.programme}</td>
                      <td className="px-5 py-3.5 text-[13px]" style={{ color: a.result === 'In progress' ? C.amber : C.green }}>
                        {a.result === 'In progress' ? '◎' : '✓'} {a.result}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div></Reveal>

          </div>

          {/* Right */}
          <div className="flex flex-col gap-5">

            {/* Signals */}
            <Reveal><div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <h2 className="font-fraunces font-normal text-[18px] text-[#ededee] m-0 mb-4" style={{ letterSpacing: '-0.01em' }}>Pattern signals</h2>
              <div className="flex flex-col gap-3">
                {bp.signals.map((s, i) => (
                  <div key={i} className="flex items-start justify-between gap-3">
                    <span className="text-[13px] text-[#8a8a92] leading-[1.5]">{s.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 tracking-[0.08em] uppercase"
                      style={{
                        color: WEIGHT_COLOR[s.weight],
                        borderColor: WEIGHT_COLOR[s.weight] + '40',
                        background: WEIGHT_COLOR[s.weight] + '12',
                      }}>
                      {s.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div></Reveal>

            {/* Source */}
            <Reveal delay={80}><div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <h2 className="font-fraunces font-normal text-[18px] text-[#ededee] m-0 mb-4" style={{ letterSpacing: '-0.01em' }}>Source</h2>
              <div className="flex flex-col gap-3 text-[13px]">
                <div>
                  <div className="text-[10px] text-[#5b5b62] tracking-[0.2em] uppercase mb-1">Programme</div>
                  <div className="text-[#ededee]">{bp.source}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#5b5b62] tracking-[0.2em] uppercase mb-1">Founding pair</div>
                  <div className="text-[#ededee]">{bp.pair}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#5b5b62] tracking-[0.2em] uppercase mb-1">Outcome</div>
                  <div style={{ color: C.green }}>✓ {bp.outcome}</div>
                </div>
              </div>
            </div></Reveal>

          </div>
        </div>
      </main>
    </div>
  )
}
