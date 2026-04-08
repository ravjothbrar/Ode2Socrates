import React, { useState } from 'react'
import { useStore } from '../../store/useStore'
import Button from '../Button'

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Ode2Socrates',
    icon: '⬡',
    highlight: null,
    content: (
      <>
        <p>A spatial, Socratic note-taking app. All your data lives <strong style={{ color: '#c4b5fd' }}>locally in your browser</strong> — nothing is ever stored on a server.</p>
        <p style={{ marginTop: 14 }}>This tour takes ~60 seconds. You can skip it at any time.</p>
        <div style={{
          marginTop: 24,
          padding: '20px 16px',
          background: 'rgba(76,29,149,0.12)',
          borderRadius: 12,
          border: '1px solid rgba(124,58,237,0.2)',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '28px',
            lineHeight: '1.3',
            color: '#7c3aed',
            fontWeight: 600,
            fontStyle: 'italic',
          }}>
            "The unexamined thought<br/>is not worth keeping."
          </p>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '16px',
            color: '#4c1d95',
            marginTop: 12,
            opacity: 0.8,
          }}>
            — Socrates (probably)
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'logo',
    title: 'Your philosophical guide',
    icon: '◈',
    highlight: '.canvas-logo',
    content: (
      <>
        <p>That glowing figure in the top-left is Socrates himself — watching over your canvas.</p>
        <p style={{ marginTop: 12 }}>He's not just decoration. The <strong style={{ color: '#c4b5fd' }}>Socratic Engine</strong> in the sidebar is his voice.</p>
      </>
    ),
  },
  {
    id: 'blur',
    title: 'The Blur — your brain dump',
    icon: '◈',
    highlight: '.blur-input',
    content: (
      <>
        <p>The floating input at the bottom is <strong style={{ color: '#c4b5fd' }}>The Blur</strong>. Type anything — stream of consciousness, half-formed ideas, ranting thoughts.</p>
        <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 2 }}>
          <li>Type <code style={codeStyle}>#</code> to tag the node type</li>
          <li>Press <code style={codeStyle}>Enter</code> to commit as a node</li>
          <li><code style={codeStyle}>Shift+Enter</code> for a new line</li>
          <li>Use the <strong style={{ color: '#c4b5fd' }}>formatting toolbar</strong> for Bold, Italic, Headings, and more</li>
          <li>Long entries trigger AI distillation</li>
        </ul>
      </>
    ),
  },
  {
    id: 'canvas',
    title: 'The Infinite Canvas',
    icon: '⊡',
    highlight: null,
    content: (
      <>
        <p>Every thought you commit becomes a <strong style={{ color: '#c4b5fd' }}>node</strong> on this spatial canvas.</p>
        <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 2 }}>
          <li>Drag nodes to arrange them spatially</li>
          <li><strong style={{ color: '#c4b5fd' }}>Left-click drag</strong> on empty canvas to pan around</li>
          <li>Connect nodes by dragging from the <strong style={{ color: '#c4b5fd' }}>◉ handles</strong> on node edges</li>
          <li>Double-click a node to edit it</li>
          <li>Overlapping nodes will prompt to <strong style={{ color: '#c4b5fd' }}>merge or separate</strong></li>
        </ul>
      </>
    ),
  },
  {
    id: 'graph',
    title: 'Graph View',
    icon: '⬡',
    highlight: '.view-toggle',
    content: (
      <>
        <p>Switch to <strong style={{ color: '#c4b5fd' }}>Graph View</strong> using the top-right controls to see your ideas as a force-directed network.</p>
        <p style={{ marginTop: 12 }}>Multi-select nodes with <code style={codeStyle}>Shift+Click</code>, then hit <code style={codeStyle}>Ctrl+K → Analyse Gaps</code> to discover what's missing.</p>
      </>
    ),
  },
  {
    id: 'gadfly',
    title: 'The Gadfly — passive AI',
    icon: '⚡',
    highlight: '.sidebar-gadfly',
    content: (
      <>
        <p>The <strong style={{ color: '#c4b5fd' }}>Gadfly tab</strong> in the right sidebar streams Socratic challenges as you type — automatically, every 10 seconds.</p>
        <ul style={{ marginTop: 12, paddingLeft: 20, lineHeight: 2 }}>
          <li><code style={codeStyle}>❓</code> A probing question exposing your assumptions</li>
          <li><code style={codeStyle}>⚡</code> A Devil's Advocate counter-position</li>
          <li>Click <strong style={{ color: '#c4b5fd' }}>Answer</strong> to spawn a connected response node</li>
          <li>Hit <strong style={{ color: '#c4b5fd' }}>↻</strong> to trigger manually</li>
        </ul>
        <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text-muted)' }}>Requires a Groq API key in Settings.</p>
      </>
    ),
  },
  {
    id: 'chat',
    title: 'Context Chat — active RAG',
    icon: '💬',
    highlight: '.sidebar-chat',
    content: (
      <>
        <p>Switch to the <strong style={{ color: '#c4b5fd' }}>Context Chat tab</strong> to ask direct questions about your notes.</p>
        <p style={{ marginTop: 12 }}>The AI retrieves your most semantically relevant nodes and answers <em>in context of what you've already written</em>.</p>
        <p style={{ marginTop: 12 }}>Responses include <strong style={{ color: '#c4b5fd' }}>citation links</strong> — click them to pan the canvas directly to that node.</p>
      </>
    ),
  },
  {
    id: 'wormholes',
    title: 'Cross-Space Wormholes',
    icon: '🌀',
    highlight: null,
    content: (
      <>
        <p>When you have multiple Spaces, Ode2Socrates runs background semantic matching <em>across all of them</em>.</p>
        <p style={{ marginTop: 12 }}>If a psychological concept in <strong style={{ color: '#c4b5fd' }}>Space A</strong> parallels a business strategy in <strong style={{ color: '#c4b5fd' }}>Space B</strong> — a <strong style={{ color: '#c4b5fd' }}>🌀 Wormhole</strong> appears, letting you bridge the two domains.</p>
      </>
    ),
  },
  {
    id: 'commands',
    title: 'Keyboard shortcuts',
    icon: '⌘',
    highlight: null,
    content: (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 18px', alignItems: 'center' }}>
          {[
            ['Ctrl/⌘ + K', 'Command palette'],
            ['Enter', 'Commit a Blur node'],
            ['Shift + Enter', 'New line in Blur'],
            ['# + word', 'Tag autocomplete'],
            ['Esc', 'Close any overlay'],
          ].map(([key, desc]) => (
            <React.Fragment key={key}>
              <code style={{ ...codeStyle, fontSize: 13, whiteSpace: 'nowrap' }}>{key}</code>
              <span style={{ fontSize: 15, color: 'var(--text-secondary)' }}>{desc}</span>
            </React.Fragment>
          ))}
        </div>
      </>
    ),
  },
]

