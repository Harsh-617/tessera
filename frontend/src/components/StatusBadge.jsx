const CONFIG = {
  proposed:  { label: 'Proposed',  bg: '#eff6ff', color: '#3b82f6', pulse: false },
  active:    { label: 'Active',    bg: '#f0fdf4', color: '#22c55e', pulse: false },
  at_risk:   { label: 'At Risk',   bg: '#fef2f2', color: '#ef4444', pulse: true  },
  completed: { label: 'Completed', bg: '#f9fafb', color: '#6b7280', pulse: false },
  failed:    { label: 'Failed',    bg: '#fff7ed', color: '#f97316', pulse: false },
}

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] ?? { label: status, bg: '#f3f4f6', color: '#374151', pulse: false }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 9999,
      background: cfg.bg, color: cfg.color,
      fontSize: 12, fontWeight: 600,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: cfg.color,
        animation: cfg.pulse ? 'pulse 1.5s infinite' : 'none',
      }} />
      {cfg.label}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </span>
  )
}
