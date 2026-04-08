import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useStore } from '../../store/useStore'
import { getRagResponse, retrieveRelevantNodes } from '../../api/groq'
import Button from '../Button'

// Parse [Node: "text..."] citations from response text
function parseCitations(text, nodes) {
  const parts = []
  const regex = /\[Node:\s*"([^"]{1,80})[^"]*"\]/g
  let last = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: 'text', content: text.slice(last, match.index) })
    const snippet = match[1].toLowerCase()
    const found = nodes.find(n => n.content?.toLowerCase().includes(snippet))
    parts.push({ type: 'citation', content: match[0], nodeId: found?.id, snippet: match[1] })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ type: 'text', content: text.slice(last) })
  return parts.length ? parts : [{ type: 'text', content: text }]
}

function CitationText({ text, nodes, onCiteClick }) {
  const parts = parseCitations(text, nodes)
  return (
    <span>
      {parts.map((p, i) =>
        p.type === 'citation' ? (
          <button
            key={i}
            onClick={() => p.nodeId && onCiteClick(p.nodeId)}
            title={p.nodeId ? 'Jump to node' : 'Node not found'}
            style={{
              background: 'var(--accent-a20)',
              border: '1px solid var(--accent-a40)',
              borderRadius: 4,
              padding: '1px 6px',
              fontSize: 12,
              color: p.nodeId ? 'var(--purple-pale)' : '#94a3b8',
              cursor: p.nodeId ? 'pointer' : 'default',
              fontFamily: "'JetBrains Mono', monospace",
              display: 'inline',
              margin: '0 2px',
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => { if (p.nodeId) e.currentTarget.style.background = 'var(--accent-a35)' }}
            onMouseLeave={e => { if (p.nodeId) e.currentTarget.style.background = 'var(--accent-a20)' }}
          >
            ◈ {p.snippet.slice(0, 28)}{p.snippet.length > 28 ? '…' : ''}
          </button>
        ) : (
          <span key={i}>{p.content}</span>
        )
      )}
    </span>
  )
}

export default function ContextChat({ onNodeCite }) {
  const { groqApiKey, nodes, activeSpaceId } = useStore()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const spaceNodes = nodes.filter(n => n.spaceId === activeSpaceId)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = useCallback(async () => {
    const q = input.trim()
    if (!q || loading || !groqApiKey) return

    const userMsg = { role: 'user', content: q, id: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Retrieve relevant nodes
    const relevant = retrieveRelevantNodes(q, spaceNodes, 5)

    // Build history for context
    const history = messages.slice(-6).map(m => ({
      role: m.role,
      content: m.content,
    }))

    let accumulated = ''
    const assistantId = Date.now() + 1
    setMessages(prev => [...prev, { role: 'assistant', content: '', id: assistantId, relevant }])

    try {
      for await (const chunk of getRagResponse({ apiKey: groqApiKey, userMessage: q, relevantNodes: relevant, history })) {
        accumulated += chunk
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: accumulated } : m))
      }
    } catch (err) {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: `⚠ ${err.message}`, error: true } : m))
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, loading, groqApiKey, spaceNodes, messages])

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const hasKey = !!groqApiKey

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Chat thread */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        {messages.length === 0 && (
          <div style={{ padding: '20px 4px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <p style={{ marginBottom: 8, color: 'var(--purple-bright)' }}>💬 Ask anything about your notes.</p>
              <p>The AI retrieves your most relevant nodes and answers in context of what you've written.</p>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  'Summarise my thoughts on…',
                  'What are the key tensions in my notes about…',
                  'What have I not considered regarding…',
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); inputRef.current?.focus() }}
                    style={{
                      background: 'var(--accent-a08)',
                      border: '1px solid var(--accent-a25)',
                      borderRadius: 6, padding: '5px 10px',
                      fontSize: 12, color: 'var(--text-secondary)',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-a15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-a08)'}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className="animate-fade-in"
            style={{
              marginBottom: 14,
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: 8,
              alignItems: 'flex-start',
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              background: msg.role === 'user' ? 'var(--accent-a30)' : 'var(--accent-a15)',
              border: `1px solid ${msg.role === 'user' ? 'var(--purple-mid)' : 'var(--purple-dim)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11,
            }}>
              {msg.role === 'user' ? '◈' : '⚡'}
            </div>

            {/* Bubble */}
            <div style={{
              maxWidth: '82%',
              background: msg.role === 'user'
                ? 'var(--accent-a20)'
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${msg.role === 'user' ? 'var(--accent-a40)' : 'var(--border)'}`,
              borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
              padding: '8px 11px',
            }}>
              <div style={{
                fontSize: 13, lineHeight: 1.7,
                color: msg.error ? '#f87171' : 'var(--text-primary)',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {msg.role === 'assistant' && !msg.error ? (
                  <CitationText text={msg.content || '…'} nodes={spaceNodes} onCiteClick={onNodeCite} />
                ) : (
                  msg.content
                )}
                {msg.role === 'assistant' && loading && !msg.content && (
                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>thinking…</span>
                )}
              </div>

              {/* Context nodes used */}
              {msg.role === 'assistant' && msg.relevant?.length > 0 && (
                <div style={{ marginTop: 7, paddingTop: 7, borderTop: '1px solid rgba(42,42,74,0.6)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 4, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                    Context from {msg.relevant.length} node{msg.relevant.length > 1 ? 's' : ''}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {msg.relevant.map(n => (
                      <button
                        key={n.id}
                        onClick={() => onNodeCite(n.id)}
                        style={{
                          fontSize: 11, padding: '2px 7px', borderRadius: 4,
                          background: 'var(--accent-a12)',
                          border: '1px solid var(--accent-a25)',
                          color: 'var(--purple-bright)', cursor: 'pointer',
                          fontFamily: "'JetBrains Mono', monospace",
                          transition: 'all 0.1s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-a25)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-a12)'}
                        title={n.content.slice(0, 100)}
                      >
                        ◈ {n.content.slice(0, 22)}{n.content.length > 22 ? '…' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-a15)', border: '1px solid var(--purple-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>⚡</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: 'var(--purple-mid)', opacity: 0.6,
                  animation: `pulse 1s ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '10px 12px',
        flexShrink: 0,
      }}>
        {!hasKey ? (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '4px 0' }}>
            Add a Groq API key in Settings to use Context Chat.
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about your notes…"
              rows={2}
              disabled={loading}
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 8, padding: '7px 10px',
                fontSize: 13, lineHeight: 1.5,
                color: 'var(--text-primary)',
                resize: 'none', outline: 'none',
                fontFamily: "'Inter', sans-serif",
              }}
              onFocus={e => e.target.style.borderColor = 'var(--purple-mid)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              style={{
                width: 34, height: 34,
                background: input.trim() && !loading ? 'linear-gradient(135deg, var(--purple-dim), var(--purple-dim))' : 'rgba(42,42,74,0.5)',
                border: `1px solid ${input.trim() && !loading ? 'var(--purple-mid)' : 'var(--border)'}`,
                borderRadius: 8,
                color: input.trim() && !loading ? '#f5f3ff' : 'var(--text-muted)',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
                flexShrink: 0,
                boxShadow: input.trim() && !loading ? '0 0 8px var(--border-glow)' : 'none',
              }}
            >
              {loading ? <span className="animate-spin" style={{ display: 'inline-block', fontSize: 12 }}>◌</span> : '↑'}
            </button>
          </div>
        )}
        {messages.length > 1 && (
          <button
            onClick={() => setMessages([])}
            style={{
              marginTop: 6, background: 'none', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer',
              fontSize: 11, padding: 0,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >Clear history</button>
        )}
      </div>
    </div>
  )
}
