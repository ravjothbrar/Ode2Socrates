import React from 'react'
import { useStore } from '../../store/useStore'

const ACCENTS = [
  {
    id: 'purple',
    label: 'Socratic Purple',
    desc: 'Classic deep violet — the default.',
    swatch: 'linear-gradient(135deg, #4c1d95, #7c3aed, #a78bfa)',
    border: '#7c3aed',
  },
  {
    id: 'blue',
    label: 'TRON Blue',
    desc: 'Electric blue inspired by TRON Legacy.',
    swatch: 'linear-gradient(135deg, #003D5C, #00BFFF, #40D4FF)',
    border: '#00BFFF',
  },
  {
    id: 'pink',
    label: 'Wormhole Pink',
    desc: 'Vibrant magenta — like the wormhole portal.',
    swatch: 'linear-gradient(135deg, #831843, #ec4899, #f472b6)',
    border: '#ec4899',
  },
  {
    id: 'gold',
    label: 'Philosopher\'s Gold',
    desc: 'Warm amber — the colour of ancient wisdom.',
    swatch: 'linear-gradient(135deg, #78350f, #d97706, #f59e0b)',
    border: '#d97706',
  },
  {
    id: 'sage',
    label: 'Sage Green',
    desc: 'Calm emerald — clarity in thought.',
    swatch: 'linear-gradient(135deg, #065f46, #059669, #34d399)',
    border: '#059669',
  },
  {
    id: 'white',
    label: 'Minimal White',
    desc: 'Crisp monochrome — no colour distractions.',
    swatch: 'linear-gradient(135deg, #2A2A3A, #9999BB, #CCCCDD)',
    border: '#CCCCDD',
  },
]

export default function AccentPicker() {
  const { accentColor, setAccentColor } = useStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {ACCENTS.map(a => {
        const active = (accentColor || 'purple') === a.id
        return (
          <button
            key={a.id}
            onClick={() => setAccentColor(a.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '10px 14px',
              background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
              border: `2px solid ${active ? a.border : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.15s',
              textAlign: 'left',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.border = `2px solid ${a.border}55` }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.border = '2px solid rgba(255,255,255,0.1)' }}
          >
            {/* Swatch */}
            <div style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: a.swatch,
              boxShadow: active ? `0 0 12px ${a.border}66` : 'none',
              transition: 'box-shadow 0.15s',
            }} />
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: active ? a.border : 'var(--text-primary)',
                marginBottom: 2, transition: 'color 0.15s',
              }}>{a.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.desc}</div>
            </div>
            {active && (
              <div style={{
                width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                background: a.border, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 10, color: '#000',
                fontWeight: 700,
              }}>✓</div>
            )}
          </button>
        )
      })}
    </div>
  )
}
