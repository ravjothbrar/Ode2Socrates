import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useStore } from '../../store/useStore'

export default function CommandPalette() {
  const {
    commandPaletteOpen, closeCommandPalette, setView, view,
    spaces, activeSpaceId, switchSpace, createSpace, deleteSpace,
    setSettingsOpen, selectedNodeIds, nodes,
    setGroqApiKey, groqApiKey,
  } = useStore()

  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        useStore.getState().toggleCommandPalette()
      }
      if (e.key === 'Escape' && commandPaletteOpen) closeCommandPalette()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [commandPaletteOpen])

  const commands = useMemo(() => {
    const cmds = [
      {
        id: 'canvas',
        label: 'Switch to Canvas View',
        icon: '🗺',
        category: 'View',
        active: view === 'canvas',
        action: () => { setView('canvas'); closeCommandPalette() },
        keywords: ['canvas', 'spatial', 'map'],
      },
      {
        id: 'graph',
        label: 'Switch to Graph View',
        icon: '🕸',
        category: 'View',
        active: view === 'graph',
        action: () => { setView('graph'); closeCommandPalette() },
        keywords: ['graph', 'network', 'force'],
      },
      {
        id: 'settings',
        label: 'Open Settings',
        icon: '⚙',
        category: 'App',
        action: () => { setSettingsOpen(true); closeCommandPalette() },
        keywords: ['settings', 'api', 'key', 'groq', 'export'],
      },
      {
        id: 'new-space',
        label: 'Create New Space',
        icon: '✦',
        category: 'Spaces',
        action: async () => {
          const name = prompt('Space name:')
          if (name) await createSpace(name)
          closeCommandPalette()
        },
        keywords: ['new', 'space', 'create', 'workspace'],
      },
      ...spaces.map(s => ({
        id: `switch-${s.id}`,
        label: `Switch to "${s.name}"`,
        icon: '◈',
        category: 'Spaces',
        active: s.id === activeSpaceId,
        action: () => { switchSpace(s.id); closeCommandPalette() },
        keywords: ['switch', 'space', s.name.toLowerCase()],
      })),
    ]

    if (selectedNodeIds.length > 0) {
      cmds.push({
        id: 'gap-analysis',
        label: `Analyse Knowledge Gaps (${selectedNodeIds.length} nodes)`,
        icon: '🔍',
        category: 'AI',
        action: () => {
          const selected = nodes.filter(n => selectedNodeIds.includes(n.id))
          useStore.getState().triggerGapAnalysis?.(selected)
          closeCommandPalette()
        },
        keywords: ['analyse', 'gaps', 'knowledge', 'ai', 'cluster'],
      })
    }

    return cmds
  }, [view, spaces, activeSpaceId, selectedNodeIds, nodes])

  const filtered = useMemo(() => {
    if (!query.trim()) return commands
    const q = query.toLowerCase()
    return commands.filter(c =>
      c.label.toLowerCase().includes(q) ||
      (c.keywords || []).some(k => k.includes(q))
    )
  }, [commands, query])

  const [highlighted, setHighlighted] = useState(0)
  useEffect(() => setHighlighted(0), [filtered])

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter') { filtered[highlighted]?.action() }
    if (e.key === 'Escape') closeCommandPalette()
  }

  if (!commandPaletteOpen) return null

  const categories = [...new Set(filtered.map(c => c.category))]

  return (
    <div
      onClick={closeCommandPalette}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(8,8,15,0.75)',
        backdropFilter: 'blur(12px)', display: 'flex',
        alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '15vh', zIndex: 2000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="animate-slide-up"
        style={{
          width: 520,
          maxWidth: '90vw',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          boxShadow: '0 0 60px #7c3aed33, 0 32px 64px rgba(0,0,0,0.7)',
          overflow: 'hidden',
        }}
      >
        {/* Search */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ color: 'var(--purple-mid)', fontSize: 16 }}>⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search commands…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 14, color: 'var(--text-primary)',
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <kbd style={{
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
            borderRadius: 4, padding: '2px 6px', fontSize: 11, color: 'var(--text-muted)',
            fontFamily: "'JetBrains Mono', monospace",
          }}>ESC</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '6px 0' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No commands found
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat}>
                <div style={{
                  padding: '8px 16px 4px',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {cat}
                </div>
                {filtered
                  .filter(c => c.category === cat)
                  .map((cmd, i) => {
                    const globalIdx = filtered.indexOf(cmd)
                    const isHighlighted = globalIdx === highlighted
                    return (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setHighlighted(globalIdx)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                          padding: '9px 16px', background: isHighlighted ? 'rgba(124,58,237,0.15)' : 'transparent',
                          border: 'none', cursor: 'pointer', textAlign: 'left',
                          borderLeft: isHighlighted ? '2px solid var(--purple-mid)' : '2px solid transparent',
                          transition: 'all 0.1s',
                        }}
                      >
                        <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{cmd.icon}</span>
                        <span style={{
                          fontSize: 13, color: isHighlighted ? 'var(--lavender)' : 'var(--text-primary)',
                          fontWeight: cmd.active ? 600 : 400, flex: 1,
                        }}>
                          {cmd.label}
                        </span>
                        {cmd.active && (
                          <span style={{
                            fontSize: 10, color: 'var(--purple-bright)',
                            background: 'rgba(167,139,250,0.15)', borderRadius: 4,
                            padding: '2px 6px', fontFamily: "'JetBrains Mono', monospace",
                          }}>active</span>
                        )}
                      </button>
                    )
                  })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: 12, alignItems: 'center',
          fontSize: 11, color: 'var(--text-muted)',
        }}>
          <span><kbd style={kbdStyle}>↑↓</kbd> navigate</span>
          <span><kbd style={kbdStyle}>↵</kbd> select</span>
          <span><kbd style={kbdStyle}>esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}

const kbdStyle = {
  background: 'var(--bg-hover)',
  border: '1px solid var(--border)',
  borderRadius: 3,
  padding: '1px 5px',
  fontSize: 10,
  fontFamily: "'JetBrains Mono', monospace",
  marginRight: 4,
  color: 'var(--text-secondary)',
}
