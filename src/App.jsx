import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useStore } from './store/useStore'
import TopBar from './components/TopBar'
import CanvasView from './components/Canvas/CanvasView'
import GraphView from './components/GraphView/GraphView'
import BlurInput from './components/BlurInput/BlurInput'
import SocraticSidebar from './components/Sidebar/SocraticSidebar'
import CommandPalette from './components/CommandPalette/CommandPalette'
import SettingsModal from './components/Settings/SettingsModal'
import Tour from './components/Tour/Tour'
import HowToPage from './components/HowTo/HowToPage'
import SocratesLogo from './components/Logo/SocratesLogo'
import FloatingControls from './components/Canvas/FloatingControls'
import WormholePanel, { useWormholeDetector } from './components/Wormhole/WormholeDetector'

function WormholeRunner() {
  useWormholeDetector()
  return null
}

export default function App() {
  const { initialized, init, view, setView, isDarkMode, blurFocused } = useStore()
  const [typingText, setTypingText] = useState('')
  const [loadError, setLoadError] = useState(null)
  const canvasRef = useRef(null)

  // Apply theme on mount and when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    init().catch(err => setLoadError(err.message))
  }, [])

  const handleTyping = useCallback((text) => {
    setTypingText(text)
  }, [])

  // Pan canvas to a specific node (used by Context Chat citations)
  const handleNodeCite = useCallback((nodeId) => {
    const { nodes, setView } = useStore.getState()
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return
    setView('canvas')
    window.dispatchEvent(new CustomEvent('ode2-pan-to-node', { detail: { nodeId, x: node.x, y: node.y } }))
  }, [])

  if (!initialized) {
    return <LoadingScreen error={loadError} />
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg-deep)',
    }}>
      {/* Slim top bar */}
      <TopBar />

      {/* Main area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* Workspace (canvas + logo overlay) */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }} ref={canvasRef}>

          {/* Socrates SVG logo — overlaid on canvas top-left.
              In graph view, shift right so graph stats (at left:170) don't overlap it. */}
          <div
            className="canvas-logo"
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              zIndex: 10,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <SocratesLogo size="canvas" showTitle={false} typing={blurFocused} />
          </div>

          {/* Canvas / Graph */}
          {view === 'canvas' ? <CanvasView /> : <GraphView />}

          {/* Floating controls — top-right */}
          <FloatingControls />

          {/* Wormhole panel — bottom-left */}
          <WormholePanel />

          {/* Blur input — bottom-centre */}
          <BlurInput onTyping={handleTyping} className="blur-input" />
        </div>

        {/* Right sidebar */}
        <SocraticSidebar typingText={typingText} onNodeCite={handleNodeCite} />
      </div>

      {/* Background services */}
      <WormholeRunner />

      {/* Overlays (highest z-index) */}
      <CommandPalette />
      <SettingsModal />
      <Tour />
      <HowToPage />
    </div>
  )
}

function LoadingScreen({ error }) {
  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-deep)', gap: 20,
    }}>
      <div style={{ animation: 'pulse 2s infinite', userSelect: 'none' }}>
        <svg width="80" height="116" viewBox="0 0 120 174" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="44" rx="32" ry="36" stroke="#4c1d95" strokeWidth="2" fill="none"/>
          <circle cx="49" cy="43" r="1.5" fill="#4c1d95"/>
          <circle cx="73" cy="43" r="1.5" fill="#4c1d95"/>
          <path d="M60 46 Q57 54 59 58 Q60 60 61 58 Q63 54 60 46" stroke="#4c1d95" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <path d="M32 62 Q28 72 30 84 Q34 100 42 110 Q50 118 60 120 Q70 118 78 110 Q86 100 90 84 Q92 72 88 62" stroke="#4c1d95" strokeWidth="2" fill="none"/>
          <path d="M30 124 Q46 118 60 120 Q74 118 90 124" stroke="#4c1d95" strokeWidth="2" fill="none"/>
          <path d="M30 124 Q20 132 18 150 Q16 164 20 174 L100 174 Q104 164 102 150 Q100 132 90 124" stroke="#4c1d95" strokeWidth="2" fill="none"/>
        </svg>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
        {error ? `Error: ${error}` : 'loading indexedDB…'}
      </div>
    </div>
  )
}
