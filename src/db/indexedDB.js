import { openDB } from 'idb'

const DB_NAME = 'Ode2Socrates'
const DB_VERSION = 1

let _db = null

async function getDB() {
  if (_db) return _db
  _db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('spaces')) {
        const spaces = db.createObjectStore('spaces', { keyPath: 'id' })
        spaces.createIndex('updatedAt', 'updatedAt')
      }
      if (!db.objectStoreNames.contains('nodes')) {
        const nodes = db.createObjectStore('nodes', { keyPath: 'id' })
        nodes.createIndex('spaceId', 'spaceId')
        nodes.createIndex('updatedAt', 'updatedAt')
      }
      if (!db.objectStoreNames.contains('edges')) {
        const edges = db.createObjectStore('edges', { keyPath: 'id' })
        edges.createIndex('spaceId', 'spaceId')
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' })
      }
    },
  })
  return _db
}

// ─── Spaces ────────────────────────────────────────────────────────────────

export async function getAllSpaces() {
  const db = await getDB()
  return db.getAll('spaces')
}

export async function saveSpace(space) {
  const db = await getDB()
  return db.put('spaces', { ...space, updatedAt: Date.now() })
}

export async function deleteSpace(id) {
  const db = await getDB()
  const tx = db.transaction(['spaces', 'nodes', 'edges'], 'readwrite')
  await tx.objectStore('spaces').delete(id)
  const nodes = await tx.objectStore('nodes').index('spaceId').getAll(id)
  for (const n of nodes) await tx.objectStore('nodes').delete(n.id)
  const edges = await tx.objectStore('edges').index('spaceId').getAll(id)
  for (const e of edges) await tx.objectStore('edges').delete(e.id)
  await tx.done
}

// ─── Nodes ─────────────────────────────────────────────────────────────────

export async function getNodesBySpace(spaceId) {
  const db = await getDB()
  return db.getAllFromIndex('nodes', 'spaceId', spaceId)
}

export async function saveNode(node) {
  const db = await getDB()
  return db.put('nodes', { ...node, updatedAt: Date.now() })
}

export async function deleteNode(id) {
  const db = await getDB()
  return db.delete('nodes', id)
}

// ─── Edges ─────────────────────────────────────────────────────────────────

export async function getEdgesBySpace(spaceId) {
  const db = await getDB()
  return db.getAllFromIndex('edges', 'spaceId', spaceId)
}

export async function saveEdge(edge) {
  const db = await getDB()
  return db.put('edges', edge)
}

export async function deleteEdge(id) {
  const db = await getDB()
  return db.delete('edges', id)
}

// ─── Settings ──────────────────────────────────────────────────────────────

export async function getSetting(key) {
  const db = await getDB()
  const row = await db.get('settings', key)
  return row ? row.value : null
}

export async function setSetting(key, value) {
  const db = await getDB()
  return db.put('settings', { key, value })
}
