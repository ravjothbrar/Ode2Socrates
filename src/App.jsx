import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useStore } from './store/useStore'
import TopBar from './components/TopBar'
import CanvasView from './components/Canvas/CanvasView'
import GraphView from './components/GraphView/GraphView'
import BlurInput from './components/BlurInput/BlurInput'
import SocraticSidebar from './components/Sidebar/SocraticSidebar'
import CommandPalette from './components/CommandPalette/CommandPalette'
import SettingsModal from './components/Settings/SettingsModal'
import WelcomeModal from './components/WelcomeModal'

export default function App() {
  const { initialized, init, view } = useStore()
  const [typingText, setTypingText] = useState('')
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    init().catch(err => setLoadError(err.message))
  }, [])

  const handleTyping = useCallback((text) => {
    setTypingText(text)
  }, [])

  if (!initialized) {
    return <LoadingScreen error={loadError} />
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: '100vw', height: '100vh',
      overflow: 'hidden', background: 'var(--bg-deep)',
    }}>
      <TopBar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Main workspace */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {view === 'canvas' ? <CanvasView /> : <GraphView />}

          {/* Blur Input overlay */}
          <BlurInput onTyping={handleTyping} />
        </div>

        {/* Socratic Sidebar */}
        <SocraticSidebar typingText={typingText} />
      </div>

      {/* Overlays */}
      <CommandPalette />
      <SettingsModal />
      <WelcomeModal />
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
      }}>
{`     .---.
    /     \\
   |  o o  |
   |   ^   |
    \\ --- /
     '---'
   Initialising...`}
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
          Loading IndexedDB…
        </div>
      )}
    </div>
  )
}
