import React from 'react'

const ASCII_SOCRATES = `
        .  . .::.
      .'  .'    '.
     /  .'  /\\    \\
    |  /   /  \\    |
    | |  .'    '.  |
    | | /  ~~~~  \\ |
    |_|/ ( o)(o ) \\|
    /    \\ .  . /  \\
   /  .-'  '\\/'  '-. \\
  |  /  .-""""-.  \\ |
  | |  /        \\  | |
  |  \\/  _    _  \\/  |
  \\   | | |  | | |   /
   \\  |_|_|  |_|_|  /
    '.___________.'
         |||
       .'|||'.
      / ||||| \\
     |  |||||  |
      \\ ||||| /
       '._|_.'
`

export default function SocratesLogo({ size = 'md', showTitle = true }) {
  const scales = {
    sm: { fontSize: '5px', lineHeight: '6px' },
    md: { fontSize: '7px', lineHeight: '8.5px' },
    lg: { fontSize: '9px', lineHeight: '11px' },
  }
  const s = scales[size] || scales.md

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <pre style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        color: '#c4b5fd',
        textShadow: '0 0 12px #7c3aed88, 0 0 24px #7c3aed44',
        margin: 0,
        userSelect: 'none',
        letterSpacing: '0.02em',
        whiteSpace: 'pre',
      }}>
        {ASCII_SOCRATES}
      </pre>
      {showTitle && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '18px',
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
