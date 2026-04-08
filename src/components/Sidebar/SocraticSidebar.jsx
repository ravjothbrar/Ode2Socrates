import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useStore } from '../../store/useStore'
import { getSocraticRejoinder, getGapAnalysis } from '../../api/groq'
import Button from '../Button'
import ContextChat from './ContextChat'
import SocratesLogo from '../Logo/SocratesLogo'

// Word milestones that auto-trigger Gadfly (fires once each, in order)
const WORD_MILESTONES = [12, 50, 100, 200]

export default function SocraticSidebar({ typingText, onNodeCite }) {
  const {
    groqApiKey, sidebarContent, setSidebarContent,
    sidebarLoading, setSidebarLoading,
    createNode, createEdge, nodes,
    sidebarTab, setSidebarTab,
    blurWordCount, blurText,
  } = useStore()

  const [streamText, setStreamText] = useState('')
  const [conversationHistory, setConversationHistory] = useState([])
  const [answerMode, setAnswerMode] = useState(false)
  const [answerText, setAnswerText] = useState('')
  const abortRef = useRef(false)
  const bottomRef = useRef(null)

  // Word-milestone tracking
  const prevWordCountRef = useRef(0)
  const milestonesFiredRef = useRef(new Set())
  const autoCapReachedRef = useRef(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [streamText, sidebarContent])

  // ─── Socratic Rejoinder ────────────────────────────────────────
  const triggerRejoinder = useCallback(async (text) => {
    if (!groqApiKey || !text?.trim() || text.length < 20) return
    abortRef.current = false
    setSidebarLoading(true)
    setStreamText('')

    let accumulated = ''
    try {
      for await (const chunk of getSocraticRejoinder({ apiKey: groqApiKey, text, context: conversationHistory.slice(-4) })) {
        if (abortRef.current) break
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

  // ─── Gap Analysis ──────────────────────────────────────────────
  const triggerGapAnalysis = useCallback(async (selectedNodes) => {
    if (!groqApiKey || !selectedNodes?.length) return
    setSidebarTab('gadfly')
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
  }, [groqApiKey, setSidebarLoading, setSidebarContent, setSidebarTab])

  useEffect(() => {
    useStore.setState({ triggerGapAnalysis })
  }, [triggerGapAnalysis])

  // ─── Word-milestone Gadfly triggers ───────────────────────────
  // Fires at 12, 50, 100, 200 words — each only once per typing session.
  // After the 200-word milestone fires, auto-triggers pause until ↻ resets.
  useEffect(() => {
    if (sidebarContent?.type === 'gap') return
    if (autoCapReachedRef.current) return

    const prev = prevWordCountRef.current
    prevWordCountRef.current = blurWordCount

    // Reset milestones if user clears text
    if (blurWordCount < 5 && prev > 5) {
      milestonesFiredRef.current.clear()
      autoCapReachedRef.current = false
      return
    }

    for (const milestone of WORD_MILESTONES) {
      if (blurWordCount >= milestone && !milestonesFiredRef.current.has(milestone)) {
        milestonesFiredRef.current.add(milestone)
        if (milestone === 200) autoCapReachedRef.current = true
        // Use current blurText from store so we have the latest full content
        const currentText = useStore.getState().blurText
        triggerRejoinder(currentText || typingText || '')
        break // trigger one milestone at a time
      }
    }
  }, [blurWordCount, sidebarContent])

  // ─── Distillation helpers ──────────────────────────────────────
  async function acceptAtom(atom, parentContent) {
    const parentNode = nodes.find(n => n.content === parentContent)
    const child = await createNode({ content: atom.content, type: atom.type || 'note', tags: atom.tag ? [atom.tag] : [] })
    if (parentNode) await createEdge({ source: parentNode.id, target: child.id })
  }

  async function acceptAllAtoms() {
    if (!sidebarContent?.atoms) return
    const parentNode = nodes.find(n => n.content === sidebarContent.parentContent)
    for (const atom of sidebarContent.atoms) {
      const child = await createNode({ content: atom.content, type: atom.type || 'note', tags: atom.tag ? [atom.tag] : [] })
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
      width: '352px',
      height: '100%',
      background: 'var(--bg-dark)',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <TabButton
          active={sidebarTab === 'gadfly'}
          onClick={() => setSidebarTab('gadfly')}
          icon="⚡"
          label="Gadfly"
          hasActivity={!!streamText || !!sidebarContent}
          loading={sidebarLoading && sidebarTab !== 'gadfly'}
          className="sidebar-gadfly"
        />
        <TabButton
          active={sidebarTab === 'chat'}
          onClick={() => setSidebarTab('chat')}
          icon="💬"
          label="Context Chat"
          className="sidebar-chat"
        />
        {/* Manual refresh only on Gadfly tab */}
        {sidebarTab === 'gadfly' && (
          <button
            onClick={() => {
              // Manual refresh — reset auto-cap so milestones can re-fire
              autoCapReachedRef.current = false
              milestonesFiredRef.current.clear()
              triggerRejoinder(useStore.getState().blurText || typingText || nodes.slice(-1)[0]?.content || '')
            }}
            disabled={!hasKey}
            title="Refresh Socratic challenge manually"
            style={{
              marginLeft: 'auto', marginRight: 8, alignSelf: 'center',
              background: 'none', border: 'none',
              color: hasKey ? 'var(--purple-bright)' : 'var(--text-muted)',
              cursor: hasKey ? 'pointer' : 'default',
              fontSize: 15, padding: '4px 6px', borderRadius: 6,
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => { if (hasKey) e.currentTarget.style.color = '#e9d5ff' }}
            onMouseLeave={e => { if (hasKey) e.currentTarget.style.color = 'var(--purple-bright)' }}
          >↻</button>
        )}
      </div>

      {/* Gadfly tab */}
      {sidebarTab === 'gadfly' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 10px' }}>
          {/* AI status dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: hasKey ? (sidebarLoading ? '#f59e0b' : '#22c55e') : '#ef4444',
              boxShadow: `0 0 6px ${hasKey ? (sidebarLoading ? '#f59e0b' : '#22c55e') : '#ef4444'}`,
              animation: sidebarLoading ? 'pulse 1s infinite' : 'none',
            }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              {hasKey ? (sidebarLoading ? 'thinking…' : 'ready') : 'no api key'}
            </span>
          </div>

          {!hasKey && <NoKeyPrompt />}
          {!streamText && !sidebarContent && !sidebarLoading && <IdleState />}

          {/* Distillation */}
          {isDistillation && sidebarContent.atoms?.length > 0 && (
            <div className="animate-slide-right">
              <SectionHeader icon="◈" label="Auto-Distillation" />
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.6 }}>
                {sidebarContent.summary}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {sidebarContent.atoms.map((atom, i) => (
                  <AtomCard key={i} atom={atom} onAccept={() => acceptAtom(atom, sidebarContent.parentContent)} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 7, marginTop: 10 }}>
                <Button variant="primary" size="sm" onClick={acceptAllAtoms} icon="✦">Accept All</Button>
                <Button variant="ghost" size="sm" onClick={() => setSidebarContent(null)}>Dismiss</Button>
              </div>
            </div>
          )}

          {/* Gap analysis header */}
          {isGap && (
            <SectionHeader icon="🔍" label={`Gap Analysis — ${sidebarContent.nodes?.length} nodes`} />
          )}

          {/* Streamed rejoinder / gap text */}
          {streamText && (
            <div className="animate-fade-in">
              {!isGap && !isDistillation && (
                <SectionHeader
                  icon={streamText.startsWith('❓') ? '❓' : '⚡'}
                  label={streamText.startsWith('❓') ? 'Socratic Question' : "Devil's Advocate"}
                />
              )}
              <div style={{
                fontSize: 12, lineHeight: 1.8, fontStyle: 'italic',
                color: sidebarLoading ? 'var(--text-secondary)' : 'var(--text-primary)',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {streamText}
                {sidebarLoading && (
                  <span className="animate-spin" style={{ display: 'inline-block', marginLeft: 4, fontSize: 11 }}>◌</span>
                )}
              </div>

              {!sidebarLoading && !isGap && streamText && (
                <div style={{ marginTop: 14 }}>
                  {answerMode ? (
                    <div>
                      <textarea
                        value={answerText}
                        onChange={e => setAnswerText(e.target.value)}
                        placeholder="Your response…"
                        autoFocus
                        style={{
                          width: '100%', minHeight: 72, resize: 'vertical',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border)',
                          borderRadius: 8, padding: '7px 10px',
                          color: 'var(--text-primary)', fontSize: 12,
                          fontFamily: "'Inter', sans-serif", outline: 'none',
                          lineHeight: 1.6, marginBottom: 7,
                        }}
                        onFocus={e => e.target.style.borderColor = '#7c3aed'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button variant="primary" size="sm" onClick={handleAnswer} icon="✦">Commit & Continue</Button>
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

              {!sidebarLoading && (
                <button
                  onClick={() => { setStreamText(''); setSidebarContent(null) }}
                  style={{
                    marginTop: 10, background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    fontSize: 10, padding: 0,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >Clear ✕</button>
              )}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}

      {/* Context Chat tab */}
      {sidebarTab === 'chat' && (
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ContextChat onNodeCite={onNodeCite} />
        </div>
      )}

      {/* Conversation counter */}
      {sidebarTab === 'gadfly' && conversationHistory.length > 0 && (
        <div style={{
          padding: '7px 14px',
          borderTop: '1px solid var(--border)',
          fontSize: 10, color: 'var(--text-muted)',
          fontFamily: "'JetBrains Mono', monospace",
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}>
          <span>{conversationHistory.length / 2} exchange{conversationHistory.length / 2 !== 1 ? 's' : ''}</span>
          <button
            onClick={() => setConversationHistory([])}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 10 }}
          >Clear history</button>
        </div>
      )}
    </aside>
  )
}

function TabButton({ active, onClick, icon, label, hasActivity, className }) {
  const [h, setH] = useState(false)
  return (
    <button
      onClick={onClick}
      className={className}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '10px 8px',
        background: active ? 'rgba(124,58,237,0.12)' : h ? 'rgba(124,58,237,0.05)' : 'transparent',
        border: 'none',
        borderBottom: active ? '2px solid #7c3aed' : '2px solid transparent',
        cursor: 'pointer',
        fontSize: 12, fontWeight: active ? 600 : 400,
        color: active ? 'var(--lavender)' : h ? 'var(--text-primary)' : 'var(--text-secondary)',
        transition: 'all 0.1s',
        position: 'relative',
      }}
    >
      <span style={{ fontSize: 13 }}>{icon}</span>
      {label}
      {hasActivity && !active && (
        <div style={{
          position: 'absolute', top: 6, right: 8,
          width: 5, height: 5, borderRadius: '50%',
          background: '#7c3aed',
          boxShadow: '0 0 6px #7c3aed',
        }} />
      )}
    </button>
  )
}

function SectionHeader({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.09em',
        textTransform: 'uppercase', color: 'var(--purple-bright)',
        fontFamily: "'JetBrains Mono', monospace",
      }}>{label}</span>
    </div>
  )
}

function AtomCard({ atom, onAccept }) {
  const [accepted, setAccepted] = useState(false)
  const typeColors = { claim: '#0ea5e9', task: '#22c55e', question: '#f59e0b', insight: '#ec4899', note: '#94a3b8' }
  const color = typeColors[atom.type] || '#94a3b8'
  return (
    <div style={{
      background: `${color}10`, border: `1px solid ${color}2a`,
      borderRadius: 8, padding: '7px 10px',
      display: 'flex', gap: 8, alignItems: 'flex-start',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: '0.08em', fontFamily: "'JetBrains Mono'", textTransform: 'uppercase', marginBottom: 3 }}>
          {atom.tag || atom.type}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-primary)', lineHeight: 1.5 }}>{atom.content}</div>
      </div>
      <button
        onClick={() => { onAccept(); setAccepted(true) }}
        disabled={accepted}
        style={{
          background: accepted ? 'rgba(34,197,94,0.2)' : 'rgba(124,58,237,0.15)',
          border: `1px solid ${accepted ? '#22c55e' : '#7c3aed'}`,
          borderRadius: 5, padding: '2px 8px',
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
    <div style={{ textAlign: 'center', padding: '20px 4px' }}>
      <div style={{ fontSize: 24, marginBottom: 10 }}>🔑</div>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.7 }}>
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
    <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <SocratesLogo size="canvas" />
      <p style={{ fontSize: 17, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.8, marginTop: 14 }}>
        Start typing in The Blur. Socrates will challenge your assumptions.
      </p>
    </div>
  )
}
