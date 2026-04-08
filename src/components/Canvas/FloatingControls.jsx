import React, { useState } from 'react'
import { useStore } from '../../store/useStore'

function Pill({ children, active, onClick, title }) {
  const [h, setH] = useState(false)
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 12px',
        background: active
          ? 'rgba(124,58,237,0.3)'
          : h ? 'rgba(167,139,250,0.12)' : 'rgba(13,13,26,0.85)',
        border: `1px solid ${active ? '#7c3aed' : h ? '#7c3aed88' : 'rgba(42,42,74,0.8)'}`,
        borderRadius: 99,
        color: active ? '#e9d5ff' : h ? '#c4b5fd' : '#94a3b8',
        cursor: 'pointer',
        fontSize: 12, fontWeight: active ? 600 : 400,
        transition: 'all 0.15s ease',
        backdropFilter: 'blur(12px)',
        whiteSpace: 'nowrap',
        boxShadow: active ? '0 0 12px #7c3aed33' : h ? '0 0 8px #7c3aed22' : 'none',
      }}
    >
      {children}
    </button>
  )
}

export default function FloatingControls() {
  const {
    view, setView,
    spaces, activeSpaceId, switchSpace, createSpace, deleteSpace,
    toggleCommandPalette,
    nodes, edges,
  } = useStore()

  const [spacesOpen, setSpacesOpen] = useState(false)
  const activeSpace = spaces.find(s => s.id === activeSpaceId)

  return (
    <>
      {/* Top-right floating strip */}
      <div style={{
        position: 'absolute',
        top: 14,
        right: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        zIndex: 50,
      }}>
        {/* Stats */}
        <div style={{
          fontSize: 10,
          color: 'rgba(148,163,184,0.6)',
          fontFamily: "'JetBrains Mono', monospace",
          padding: '4px 10px',
          background: 'rgba(13,13,26,0.7)',
          border: '1px solid rgba(42,42,74,0.6)',
          borderRadius: 99,
          backdropFilter: 'blur(12px)',
        }}>
          {nodes.filter(n => n.spaceId === activeSpaceId).length}n ·{' '}
          {edges.filter(e => e.spaceId === activeSpaceId && !e.ghost).length}l
        </div>

        {/* View toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(13,13,26,0.85)',
          border: '1px solid rgba(42,42,74,0.8)',
          borderRadius: 99,
          padding: 3,
          gap: 2,
          backdropFilter: 'blur(12px)',
        }}>
          <Pill active={view === 'canvas'} onClick={() => setView('canvas')}>⊡ Canvas</Pill>
          <Pill active={view === 'graph'} onClick={() => setView('graph')}>⬡ Graph</Pill>
        </div>

        {/* Spaces */}
        <div style={{ position: 'relative' }}>
          <Pill onClick={() => setSpacesOpen(v => !v)} active={spacesOpen}>
            ◈ {activeSpace?.name || 'Space'} ▾
          </Pill>
          {spacesOpen && (
            <div
              className="animate-fade-in"
              style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                background: 'rgba(13,13,26,0.97)',
                border: '1px solid var(--border)',
                borderRadius: 12, width: 220,
                zIndex: 500,
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ padding: '6px 0' }}>
                {spaces.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                      onClick={() => { switchSpace(s.id); setSpacesOpen(false) }}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 14px',
                        background: s.id === activeSpaceId ? 'rgba(124,58,237,0.15)' : 'transparent',
                        border: 'none', cursor: 'pointer',
                        borderLeft: s.id === activeSpaceId ? '2px solid #7c3aed' : '2px solid transparent',
                      }}
                      onMouseEnter={e => { if (s.id !== activeSpaceId) e.currentTarget.style.background = 'rgba(124,58,237,0.08)' }}
                      onMouseLeave={e => { if (s.id !== activeSpaceId) e.currentTarget.style.background = 'transparent' }}
                    >
                      <span style={{ color: 'var(--purple-mid)', fontSize: 11 }}>
                        {s.id === activeSpaceId ? '◉' : '○'}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{s.name}</span>
                    </button>
                    {/* Delete space button */}
                    <button
                      title="Delete space"
                      onClick={async (e) => {
                        e.stopPropagation()
                        if (spaces.length === 1) return
                        if (window.confirm(`Delete space "${s.name}"? This cannot be undone.`)) {
                          await deleteSpace(s.id)
                        }
                      }}
                      disabled={spaces.length === 1}
                      style={{
                        background: 'transparent', border: 'none',
                        cursor: spaces.length === 1 ? 'default' : 'pointer',
                        color: spaces.length === 1 ? 'transparent' : 'var(--text-muted)',
                        fontSize: 11, padding: '8px 10px',
                        transition: 'color 0.1s',
                        opacity: spaces.length === 1 ? 0 : 1,
                      }}
                      onMouseEnter={e => { if (spaces.length > 1) e.currentTarget.style.color = '#f87171' }}
                      onMouseLeave={e => { if (spaces.length > 1) e.currentTarget.style.color = 'var(--text-muted)' }}
                    >✕</button>
                  </div>
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
                    cursor: 'pointer', color: 'var(--purple-bright)', fontSize: 12,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span>✦</span> New Space
                </button>
              </div>
            </div>
          )}
          {spacesOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 499 }} onClick={() => setSpacesOpen(false)} />
          )}
        </div>

        {/* Cmd+K */}
        <Pill onClick={toggleCommandPalette} title="Command Palette (Ctrl+K)">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>⌘K</span>
        </Pill>
      </div>
    </>
  )
}
