import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import Button from './Button'

const ASCII_MINI = `
  /\\
 /φ \\  Ode2Socrates
/____\\
`

export default function TopBar() {
  const {
    spaces, activeSpaceId, switchSpace, createSpace,
    view, setView, setSettingsOpen, setWelcomeOpen,
    groqApiKey, nodes, edges,
    toggleCommandPalette,
  } = useStore()

  const [spacesOpen, setSpacesOpen] = useState(false)
  const activeSpace = spaces.find(s => s.id === activeSpaceId)

  return (
    <header style={{
      height: 'var(--topbar-h)',
      background: 'rgba(8,8,15,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 10,
      flexShrink: 0,
      zIndex: 200,
      position: 'relative',
    }}>
      {/* Logo */}
      <button
        onClick={() => setWelcomeOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(124,58,237,0.08)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 8,
          padding: '4px 12px',
          cursor: 'pointer',
          transition: 'all 0.15s',
          color: 'var(--purple-bright)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.15)'; e.currentTarget.style.borderColor = '#7c3aed' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.08)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)' }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#a78bfa', letterSpacing: '0.1em' }}>⬡</span>
        <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif", color: '#c4b5fd' }}>
          Ode2Socrates
        </span>
      </button>

      {/* Divider */}
      <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

      {/* View toggle */}
      <div style={{
        display: 'flex', background: 'var(--bg-card)',
        border: '1px solid var(--border)', borderRadius: 8,
        overflow: 'hidden', padding: 2, gap: 2,
      }}>
        <ViewBtn active={view === 'canvas'} onClick={() => setView('canvas')} icon="⊡">Canvas</ViewBtn>
        <ViewBtn active={view === 'graph'} onClick={() => setView('graph')} icon="⬡">Graph</ViewBtn>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Stats */}
      <div style={{
        fontSize: 11, color: 'var(--text-muted)',
        fontFamily: "'JetBrains Mono', monospace",
        display: 'flex', gap: 10,
      }}>
        <span>{nodes.filter(n => n.spaceId === activeSpaceId).length} nodes</span>
        <span style={{ color: 'var(--border)' }}>·</span>
        <span>{edges.filter(e => e.spaceId === activeSpaceId && !e.ghost).length} links</span>
      </div>

      <div style={{ width: 1, height: 20, background: 'var(--border)' }} />

      {/* Command Palette */}
      <Button size="sm" variant="ghost" onClick={toggleCommandPalette} icon="⌘" title="Command Palette (Ctrl+K)">
        Ctrl+K
      </Button>

      {/* Spaces dropdown */}
      <div style={{ position: 'relative' }}>
        <Button
          size="sm"
          variant="default"
          icon="◈"
          onClick={() => setSpacesOpen(v => !v)}
        >
          {activeSpace?.name || 'Space'} ▾
        </Button>

        {spacesOpen && (
          <div
            className="animate-fade-in"
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, width: 220, zIndex: 500,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '6px 0' }}>
              {spaces.map(s => (
                <button
                  key={s.id}
                  onClick={() => { switchSpace(s.id); setSpacesOpen(false) }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 14px', background: s.id === activeSpaceId ? 'rgba(124,58,237,0.15)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                  onMouseEnter={e => { if (s.id !== activeSpaceId) e.currentTarget.style.background = 'rgba(124,58,237,0.08)' }}
                  onMouseLeave={e => { if (s.id !== activeSpaceId) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ color: 'var(--purple-mid)', fontSize: 12 }}>
                    {s.id === activeSpaceId ? '◉' : '○'}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{s.name}</span>
                </button>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', padding: '6px 0' }}>
              <button
                onClick={async () => {
                  const name = prompt('New space name:')
                  if (name) { await createSpace(name); setSpacesOpen(false) }
                }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left', color: 'var(--purple-bright)',
                  fontSize: 12,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span>✦</span> New Space
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <Button
        size="sm"
        variant="default"
        icon="⚙"
        onClick={() => setSettingsOpen(true)}
        title="Settings"
      >
        {!groqApiKey && <span style={{ color: '#f87171', fontSize: 10 }}>⚠</span>}
      </Button>

      {/* Click outside to close spaces */}
      {spacesOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 499 }}
          onClick={() => setSpacesOpen(false)}
        />
      )}
    </header>
  )
}

function ViewBtn({ active, onClick, children, icon }) {
  const [h, setH] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '4px 10px', borderRadius: 6,
        background: active ? 'rgba(124,58,237,0.3)' : h ? 'rgba(124,58,237,0.1)' : 'transparent',
        border: active ? '1px solid rgba(124,58,237,0.5)' : '1px solid transparent',
        color: active ? 'var(--purple-pale)' : h ? 'var(--text-primary)' : 'var(--text-secondary)',
        cursor: 'pointer', fontSize: 12, fontWeight: active ? 600 : 400,
        transition: 'all 0.1s',
      }}
    >
      <span style={{ fontSize: 12 }}>{icon}</span>
      {children}
    </button>
  )
}
