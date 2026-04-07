const GROQ_BASE = 'https://api.groq.com/openai/v1'
const DEFAULT_MODEL = 'llama-3.3-70b-versatile'

async function* streamChat({ apiKey, messages, model = DEFAULT_MODEL, temperature = 0.7, max_tokens = 512 }) {
  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, temperature, max_tokens, stream: true }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq API error ${res.status}: ${err}`)
  }

  const reader = res.body.getReader()
  const dec = new TextDecoder()
  let buf = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop()
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') return
      try {
        const json = JSON.parse(data)
        const delta = json.choices?.[0]?.delta?.content
        if (delta) yield delta
      } catch {}
    }
  }
}

// ─── Socratic Rejoinder ────────────────────────────────────────────────────

export async function* getSocraticRejoinder({ apiKey, text, context = [] }) {
  const messages = [
    {
      role: 'system',
      content: `You are Socrates — a relentless, intellectually rigorous philosophical interlocutor.
The user is thinking out loud. Your job is to:
1. Ask ONE sharp, probing Socratic question that exposes an assumption, contradiction, or gap in their reasoning.
2. OR briefly play Devil's Advocate — steelman the strongest counter-position.
3. Be concise (2-4 sentences max). Never flatter. Never summarise. Just challenge.
Format: Start with either "❓" for a question or "⚡" for a Devil's Advocate challenge.`,
    },
    ...context.slice(-4),
    { role: 'user', content: `My current thought:\n\n${text}` },
  ]
  yield* streamChat({ apiKey, messages, max_tokens: 200, temperature: 0.85 })
}

// ─── Auto-Distillation ────────────────────────────────────────────────────

export async function getDistillation({ apiKey, text }) {
  const messages = [
    {
      role: 'system',
      content: `You are a concise analytical engine. Extract atomic units from the user's stream-of-consciousness text.
Return a JSON object with this exact structure:
{
  "summary": "one sentence summary",
  "atoms": [
    { "type": "claim|task|question|insight", "content": "atomic text", "tag": "#claim|#task|#question|#insight" }
  ]
}
Maximum 5 atoms. Be ruthlessly atomic. No preamble, no explanation — just the JSON.`,
    },
    { role: 'user', content: text },
  ]

  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: DEFAULT_MODEL, messages, temperature: 0.3, max_tokens: 600, stream: false }),
  })

  if (!res.ok) throw new Error(`Groq API error ${res.status}`)
  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content || '{}'
  try {
    const match = raw.match(/\{[\s\S]*\}/)
    return JSON.parse(match ? match[0] : raw)
  } catch {
    return { summary: '', atoms: [] }
  }
}

// ─── Knowledge Gap Analysis ───────────────────────────────────────────────

export async function* getGapAnalysis({ apiKey, nodes }) {
  const nodeText = nodes.map(n => `[${n.type?.toUpperCase() || 'NOTE'}] ${n.content}`).join('\n\n')
  const messages = [
    {
      role: 'system',
      content: `You are a rigorous philosophical analyst and knowledge cartographer.
Review the provided cluster of thoughts. Identify:
1. Missing counter-arguments or opposing views
2. Logical leaps or unsupported jumps
3. 2-3 specific new nodes/ideas that SHOULD be explored

Format your response with clear sections:
**Missing Arguments:**
**Logical Leaps:**
**Suggested Explorations:**

Be specific, harsh, and intellectually demanding.`,
    },
    { role: 'user', content: `Cluster of ${nodes.length} nodes:\n\n${nodeText}` },
  ]
  yield* streamChat({ apiKey, messages, max_tokens: 500, temperature: 0.7 })
}

// ─── RAG Context Chat ─────────────────────────────────────────────────────

export async function* getRagResponse({ apiKey, userMessage, relevantNodes, history = [] }) {
  const context = relevantNodes.length
    ? relevantNodes.map((n, i) =>
        `[Node ${i + 1} | id:${n.id} | type:${n.type || 'note'}]\n"${n.content.slice(0, 300)}"`
      ).join('\n\n')
    : 'No closely matching notes found in the current space.'

  const messages = [
    {
      role: 'system',
      content: `You are an analytical assistant with access to the user's personal knowledge base.

Relevant notes retrieved from their space:
---
${context}
---

Instructions:
- Answer using their notes as context when relevant.
- When you draw from a specific note, cite it inline as [Node: "first few words of the note..."].
- If the notes don't contain enough information, answer from general knowledge but say so.
- Be concise, direct, and intellectually precise.
- Never pad or flatter.`,
    },
    ...history.slice(-6),
    { role: 'user', content: userMessage },
  ]
  yield* streamChat({ apiKey, messages, max_tokens: 600, temperature: 0.65 })
}

// ─── Vector utilities for ghost linking & RAG ────────────────────────────

export function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0
  let dot = 0, magA = 0, magB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) + 1e-10)
}

export function textToVector(text, vocab) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || []
  const freq = {}
  for (const w of words) freq[w] = (freq[w] || 0) + 1
  return vocab.map(w => (freq[w] || 0) / (words.length || 1))
}

export function buildVocab(texts) {
  const all = new Set()
  for (const t of texts) {
    const words = t.toLowerCase().match(/\b\w+\b/g) || []
    words.forEach(w => all.add(w))
  }
  return [...all]
}

// Retrieve top-N most relevant nodes for RAG
export function retrieveRelevantNodes(queryText, allNodes, topN = 5) {
  if (!allNodes.length || !queryText.trim()) return []
  const texts = [queryText, ...allNodes.map(n => n.content || '')]
  const vocab = buildVocab(texts)
  const queryVec = textToVector(queryText, vocab)
  const scored = allNodes
    .filter(n => n.content?.trim())
    .map(n => ({
      node: n,
      score: cosineSimilarity(queryVec, textToVector(n.content, vocab)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .filter(x => x.score > 0.05)
  return scored.map(x => x.node)
}
