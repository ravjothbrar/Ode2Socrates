import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useStore } from '../../store/useStore'
import { buildVocab, textToVector, cosineSimilarity } from '../../api/groq'
import { getDistillation } from '../../api/groq'

const TAG_TYPES = [
  { tag: '#claim',    icon: '◈', desc: 'A declarative statement or thesis' },
  { tag: '#task',     icon: '☐', desc: 'An action item or to-do' },
  { tag: '#question', icon: '?', desc: 'An open question to explore' },
  { tag: '#insight',  icon: '✦', desc: 'A key realisation or learning' },
  { tag: '#quote',    icon: '"', desc: 'A quote or reference' },
  { tag: '#note',     icon: '○', desc: 'A general note' },
]

// Formatting toolbar items
const FORMAT_ACTIONS = [
  { label: 'B',      title: 'Bold',            wrap: ['**', '**'],       style: { fontWeight: 700 } },
  { label: 'I',      title: 'Italic',          wrap: ['_', '_'],         style: { fontStyle: 'italic' } },
  { label: 'U',      title: 'Underline',       wrap: ['<u>', '</u>'],    style: { textDecoration: 'underline' } },
  { label: 'H1',     title: 'Heading 1',       prefix: '# ',             style: { fontWeight: 700 } },
  { label: 'H2',     title: 'Heading 2',       prefix: '## ',            style: { fontWeight: 600 } },
  { label: 'P',      title: 'Paragraph',       prefix: '',               style: {} },
  { label: '≡',      title: 'Unordered list',  prefix: '- ',             style: {} },
  { label: '≡₁',     title: 'Ordered list',    prefix: '1. ',            style: {} },
]

function applyFormat(textarea, action, text, setText) {
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = text.slice(start, end)

  if (action.wrap) {
    const [before, after] = action.wrap
    const newText = text.slice(0, start) + before + (selected || 'text') + after + text.slice(end)
    setText(newText)
    setTimeout(() => {
      const newPos = start + before.length + (selected || 'text').length + after.length
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + (selected || 'text').length
      )
    }, 0)
  } else if (action.prefix !== undefined) {
    // Apply prefix to current line
    const lineStart = text.lastIndexOf('\n', start - 1) + 1
    const newText = text.slice(0, lineStart) + action.prefix + text.slice(lineStart)
    setText(newText)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(lineStart + action.prefix.length, lineStart + action.prefix.length)
    }, 0)
  }
}

