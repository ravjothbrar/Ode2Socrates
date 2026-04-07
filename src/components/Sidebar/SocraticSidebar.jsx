import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useStore } from '../../store/useStore'
import { getSocraticRejoinder, getGapAnalysis } from '../../api/groq'
import Button from '../Button'

export default function SocraticSidebar({ typingText }) {
  const {
    groqApiKey, sidebarContent, setSidebarContent,
    sidebarLoading, setSidebarLoading,
    createNode, createEdge, nodes,
    selectedNodeIds,
  } = useStore()

  const [streamText, setStreamText] = useState('')
  const [conversationHistory, setConversationHistory] = useState([])
  const [answerMode, setAnswerMode] = useState(false)
  const [answerText, setAnswerText] = useState('')
  const abortRef = useRef(null)
  const bottomRef = useRef(null)

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [streamText, sidebarContent])

  // ─── Socratic Rejoinder stream ──────────────────────────────────
  const triggerRejoinder = useCallback(async (text) => {
    if (!groqApiKey || !text?.trim() || text.length < 20) return
    if (abortRef.current) abortRef.current = false
    setSidebarLoading(true)
    setStreamText('')

    let accumulated = ''
    try {
      for await (const chunk of getSocraticRejoinder({
        apiKey: groqApiKey,
        text,
        context: conversationHistory.slice(-4),
      })) {
        if (abortRef.current === false) break
        accumulated += chunk
        setStreamText(accumulated)
      }
      if (accumulated) {
        setConversationHistory(h => [
          ...h,
          { role: 'user', content: text },
          { role: 'assistant', content: accumulated },
        ])
      }
    } catch (err) {
      setStreamText(`⚠ ${err.message}`)
    } finally {
      setSidebarLoading(false)
    }
  }, [groqApiKey, conversationHistory, setSidebarLoading])

  // ─── Gap Analysis stream ────────────────────────────────────────
  const triggerGapAnalysis = useCallback(async (selectedNodes) => {
    if (!groqApiKey || !selectedNodes?.length) return
    setSidebarLoading(true)
    setStreamText('')
    setSidebarContent({ type: 'gap', nodes: selectedNodes })

    let accumulated = ''
    try {
      for await (const chunk of getGapAnalysis({ apiKey: groqApiKey, nodes: selectedNodes })) {
        accumulated += chunk
        setStreamText(accumulated)
      }
    } catch (err) {
      setStreamText(`⚠ ${err.message}`)
    } finally {
      setSidebarLoading(false)
    }
  }, [groqApiKey, setSidebarLoading, setSidebarContent])

  // Expose triggerGapAnalysis to store
  useEffect(() => {
    useStore.setState({ triggerGapAnalysis })
  }, [triggerGapAnalysis])

  // Throttled trigger when typing
  const throttleTimerRef = useRef(null)
  useEffect(() => {
    if (!typingText || sidebarContent?.type === 'gap') return
    clearTimeout(throttleTimerRef.current)
    throttleTimerRef.current = setTimeout(() => {
      triggerRejoinder(typingText)
    }, 10000)
    return () => clearTimeout(throttleTimerRef.current)
  }, [typingText])

  // Accept distillation atom as child node
  async function acceptAtom(atom, parentContent) {
    const parentNode = nodes.find(n => n.content === parentContent)
    const child = await createNode({
      content: atom.content,
      type: atom.type || 'note',
      tags: atom.tag ? [atom.tag] : [],
    })
    if (parentNode) await createEdge({ source: parentNode.id, target: child.id })
  }

  async function acceptAllAtoms() {
    if (!sidebarContent?.atoms) return
    const parentNode = nodes.find(n => n.content === sidebarContent.parentContent)
    for (const atom of sidebarContent.atoms) {
      const child = await createNode({
        content: atom.content,
        type: atom.type || 'note',
        tags: atom.tag ? [atom.tag] : [],
      })
      if (parentNode) await createEdge({ source: parentNode.id, target: child.id })
    }
    setSidebarContent(null)
  }

  async function handleAnswer() {
    if (!answerText.trim()) return
    await createNode({ content: answerText.trim(), type: 'note' })
    setAnswerText('')
    setAnswerMode(false)
    triggerRejoinder(answerText)
  }

  const hasKey = !!groqApiKey
  const isDistillation = sidebarContent?.type === 'distillation'
  const isGap = sidebarContent?.type === 'gap'

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      height: '100%',
      background: 'var(--bg-dark)',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: hasKey ? (sidebarLoading ? '#f59e0b' : '#22c55e') : '#ef4444',
            boxShadow: hasKey ? (sidebarLoading ? '0 0 6px #f59e0b' : '0 0 6px #22c55e') : '0 0 6px #ef4444',
            animation: sidebarLoading ? 'pulse 1s infinite' : 'none',
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
            Socratic Engine
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button
            size="sm"
            variant="ghost"
            title="Refresh (manual trigger)"
            icon="↻"
            onClick={() => triggerRejoinder(typingText || nodes.slice(-1)[0]?.content || '')}
            disabled={!hasKey}
          />
          {(streamText || sidebarContent) && (
            <Button
              size="sm"
              variant="ghost"
              title="Clear sidebar"
              icon="✕"
              onClick={() => { setStreamText(''); setSidebarContent(null) }}
            />
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

        {!hasKey && (
          <NoKeyPrompt />
        )}

        {hasKey && !streamText && !sidebarContent && !sidebarLoading && (
          <IdleState />
        )}

        {/* Distillation suggestions */}
        {isDistillation && sidebarContent.atoms?.length > 0 && (
          <div className="animate-slide-right">
            <SectionHeader icon="◈" label="Auto-Distillation" />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
              {sidebarContent.summary}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sidebarContent.atoms.map((atom, i) => (
                <AtomCard key={i} atom={atom} onAccept={() => acceptAtom(atom, sidebarContent.parentContent)} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button variant="primary" size="sm" onClick={acceptAllAtoms} icon="✦">
                Accept All as Nodes
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSidebarContent(null)}>
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Gap analysis header */}
        {isGap && (
          <div style={{ marginBottom: 12 }}>
            <SectionHeader icon="🔍" label={`Gap Analysis — ${sidebarContent.nodes?.length} nodes`} />
          </div>
        )}

        {/* Streamed text */}
        {streamText && (
          <div className="animate-fade-in">
            {!isGap && !isDistillation && (
              <SectionHeader icon={streamText.startsWith('❓') ? '❓' : '⚡'} label="Socratic Rejoinder" />
            )}
            <div style={{
              fontSize: 13, lineHeight: 1.75,
              color: sidebarLoading ? 'var(--text-secondary)' : 'var(--text-primary)',
              fontStyle: 'italic',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {streamText}
              {sidebarLoading && <span className="animate-spin" style={{ display: 'inline-block', marginLeft: 4 }}>◌</span>}
            </div>

            {!sidebarLoading && !isGap && streamText && (
              <div style={{ marginTop: 16 }}>
                {answerMode ? (
                  <div>
                    <textarea
                      value={answerText}
                      onChange={e => setAnswerText(e.target.value)}
                      placeholder="Your response…"
                      autoFocus
                      style={{
                        width: '100%', minHeight: 80, resize: 'vertical',
                        background: 'var(--bg-input)', border: '1px solid var(--border)',
                        borderRadius: 8, padding: '8px 10px',
                        color: 'var(--text-primary)', fontSize: 12,
                        fontFamily: "'Inter', sans-serif", outline: 'none',
                        lineHeight: 1.6, marginBottom: 8,
                      }}
                      onFocus={e => e.target.style.borderColor = '#7c3aed'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Button variant="primary" size="sm" onClick={handleAnswer} icon="✦">
                        Commit &amp; Continue
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setAnswerMode(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button size="sm" variant="default" icon="↩" onClick={() => setAnswerMode(true)}>
                    Answer (spawn node)
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Conversation history count */}
      {conversationHistory.length > 0 && (
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid var(--border)',
          fontSize: 10, color: 'var(--text-muted)',
          fontFamily: "'JetBrains Mono', monospace",
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}>
          <span>{conversationHistory.length / 2} exchanges</span>
          <button
            onClick={() => setConversationHistory([])}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 10 }}
          >Clear history</button>
        </div>
      )}
    </aside>
  )
}

function SectionHeader({ icon, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      marginBottom: 10,
    }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--purple-bright)',
        fontFamily: "'JetBrains Mono', monospace",
      }}>{label}</span>
    </div>
  )
}

function AtomCard({ atom, onAccept }) {
  const [accepted, setAccepted] = useState(false)
  const typeColors = {
    claim: '#0ea5e9', task: '#22c55e', question: '#f59e0b',
    insight: '#ec4899', note: '#94a3b8',
  }
  const color = typeColors[atom.type] || '#94a3b8'
  return (
    <div style={{
      background: `${color}11`,
      border: `1px solid ${color}33`,
      borderRadius: 8,
      padding: '8px 10px',
      display: 'flex', gap: 8, alignItems: 'flex-start',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 600, color, letterSpacing: '0.08em', fontFamily: "'JetBrains Mono'", textTransform: 'uppercase', marginBottom: 3 }}>
          {atom.tag || atom.type}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.5 }}>{atom.content}</div>
      </div>
      <button
        onClick={() => { onAccept(); setAccepted(true) }}
        disabled={accepted}
        style={{
          background: accepted ? 'rgba(34,197,94,0.2)' : 'rgba(124,58,237,0.15)',
          border: `1px solid ${accepted ? '#22c55e' : '#7c3aed'}`,
          borderRadius: 5, padding: '3px 8px',
          fontSize: 10, cursor: accepted ? 'default' : 'pointer',
          color: accepted ? '#22c55e' : 'var(--purple-bright)',
          fontFamily: "'JetBrains Mono'", flexShrink: 0,
          transition: 'all 0.15s',
        }}
      >{accepted ? '✓' : '+ Add'}</button>
    </div>
  )
}

function NoKeyPrompt() {
  const { setSettingsOpen } = useStore()
  return (
    <div style={{ textAlign: 'center', padding: '24px 8px' }}>
      <div style={{ fontSize: 28, marginBottom: 12 }}>🔑</div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.7 }}>
        Add your Groq API key to activate the Socratic Engine.
      </p>
      <Button variant="primary" size="sm" onClick={() => setSettingsOpen(true)} icon="⚙">
        Open Settings
      </Button>
    </div>
  )
}

function IdleState() {
  return (
    <div style={{ padding: '16px 0' }}>
      <pre style={{
        fontSize: '7px', lineHeight: '9px',
        color: '#4c1d95', fontFamily: "'JetBrains Mono', monospace",
        textAlign: 'center', marginBottom: 16,
        userSelect: 'none',
      }}>
{`  ?     ?     ?
   \\   |   /
    \\ \\|/ /
  ---( o )---
    / /|\\ \\
   /   |   \\
  ?     |     ?
        |
   I know that I
    know nothing.`}
      </pre>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.7 }}>
        Start typing in The Blur to awaken Socrates. He'll challenge your assumptions every 10 seconds.
      </p>
      <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
        Or hit <span style={{ color: 'var(--purple-bright)' }}>↻</span> to refresh manually.
      </p>
    </div>
  )
}
