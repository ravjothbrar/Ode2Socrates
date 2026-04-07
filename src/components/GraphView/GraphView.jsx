import React, { useEffect, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import { useStore } from '../../store/useStore'

const TYPE_COLORS = {
  blur: '#7c3aed', claim: '#0ea5e9', task: '#22c55e',
  question: '#f59e0b', insight: '#ec4899', quote: '#a78bfa', note: '#475569',
}

export default function GraphView() {
  const svgRef = useRef(null)
  const { nodes, edges, createEdge, deleteNode, setSelectedNodeIds, selectedNodeIds } = useStore()

  useEffect(() => {
    if (!svgRef.current) return

    const container = svgRef.current.parentElement
    const W = container.clientWidth
    const H = container.clientHeight

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg
      .attr('width', W)
      .attr('height', H)
      .style('background', 'var(--bg-deep)')

    const defs = svg.append('defs')

    // Arrow marker
    defs.append('marker')
      .attr('id', 'graph-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#7c3aed')

    // Ghost arrow
    defs.append('marker')
      .attr('id', 'ghost-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#7c3aed')
      .attr('opacity', 0.4)

    // Glow filter
    const filter = defs.append('filter').attr('id', 'glow')
    filter.append('feGaussianBlur').attr('stdDeviation', 3).attr('result', 'coloredBlur')
    const merge = filter.append('feMerge')
    merge.append('feMergeNode').attr('in', 'coloredBlur')
    merge.append('feMergeNode').attr('in', 'SourceGraphic')

    const g = svg.append('g')

    // Zoom/pan
    const zoom = d3.zoom()
      .scaleExtent([0.2, 3])
      .on('zoom', e => g.attr('transform', e.transform))
    svg.call(zoom)

    // Prepare data
    const nodeData = nodes.map(n => ({ ...n, _id: n.id }))
    const edgeData = edges
      .filter(e => nodes.find(n => n.id === e.source) && nodes.find(n => n.id === e.target))
      .map(e => ({ ...e, source: e.source, target: e.target }))

    // Force simulation
    const sim = d3.forceSimulation(nodeData)
      .force('link', d3.forceLink(edgeData).id(d => d.id).distance(180).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide(70))

    // Draw edges
    const linkG = g.append('g').attr('class', 'links')
    const link = linkG.selectAll('line')
      .data(edgeData)
      .join('line')
      .attr('stroke', d => d.ghost ? '#7c3aed' : '#7c3aed')
      .attr('stroke-opacity', d => d.ghost ? 0.3 : 0.6)
      .attr('stroke-width', d => d.ghost ? 1 : 1.5)
      .attr('stroke-dasharray', d => d.ghost ? '5 4' : null)
      .attr('marker-end', d => d.ghost ? 'url(#ghost-arrow)' : 'url(#graph-arrow)')

    // Draw nodes
    const nodeG = g.append('g').attr('class', 'nodes')
    const node = nodeG.selectAll('g')
      .data(nodeData)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(
        d3.drag()
          .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
          .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y })
          .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null })
      )

    // Node circle
    node.append('circle')
      .attr('r', d => Math.max(24, Math.min(40, 12 + (d.content?.length || 0) / 10)))
      .attr('fill', d => (TYPE_COLORS[d.type] || '#475569') + '22')
      .attr('stroke', d => TYPE_COLORS[d.type] || '#475569')
      .attr('stroke-width', 1.5)
      .attr('filter', 'url(#glow)')

    // Node type label
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-12px')
      .attr('font-size', '8px')
      .attr('fill', d => TYPE_COLORS[d.type] || '#475569')
      .attr('font-family', "'JetBrains Mono', monospace")
      .attr('letter-spacing', '0.05em')
      .text(d => (d.type || 'note').toUpperCase())

    // Node content preview
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '4px')
      .attr('font-size', '10px')
      .attr('fill', '#e2e8f0')
      .attr('font-family', "'Inter', sans-serif")
      .attr('font-weight', 400)
      .text(d => {
        const txt = (d.content || '').replace(/[#*`\n]/g, ' ').trim()
        return txt.slice(0, 22) + (txt.length > 22 ? '…' : '')
      })

    // Selection highlight
    node.on('click', (e, d) => {
      e.stopPropagation()
      const isSelected = selectedNodeIds.includes(d.id)
      if (e.shiftKey) {
        setSelectedNodeIds(
          isSelected
            ? selectedNodeIds.filter(id => id !== d.id)
            : [...selectedNodeIds, d.id]
        )
      } else {
        setSelectedNodeIds(isSelected ? [] : [d.id])
      }
    })

    svg.on('click', () => setSelectedNodeIds([]))

    // Update selected state
    function updateSelection() {
      node.select('circle')
        .attr('stroke-width', d => selectedNodeIds.includes(d.id) ? 2.5 : 1.5)
        .attr('stroke', d => selectedNodeIds.includes(d.id) ? '#c4b5fd' : (TYPE_COLORS[d.type] || '#475569'))
    }
    updateSelection()

    // Tick
    sim.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    return () => sim.stop()
  }, [nodes, edges, selectedNodeIds])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg ref={svgRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute', top: 16, left: 16,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '12px 16px',
        fontSize: 12, color: 'var(--text-secondary)',
        fontFamily: "'JetBrains Mono', monospace",
        lineHeight: 1.8,
      }}>
        <div style={{ color: 'var(--purple-bright)', fontWeight: 600, marginBottom: 6, fontSize: 11 }}>
          GRAPH VIEW
        </div>
        <div>{nodes.length} nodes · {edges.filter(e => !e.ghost).length} links</div>
        {edges.filter(e => e.ghost).length > 0 && (
          <div style={{ color: 'var(--text-muted)' }}>
            {edges.filter(e => e.ghost).length} ghost links
          </div>
        )}
        <div style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 10 }}>
          Shift+click to multi-select
        </div>
        {selectedNodeIds.length > 1 && (
          <div style={{
            marginTop: 6, color: 'var(--purple-bright)', fontSize: 10,
            background: 'rgba(124,58,237,0.15)', padding: '4px 8px',
            borderRadius: 6, border: '1px solid rgba(124,58,237,0.3)',
          }}>
            {selectedNodeIds.length} selected — Cmd+K → Analyse Gaps
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '10px 14px',
      }}>
        <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 6, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>Types</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace" }}>
                {type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
