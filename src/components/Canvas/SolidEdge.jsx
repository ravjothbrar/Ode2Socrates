import React, { useState } from 'react'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react'
import { useStore } from '../../store/useStore'

export default function SolidEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd, data }) {
  const { deleteEdge } = useStore()
  const [hovered, setHovered] = useState(false)

  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: hovered ? '#a78bfa' : '#7c3aed',
          strokeWidth: hovered ? 2 : 1.5,
          opacity: hovered ? 1 : 0.7,
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
              padding: '3px 8px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              fontSize: 11, color: 'var(--text-muted)',
            }}>
              {data?.label && <span style={{ color: 'var(--text-secondary)', marginRight: 6 }}>{data.label}</span>}
              <button
                onClick={() => deleteEdge(id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#f87171', fontSize: 11, padding: 0,
                }}
              >✕ Remove</button>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
