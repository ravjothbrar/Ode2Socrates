import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import SocratesLogo from './Logo/SocratesLogo'

function GearIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.34.07-.69.07-1.08s-.03-.74-.07-1.08l2.32-1.82a.56.56 0 0 0 .13-.7l-2.2-3.81a.55.55 0 0 0-.68-.24l-2.73 1.1a8.13 8.13 0 0 0-1.85-1.07l-.41-2.91A.553.553 0 0 0 14 1h-4c-.27 0-.5.19-.55.46l-.41 2.91A8.13 8.13 0 0 0 7.2 5.44L4.47 4.34a.536.536 0 0 0-.68.24L1.59 8.39a.553.553 0 0 0 .13.7l2.32 1.82C4 11.26 3.97 11.61 3.97 12s.03.74.07 1.08L1.72 14.9a.556.556 0 0 0-.13.7l2.2 3.81c.14.24.41.32.68.24l2.73-1.1c.57.4 1.19.74 1.85 1.07l.41 2.91c.05.27.28.47.55.47h4c.27 0 .5-.19.55-.46l.41-2.91a8.13 8.13 0 0 0 1.85-1.07l2.73 1.1c.26.1.54 0 .68-.24l2.2-3.81a.555.555 0 0 0-.13-.7l-2.32-1.82z"/>
    </svg>
  )
}

function WhyModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8,8,15,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 5000,
        padding: 24,
      }}
    >
      <div
        className="animate-slide-up"
        onClick={e => e.stopPropagation()}
        style={{
          width: 648, maxWidth: '92vw',
          background: 'var(--bg-card)',
          border: '1px solid var(--accent-a40)',
          borderRadius: 18,
          padding: '38px 43px 34px',
          boxShadow: '0 0 60px var(--border-glow), 0 24px 48px rgba(0,0,0,0.65)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 16,
            background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer',
            fontSize: 20, lineHeight: 1, transition: 'color 0.1s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >×</button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <SocratesLogo size="canvas" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{
            fontSize: 15, fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.12em',
            color: 'var(--purple-bright)',
            textTransform: 'uppercase',
          }}>◈ Why Ode 2 Socrates?</span>
        </div>

        <div style={{
          fontSize: 17, lineHeight: 1.85,
          color: 'var(--text-secondary)',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <p>
            Ode 2 Socrates was built as a browser-based reflection tool to look introspectively,
            question your assumptions and form arguments with AI assistance. It's a tool to
            interrogate yourself in an optimised environment, forming graphs and maps of your
            arguments, and how you think — revealing insights about yourself and facilitating
            deep introspective thought.
          </p>
          <p>
            Through the power of Socratic rejoinders, we truly get to the heart of your thoughts.
          </p>
          <blockquote style={{
            margin: '8px 0 0', padding: '14px 20px',
            borderLeft: '3px solid var(--purple-mid)',
            background: 'var(--accent-a08)',
            borderRadius: '0 10px 10px 0',
            fontSize: 19, fontWeight: 700, fontStyle: 'italic',
            color: 'var(--lavender)', lineHeight: 1.75,
          }}>
            "Think of Ode 2 Socrates as your space to find out what you think, how you think,
            and develop yourself."
          </blockquote>
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '7px 18px', borderRadius: 8,
              background: 'linear-gradient(135deg, var(--purple-dim), var(--purple-mid))',
              border: '1px solid var(--purple-mid)',
              color: 'rgba(255,255,255,0.93)', fontSize: 12, fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 0 12px var(--border-glow)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px var(--border-glow)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 12px var(--border-glow)'}
          >
            ✦ Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TopBar() {
  const { setTourOpen, setSettingsOpen, setHowToOpen } = useStore()
  const [hoverRav, setHoverRav] = useState(false)
  const [hoverWhy, setHoverWhy] = useState(false)
  const [hoverTour, setHoverTour] = useState(false)
  const [hoverHowTo, setHoverHowTo] = useState(false)
  const [hoverSettings, setHoverSettings] = useState(false)
  const [whyOpen, setWhyOpen] = useState(false)

  const pillStyle = (hover) => ({
    display: 'flex', alignItems: 'center', gap: 7,
    background: hover ? 'var(--accent-a15)' : 'var(--accent-a08)',
    border: `1px solid ${hover ? 'var(--purple-mid)' : 'var(--accent-a35)'}`,
    borderRadius: 99,
    padding: '5px 14px 5px 10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    color: hover ? 'var(--lavender)' : 'var(--purple-bright)',
    boxShadow: hover ? '0 0 0 1px var(--border-glow), 0 0 12px var(--border-glow)' : 'none',
    textDecoration: 'none',
    flexShrink: 0,
    fontSize: 12, fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.01em',
  })

  // Settings is a slightly more prominent pill
  const settingsStyle = (hover) => ({
    ...pillStyle(hover),
    padding: '5px 16px 5px 12px',
    fontWeight: 600,
    fontSize: 12,
  })

  return (
    <>
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
        gap: 8,
      }}>
        {/* LEFT: Why? pill + Ravjoth Brar pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            onMouseEnter={() => setHoverWhy(true)}
            onMouseLeave={() => setHoverWhy(false)}
            onClick={() => setWhyOpen(true)}
            style={pillStyle(hoverWhy)}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
              <text x="8" y="12" textAnchor="middle" fill="currentColor"
                fontSize="9" fontWeight="700" fontFamily="serif">?</text>
            </svg>
            Why?
          </button>

          <a
            href="https://ravjothbrar.com/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoverRav(true)}
            onMouseLeave={() => setHoverRav(false)}
            style={pillStyle(hoverRav)}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Created by Ravjoth Brar
          </a>
        </div>

        {/* CENTER: Title */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          pointerEvents: 'none', userSelect: 'none',
        }}>
          <span style={{
            fontSize: 18, fontWeight: 800,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.05em',
            background: 'linear-gradient(135deg, var(--purple-bright) 0%, var(--purple-mid) 50%, var(--purple-pale) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            whiteSpace: 'nowrap',
          }}>
            Ode 2 Socrates
          </span>
        </div>

        {/* RIGHT: Tour + How To + Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
          {/* Tour button */}
          <button
            onMouseEnter={() => setHoverTour(true)}
            onMouseLeave={() => setHoverTour(false)}
            onClick={() => setTourOpen(true)}
            title="Take the tour"
            style={pillStyle(hoverTour)}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M2 3l10 5-10 5V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
            </svg>
            Tour
          </button>

          {/* How To button */}
          <button
            onMouseEnter={() => setHoverHowTo(true)}
            onMouseLeave={() => setHoverHowTo(false)}
            onClick={() => setHowToOpen(true)}
            title="How To guide"
            style={pillStyle(hoverHowTo)}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            How To
          </button>

          {/* Settings — gear icon + label */}
          <button
            onMouseEnter={() => setHoverSettings(true)}
            onMouseLeave={() => setHoverSettings(false)}
            onClick={() => setSettingsOpen(true)}
            title="Settings"
            style={settingsStyle(hoverSettings)}
          >
            <GearIcon />
            Settings
          </button>
        </div>
      </header>

      {whyOpen && <WhyModal onClose={() => setWhyOpen(false)} />}
    </>
  )
}
