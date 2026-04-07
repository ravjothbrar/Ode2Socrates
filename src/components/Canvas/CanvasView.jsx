import React, { useCallback, useMemo, useEffect, useRef } from 'react'
import {
  ReactFlow, Background, Controls, MiniMap,
  MarkerType, useReactFlow, ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useStore } from '../../store/useStore'
import NodeCard from './NodeCard'
import GhostEdge from './GhostEdge'
import SolidEdge from './SolidEdge'

const NODE_TYPES = { nodeCard: NodeCard }
const EDGE_TYPES = { ghost: GhostEdge, solid: SolidEdge }

function CanvasInner() {
  const {
    nodes: storeNodes, edges: storeEdges,
    updateNodePosition, persistNodePosition,
    createEdge, setSelectedNodeIds,
  } = useStore()

  const { setCenter } = useReactFlow()

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

  const onNodeDragStop = useCallback((_, node) => {
    persistNodePosition(node.id, node.position.x, node.position.y)
  }, [persistNodePosition])

  const onNodeDrag = useCallback((_, node) => {
    updateNodePosition(node.id, node.position.x, node.position.y)
  }, [updateNodePosition])

  const onConnect = useCallback(async (params) => {
    await createEdge({ source: params.source, target: params.target })
  }, [createEdge])

  const onSelectionChange = useCallback(({ nodes }) => {
    setSelectedNodeIds(nodes.map(n => n.id))
  }, [setSelectedNodeIds])

  return (
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
      panOnDrag={[1, 2]}
      selectionOnDrag
      selectNodesOnDrag={false}
      style={{ background: 'var(--bg-deep)' }}
    >
      <Background color="#2a2a4a" gap={32} size={1} style={{ opacity: 0.35 }} />
      <Controls position="bottom-left" style={{ bottom: 90 }} />
      <MiniMap
        nodeColor={n => {
          const type = n.data?.type || 'note'
          const colors = {
            blur: '#7c3aed', claim: '#0ea5e9', task: '#22c55e',
            question: '#f59e0b', insight: '#ec4899', quote: '#a78bfa', note: '#475569',
          }
          return colors[type] || '#475569'
        }}
        style={{ bottom: 90 }}
        position="bottom-right"
      />
    </ReactFlow>
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
