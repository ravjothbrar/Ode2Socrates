import React, { useEffect, useRef, useState } from 'react'
import { useStore } from '../../store/useStore'
import { buildVocab, textToVector, cosineSimilarity } from '../../api/groq'
import { getNodesBySpace } from '../../db/indexedDB'

const SIMILARITY_THRESHOLD = 0.32

// Runs in background; surfaces cross-space semantic matches
export function useWormholeDetector() {
  const { spaces, nodes, activeSpaceId, setWormholes, setWormholeVisible } = useStore()
  const timerRef = useRef(null)

  useEffect(() => {
    if (spaces.length < 2) return
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      try {
        // Load all nodes from all spaces
        const allSpaceNodes = {}
        for (const space of spaces) {
          if (space.id === activeSpaceId) {
            allSpaceNodes[space.id] = nodes.filter(n => n.spaceId === space.id)
          } else {
            allSpaceNodes[space.id] = await getNodesBySpace(space.id)
          }
        }

        const wormholes = []
        const spaceIds = spaces.map(s => s.id)

        for (let i = 0; i < spaceIds.length; i++) {
          for (let j = i + 1; j < spaceIds.length; j++) {
            const nodesA = allSpaceNodes[spaceIds[i]].filter(n => n.content?.trim())
            const nodesB = allSpaceNodes[spaceIds[j]].filter(n => n.content?.trim())
            if (!nodesA.length || !nodesB.length) continue

            const allTexts = [...nodesA, ...nodesB].map(n => n.content)
            const vocab = buildVocab(allTexts)

            for (const nA of nodesA) {
              const vecA = textToVector(nA.content, vocab)
              for (const nB of nodesB) {
                const vecB = textToVector(nB.content, vocab)
                const sim = cosineSimilarity(vecA, vecB)
                if (sim >= SIMILARITY_THRESHOLD) {
                  wormholes.push({
                    id: `${nA.id}-${nB.id}`,
                    spaceAId: spaceIds[i],
                    nodeAId: nA.id,
                    nodeAContent: nA.content.slice(0, 60),
                    spaceBId: spaceIds[j],
                    nodeBId: nB.id,
                    nodeBContent: nB.content.slice(0, 60),
                    sim: Math.round(sim * 100) / 100,
                  })
                }
              }
            }
          }
        }

        // Deduplicate: keep highest sim per node pair
        const seen = new Set()
        const unique = wormholes
          .sort((a, b) => b.sim - a.sim)
          .filter(w => {
            const key = [w.nodeAId, w.nodeBId].sort().join('-')
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          .slice(0, 10)

        setWormholes(unique)
        setWormholeVisible(unique.length > 0)
      } catch (err) {
        console.warn('Wormhole detection error:', err)
      }
    }, 3000) // debounce 3s after any change

    return () => clearTimeout(timerRef.current)
  }, [nodes.length, spaces.length, activeSpaceId])
}

