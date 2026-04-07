import React, { useState } from 'react'
import { BaseEdge, EdgeLabelRenderer, getStraightPath, getBezierPath } from '@xyflow/react'
import { useStore } from '../../store/useStore'

export default function GhostEdge({ id, sourceX, sourceY, targetX, targetY, data }) {
  const { solidifyEdge, deleteEdge } = useStore()
  const [hovered, setHovered] = useState(false)

  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: '#7c3aed',
          strokeWidth: hovered ? 2 : 1,
          strokeDasharray: '6 4',
          opacity: hovered ? 0.7 : 0.35,
          transition: 'all 0.15s',
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered && (
            <div className="animate-fade-in" style={{
              display: 'flex', gap: 4, background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 6,
              padding: '3px 6px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}>
              <GhostBtn
                title="Solidify link"
                onClick={() => solidifyEdge(id)}
                color="#22c55e"
              >⬡ Link</GhostBtn>
              <GhostBtn
                title="Dismiss"
                onClick={() => deleteEdge(id)}
                color="#ef4444"
              >✕</GhostBtn>
            </div>
          )}
          {!hovered && (
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#7c3aed', opacity: 0.5,
              cursor: 'pointer',
            }} />
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

function GhostBtn({ children, onClick, title, color }) {
  const [h, setH] = useState(false)
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? `${color}22` : 'transparent',
        border: `1px solid ${h ? color : 'transparent'}`,
        borderRadius: 4, padding: '2px 7px',
        fontSize: 11, cursor: 'pointer',
        color: h ? color : 'var(--text-secondary)',
        transition: 'all 0.1s',
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >{children}</button>
  )
}
