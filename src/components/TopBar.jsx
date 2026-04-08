import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import SocratesLogo from './Logo/SocratesLogo'

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
          border: '1px solid rgba(124,58,237,0.45)',
          borderRadius: 18,
          padding: '38px 43px 34px',
          boxShadow: '0 0 60px #7c3aed22, 0 24px 48px rgba(0,0,0,0.65)',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 16,
            background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer',
            fontSize: 20, lineHeight: 1,
            transition: 'color 0.1s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >×</button>

        {/* Socrates art */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <SocratesLogo size="canvas" />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{
            fontSize: 15, fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.12em',
            color: 'var(--purple-bright)',
            textTransform: 'uppercase',
          }}>◈ Why Ode 2 Socrates?</span>
        </div>

        {/* Body */}
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

          {/* Quote — last sentence, bigger bold italic */}
          <blockquote style={{
            margin: '8px 0 0',
            padding: '14px 20px',
            borderLeft: '3px solid #7c3aed',
            background: 'rgba(124,58,237,0.08)',
            borderRadius: '0 10px 10px 0',
            fontSize: 19,
            fontWeight: 700,
            fontStyle: 'italic',
            color: 'var(--lavender)',
            lineHeight: 1.75,
          }}>
            "Think of Ode 2 Socrates as your space to find out what you think, how you think,
            and develop yourself."
          </blockquote>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 24,
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '7px 18px', borderRadius: 8,
              background: 'linear-gradient(135deg, #6d28d9, #5b21b6)',
              border: '1px solid #7c3aed',
              color: '#f5f3ff', fontSize: 12, fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 0 12px #7c3aed33',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px #7c3aed55'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 12px #7c3aed33'}
          >
            ✦ Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TopBar() {
  const { setTourOpen, setSettingsOpen, isDarkMode, toggleDarkMode } = useStore()
  const [hoverRav, setHoverRav] = useState(false)
  const [hoverWhy, setHoverWhy] = useState(false)
  const [hoverQ, setHoverQ] = useState(false)
  const [hoverSettings, setHoverSettings] = useState(false)
  const [hoverTheme, setHoverTheme] = useState(false)
  const [whyOpen, setWhyOpen] = useState(false)

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

  const pillStyle = (hover) => ({
    display: 'flex', alignItems: 'center', gap: 7,
    background: hover ? 'rgba(167,139,250,0.15)' : 'rgba(124,58,237,0.08)',
    border: `1px solid ${hover ? '#7c3aed' : 'rgba(124,58,237,0.35)'}`,
    borderRadius: 99,
    padding: '5px 14px 5px 10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    color: hover ? '#e9d5ff' : '#a78bfa',
    boxShadow: hover ? '0 0 0 1px #7c3aed33, 0 0 12px #7c3aed22' : 'none',
    textDecoration: 'none',
    flexShrink: 0,
    fontSize: 12, fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.01em',
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
          {/* Why? pill */}
          <button
            onMouseEnter={() => setHoverWhy(true)}
            onMouseLeave={() => setHoverWhy(false)}
            onClick={() => setWhyOpen(true)}
            style={{ ...pillStyle(hoverWhy), border: `1px solid ${hoverWhy ? '#7c3aed' : 'rgba(124,58,237,0.35)'}` }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
              <text x="8" y="12" textAnchor="middle" fill="currentColor"
                fontSize="9" fontWeight="700" fontFamily="serif">?</text>
            </svg>
            Why?
          </button>

          {/* Ravjoth Brar pill */}
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

        {/* CENTER: Title — absolutely centered */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          <span style={{
            fontSize: 18, fontWeight: 800,
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
          <button
            onMouseEnter={() => setHoverTheme(true)}
            onMouseLeave={() => setHoverTheme(false)}
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ ...iconBtn(hoverTheme), fontSize: 15 }}
          >
            {isDarkMode ? '☀' : '🌙'}
          </button>

          <button
            onMouseEnter={() => setHoverQ(true)}
            onMouseLeave={() => setHoverQ(false)}
            onClick={() => setTourOpen(true)}
            title="Take the tour"
            style={{ ...iconBtn(hoverQ), fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
          >?</button>

          <button
            onMouseEnter={() => setHoverSettings(true)}
            onMouseLeave={() => setHoverSettings(false)}
            onClick={() => setSettingsOpen(true)}
            title="Settings"
            style={{ ...iconBtn(hoverSettings), fontSize: 18, width: 36, height: 36 }}
          >⚙</button>
        </div>
      </header>

      {whyOpen && <WhyModal onClose={() => setWhyOpen(false)} />}
    </>
  )
}
