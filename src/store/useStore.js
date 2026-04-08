import { create } from 'zustand'
import { nanoid } from './nanoid'
import * as db from '../db/indexedDB'

const DEFAULT_SPACE = {
  id: 'default',
  name: 'My Space',
  createdAt: Date.now(),
}

export const useStore = create((set, get) => ({
  // ─── App state ─────────────────────────────────────────────────
  initialized: false,
  view: 'canvas',
  activeSpaceId: 'default',
  spaces: [DEFAULT_SPACE],
  nodes: [],
  edges: [],
  selectedNodeIds: [],

  // ─── UI overlays ───────────────────────────────────────────────
  commandPaletteOpen: false,
  settingsOpen: false,
  tourOpen: false,           // replaces welcomeOpen
  howToOpen: false,
  groqApiKey: '',

  // ─── Sidebar ───────────────────────────────────────────────────
  sidebarTab: 'gadfly',      // 'gadfly' | 'chat'
  sidebarContent: null,
  sidebarLoading: false,

  // ─── Blur input ────────────────────────────────────────────────
  blurText: '',
  blurFocused: false,
  blurWordCount: 0,

  // ─── Theme ─────────────────────────────────────────────────────
  isDarkMode: true,

  // ─── Wormholes ─────────────────────────────────────────────────
  wormholes: [],             // [{ id, spaceAId, nodeAId, spaceBId, nodeBId, sim }]
  wormholeVisible: false,

  // ─── Init ──────────────────────────────────────────────────────
  async init() {
    const [spaces, key, hasSeenTour] = await Promise.all([
      db.getAllSpaces(),
      db.getSetting('groqApiKey'),
      db.getSetting('hasSeenTour'),
    ])
    const finalSpaces = spaces.length ? spaces : [DEFAULT_SPACE]
    if (!spaces.length) await db.saveSpace(DEFAULT_SPACE)

    const activeSpaceId = finalSpaces[0].id
    const [nodes, edges] = await Promise.all([
      db.getNodesBySpace(activeSpaceId),
      db.getEdgesBySpace(activeSpaceId),
    ])

    set({
      initialized: true,
      spaces: finalSpaces,
      activeSpaceId,
      nodes,
      edges,
      groqApiKey: key || '',
      tourOpen: !hasSeenTour,
    })
  },

  // ─── Space actions ─────────────────────────────────────────────
  async switchSpace(spaceId) {
    const [nodes, edges] = await Promise.all([
      db.getNodesBySpace(spaceId),
      db.getEdgesBySpace(spaceId),
    ])
    set({ activeSpaceId: spaceId, nodes, edges, selectedNodeIds: [] })
  },

  async createSpace(name) {
    const space = { id: nanoid(), name, createdAt: Date.now() }
    await db.saveSpace(space)
    set(s => ({ spaces: [...s.spaces, space] }))
    get().switchSpace(space.id)
    return space
  },

  async renameSpace(id, name) {
    const space = get().spaces.find(s => s.id === id)
    if (!space) return
    const updated = { ...space, name }
    await db.saveSpace(updated)
    set(s => ({ spaces: s.spaces.map(sp => sp.id === id ? updated : sp) }))
  },

  async deleteSpace(id) {
    await db.deleteSpace(id)
    const remaining = get().spaces.filter(s => s.id !== id)
    set({ spaces: remaining })
    if (get().activeSpaceId === id) {
      if (remaining.length) get().switchSpace(remaining[0].id)
      else {
        const ns = { id: nanoid(), name: 'My Space', createdAt: Date.now() }
        await db.saveSpace(ns)
        set({ spaces: [ns] })
        get().switchSpace(ns.id)
      }
    }
  },

  // ─── Node actions ──────────────────────────────────────────────
  async createNode({ content = '', type = 'blur', x, y, tags = [] } = {}) {
    const { activeSpaceId, nodes } = get()
    const pos = nodes.length
    const defaultX = x ?? 200 + (pos % 4) * 320 + Math.random() * 40
    const defaultY = y ?? 150 + Math.floor(pos / 4) * 240 + Math.random() * 40

    const node = {
      id: nanoid(),
      spaceId: activeSpaceId,
      content,
      type,
      tags,
      x: defaultX,
      y: defaultY,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      embedding: null,
    }
    await db.saveNode(node)
    set(s => ({ nodes: [...s.nodes, node] }))
    return node
  },

  async updateNode(id, patch) {
    const node = get().nodes.find(n => n.id === id)
    if (!node) return
    const updated = { ...node, ...patch, updatedAt: Date.now() }
    await db.saveNode(updated)
    set(s => ({ nodes: s.nodes.map(n => n.id === id ? updated : n) }))
    return updated
  },

  async deleteNode(id) {
    await db.deleteNode(id)
    await Promise.all(
      get().edges
        .filter(e => e.source === id || e.target === id)
        .map(e => db.deleteEdge(e.id))
    )
    set(s => ({
      nodes: s.nodes.filter(n => n.id !== id),
      edges: s.edges.filter(e => e.source !== id && e.target !== id),
      selectedNodeIds: s.selectedNodeIds.filter(nid => nid !== id),
    }))
  },

  updateNodePosition(id, x, y) {
    set(s => ({ nodes: s.nodes.map(n => n.id === id ? { ...n, x, y } : n) }))
  },

  persistNodePosition(id, x, y) {
    const node = get().nodes.find(n => n.id === id)
    if (node) db.saveNode({ ...node, x, y })
  },

  // ─── Edge actions ──────────────────────────────────────────────
  async createEdge({ source, target, ghost = false, label = '' }) {
    const existing = get().edges.find(
      e => e.source === source && e.target === target
    )
    if (existing) return existing
    const edge = {
      id: nanoid(),
      spaceId: get().activeSpaceId,
      source,
      target,
      ghost,
      label,
      createdAt: Date.now(),
    }
    await db.saveEdge(edge)
    set(s => ({ edges: [...s.edges, edge] }))
    return edge
  },

  async solidifyEdge(id) {
    const edge = get().edges.find(e => e.id === id)
    if (!edge) return
    const updated = { ...edge, ghost: false }
    await db.saveEdge(updated)
    set(s => ({ edges: s.edges.map(e => e.id === id ? updated : e) }))
  },

  async deleteEdge(id) {
    await db.deleteEdge(id)
    set(s => ({ edges: s.edges.filter(e => e.id !== id) }))
  },

  // ─── Selection ─────────────────────────────────────────────────
  setSelectedNodeIds(ids) { set({ selectedNodeIds: ids }) },

  // ─── Wormholes ─────────────────────────────────────────────────
  setWormholes(wormholes) { set({ wormholes }) },
  setWormholeVisible(v) { set({ wormholeVisible: v }) },

  // ─── UI actions ────────────────────────────────────────────────
  setView(view) { set({ view }) },
  toggleCommandPalette() { set(s => ({ commandPaletteOpen: !s.commandPaletteOpen })) },
  closeCommandPalette() { set({ commandPaletteOpen: false }) },
  setSettingsOpen(v) { set({ settingsOpen: v }) },
  setHowToOpen(v) { set({ howToOpen: v }) },

  async setTourOpen(v) {
    if (!v) await db.setSetting('hasSeenTour', true)
    set({ tourOpen: v })
  },

  setSidebarTab(tab) { set({ sidebarTab: tab }) },
  setBlurText(t) { set({ blurText: t }) },
  setBlurFocused(v) { set({ blurFocused: v }) },
  setBlurWordCount(n) { set({ blurWordCount: n }) },

  async setGroqApiKey(key) {
    await db.setSetting('groqApiKey', key)
    set({ groqApiKey: key })
  },

  setSidebarContent(c) { set({ sidebarContent: c }) },
  setSidebarLoading(v) { set({ sidebarLoading: v }) },

  toggleDarkMode() {
    const next = !get().isDarkMode
    set({ isDarkMode: next })
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
  },

  // Exposed by sidebar component for gap analysis
  triggerGapAnalysis: null,
}))
