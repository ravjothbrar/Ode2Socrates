import React, { useState } from 'react'
import { useStore } from '../../store/useStore'
import Button from '../Button'

const SECTIONS = [
  {
    id: 'start',
    icon: '✦',
    label: 'Getting Started',
    content: <GettingStarted />,
  },
  {
    id: 'blur',
    icon: '◈',
    label: 'The Blur Input',
    content: <BlurSection />,
  },
  {
    id: 'nodes',
    icon: '⬡',
    label: 'Node Types & Tags',
    content: <NodesSection />,
  },
  {
    id: 'canvas',
    icon: '⊡',
    label: 'Canvas Navigation',
    content: <CanvasSection />,
  },
  {
    id: 'graph',
    icon: '🕸',
    label: 'Graph View',
    content: <GraphSection />,
  },
  {
    id: 'gadfly',
    icon: '⚡',
    label: 'The Gadfly (Passive AI)',
    content: <GadflySection />,
  },
  {
    id: 'chat',
    icon: '💬',
    label: 'Context Chat (RAG)',
    content: <ChatSection />,
  },
  {
    id: 'wormholes',
    icon: '🌀',
    label: 'Cross-Space Wormholes',
    content: <WormholeSection />,
  },
  {
    id: 'gaps',
    icon: '🔍',
    label: 'Knowledge Gap Analysis',
    content: <GapsSection />,
  },
  {
    id: 'keys',
    icon: '⌘',
    label: 'Keyboard Shortcuts',
    content: <KeysSection />,
  },
  {
    id: 'export',
    icon: '📦',
    label: 'Export & Data',
    content: <ExportSection />,
  },
]

