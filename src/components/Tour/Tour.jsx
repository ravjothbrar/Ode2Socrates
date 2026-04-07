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
        <p style={{ marginTop: 10 }}>This tour takes ~60 seconds. You can skip it at any time.</p>
        <pre style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '7px', lineHeight: '9px',
          color: '#4c1d95',
          marginTop: 14, textAlign: 'center',
        }}>
{`  "The unexamined thought is not worth keeping."
                          — Socrates (probably)`}
        </pre>
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
        <p>That glowing ASCII figure in the top-left is Socrates himself — watching over your canvas.</p>
        <p style={{ marginTop: 8 }}>He's not just decoration. The <strong style={{ color: '#c4b5fd' }}>Socratic Engine</strong> in the sidebar is his voice.</p>
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
        <ul style={{ marginTop: 8, paddingLeft: 16, lineHeight: 1.8 }}>
          <li>Type <code style={codeStyle}>#</code> to tag the node type</li>
          <li>Press <code style={codeStyle}>Enter</code> to commit as a node</li>
          <li><code style={codeStyle}>Shift+Enter</code> for a new line</li>
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
        <ul style={{ marginTop: 8, paddingLeft: 16, lineHeight: 1.8 }}>
          <li>Drag nodes to arrange them spatially</li>
          <li>Connect nodes by dragging from the <strong style={{ color: '#c4b5fd' }}>◉ handles</strong> on node edges</li>
          <li>Double-click a node to edit it</li>
          <li>Hover a node to export or delete it</li>
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
        <p style={{ marginTop: 8 }}>Multi-select nodes with <code style={codeStyle}>Shift+Click</code>, then hit <code style={codeStyle}>Ctrl+K → Analyse Gaps</code> to discover what's missing.</p>
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
        <ul style={{ marginTop: 8, paddingLeft: 16, lineHeight: 1.8 }}>
          <li><code style={codeStyle}>❓</code> A probing question exposing your assumptions</li>
          <li><code style={codeStyle}>⚡</code> A Devil's Advocate counter-position</li>
          <li>Click <strong style={{ color: '#c4b5fd' }}>Answer</strong> to spawn a connected response node</li>
          <li>Hit <strong style={{ color: '#c4b5fd' }}>↻</strong> to trigger manually</li>
        </ul>
        <p style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>Requires a Groq API key in Settings.</p>
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
        <p style={{ marginTop: 8 }}>The AI retrieves your most semantically relevant nodes and answers <em>in context of what you've already written</em>.</p>
        <p style={{ marginTop: 8 }}>Responses include <strong style={{ color: '#c4b5fd' }}>citation links</strong> — click them to pan the canvas directly to that node.</p>
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
        <p style={{ marginTop: 8 }}>If a psychological concept in <strong style={{ color: '#c4b5fd' }}>Space A</strong> parallels a business strategy in <strong style={{ color: '#c4b5fd' }}>Space B</strong> — a <strong style={{ color: '#c4b5fd' }}>🌀 Wormhole</strong> appears, letting you bridge the two domains.</p>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 14px', alignItems: 'center' }}>
          {[
            ['Ctrl/⌘ + K', 'Command palette'],
            ['Enter', 'Commit a Blur node'],
            ['Shift + Enter', 'New line in Blur'],
            ['# + word', 'Tag autocomplete'],
            ['Esc', 'Close any overlay'],
          ].map(([key, desc]) => (
            <React.Fragment key={key}>
              <code style={{ ...codeStyle, fontSize: 10, whiteSpace: 'nowrap' }}>{key}</code>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{desc}</span>
            </React.Fragment>
          ))}
        </div>
      </>
    ),
  },
]

const codeStyle = {
  background: 'rgba(124,58,237,0.2)',
  padding: '1px 5px',
  borderRadius: 3,
  color: '#c4b5fd',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11,
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
          <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📖</div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--lavender)', marginBottom: 8 }}>
              Want the full How To? guide?
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              The guide covers every feature in detail — commands, AI loops, export, and more — with a searchable tabbed layout.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
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
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 20 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === step ? '#7c3aed' : i < step ? '#4c1d95' : '#2a2a4a',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }} onClick={() => setStep(i)} />
          ))}
        </div>

        {/* Content */}
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>{current.icon}</span>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--lavender)' }}>
              {current.title}
            </h2>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            {current.content}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 24,
        }}>
          <button
            onClick={handleSkip}
            style={{
              background: 'none', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer',
              fontSize: 12, padding: '6px 0',
              transition: 'color 0.1s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--text-secondary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            Skip tour
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)}>
                ← Back
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={handleNext} icon={isLast ? '✦' : null}>
              {isLast ? 'Finish' : 'Next →'}
            </Button>
          </div>
        </div>

        {/* Step counter */}
        <div style={{
          textAlign: 'center', marginTop: 10,
          fontSize: 10, color: 'var(--text-muted)',
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
      }}
    >
      <div onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

const modalStyle = {
  width: 460,
  maxWidth: '90vw',
  background: 'var(--bg-card)',
  border: '1px solid rgba(124,58,237,0.4)',
  borderRadius: 16,
  padding: '24px',
  boxShadow: '0 0 60px #7c3aed22, 0 24px 48px rgba(0,0,0,0.6)',
}
