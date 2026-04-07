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
  const { initialized, init, view, setView } = useStore()
  const [typingText, setTypingText] = useState('')
  const [loadError, setLoadError] = useState(null)
  const canvasRef = useRef(null)

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
    // Emit a custom event that the canvas view can pick up
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

          {/* Socrates ASCII logo — outside topbar, overlaid on canvas top-left */}
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
            <SocratesLogo size="canvas" showTitle={false} />
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
      <pre style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '8px', lineHeight: '10px',
        color: '#4c1d95',
        textAlign: 'center',
        animation: 'pulse 2s infinite',
        userSelect: 'none',
      }}>
{`      .-"""""-.
    .'          '.
   /   O      O   \\
  :           ^    :
  |    \\___/       |
   \\             /
    '.          .'
      '-......-'

   initialising…`}
      </pre>
      {error ? (
        <div style={{
          color: '#f87171', fontSize: 13,
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid #7f1d1d',
          borderRadius: 8, padding: '10px 20px',
        }}>
          Error: {error}
        </div>
      ) : (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, color: 'var(--text-muted)',
          letterSpacing: '0.1em',
        }}>
          loading indexedDB…
        </div>
      )}
    </div>
  )
}
