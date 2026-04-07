import React from 'react'

// A Socrates-in-thought ASCII bust — lavender glow like NeuroLocate brain
const ASCII_SOCRATES = `
      .-"""""-.
    .'          '.
   /   O      O   \\
  :           ^    :
  |    \\___/       |
  :                ;
   \\  '------'   /
    '.          .'
  .-'  |      |  '-.
 /     |  __  |     \\
|      '-'  '-'      |
|    ,----------.    |
 \\  /  Socrates  \\  /
  '--'            '--'
      |    |    |
      |    |    |
  ~~~~~~~~~~~~~~~~~~~~
  "Know thyself"
`

// Compact version for smaller sizes
const ASCII_MINI = `
    .-""-.
   / o  o \\
  :   ^    :
  |  \\_/   |
   \\ '-'  /
  .-|    |-.
 /  '----'  \\
`

export default function SocratesLogo({ size = 'canvas', showTitle = false }) {
  if (size === 'canvas') {
    // Large canvas overlay — lavender glow, semi-transparent
    return (
      <div style={{
        position: 'relative',
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        <pre style={{
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          fontSize: '8.5px',
          lineHeight: '11px',
          color: '#c4b5fd',
          textShadow: '0 0 14px #7c3aed99, 0 0 28px #7c3aed44',
          margin: 0,
          whiteSpace: 'pre',
          opacity: 0.82,
          letterSpacing: '0.03em',
        }}>
          {ASCII_SOCRATES}
        </pre>
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
            marginTop: 2,
            opacity: 0.7,
          }}>
            Ode2Socrates
          </div>
        )}
      </div>
    )
  }

  // Welcome modal variant
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <pre style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: size === 'sm' ? '6px' : '8px',
        lineHeight: size === 'sm' ? '7.5px' : '10px',
        color: '#c4b5fd',
        textShadow: '0 0 12px #7c3aed88, 0 0 24px #7c3aed44',
        margin: 0,
        userSelect: 'none',
        letterSpacing: '0.02em',
        whiteSpace: 'pre',
      }}>
        {size === 'sm' ? ASCII_MINI : ASCII_SOCRATES}
      </pre>
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