// Panel showing detected wormholes
export default function WormholePanel() {
  const { wormholes, wormholeVisible, spaces, nodes, switchSpace } = useStore()
  const setView = useStore(s => s.setView)
  const [open, setOpen] = useState(false)
  const [traveling, setTraveling] = useState(false)

  if (!wormholeVisible || wormholes.length === 0) return null

  function getSpaceName(id) {
    return spaces.find(s => s.id === id)?.name || 'Unknown Space'
  }

  function navigateTo(targetSpaceId, targetNodeId) {
    setTraveling(true)
    setOpen(false)
    setTimeout(() => {
      switchSpace(targetSpaceId)
      setView('canvas')
      setTimeout(() => {
        const targetNode = useStore.getState().nodes.find(n => n.id === targetNodeId)
        if (targetNode) {
          window.dispatchEvent(new CustomEvent('ode2-pan-to-node', {
            detail: { nodeId: targetNodeId, x: targetNode.x, y: targetNode.y },
          }))
        }
        setTraveling(false)
      }, 200)
    }, 450)
  }

  return (
    <>
      {/* Wormhole travel animation overlay */}
      {traveling && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'radial-gradient(ellipse at center, rgba(236,72,153,0.7) 0%, rgba(124,58,237,0.5) 35%, transparent 70%)',
          animation: 'wormhole-travel 0.65s ease-out forwards',
          pointerEvents: 'none',
        }} />
      )}

      {/* Trigger button — bottom-right to avoid Controls (canvas) and legend (graph) */}
      <button
        onClick={() => setOpen(v => !v)}
        title={`${wormholes.length} cross-space connection${wormholes.length > 1 ? 's' : ''} detected`}
        style={{
          position: 'absolute',
          bottom: 16,
          right: 14,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          background: open ? 'rgba(236,72,153,0.2)' : 'rgba(13,13,26,0.9)',
          border: `1px solid ${open ? '#ec4899' : 'rgba(236,72,153,0.4)'}`,
          borderRadius: 99,
          padding: '6px 14px',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          color: '#f9a8d4',
          fontSize: 15, fontWeight: 600,
          boxShadow: '0 0 16px rgba(236,72,153,0.2)',
          animation: 'pulse 3s infinite',
          transition: 'all 0.15s',
        }}
      >
        <span style={{ fontSize: 18 }}>🌀</span>
        <span>{wormholes.length} Wormhole{wormholes.length > 1 ? 's' : ''}</span>
      </button>

      {/* Panel — opens upward from bottom-right */}
      {open && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            bottom: 60,
            right: 14,
            zIndex: 200,
            width: 330,
            maxHeight: 680,
            background: 'rgba(13,13,26,0.97)',
            border: '1px solid rgba(236,72,153,0.3)',
            borderRadius: 14,
            boxShadow: '0 0 40px rgba(236,72,153,0.15), 0 16px 32px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '14px 16px 10px',
            borderBottom: '1px solid rgba(236,72,153,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f9a8d4', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🌀</span> Cross-Space Wormholes
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
                Semantic bridges across your spaces
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}
            >×</button>
          </div>

          {/* Wormhole list */}
          <div style={{ padding: '8px 0', overflowY: 'auto', flex: 1 }}>
            {wormholes.map(w => (
              <div key={w.id} style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(42,42,74,0.4)',
              }}>
                {/* Similarity score bar */}
                <div style={{
                  fontSize: 11, color: '#ec4899', marginBottom: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <div style={{ flex: 1, height: 2, background: 'rgba(42,42,74,0.6)', borderRadius: 1 }}>
                    <div style={{ width: `${w.sim * 100}%`, height: '100%', background: '#ec4899', borderRadius: 1 }} />
                  </div>
                  <span>{Math.round(w.sim * 100)}% match</span>
                </div>

                {/* Node A */}
                <WormholeNode
                  spaceName={getSpaceName(w.spaceAId)}
                  content={w.nodeAContent}
                  targetSpaceName={getSpaceName(w.spaceBId)}
                  onNavigate={() => navigateTo(w.spaceBId, w.nodeBId)}
                />

                <div style={{ textAlign: 'center', fontSize: 18, color: '#ec4899', margin: '6px 0', opacity: 0.6 }}>⟷</div>

                {/* Node B */}
                <WormholeNode
                  spaceName={getSpaceName(w.spaceBId)}
                  content={w.nodeBContent}
                  targetSpaceName={getSpaceName(w.spaceAId)}
                  onNavigate={() => navigateTo(w.spaceAId, w.nodeAId)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {open && <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setOpen(false)} />}
    </>
  )
}

function WormholeNode({ spaceName, content, targetSpaceName, onNavigate }) {
  const [h, setH] = useState(false)
  const [btnH, setBtnH] = useState(false)
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(42,42,74,0.4)',
      borderRadius: 8,
      padding: '8px 11px',
    }}>
      <div style={{
        fontSize: 11, color: '#ec4899',
        fontFamily: "'JetBrains Mono', monospace",
        marginBottom: 4, letterSpacing: '0.04em',
      }}>
        ◈ {spaceName}
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: 8 }}>
        "{content}{content.length >= 60 ? '…' : ''}"
      </div>
      <button
        onClick={onNavigate}
        onMouseEnter={() => setBtnH(true)}
        onMouseLeave={() => setBtnH(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 11px',
          background: btnH ? 'rgba(236,72,153,0.2)' : 'rgba(236,72,153,0.08)',
          border: `1px solid ${btnH ? '#ec4899' : 'rgba(236,72,153,0.35)'}`,
          borderRadius: 6,
          color: '#f9a8d4',
          fontSize: 12, fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s',
          boxShadow: btnH ? '0 0 12px rgba(236,72,153,0.3)' : 'none',
        }}
      >
        <span>🌀</span>
        <span>Jump to {targetSpaceName}</span>
      </button>
    </div>
  )
}
