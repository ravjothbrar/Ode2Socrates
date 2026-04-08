import React, { useCallback, useMemo, useEffect, useState, useRef } from 'react'
import {
  ReactFlow, Background, Controls,
  MarkerType, useReactFlow, ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useStore } from '../../store/useStore'
import NodeCard from './NodeCard'
import GhostEdge from './GhostEdge'
import SolidEdge from './SolidEdge'

const NODE_TYPES = { nodeCard: NodeCard }
const EDGE_TYPES = { ghost: GhostEdge, solid: SolidEdge }

// Approximate node dimensions for overlap detection
const NODE_W = 260
const NODE_H = 120

function OverlapDialog({ nodeA, nodeB, onMerge, onSeparate }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(8,8,15,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000,
    }} onClick={onSeparate}>
      <div
        className="animate-slide-up"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(124,58,237,0.5)',
          borderRadius: 14,
          padding: '22px 28px',
          maxWidth: 380,
          boxShadow: '0 0 40px #7c3aed22, 0 16px 40px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ fontSize: 24, textAlign: 'center', marginBottom: 10 }}>⊕</div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--lavender)', textAlign: 'center', marginBottom: 8 }}>
          Merge notes?
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.7, marginBottom: 16 }}>
          These notes are overlapping. Would you like to merge them into one, or keep them separate?
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={onMerge}
            style={{
              padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
              background: 'linear-gradient(135deg, #6d28d9, #5b21b6)',
              border: '1px solid #7c3aed',
              color: '#f5f3ff', fontSize: 13, fontWeight: 600,
              transition: 'all 0.15s',
              boxShadow: '0 0 12px #7c3aed33',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px #7c3aed55'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 12px #7c3aed33'}
          >✦ Merge</button>
          <button
            onClick={onSeparate}
            style={{
              padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed88'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >Keep separate</button>
        </div>
      </div>
    </div>
  )
}

function CanvasInner() {
  const {
    nodes: storeNodes, edges: storeEdges,
    updateNodePosition, persistNodePosition,
    updateNode, deleteNode, createEdge, edges: allEdges,
    setSelectedNodeIds,
    activeSpaceId,
  } = useStore()

  const { setCenter } = useReactFlow()
  const [overlapPrompt, setOverlapPrompt] = useState(null) // { nodeA, nodeB }

  const flowNodes = useMemo(() => storeNodes.map(n => ({
    id: n.id,
    type: 'nodeCard',
    position: { x: n.x || 0, y: n.y || 0 },
    data: { ...n },
  })), [storeNodes])

  const flowEdges = useMemo(() => storeEdges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: e.ghost ? 'ghost' : 'solid',
    data: { label: e.label },
    markerEnd: e.ghost ? undefined : { type: MarkerType.ArrowClosed, color: '#7c3aed' },
  })), [storeEdges])

  // Listen for pan-to-node events from Context Chat citations
  useEffect(() => {
    function onPanToNode(e) {
      const { x, y } = e.detail
      setCenter(x + 130, y + 60, { zoom: 1.2, duration: 600 })
    }
    window.addEventListener('ode2-pan-to-node', onPanToNode)
    return () => window.removeEventListener('ode2-pan-to-node', onPanToNode)
  }, [setCenter])

  const checkOverlap = useCallback((movedNode) => {
    const ax = movedNode.position.x
    const ay = movedNode.position.y
    const spaceNodes = storeNodes.filter(n => n.spaceId === activeSpaceId && n.id !== movedNode.id)

    for (const other of spaceNodes) {
      const bx = other.x || 0
      const by = other.y || 0
      const dx = Math.abs(ax - bx)
      const dy = Math.abs(ay - by)
      if (dx < NODE_W * 0.85 && dy < NODE_H * 1.1) {
        return other
      }
    }
    return null
  }, [storeNodes, activeSpaceId])

  const onNodeDragStop = useCallback((_, node) => {
    persistNodePosition(node.id, node.position.x, node.position.y)

    const overlapping = checkOverlap(node)
    if (overlapping) {
      setOverlapPrompt({ nodeA: node, nodeB: overlapping })
    }
  }, [persistNodePosition, checkOverlap])

  const onNodeDrag = useCallback((_, node) => {
    updateNodePosition(node.id, node.position.x, node.position.y)
  }, [updateNodePosition])

  const onConnect = useCallback(async (params) => {
    await createEdge({ source: params.source, target: params.target })
  }, [createEdge])

  const onSelectionChange = useCallback(({ nodes }) => {
    setSelectedNodeIds(nodes.map(n => n.id))
  }, [setSelectedNodeIds])

  // Merge: combine content of nodeA into nodeB, delete nodeA, reroute edges
  const handleMerge = useCallback(async () => {
    if (!overlapPrompt) return
    const { nodeA, nodeB } = overlapPrompt
    setOverlapPrompt(null)

    const aNode = storeNodes.find(n => n.id === nodeA.id)
    const bNode = storeNodes.find(n => n.id === nodeB.id)
    if (!aNode || !bNode) return

    const mergedContent = `${bNode.content}\n\n---\n\n${aNode.content}`
    await updateNode(bNode.id, { content: mergedContent })
    await deleteNode(aNode.id)
  }, [overlapPrompt, storeNodes, updateNode, deleteNode])

  // Separate: nudge nodeA away from nodeB
  const handleSeparate = useCallback(() => {
    if (!overlapPrompt) return
    const { nodeA, nodeB } = overlapPrompt
    setOverlapPrompt(null)

    const ax = nodeA.position.x
    const ay = nodeA.position.y
    const bx = nodeB.x || 0
    const by = nodeB.y || 0

    // Calculate direction and push nodeA away
    let dx = ax - bx
    let dy = ay - by
    const dist = Math.sqrt(dx * dx + dy * dy) || 1
    dx = dx / dist
    dy = dy / dist

    const pushX = bx + dx * (NODE_W + 20)
    const pushY = by + dy * (NODE_H + 20)

    updateNodePosition(nodeA.id, pushX, pushY)
    persistNodePosition(nodeA.id, pushX, pushY)
  }, [overlapPrompt, updateNodePosition, persistNodePosition])

  return (
    <>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        onNodeDragStop={onNodeDragStop}
        onNodeDrag={onNodeDrag}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2.5}
        deleteKeyCode={null}
        panOnDrag={[0, 1, 2]}
        selectionOnDrag={false}
        selectNodesOnDrag={false}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'var(--bg-deep)' }}
      >
        <Background color="#2a2a4a" gap={32} size={1} style={{ opacity: 0.35 }} />
        <Controls position="bottom-left" style={{ bottom: 90 }} />
      </ReactFlow>

      {overlapPrompt && (
        <OverlapDialog
          nodeA={overlapPrompt.nodeA}
          nodeB={overlapPrompt.nodeB}
          onMerge={handleMerge}
          onSeparate={handleSeparate}
        />
      )}
    </>
  )
}

export default function CanvasView() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <CanvasInner />
      </ReactFlowProvider>
    </div>
  )
}