export default function HowToPage() {
  const { howToOpen, setHowToOpen } = useStore()
  const [active, setActive] = useState('start')
  const [search, setSearch] = useState('')

  if (!howToOpen) return null

  const filtered = search.trim()
    ? SECTIONS.filter(s => s.label.toLowerCase().includes(search.toLowerCase()))
    : SECTIONS

  const current = SECTIONS.find(s => s.id === active) || SECTIONS[0]

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8,8,15,0.92)',
        backdropFilter: 'blur(16px)',
        zIndex: 3500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={() => setHowToOpen(false)}
    >
      <div
        className="animate-slide-up"
        onClick={e => e.stopPropagation()}
        style={{
          width: 1640, maxWidth: '97vw',
          height: '92vh', maxHeight: 1280,
          background: 'var(--bg-card)',
          border: '1px solid rgba(124,58,237,0.35)',
          borderRadius: 24,
          boxShadow: '0 0 100px #7c3aed22, 0 48px 96px rgba(0,0,0,0.7)',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* Left nav */}
        <div style={{
          width: 420,
          flexShrink: 0,
          background: 'rgba(13,13,26,0.6)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '32px 28px 20px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}>
            <div style={{
              fontSize: 26, fontWeight: 700, color: 'var(--purple-bright)',
              letterSpacing: '0.05em', marginBottom: 16,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              HOW TO?
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              style={{
                width: '100%', background: 'var(--bg-input)',
                border: '1px solid var(--border)', borderRadius: 10,
                padding: '10px 16px', fontSize: 22,
                color: 'var(--text-primary)', outline: 'none',
                fontFamily: "'Inter', sans-serif",
              }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Nav links */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
            {filtered.map(s => (
              <button
                key={s.id}
                onClick={() => { setActive(s.id); setSearch('') }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 28px',
                  background: active === s.id ? 'rgba(124,58,237,0.2)' : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  borderLeft: active === s.id ? '4px solid #7c3aed' : '4px solid transparent',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => { if (active !== s.id) e.currentTarget.style.background = 'rgba(124,58,237,0.08)' }}
                onMouseLeave={e => { if (active !== s.id) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: 26, width: 36, textAlign: 'center' }}>{s.icon}</span>
                <span style={{
                  fontSize: 24, fontWeight: active === s.id ? 600 : 400,
                  color: active === s.id ? 'var(--lavender)' : 'var(--text-secondary)',
                }}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Title bar */}
          <div style={{
            padding: '32px 48px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{ fontSize: 40 }}>{current.icon}</span>
              <h2 style={{ fontSize: 32, fontWeight: 700, color: 'var(--lavender)' }}>
                {current.label}
              </h2>
            </div>
            <button
              onClick={() => setHowToOpen(false)}
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                fontSize: 36, padding: '4px 12px', borderRadius: 8,
                transition: 'color 0.1s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >×</button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
            <div style={{ fontSize: 'clamp(13px, 1.1vw, 17px)', color: 'var(--text-secondary)', lineHeight: 1.85 }}>
              {current.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section content components ────────────────────────────────────────────

const H = ({ children }) => (
  <h3 style={{ fontSize: 'clamp(13px, 1.1vw, 17px)', fontWeight: 700, color: 'var(--text-primary)', margin: '18px 0 6px' }}>{children}</h3>
)
const P = ({ children }) => <p style={{ marginBottom: 8 }}>{children}</p>
const C = ({ children }) => (
  <code style={{
    background: 'rgba(124,58,237,0.2)', padding: '1px 5px',
    borderRadius: 3, color: '#c4b5fd',
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
  }}>{children}</code>
)
const Li = ({ children }) => <li style={{ marginBottom: 5 }}>{children}</li>
const Callout = ({ children, color = '#7c3aed' }) => (
  <div style={{
    background: `${color}11`, border: `1px solid ${color}33`,
    borderRadius: 8, padding: '10px 14px', margin: '12px 0',
    fontSize: 12, lineHeight: 1.7,
  }}>{children}</div>
)
const ShortcutRow = ({ keys, desc }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
    <C>{keys}</C>
    <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{desc}</span>
  </div>
)

function GettingStarted() {
  return (
    <>
      <P>Ode2Socrates is a local-first, spatial note-taking app with a Socratic AI engine. Here's how to get up and running in 2 minutes.</P>
      <H>1. Add your Groq API key</H>
      <P>Open <strong style={{ color: '#c4b5fd' }}>Settings ⚙</strong> (top-right floating controls) and paste your Groq API key. It's stored only in your browser — never sent anywhere except directly to Groq's inference API.</P>
      <Callout>Get a free Groq API key at <strong style={{ color: '#c4b5fd' }}>console.groq.com</strong>. Groq is required for all AI features. It's free for generous usage.</Callout>
      <H>2. Create your first thought</H>
      <P>Click in <strong style={{ color: '#c4b5fd' }}>The Blur</strong> at the bottom of the screen. Type anything. Press <C>Enter</C> to commit it as a node on the canvas.</P>
      <H>3. Let Socrates challenge you</H>
      <P>After 10 seconds of typing, the <strong style={{ color: '#c4b5fd' }}>Gadfly</strong> in the right sidebar will stream a Socratic challenge or Devil's Advocate provocation. Don't dismiss it — engage with it.</P>
      <H>4. Explore your knowledge graph</H>
      <P>Switch to <strong style={{ color: '#c4b5fd' }}>Graph View</strong> using the top-right controls to see your thoughts as a network. Select a cluster, then press <C>Ctrl+K</C> → <em>Analyse Gaps</em>.</P>
    </>
  )
}

function BlurSection() {
  return (
    <>
      <P>The Blur is the primary input. It's designed for frictionless, keyboard-centric brain dumping. Your hands never need to leave the keyboard.</P>
      <H>Keyboard shortcuts</H>
      <ShortcutRow keys="Enter" desc="Commit as a node on the canvas" />
      <ShortcutRow keys="Shift+Enter" desc="Insert a new line within your text" />
      <ShortcutRow keys="#" desc="Trigger the tag autocomplete menu" />
      <ShortcutRow keys="Esc" desc="Close the tag menu" />
      <H>Tag autocomplete</H>
      <P>Type <C>#</C> anywhere in your text to open the tag picker. Narrow it by typing letters after the <C>#</C>. Hit <C>Enter</C> or click to insert the tag.</P>
      <H>Auto-distillation</H>
      <Callout color="#7c3aed">When you commit a long entry (&gt;200 characters), the AI automatically extracts atomic child nodes — claims, tasks, questions, insights. You can accept each individually or all at once in the Gadfly tab.</Callout>
      <H>Ghost linking</H>
      <P>When a new node is committed, a local semantic similarity check runs against all existing nodes. If a strong match is found, a dashed <strong style={{ color: '#c4b5fd' }}>ghost edge</strong> appears. Hover it to solidify or dismiss the link.</P>
    </>
  )
}

function NodesSection() {
  const types = [
    { tag: '#blur',     color: '#7c3aed', desc: 'Default — raw, unclassified thought' },
    { tag: '#claim',    color: '#0ea5e9', desc: 'A declarative thesis or assertion' },
    { tag: '#task',     color: '#22c55e', desc: 'An action item or to-do' },
    { tag: '#question', color: '#f59e0b', desc: 'An open question to explore' },
    { tag: '#insight',  color: '#ec4899', desc: 'A key realisation or learning' },
    { tag: '#quote',    color: '#a78bfa', desc: 'A quote or reference' },
    { tag: '#note',     color: '#94a3b8', desc: 'A general note' },
  ]
  return (
    <>
      <P>Every node has a type that controls its visual appearance and how the AI classifies it. The type is inferred automatically or set manually via tags.</P>
      <H>Node types</H>
      {types.map(t => (
        <div key={t.tag} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
          <C>{t.tag}</C>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t.desc}</span>
        </div>
      ))}
      <H>Editing nodes</H>
      <P><strong style={{ color: '#c4b5fd' }}>Double-click</strong> a node to edit it inline. Press <C>Enter</C> to save, <C>Esc</C> to cancel.</P>
      <H>Linking nodes</H>
      <P>Drag from the <strong style={{ color: '#c4b5fd' }}>◉ handle</strong> on the left or right edge of a node and drop onto another node to create a directed link.</P>
    </>
  )
}

function CanvasSection() {
  return (
    <>
      <P>The canvas is an infinite, pannable, zoomable spatial workspace. Nodes keep their positions between sessions — stored in IndexedDB.</P>
      <H>Navigation</H>
      <ShortcutRow keys="Drag (empty area)" desc="Pan the canvas" />
      <ShortcutRow keys="Scroll / Pinch" desc="Zoom in and out" />
      <ShortcutRow keys="Ctrl+Scroll" desc="Zoom with keyboard" />
      <H>Selection</H>
      <ShortcutRow keys="Click node" desc="Select a single node" />
      <ShortcutRow keys="Drag (empty)" desc="Lasso-select multiple nodes" />
      <ShortcutRow keys="Shift+Click" desc="Add to selection" />
      <H>MiniMap</H>
      <P>The minimap in the bottom-right corner shows you the full layout of your space and where you are within it. Click to teleport.</P>
    </>
  )
}

function GraphSection() {
  return (
    <>
      <P>Graph View displays your nodes as a D3 force-directed network. Node positions are calculated automatically — useful for seeing the structure of your thinking.</P>
      <H>Switching views</H>
      <P>Use the <strong style={{ color: '#c4b5fd' }}>⊡ Canvas / ⬡ Graph</strong> toggle in the floating top-right controls.</P>
      <H>Interaction</H>
      <ShortcutRow keys="Drag node" desc="Temporarily pin a node's position" />
      <ShortcutRow keys="Click" desc="Select node" />
      <ShortcutRow keys="Shift+Click" desc="Multi-select for gap analysis" />
      <H>Legend</H>
      <P>Each node type has a distinct colour (visible in the bottom-left legend). Ghost edges appear as dashed lines.</P>
    </>
  )
}

function GadflySection() {
  return (
    <>
      <P>The Gadfly is the passive AI tab. Socrates watches what you type and challenges you without being asked.</P>
      <H>How it triggers</H>
      <ul style={{ paddingLeft: 16 }}>
        <Li><strong style={{ color: '#c4b5fd' }}>Active typing</strong>: fires at most once every 10 seconds while you're typing in The Blur.</Li>
        <Li><strong style={{ color: '#c4b5fd' }}>Idle</strong>: pauses when you stop typing. Use the ↻ button to trigger manually.</Li>
      </ul>
      <H>Response types</H>
      <P><C>❓</C> — A Socratic question probing your assumptions or exposing logical gaps.</P>
      <P><C>⚡</C> — A Devil's Advocate challenge: the strongest counter-argument to your position.</P>
      <H>Responding</H>
      <P>Click <strong style={{ color: '#c4b5fd' }}>Answer (spawn node)</strong> to write a response. Your answer creates a connected node on the canvas and kicks off the next exchange.</P>
      <H>Auto-distillation</H>
      <Callout>When you commit a long Blur entry, the Gadfly shows distillation suggestions — atomic child nodes extracted by the AI. Accept individually or all at once.</Callout>
    </>
  )
}

function ChatSection() {
  return (
    <>
      <P>The Context Chat tab is an active AI interface — you drive it. Ask anything about your notes and get answers grounded in what you've actually written.</P>
      <H>How RAG works here</H>
      <ol style={{ paddingLeft: 16 }}>
        <Li>You ask a question.</Li>
        <Li>The app computes local semantic similarity against all nodes in your current Space.</Li>
        <Li>The top 3–5 most relevant nodes are retrieved.</Li>
        <Li>Their text is injected as context into the Groq prompt — invisibly.</Li>
        <Li>The AI answers <em>in light of your actual notes</em>.</Li>
      </ol>
      <H>Node citations</H>
      <P>Responses include inline citations like <C>[Node: "your note text…"]</C>. Click any citation to <strong style={{ color: '#c4b5fd' }}>pan the canvas directly to that node</strong>.</P>
      <H>Conversation memory</H>
      <P>The chat remembers your last 6 exchanges within a session. Use the "Clear" button to start fresh.</P>
      <Callout color="#0ea5e9">Context Chat is great for: "What are my strongest arguments for X?", "Summarise my notes on Y", "What have I said about the relationship between A and B?"</Callout>
    </>
  )
}

function WormholeSection() {
  return (
    <>
      <P>Wormholes are cross-space semantic connections discovered automatically in the background.</P>
      <H>How it works</H>
      <P>When you have 2+ Spaces, Ode2Socrates runs local TF-IDF similarity matching across all your spaces' nodes. If a node in Space A is strongly similar to a node in Space B, a <strong style={{ color: '#c4b5fd' }}>🌀 Wormhole</strong> notification appears.</P>
      <H>The wormhole indicator</H>
      <P>A pulsing 🌀 button appears in the floating controls when wormholes are detected. Click it to open the Wormhole panel showing the cross-space pairs.</P>
      <H>Why this matters</H>
      <Callout color="#ec4899">The best insights often come from unexpected collisions between unrelated domains. A psychological concept you mapped last month may perfectly parallel a business strategy you're developing now. Wormholes surface that.</Callout>
      <H>Interaction</H>
      <P>From the wormhole panel, you can navigate to either space, or create a permanent "bridge" between the two nodes.</P>
    </>
  )
}

function GapsSection() {
  return (
    <>
      <P>Knowledge Gap Analysis sends a selected cluster of nodes to Groq for structural critique.</P>
      <H>How to trigger</H>
      <ol style={{ paddingLeft: 16 }}>
        <Li>In Graph View, <C>Shift+Click</C> to select 2+ nodes.</Li>
        <Li>Press <C>Ctrl+K</C>.</Li>
        <Li>Select <strong style={{ color: '#c4b5fd' }}>Analyse Knowledge Gaps</strong>.</Li>
      </ol>
      <H>What the AI looks for</H>
      <ul style={{ paddingLeft: 16 }}>
        <Li>Missing counter-arguments or opposing views</Li>
        <Li>Logical leaps — unsupported jumps in reasoning</Li>
        <Li>2–3 specific nodes you should explore next</Li>
      </ul>
      <P>Results stream into the Gadfly tab.</P>
    </>
  )
}

function KeysSection() {
  return (
    <>
      <H>Global</H>
      <ShortcutRow keys="Ctrl / ⌘ + K" desc="Open command palette" />
      <ShortcutRow keys="Esc" desc="Close any overlay or modal" />
      <H>The Blur input</H>
      <ShortcutRow keys="Enter" desc="Commit node" />
      <ShortcutRow keys="Shift + Enter" desc="New line within input" />
      <ShortcutRow keys="# + letters" desc="Tag autocomplete" />
      <H>Canvas</H>
      <ShortcutRow keys="Drag (empty area)" desc="Pan" />
      <ShortcutRow keys="Scroll" desc="Zoom" />
      <ShortcutRow keys="Drag handles" desc="Create an edge between nodes" />
      <ShortcutRow keys="Double-click node" desc="Edit node inline" />
      <H>Graph view</H>
      <ShortcutRow keys="Shift + Click" desc="Multi-select nodes" />
      <ShortcutRow keys="Click empty" desc="Deselect all" />
    </>
  )
}

function ExportSection() {
  return (
    <>
      <P>All data is stored locally in IndexedDB. You own it entirely.</P>
      <H>Individual node export</H>
      <P>Hover any node on the canvas → click the <C>⬇</C> icon → downloads a <C>.md</C> file with YAML frontmatter (id, type, tags, timestamps) and the node's Markdown content.</P>
      <H>Bulk space export</H>
      <P>Open <strong style={{ color: '#c4b5fd' }}>Settings ⚙</strong> → <em>Export Current Space (.zip)</em>. This downloads a ZIP containing:</P>
      <ul style={{ paddingLeft: 16 }}>
        <Li>One <C>.md</C> file per node (named by content)</Li>
        <Li>A <C>_mapping.json</C> with all node coordinates, types, and edge relationships</Li>
      </ul>
      <H>Data portability</H>
      <Callout color="#22c55e">The Markdown files are plain text — importable into Obsidian, Notion, or any Markdown editor. The JSON mapping preserves the spatial layout if you ever rebuild the canvas.</Callout>
    </>
  )
}
