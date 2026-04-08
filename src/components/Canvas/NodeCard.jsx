import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Handle, Position } from '@xyflow/react'
import ReactMarkdown from 'react-markdown'
import { useStore } from '../../store/useStore'
import { exportNode } from '../../utils/export'

const TYPE_META = {
  blur:    { label: 'Blur',    color: '#7c3aed', bg: '#1a0a3e' },
  claim:   { label: '#claim',  color: '#0ea5e9', bg: '#0a1e2e' },
  task:    { label: '#task',   color: '#22c55e', bg: '#0a1e14' },
  question:{ label: '#question', color: '#f59e0b', bg: '#1e1400' },
  insight: { label: '#insight', color: '#ec4899', bg: '#1e0a1a' },
  quote:   { label: '#quote',  color: '#a78bfa', bg: '#130d2e' },
  note:    { label: '#note',   color: '#94a3b8', bg: '#12121f' },
}

export default function NodeCard({ id, data }) {
  const { updateNode, deleteNode, wormholeLinks } = useStore()
  const wormholeLink = wormholeLinks?.[id]
  const [editing, setEditing] = useState(data.isNew || false)
  const [content, setContent] = useState(data.content || '')
  const [hovered, setHovered] = useState(false)
  const textareaRef = useRef(null)

  const meta = TYPE_META[data.type] || TYPE_META.note

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus()
      const len = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(len, len)
    }
  }, [editing])

  const save = useCallback(async () => {
    if (content.trim() !== data.content) {
      await updateNode(id, { content: content.trim() })
    }
    setEditing(false)
  }, [content, data.content, id, updateNode])

  function onKeyDown(e) {
    if (e.key === 'Escape') { setContent(data.content); setEditing(false) }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save() }
  }

  return (
    <div
      className="animate-fade-in"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: meta.bg,
        border: `1px solid ${hovered || editing ? meta.color + '88' : '#2d2d5e'}`,
        borderRadius: 12,
        width: 260,
        minHeight: 80,
        padding: 0,
        boxShadow: hovered
          ? `0 0 0 1px ${meta.color}33, 0 8px 24px rgba(0,0,0,0.4)`
          : '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'all 0.15s ease',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 10px 6px',
        borderBottom: `1px solid ${meta.color}22`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
            color: meta.color, fontFamily: "'JetBrains Mono', monospace",
            textTransform: 'uppercase',
          }}>
            {meta.label}
          </span>
          {wormholeLink && (
            <button
              title="Jump to wormhole link"
              onClick={e => {
                e.stopPropagation()
                window.dispatchEvent(new CustomEvent('ode2-wormhole-navigate', {
                  detail: { targetSpaceId: wormholeLink.targetSpaceId, targetNodeId: wormholeLink.targetNodeId }
                }))
              }}
              style={{
                background: 'rgba(236,72,153,0.18)', border: '1px solid rgba(236,72,153,0.5)',
                borderRadius: 99, padding: '1px 6px',
                cursor: 'pointer', fontSize: 10, color: '#f9a8d4',
                display: 'flex', alignItems: 'center', gap: 3,
                transition: 'all 0.12s', lineHeight: 1.4,
                animation: 'pulse 3s infinite',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(236,72,153,0.32)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(236,72,153,0.18)'}
            >🌀</button>
          )}
        </div>
        {hovered && (
          <div style={{ display: 'flex', gap: 4 }}>
            <IconBtn title="Edit" onClick={() => setEditing(true)}>✎</IconBtn>
            <IconBtn title="Export .md" onClick={() => exportNode({ ...data, id })}>⬇</IconBtn>
            <IconBtn title="Delete" danger onClick={() => deleteNode(id)}>✕</IconBtn>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px 12px' }}>
        {editing ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            onBlur={save}
            onKeyDown={onKeyDown}
            placeholder="Type here… (Enter to save, Shift+Enter for newline)"
            style={{
              width: '100%', minHeight: 80, resize: 'vertical',
              background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontSize: 13, lineHeight: 1.6,
              fontFamily: "'Inter', sans-serif",
            }}
          />
        ) : (
          <div
            className="node-markdown"
            onDoubleClick={() => setEditing(true)}
            style={{
              fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)',
              cursor: 'text', minHeight: 40,
              wordBreak: 'break-word', overflowWrap: 'anywhere',
            }}
          >
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Double-click to edit…
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      {data.tags?.length > 0 && (
        <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {data.tags.map(t => (
            <span key={t} style={{
              fontSize: 10, padding: '2px 6px', borderRadius: 4,
              background: `${meta.color}22`, color: meta.color,
              fontFamily: "'JetBrains Mono', monospace",
            }}>{t}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function IconBtn({ children, onClick, title, danger }) {
  const [h, setH] = useState(false)
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? (danger ? 'rgba(239,68,68,0.2)' : 'rgba(124,58,237,0.2)') : 'transparent',
        border: 'none', borderRadius: 4, padding: '1px 5px',
        color: h ? (danger ? '#f87171' : '#c4b5fd') : 'var(--text-muted)',
        cursor: 'pointer', fontSize: 12, transition: 'all 0.1s',
      }}
    >{children}</button>
  )
}
