import { useState } from 'react'

export default function MultiSelectChip({ label, options, value = [], onChange }) {
  const [input, setInput] = useState('')

  const toggle = (opt) => {
    if (value.includes(opt)) {
      onChange(value.filter(v => v !== opt))
    } else {
      onChange([...value, opt])
    }
  }

  const addCustom = () => {
    const trimmed = input.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput('')
  }

  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#374151' }}>{label}</label>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {options.map(opt => (
          <button
            key={opt} type="button"
            onClick={() => toggle(opt)}
            style={{
              padding: '4px 12px', borderRadius: 9999, fontSize: 13, cursor: 'pointer',
              border: value.includes(opt) ? '2px solid #6366f1' : '2px solid #e5e7eb',
              background: value.includes(opt) ? '#eff6ff' : '#fff',
              color: value.includes(opt) ? '#6366f1' : '#374151',
              fontWeight: value.includes(opt) ? 600 : 400,
            }}
          >
            {opt}
          </button>
        ))}
        {value.filter(v => !options.includes(v)).map(v => (
          <button
            key={v} type="button"
            onClick={() => toggle(v)}
            style={{
              padding: '4px 12px', borderRadius: 9999, fontSize: 13, cursor: 'pointer',
              border: '2px solid #6366f1', background: '#eff6ff', color: '#6366f1', fontWeight: 600,
            }}
          >
            {v} ×
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          placeholder="Add custom…"
          style={{
            flex: 1, padding: '6px 10px', borderRadius: 8, fontSize: 13,
            border: '1px solid #d1d5db', outline: 'none',
          }}
        />
        <button type="button" onClick={addCustom} style={{
          padding: '6px 14px', borderRadius: 8, background: '#6366f1',
          color: '#fff', border: 'none', fontSize: 13, cursor: 'pointer',
        }}>Add</button>
      </div>
    </div>
  )
}
