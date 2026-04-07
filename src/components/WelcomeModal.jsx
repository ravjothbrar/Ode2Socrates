import React from 'react'
import { useStore } from '../store/useStore'
import SocratesLogo from './Logo/SocratesLogo'
import Button from './Button'

const FEATURES = [
  {
    icon: '◈',
    title: 'The Blur Input',
    desc: 'Stream-of-consciousness capture. Type freely, tag with #, commit with Enter.',
  },
  {
    icon: '⬡',
    title: 'Infinite Canvas',
    desc: 'Spatial workspace for your thoughts. Drag, pan, zoom. Link nodes by dragging handles.',
  },
  {
    icon: '🕸',
    title: 'Graph View',
    desc: 'Force-directed auto-layout. Multi-select clusters and analyse knowledge gaps.',
  },
  {
    icon: '⚡',
    title: 'Socratic Engine',
    desc: 'Groq-powered AI plays Devil\'s Advocate every 10s. Challenges your assumptions in real time.',
  },
]

const ASCII_QUOTE = `
  "The unexamined thought
   is not worth keeping."
                — Socrates (probably)
`

export default function WelcomeModal() {
  const { welcomeOpen, setWelcomeOpen, groqApiKey, setSettingsOpen } = useStore()
  if (!welcomeOpen) return null

  return (
    <div
      onClick={() => setWelcomeOpen(false)}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8,8,15,0.9)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 3000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="animate-slide-up"
        style={{
          width: 580, maxWidth: '92vw', maxHeight: '90vh',
          background: 'var(--bg-card)',
          border: '1px solid rgba(124,58,237,0.4)',
          borderRadius: 20,
          boxShadow: '0 0 60px #7c3aed33, 0 0 120px #7c3aed11, 0 32px 64px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Logo area */}
        <div style={{
          padding: '32px 24px 20px',
          background: 'linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(124,58,237,0.2)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <SocratesLogo size="md" showTitle={true} />
          <pre style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px', lineHeight: '15px',
            color: 'var(--text-muted)',
            marginTop: 16, textAlign: 'center',
            whiteSpace: 'pre',
          }}>{ASCII_QUOTE}</pre>
          <p style={{
            fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center',
            maxWidth: 400, lineHeight: 1.7, marginTop: 4,
          }}>
            A spatial, Socratic note-taking tool. All data stays{' '}
            <span style={{ color: 'var(--purple-bright)', fontWeight: 600 }}>locally in your browser</span>.
            Powered by your own Groq key.
          </p>
        </div>

        {/* Features grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 12, padding: '20px 24px',
          overflowY: 'auto',
        }}>
          {FEATURES.map(f => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>

        {/* Actions */}
        <div style={{
          padding: '16px 24px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {!groqApiKey && (
            <Button
              variant="primary"
              size="md"
              icon="🔑"
              onClick={() => { setSettingsOpen(true); setWelcomeOpen(false) }}
            >
              Add Groq API Key
            </Button>
          )}
          <Button
            variant={groqApiKey ? 'primary' : 'default'}
            size="md"
            icon="◈"
            onClick={() => setWelcomeOpen(false)}
          >
            {groqApiKey ? 'Start Thinking' : 'Continue Without AI'}
          </Button>
        </div>

        {/* Dismiss hint */}
        <div style={{
          textAlign: 'center', paddingBottom: 14,
          fontSize: 11, color: 'var(--text-muted)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          Click anywhere outside to dismiss
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div style={{
      background: 'rgba(124,58,237,0.05)',
      border: '1px solid var(--border)',
      borderRadius: 12, padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
    </div>
  )
}
