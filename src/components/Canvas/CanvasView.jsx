import React, { useCallback, useMemo, useRef } from 'react'
import {
  ReactFlow, Background, Controls, MiniMap,
  addEdge, useNodesState, useEdgesState, Panel,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useStore } from '../../store/useStore'
import NodeCard from './NodeCard'
import GhostEdge from './GhostEdge'
import SolidEdge from './SolidEdge'

const NODE_TYPES = { nodeCard: NodeCard }
const EDGE_TYPES = { ghost: GhostEdge, solid: SolidEdge }

export default function CanvasView() {
  const {
    nodes: storeNodes, edges: storeEdges,
    updateNodePosition, persistNodePosition,
    createEdge, setSelectedNodeIds,
    activeSpaceId,
  } = useStore()

  const flowNodes = useMemo(() => storeNodes.map(n => ({
    id: n.id,
    type: 'nodeCard',
    position: { x: n.x || 0, y: n.y || 0 },
    data: { ...n },
    selected: false,
  })), [storeNodes])

  const flowEdges = useMemo(() => storeEdges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: e.ghost ? 'ghost' : 'solid',
    data: { label: e.label },
    markerEnd: e.ghost ? undefined : { type: MarkerType.ArrowClosed, color: '#7c3aed' },
  })), [storeEdges])

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
    <div style={{ width: '100%', height: '100%', background: 'var(--bg-deep)' }}>
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
        <Background
          color="#2a2a4a"
          gap={32}
          size={1}
          style={{ opacity: 0.4 }}
        />
        <Controls
          position="bottom-left"
          style={{ bottom: 80 }}
        />
        <MiniMap
          nodeColor={n => {
            const type = n.data?.type || 'note'
            const colors = {
              blur: '#7c3aed', claim: '#0ea5e9', task: '#22c55e',
              question: '#f59e0b', insight: '#ec4899', quote: '#a78bfa', note: '#475569',
            }
            return colors[type] || '#475569'
          }}
          style={{ background: 'var(--bg-card)', bottom: 80, right: 8 }}
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  )
}
