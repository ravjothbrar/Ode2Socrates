import JSZip from 'jszip'

function sanitizeFilename(s) {
  return s.replace(/[^a-z0-9\-_\s]/gi, '').trim().replace(/\s+/g, '-').slice(0, 60) || 'node'
}

export function downloadFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function nodeToMarkdown(node) {
  const header = [
    `---`,
    `id: ${node.id}`,
    `type: ${node.type || 'note'}`,
    `tags: ${(node.tags || []).join(', ')}`,
    `created: ${new Date(node.createdAt).toISOString()}`,
    `updated: ${new Date(node.updatedAt).toISOString()}`,
    `---`,
    ``,
  ].join('\n')
  return header + node.content
}

export function exportNode(node) {
  const name = sanitizeFilename(node.content.slice(0, 40)) || node.id
  downloadFile(nodeToMarkdown(node), `${name}.md`)
}

export async function exportSpace(space, nodes, edges) {
  const zip = new JSZip()
  const folder = zip.folder(sanitizeFilename(space.name) || 'space')

  for (const node of nodes) {
    const name = sanitizeFilename(node.content.slice(0, 40)) || node.id
    folder.file(`${name}-${node.id.slice(0, 6)}.md`, nodeToMarkdown(node))
  }

  const mapping = {
    space: { id: space.id, name: space.name },
    nodes: nodes.map(n => ({ id: n.id, type: n.type, tags: n.tags, x: n.x, y: n.y })),
    edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target, ghost: e.ghost, label: e.label })),
    exportedAt: new Date().toISOString(),
  }
  folder.file('_mapping.json', JSON.stringify(mapping, null, 2))

  const blob = await zip.generateAsync({ type: 'blob' })
  const name = sanitizeFilename(space.name) || 'ode2socrates-export'
  downloadFile(blob, `${name}.zip`, 'application/zip')
}