export default function BlurInput({ onTyping }) {
  const { createNode, nodes, createEdge, groqApiKey, setSidebarContent, setSidebarLoading, blurFocused, setBlurFocused } = useStore()
  const [text, setText] = useState('')
  const [tagMenu, setTagMenu] = useState(null)   // { query, start }
  const [submitting, setSubmitting] = useState(false)
  const textareaRef = useRef(null)

  // Notify parent for sidebar throttle
  useEffect(() => {
    if (text.trim().length > 20) onTyping?.(text)
  }, [text])

  function onKeyDown(e) {
    if (tagMenu) {
      if (e.key === 'Escape') { setTagMenu(null); return }
      if (['ArrowDown', 'ArrowUp', 'Enter', 'Tab'].includes(e.key)) {
        e.preventDefault()
        return
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function onChange(e) {
    const val = e.target.value
    setText(val)

    // Detect # for tag menu
    const pos = e.target.selectionStart
    const before = val.slice(0, pos)
    const hashIdx = before.lastIndexOf('#')
    if (hashIdx !== -1 && (hashIdx === 0 || /\s/.test(before[hashIdx - 1]))) {
      const query = before.slice(hashIdx + 1).toLowerCase()
      if (!/\s/.test(query)) {
        setTagMenu({ query, start: hashIdx })
        return
      }
    }
    setTagMenu(null)
  }

  function selectTag(tag) {
    if (tagMenu === null) return
    const ta = textareaRef.current
    const pos = ta.selectionStart
    const before = text.slice(0, tagMenu.start)
    const after = text.slice(pos)
    const newText = before + tag + ' ' + after
    setText(newText)
    setTagMenu(null)
    setTimeout(() => {
      ta.focus()
      const newPos = (before + tag + ' ').length
      ta.setSelectionRange(newPos, newPos)
    }, 0)
  }

  const filteredTags = tagMenu
    ? TAG_TYPES.filter(t => t.tag.slice(1).startsWith(tagMenu.query))
    : []

  function extractTagsFromText(t) {
    const matches = t.match(/#\w+/g) || []
    const valid = TAG_TYPES.map(tt => tt.tag)
    return matches.filter(m => valid.includes(m))
  }

  function inferType(t, tags) {
    if (tags.includes('#task')) return 'task'
    if (tags.includes('#claim')) return 'claim'
    if (tags.includes('#question')) return 'question'
    if (tags.includes('#insight')) return 'insight'
    if (tags.includes('#quote')) return 'quote'
    if (tags.includes('#note')) return 'note'
    if (t.trim().endsWith('?')) return 'question'
    return 'blur'
  }

  async function findGhostLinks(newNode) {
    if (nodes.length < 2) return
    const allTexts = nodes.map(n => n.content || '')
    const vocab = buildVocab([newNode.content, ...allTexts])
    const newVec = textToVector(newNode.content, vocab)

    for (const n of nodes) {
      if (n.id === newNode.id || !n.content) continue
      const vec = textToVector(n.content, vocab)
      const sim = cosineSimilarity(newVec, vec)
      if (sim > 0.18) {
        await createEdge({ source: newNode.id, target: n.id, ghost: true, label: `sim:${sim.toFixed(2)}` })
      }
    }
  }

  async function submit() {
    const trimmed = text.trim()
    if (!trimmed || submitting) return
    setSubmitting(true)

    const tags = extractTagsFromText(trimmed)
    const type = inferType(trimmed, tags)

    // Long text → distillation
    if (trimmed.length > 200 && groqApiKey) {
      try {
        const result = await getDistillation({ apiKey: groqApiKey, text: trimmed })
        setSidebarContent({
          type: 'distillation',
          summary: result.summary,
          atoms: result.atoms || [],
          parentContent: trimmed,
          parentTags: tags,
          parentType: type,
        })
      } catch (err) {
        console.warn('Distillation failed:', err)
      }
    }

    const node = await createNode({ content: trimmed, type, tags })
    await findGhostLinks(node)

    setText('')
    setSubmitting(false)
    textareaRef.current?.focus()
  }

  const focused = blurFocused

  return (
    <div style={{
      position: 'absolute',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(832px, calc(100vw - 380px))',
      zIndex: 100,
    }}>
      {/* Tag autocomplete menu */}
      {tagMenu && filteredTags.length > 0 && (
        <div className="animate-fade-in" style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: 0,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: '0 -8px 24px rgba(0,0,0,0.5)',
          width: 280,
        }}>
          <div style={{ padding: '6px 0' }}>
            {filteredTags.map((t) => (
              <button
                key={t.tag}
                onMouseDown={e => { e.preventDefault(); selectTag(t.tag) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 14px', background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 14, color: 'var(--purple-bright)', width: 18, textAlign: 'center' }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{t.tag}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main input */}
      <div style={{
        background: 'rgba(13,13,26,0.92)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${focused ? '#7c3aed' : '#2a2a4a'}`,
        borderRadius: 14,
        boxShadow: focused
          ? '0 0 0 2px #7c3aed33, 0 8px 32px rgba(0,0,0,0.6)'
          : '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'all 0.15s',
        overflow: 'hidden',
      }}>
        {/* Header bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 14px 6px',
          borderBottom: '1px solid rgba(42,42,74,0.6)',
        }}>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
            color: 'var(--purple-bright)', fontFamily: "'JetBrains Mono', monospace",
            textTransform: 'uppercase', opacity: 0.7,
          }}>
            ◈ The Blur
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 10, color: 'var(--text-muted)' }}>
            <span>Type <code style={{ background: 'rgba(124,58,237,0.2)', padding: '0 4px', borderRadius: 3, color: 'var(--purple-bright)', fontFamily: "'JetBrains Mono'" }}>#</code> to tag</span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span><code style={{ background: 'rgba(124,58,237,0.2)', padding: '0 4px', borderRadius: 3, color: 'var(--purple-bright)', fontFamily: "'JetBrains Mono'" }}>↵</code> to commit</span>
          </div>
        </div>

        {/* ── Formatting Toolbar ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: '6px 14px',
          borderBottom: '1px solid rgba(42,42,74,0.5)',
          background: 'rgba(8,8,20,0.4)',
        }}>
          {FORMAT_ACTIONS.map((action, idx) => {
            const isSeparator = idx === 3 || idx === 5 || idx === 6
            return (
              <React.Fragment key={action.label}>
                {isSeparator && (
                  <div style={{ width: 1, height: 16, background: 'rgba(42,42,74,0.8)', margin: '0 4px' }} />
                )}
                <button
                  title={action.title}
                  onMouseDown={e => {
                    e.preventDefault()
                    applyFormat(textareaRef.current, action, text, setText)
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: 28, height: 26, padding: '0 6px',
                    background: 'transparent',
                    border: '1px solid transparent',
                    borderRadius: 5,
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    fontSize: action.label === 'B' ? 13 : action.label.length > 1 ? 11 : 13,
                    fontFamily: action.label === 'B' || action.label === 'I' || action.label === 'U'
                      ? "'Inter', sans-serif"
                      : "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    transition: 'all 0.1s',
                    ...action.style,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(124,58,237,0.2)'
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'
                    e.currentTarget.style.color = '#c4b5fd'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'transparent'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }}
                >
                  {action.label}
                </button>
              </React.Fragment>
            )
          })}
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setBlurFocused(true)}
          onBlur={() => setBlurFocused(false)}
          placeholder="Brain dump here… let thoughts flow unfiltered."
          rows={4}
          style={{
            width: '100%',
            minHeight: 94,
            maxHeight: 260,
            resize: 'vertical',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '12px 14px',
            fontSize: 14,
            lineHeight: 1.65,
            color: 'var(--text-primary)',
            fontFamily: "'Inter', sans-serif",
          }}
        />

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 14px 10px',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {TAG_TYPES.slice(0, 5).map(t => (
              <button
                key={t.tag}
                onClick={() => {
                  setText(prev => prev + (prev.endsWith(' ') || !prev ? '' : ' ') + t.tag + ' ')
                  textareaRef.current?.focus()
                }}
                style={{
                  fontSize: 10, padding: '2px 7px', borderRadius: 5,
                  background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
                  color: 'var(--purple-bright)', cursor: 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => { e.target.style.background = 'rgba(124,58,237,0.25)'; e.target.style.borderColor = '#7c3aed' }}
                onMouseLeave={e => { e.target.style.background = 'rgba(124,58,237,0.1)'; e.target.style.borderColor = 'rgba(124,58,237,0.25)' }}
              >{t.tag}</button>
            ))}
          </div>
          <button
            onClick={submit}
            disabled={!text.trim() || submitting}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              background: text.trim() ? 'linear-gradient(135deg, #6d28d9, #5b21b6)' : 'rgba(42,42,74,0.5)',
              border: `1px solid ${text.trim() ? '#7c3aed' : 'var(--border)'}`,
              color: text.trim() ? '#f5f3ff' : 'var(--text-muted)',
              fontSize: 12, fontWeight: 600, cursor: text.trim() ? 'pointer' : 'default',
              transition: 'all 0.15s',
              boxShadow: text.trim() ? '0 0 12px #7c3aed33' : 'none',
            }}
          >
            {submitting ? (
              <span className="animate-spin" style={{ display: 'inline-block' }}>◌</span>
            ) : '✦'} Commit
          </button>
        </div>
      </div>
    </div>
  )
}
