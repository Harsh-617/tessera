import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Reveal from '../../components/Reveal'

const C = { green: '#22c55e', amber: '#f59e0b', blue: '#60a5fa', red: '#ef4444' }

const MOCK_ACTORS = {
  ar: {
    initials: 'AR', name: 'Ahmad Razif', role: 'mentor',
    sub: 'VP, Maybank · 14 yrs experience',
    focus: 'Fintech · Fundraising', country: 'Malaysia', links: 1, profile: 'complete',
    bio: 'Former VP at Maybank with 14 years spanning retail banking, venture debt, and fintech partnerships. Led 3 accelerator cohorts as lead mentor. Active angel investor in SEA fintech.',
    expertise: ['Fundraising', 'Fintech regulation', 'Investor relations', 'Term sheet negotiation'],
    stats: [
      { label: 'Active links',    value: '1' },
      { label: 'Total mentored',  value: '4' },
      { label: 'Avg health',      value: '83', color: C.green },
      { label: 'Sessions logged', value: '31' },
    ],
    links: [
      { id: 'link-1', name: 'FundBridge', sub: 'Fintech · Seed', health: 85, status: 'active', programme: 'MaGIC Cohort 6' },
    ],
    past: [
      { name: 'PayNow Pro', programme: 'MaGIC Cohort 5', outcome: 'Raised RM1.2M seed', duration: '6 months' },
    ],
  },
  nh: {
    initials: 'NH', name: 'Nurul Huda', role: 'mentor',
    sub: 'ex-KKM Senior Consultant · 8 yrs experience',
    focus: 'Healthtech · Regulatory', country: 'Malaysia', links: 1, profile: 'complete',
    bio: 'Former senior consultant at Kementerian Kesihatan Malaysia (KKM). Deep expertise in MOH pilot approvals, digital health policy, and clinical trial pathways. Currently advising two healthtech accelerators.',
    expertise: ['MOH pilot approval', 'Healthcare regulation', 'Clinical pathways', 'Ministry stakeholder mapping'],
    stats: [
      { label: 'Active links',    value: '1' },
      { label: 'Total mentored',  value: '3' },
      { label: 'Avg health',      value: '78', color: C.green },
      { label: 'Sessions logged', value: '22' },
    ],
    links: [
      { id: 'link-1', name: 'CareLoop', sub: 'Healthtech · MVP', health: 70, status: 'active', programme: 'Cradle CIP 2026' },
    ],
    past: [
      { name: 'MediTrack', programme: 'MaGIC Cohort 6', outcome: 'MOH pilot approved', duration: '7 months' },
    ],
  },
  cl: {
    initials: 'CL', name: 'CareLoop', role: 'startup',
    sub: 'Healthtech · MVP stage',
    focus: 'Healthtech', country: 'Malaysia', links: 1, profile: 'complete',
    bio: 'Remote patient monitoring platform for chronic-care clinics. Targeting MOH pilot approval for deployment across public health facilities. Currently at MVP with 2 pilot clinic partners.',
    expertise: ['Remote monitoring', 'Chronic care', 'IoT devices', 'Clinical workflow integration'],
    stats: [
      { label: 'Health score',   value: '70', color: C.green },
      { label: 'Milestones',     value: '2/3' },
      { label: 'Programme week', value: '2/26' },
      { label: 'Check-ins',      value: '6' },
    ],
    links: [
      { id: 'link-1', name: 'Nurul Huda', sub: 'Healthtech · Regulatory', health: 70, status: 'active', programme: 'Cradle CIP 2026' },
    ],
    past: [],
  },
}

function hColor(v) {
  const n = parseInt(v)
  if (isNaN(n)) return '#ededee'
  if (n >= 70) return C.green
  if (n >= 40) return C.amber
  return C.red
}

const ROLE_BADGE = {
  mentor:  { bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)',  color: C.blue,    label: 'Mentor'  },
  startup: { bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)',   color: C.green,   label: 'Startup' },
  partner: { bg: 'rgba(255,255,255,0.04)', border: '#232327',               color: '#8a8a92', label: 'Partner' },
}