const codeStyle = {
  background: 'rgba(124,58,237,0.2)',
  padding: '2px 7px',
  borderRadius: 4,
  color: '#c4b5fd',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 13,
}

export default function Tour() {
  const { tourOpen, setTourOpen, setHowToOpen } = useStore()
  const [step, setStep] = useState(0)
  const [showHowToPrompt, setShowHowToPrompt] = useState(false)

  if (!tourOpen) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  function handleNext() {
    if (isLast) {
      setShowHowToPrompt(true)
    } else {
      setStep(s => s + 1)
    }
  }

  function handleSkip() {
    setTourOpen(false)
    setStep(0)
    setShowHowToPrompt(false)
  }

  if (showHowToPrompt) {
    return (
      <Overlay onClose={handleSkip}>
        <div className="animate-slide-up" style={modalStyle}>
          <div style={{ textAlign: 'center', padding: '10px 0 24px' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📖</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--lavender)', marginBottom: 12 }}>
              Want the full How To? guide?
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              The guide covers every feature in detail — commands, AI loops, export, and more — with a searchable tabbed layout.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button
              variant="primary"
              size="md"
              icon="📖"
              onClick={() => { setHowToOpen(true); handleSkip() }}
            >
              Open How To?
            </Button>
            <Button variant="ghost" size="md" onClick={handleSkip}>
              Maybe later
            </Button>
          </div>
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay onClose={handleSkip}>
      <div className="animate-slide-up" style={modalStyle}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginBottom: 28 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 28 : 9,
              height: 9,
              borderRadius: 5,
              background: i === step ? '#7c3aed' : i < step ? '#4c1d95' : '#2a2a4a',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }} onClick={() => setStep(i)} />
          ))}
        </div>

        {/* Content */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 26 }}>{current.icon}</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--lavender)' }}>
              {current.title}
            </h2>
          </div>
          <div style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.85 }}>
            {current.content}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 32,
        }}>
          <button
            onClick={handleSkip}
            style={{
              background: 'none', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer',
              fontSize: 15, padding: '8px 0',
              transition: 'color 0.1s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--text-secondary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            Skip tour
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            {step > 0 && (
              <Button variant="ghost" size="md" onClick={() => setStep(s => s - 1)}>
                ← Back
              </Button>
            )}
            <Button variant="primary" size="md" onClick={handleNext} icon={isLast ? '✦' : null}>
              {isLast ? 'Finish' : 'Next →'}
            </Button>
          </div>
        </div>

        {/* Step counter */}
        <div style={{
          textAlign: 'center', marginTop: 14,
          fontSize: 13, color: 'var(--text-muted)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {step + 1} / {STEPS.length}
        </div>
      </div>
    </Overlay>
  )
}

function Overlay({ onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8,8,15,0.82)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 4000,
        padding: '20px',
      }}
    >
      <div onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

const modalStyle = {
  width: 760,
  maxWidth: '92vw',
  maxHeight: '90vh',
  overflowY: 'auto',
  background: 'var(--bg-card)',
  border: '1px solid rgba(124,58,237,0.4)',
  borderRadius: 20,
  padding: '36px 40px',
  boxShadow: '0 0 80px #7c3aed22, 0 32px 64px rgba(0,0,0,0.6)',
}
