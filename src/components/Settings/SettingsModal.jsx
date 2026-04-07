import React, { useState } from 'react'
import { useStore } from '../../store/useStore'
import Button from '../Button'
import { exportSpace } from '../../utils/export'

export default function SettingsModal() {
  const { settingsOpen, setSettingsOpen, groqApiKey, setGroqApiKey,
          spaces, activeSpaceId, nodes, edges } = useStore()
  const [keyInput, setKeyInput] = useState(groqApiKey)
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!settingsOpen) return null

  async function handleSave() {
    await setGroqApiKey(keyInput.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleExport() {
    const space = spaces.find(s => s.id === activeSpaceId)
    const spaceNodes = nodes.filter(n => n.spaceId === activeSpaceId)
    const spaceEdges = edges.filter(e => e.spaceId === activeSpaceId)
    await exportSpace(space, spaceNodes, spaceEdges)
  }

  return (
    <div
      onClick={() => setSettingsOpen(false)}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(8,8,15,0.85)',
        backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="animate-slide-up"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          width: 480,
          maxWidth: '90vw',
          boxShadow: '0 0 40px #7c3aed22, 0 24px 48px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>⚙</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Settings</span>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', fontSize: 18, padding: '2px 6px', borderRadius: 4,
            }}
          >×</button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Groq API Key */}
          <Section title="🔑 Groq API Key" subtitle="Required for all AI features. Stored locally only, never transmitted.">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  placeholder="gsk_..."
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '8px 40px 8px 12px',
                    color: 'var(--text-primary)',
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', monospace",
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button
                  onClick={() => setShowKey(v => !v)}
                  style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)',
                    cursor: 'pointer', fontSize: 12, padding: '2px',
                  }}
                >{showKey ? '🙈' : '👁'}</button>
              </div>
              <Button onClick={handleSave} variant="primary" size="md">
                {saved ? '✓ Saved' : 'Save'}
              </Button>
            </div>
            {!groqApiKey && (
              <p style={{ color: '#f87171', fontSize: 11, marginTop: 6 }}>
                ⚠ No API key set. AI features will be disabled.
              </p>
            )}
          </Section>

          <Divider />

          {/* Export */}
          <Section title="📦 Export Data" subtitle="Download your current space as Markdown files and a JSON mapping.">
            <Button onClick={handleExport} variant="default" icon="⬇" size="md">
              Export Current Space (.zip)
            </Button>
          </Section>

          <Divider />

          {/* About */}
          <Section title="ℹ About" subtitle="">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              <p><span style={{ color: 'var(--purple-bright)' }}>Ode2Socrates</span> — A Socratic, spatial note-taking tool.</p>
              <p style={{ marginTop: 4 }}>All data stored locally in IndexedDB. Nothing leaves your browser except Groq API calls.</p>
              <p style={{ marginTop: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>
                Built with React + React Flow + Groq
              </p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, subtitle, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
      {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{subtitle}</p>}
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />
}
