import React, { useState } from 'react'
import { useStore } from '../store/useStore'

export default function TopBar() {
  const { setTourOpen, setHowToOpen } = useStore()
  const [hoverRav, setHoverRav] = useState(false)
  const [hoverQ, setHoverQ] = useState(false)

  return (
    <header style={{
      height: 44,
      background: 'rgba(8,8,15,0.97)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      flexShrink: 0,
      zIndex: 200,
      position: 'relative',
    }}>
      {/* Ravjoth Brar credit pill */}
      <button
        onMouseEnter={() => setHoverRav(true)}
        onMouseLeave={() => setHoverRav(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: hoverRav ? 'rgba(167,139,250,0.15)' : 'rgba(124,58,237,0.08)',
          border: `1px solid ${hoverRav ? '#7c3aed' : 'rgba(124,58,237,0.35)'}`,
          borderRadius: 99,
          padding: '5px 14px 5px 10px',
          cursor: 'default',
          transition: 'all 0.15s ease',
          color: hoverRav ? '#e9d5ff' : '#a78bfa',
          boxShadow: hoverRav ? '0 0 0 1px #7c3aed33' : 'none',
        }}
      >
        {/* Person icon */}
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{
          fontSize: 12, fontWeight: 500,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '0.01em',
        }}>
          Ravjoth Brar
        </span>
      </button>

      {/* ? Help button */}
      <button
        onMouseEnter={() => setHoverQ(true)}
        onMouseLeave={() => setHoverQ(false)}
        onClick={() => setTourOpen(true)}
        title="Take the tour"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 30, height: 30,
          background: hoverQ ? 'rgba(167,139,250,0.15)' : 'rgba(124,58,237,0.08)',
          border: `1px solid ${hoverQ ? '#7c3aed' : 'rgba(124,58,237,0.35)'}`,
          borderRadius: 99,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          color: hoverQ ? '#e9d5ff' : '#a78bfa',
          boxShadow: hoverQ ? '0 0 0 1px #7c3aed33' : 'none',
          fontSize: 13, fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
        }}
      >?</button>
    </header>
  )
}
