import React from 'react'

// SVG cartoon Socrates — purple outlines, inspired by the classic philosophical figure
function SocratesSVG({ width = 120, strokeColor = '#a78bfa', strokeWidth = 2.2 }) {
  const s = strokeColor
  const sw = strokeWidth
  return (
    <svg
      width={width}
      height={width * 1.45}
      viewBox="0 0 120 174"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* ── Head (bald oval) ── */}
      <ellipse cx="60" cy="44" rx="32" ry="36" stroke={s} strokeWidth={sw} fill="none" />

      {/* ── Ears ── */}
      <path d="M28 40 Q22 44 28 52" stroke={s} strokeWidth={sw * 0.85} fill="none" strokeLinecap="round"/>
      <path d="M92 40 Q98 44 92 52" stroke={s} strokeWidth={sw * 0.85} fill="none" strokeLinecap="round"/>

      {/* ── Eyes ── */}
      <circle cx="48" cy="42" r="3.5" stroke={s} strokeWidth={sw * 0.9} fill="none" />
      <circle cx="72" cy="42" r="3.5" stroke={s} strokeWidth={sw * 0.9} fill="none" />
      {/* Pupils */}
      <circle cx="49" cy="43" r="1.5" fill={s} />
      <circle cx="73" cy="43" r="1.5" fill={s} />

      {/* ── Brow (thoughtful raised brow) ── */}
      <path d="M44 36 Q48 33 53 35" stroke={s} strokeWidth={sw * 0.8} fill="none" strokeLinecap="round"/>
      <path d="M67 35 Q72 33 76 36" stroke={s} strokeWidth={sw * 0.8} fill="none" strokeLinecap="round"/>

      {/* ── Nose ── */}
      <path d="M60 46 Q57 54 59 58 Q60 60 61 58 Q63 54 60 46" stroke={s} strokeWidth={sw * 0.85} fill="none" strokeLinecap="round" strokeLinejoin="round"/>

      {/* ── Smile / gentle expression ── */}
      <path d="M52 66 Q60 71 68 66" stroke={s} strokeWidth={sw * 0.9} fill="none" strokeLinecap="round"/>

      {/* ── Side hair tufts ── */}
      <path d="M28 44 Q18 38 20 28 Q24 20 32 22" stroke={s} strokeWidth={sw * 0.75} fill="none" strokeLinecap="round"/>
      <path d="M92 44 Q102 38 100 28 Q96 20 88 22" stroke={s} strokeWidth={sw * 0.75} fill="none" strokeLinecap="round"/>
      {/* Forehead wisps */}
      <path d="M38 12 Q40 6 44 10" stroke={s} strokeWidth={sw * 0.65} fill="none" strokeLinecap="round"/>
      <path d="M82 12 Q80 6 76 10" stroke={s} strokeWidth={sw * 0.65} fill="none" strokeLinecap="round"/>

      {/* ── Neck ── */}
      <path d="M52 78 L50 88" stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round"/>
      <path d="M68 78 L70 88" stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round"/>

      {/* ── Beard (large rounded beard) ── */}
      {/* Outer beard outline */}
      <path
        d="M32 62 Q28 72 30 84 Q34 100 42 110 Q50 118 60 120 Q70 118 78 110 Q86 100 90 84 Q92 72 88 62"
        stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Beard texture lines */}
      <path d="M44 72 Q48 82 46 92" stroke={s} strokeWidth={sw * 0.55} fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M56 74 Q58 86 56 96" stroke={s} strokeWidth={sw * 0.55} fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M64 74 Q66 86 64 96" stroke={s} strokeWidth={sw * 0.55} fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M74 72 Q72 82 74 92" stroke={s} strokeWidth={sw * 0.55} fill="none" strokeLinecap="round" opacity="0.7"/>
      {/* Mustache */}
      <path d="M50 63 Q55 67 60 65 Q65 67 70 63" stroke={s} strokeWidth={sw * 0.9} fill="none" strokeLinecap="round"/>

      {/* ── Toga / robe ── */}
      {/* Main body */}
      <path
        d="M30 124 Q20 132 18 150 Q16 164 20 174 L100 174 Q104 164 102 150 Q100 132 90 124"
        stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Shoulder line */}
      <path d="M30 124 Q46 118 60 120 Q74 118 90 124" stroke={s} strokeWidth={sw} fill="none" strokeLinecap="round"/>
      {/* Toga drape diagonal */}
      <path d="M46 120 Q52 130 48 144 Q46 154 50 164" stroke={s} strokeWidth={sw * 0.75} fill="none" strokeLinecap="round" opacity="0.8"/>
      {/* Toga fold lines */}
      <path d="M60 120 Q64 138 62 154" stroke={s} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M72 122 Q76 138 74 156" stroke={s} strokeWidth={sw * 0.6} fill="none" strokeLinecap="round" opacity="0.6"/>

      {/* ── Contemplating hand / chin stroke ── */}
      <path d="M50 96 Q44 108 46 116" stroke={s} strokeWidth={sw * 0.8} fill="none" strokeLinecap="round"/>
      {/* Finger at chin */}
      <path d="M46 104 Q40 106 38 112 Q40 116 44 114" stroke={s} strokeWidth={sw * 0.75} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function SocratesLogo({ size = 'canvas', showTitle = false, typing = false }) {
  const isTyping = typing

  if (size === 'canvas') {
    return (
      <div
        className={isTyping ? 'socrates-typing' : ''}
        style={{
          position: 'relative',
          userSelect: 'none',
          pointerEvents: 'none',
          filter: isTyping
            ? undefined // handled by CSS class
            : 'drop-shadow(0 0 8px #7c3aed66) drop-shadow(0 0 18px #7c3aed33)',
          transition: 'filter 0.3s ease',
          transformOrigin: 'top left',
        }}
      >
        <SocratesSVG width={110} strokeColor="#a78bfa" strokeWidth={2.0} />
        {showTitle && (
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: '#a78bfa',
            textShadow: '0 0 12px #7c3aed66',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginTop: 4,
            opacity: 0.7,
          }}>
            Ode2Socrates
          </div>
        )}
      </div>
    )
  }

  // Welcome modal / tour variant
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <SocratesSVG
        width={size === 'sm' ? 60 : 90}
        strokeColor="#a78bfa"
        strokeWidth={size === 'sm' ? 1.5 : 1.8}
      />
      {showTitle && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '17px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          color: '#a78bfa',
          textShadow: '0 0 16px #7c3aed66',
          textTransform: 'uppercase',
        }}>
          Ode2Socrates
        </div>
      )}
    </div>
  )
}
