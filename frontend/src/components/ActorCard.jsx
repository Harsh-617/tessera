// compact=true → small card (used in match lists). compact=false → full card.
export default function ActorCard({ actor, role, compact = false }) {
  if (!actor) return null

  const initials = (actor.full_name || actor.company_name || '?')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: '#6366f1', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 13, flexShrink: 0,
        }}>{initials}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>
            {actor.full_name || actor.company_name}
          </div>
          {actor.job_title && (
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              {actor.job_title} · {actor.current_company}
            </div>
          )}
          {actor.industry && (
            <div style={{ fontSize: 12, color: '#6b7280' }}>{actor.industry}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      border: '1px solid #e5e7eb', borderRadius: 12, padding: 20,
      background: '#fff',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: role === 'mentor' ? '#6366f1' : '#0ea5e9',
          color: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontWeight: 700, fontSize: 18,
        }}>{initials}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>
            {actor.full_name || actor.company_name}
          </div>
          {actor.job_title && (
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              {actor.job_title} at {actor.current_company}
            </div>
          )}
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
            {role?.toUpperCase()} · {actor.country}
          </div>
        </div>
      </div>

      {actor.bio || actor.description ? (
        <p style={{ fontSize: 13, color: '#374151', marginBottom: 12, lineHeight: 1.5 }}>
          {(actor.bio || actor.description)?.slice(0, 160)}…
        </p>
      ) : null}

      {actor.industry && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(Array.isArray(actor.industry) ? actor.industry : [actor.industry]).map(tag => (
            <span key={tag} style={{
              padding: '2px 8px', borderRadius: 9999,
              background: '#f3f4f6', fontSize: 11, color: '#374151',
            }}>{tag}</span>
          ))}
          {actor.expertise_areas?.map(tag => (
            <span key={tag} style={{
              padding: '2px 8px', borderRadius: 9999,
              background: '#eff6ff', fontSize: 11, color: '#3b82f6',
            }}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}