export default function ActorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cardBg = { background: 'linear-gradient(180deg, #18181c 0%, #131316 100%)' }

  const actor = MOCK_ACTORS[id] ?? {
    initials: id?.slice(0, 2).toUpperCase() ?? '?',
    name: 'Unknown actor', role: 'mentor', sub: '—', focus: '—', country: '—',
    bio: 'No profile data available.', expertise: [], stats: [], links: [], past: [],
  }

  const roleCfg = ROLE_BADGE[actor.role] ?? ROLE_BADGE.partner

  return (
    <div className="min-h-screen" style={{ background: '#0b0b0c', color: '#ededee', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="ds-bg" />
      <div className="ds-grid" />
      <Sidebar />

      <main className="ml-[240px] min-h-screen relative z-10 p-10 pt-12 page-enter">

        {/* Back */}
        <button
          onClick={() => navigate('/admin/actors')}
          className="flex items-center gap-2 text-[13px] text-[#5b5b62] hover:text-[#ededee] transition-colors cursor-pointer bg-transparent border-0 p-0 mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          All actors
        </button>

        {/* Header card */}
        <div className="rounded-2xl border border-[#232327] p-7 mb-6 flex items-start gap-6" style={cardBg}>
          <div className="w-16 h-16 rounded-[18px] flex-shrink-0 flex items-center justify-center font-fraunces text-[22px] text-[#ededee]"
            style={{ background: 'linear-gradient(135deg, #3a3a40, #1d1d21)' }}>
            {actor.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-fraunces font-light text-[28px] leading-none tracking-[-0.02em] text-[#ededee] m-0">{actor.name}</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full tracking-[0.1em] uppercase flex-shrink-0"
                style={{ background: roleCfg.bg, border: `1px solid ${roleCfg.border}`, color: roleCfg.color }}>
                {roleCfg.label}
              </span>
            </div>
            <div className="text-[13.5px] text-[#8a8a92] mb-3">{actor.sub}</div>
            <div className="flex gap-4 text-[12px] text-[#5b5b62]">
              <span>{actor.focus}</span>
              <span>·</span>
              <span>{actor.country}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          {actor.stats.map((s, i) => (
            <div key={i} className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <div className="text-[12px] text-[#5b5b62] tracking-[0.16em] uppercase mb-3">{s.label}</div>
              <div className="font-fraunces font-light text-[36px] leading-none tracking-[-0.03em]"
                style={{ color: s.color ?? '#ededee' }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_340px] gap-6">

          {/* Left col */}
          <div className="flex flex-col gap-6">

            {/* Bio */}
            <Reveal><div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <h2 className="font-fraunces font-normal text-[18px] text-[#ededee] m-0 mb-3" style={{ letterSpacing: '-0.01em' }}>About</h2>
              <p className="text-[14px] text-[#8a8a92] leading-[1.65] m-0">{actor.bio}</p>
            </div></Reveal>

            {/* Active links */}
            {actor.links?.length > 0 && (
              <Reveal delay={80}><div className="rounded-2xl border border-[#232327] overflow-hidden" style={cardBg}>
                <div className="px-6 py-4 border-b border-[#232327]">
                  <h2 className="font-fraunces font-normal text-[18px] text-[#ededee] m-0" style={{ letterSpacing: '-0.01em' }}>Active links</h2>
                </div>
                {actor.links.map((link, i) => {
                  const hc = hColor(link.health)
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors"
                      style={{ borderBottom: i < actor.links.length - 1 ? '1px solid #232327' : 'none' }}
                      onClick={() => navigate(`/admin/links/${link.id}`)}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center font-fraunces text-[13px] text-[#ededee] flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #3a3a40, #1d1d21)' }}>
                        {link.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] text-[#ededee] font-medium">{link.name}</div>
                        <div className="text-[12px] text-[#8a8a92] mt-0.5">{link.sub} · {link.programme}</div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-24 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full" style={{ width: `${link.health}%`, background: hc }} />
                        </div>
                        <span className="text-[12px] font-medium w-6 text-right" style={{ color: hc }}>{link.health}</span>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b5b62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </div>
                  )
                })}
              </div></Reveal>
            )}

            {/* Past */}
            {actor.past?.length > 0 && (
              <Reveal delay={160}><div className="rounded-2xl border border-[#232327] overflow-hidden" style={cardBg}>
                <div className="px-6 py-4 border-b border-[#232327]">
                  <h2 className="font-fraunces font-normal text-[18px] text-[#ededee] m-0" style={{ letterSpacing: '-0.01em' }}>Past links</h2>
                </div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #232327' }}>
                      {['Name', 'Programme', 'Outcome', 'Duration'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] text-[#5b5b62] tracking-[0.12em] uppercase font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {actor.past.map((p, i) => (
                      <tr key={i} style={{ borderBottom: i < actor.past.length - 1 ? '1px solid #232327' : 'none' }}>
                        <td className="px-5 py-3.5 text-[13.5px] text-[#ededee]">{p.name}</td>
                        <td className="px-5 py-3.5 text-[13px] text-[#8a8a92]">{p.programme}</td>
                        <td className="px-5 py-3.5 text-[13px]" style={{ color: C.green }}>✓ {p.outcome}</td>
                        <td className="px-5 py-3.5 text-[13px] text-[#5b5b62]">{p.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div></Reveal>
            )}
          </div>

          {/* Right col */}
          <div className="flex flex-col gap-5">
            <Reveal><div className="rounded-2xl border border-[#232327] p-6" style={cardBg}>
              <h2 className="font-fraunces font-normal text-[18px] text-[#ededee] m-0 mb-4" style={{ letterSpacing: '-0.01em' }}>Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {actor.expertise.map(tag => (
                  <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full border border-[#232327] text-[#8a8a92]"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div></Reveal>
          </div>

        </div>
      </main>
    </div>
  )
}
