// Shows embedding score and DNA score as two labelled bars
export default function ScoreBar({ embeddingScore = 0, dnaScore = 0, combinedScore = 0 }) {
  const pct = (v) => `${Math.round(v * 100)}%`

  return (
    <div style={{ fontSize: 13 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: '#6b7280' }}>Combined</span>
        <span style={{ fontWeight: 700, color: '#6366f1' }}>{pct(combinedScore)}</span>
      </div>
      <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, marginBottom: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct(combinedScore), background: '#6366f1', borderRadius: 4, transition: 'width 0.4s' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: '#6b7280' }}>Embedding (60%)</span>
        <span style={{ fontWeight: 600, color: '#0ea5e9' }}>{pct(embeddingScore)}</span>
      </div>
      <div style={{ height: 6, background: '#e5e7eb', borderRadius: 4, marginBottom: 8, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct(embeddingScore), background: '#0ea5e9', borderRadius: 4 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: '#6b7280' }}>DNA (40%)</span>
        <span style={{ fontWeight: 600, color: '#22c55e' }}>{pct(dnaScore)}</span>
      </div>
      <div style={{ height: 6, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct(dnaScore), background: '#22c55e', borderRadius: 4 }} />
      </div>
    </div>
  )
}
