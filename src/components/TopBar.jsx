import React, { useState } from 'react'
import { useStore } from '../store/useStore'

export default function TopBar() {
  const { setTourOpen, setSettingsOpen, isDarkMode, toggleDarkMode } = useStore()
  const [hoverRav, setHoverRav] = useState(false)
  const [hoverQ, setHoverQ] = useState(false)
  const [hoverSettings, setHoverSettings] = useState(false)
  const [hoverTheme, setHoverTheme] = useState(false)

  const iconBtn = (hover) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 34, height: 34,
    background: hover ? 'rgba(167,139,250,0.15)' : 'rgba(124,58,237,0.08)',
    border: `1px solid ${hover ? '#7c3aed' : 'rgba(124,58,237,0.35)'}`,
    borderRadius: 99,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    color: hover ? '#e9d5ff' : '#a78bfa',
    boxShadow: hover ? '0 0 0 1px #7c3aed33' : 'none',
  })

  return (
    <header style={{
      height: 52,
      background: 'rgba(8,8,15,0.97)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      flexShrink: 0,
      zIndex: 200,
      position: 'relative',
    }}>
      {/* LEFT: Ravjoth Brar credit pill */}
      <a
        href="https://ravjothbrar.com/"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHoverRav(true)}
        onMouseLeave={() => setHoverRav(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: hoverRav ? 'rgba(167,139,250,0.15)' : 'rgba(124,58,237,0.08)',
          border: `1px solid ${hoverRav ? '#7c3aed' : 'rgba(124,58,237,0.35)'}`,
          borderRadius: 99,
          padding: '5px 14px 5px 10px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          color: hoverRav ? '#e9d5ff' : '#a78bfa',
          boxShadow: hoverRav ? '0 0 0 1px #7c3aed33, 0 0 12px #7c3aed22' : 'none',
          textDecoration: 'none',
          flexShrink: 0,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 12, fontWeight: 500, fontFamily: "'Inter', sans-serif", letterSpacing: '0.01em' }}>
          Created by Ravjoth Brar
        </span>
      </a>

      {/* CENTER: Title — absolutely positioned so it's always centered */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        <span style={{
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '0.05em',
          background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #c4b5fd 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          whiteSpace: 'nowrap',
        }}>
          Ode 2 Socrates
        </span>
      </div>

      {/* RIGHT: theme toggle + ? + ⚙ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
        {/* Dark/Light mode toggle */}
        <button
          onMouseEnter={() => setHoverTheme(true)}
          onMouseLeave={() => setHoverTheme(false)}
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{ ...iconBtn(hoverTheme), fontSize: 15 }}
        >
          {isDarkMode ? '☀' : '🌙'}
        </button>

        {/* ? Help button */}
        <button
          onMouseEnter={() => setHoverQ(true)}
          onMouseLeave={() => setHoverQ(false)}
          onClick={() => setTourOpen(true)}
          title="Take the tour"
          style={{ ...iconBtn(hoverQ), fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
        >?</button>

        {/* Settings cog — rightmost */}
        <button
          onMouseEnter={() => setHoverSettings(true)}
          onMouseLeave={() => setHoverSettings(false)}
          onClick={() => setSettingsOpen(true)}
          title="Settings"
          style={{ ...iconBtn(hoverSettings), fontSize: 18, width: 36, height: 36 }}
        >⚙</button>
      </div>
    </header>
  )
}
