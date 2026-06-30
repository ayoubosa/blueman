/**
 * JARVIS backend client.
 *
 * Talks to a running OpenJarvis server (`jarvis serve --port 8000`).
 * Vite proxies /v1 and /api to that server (see vite.config.js).
 *
 * Every call degrades gracefully: if the backend is offline, helpers return
 * the provided fallback so the UI keeps working in "demo mode". Check
 * isLive() to show connection state.
 */

const TIMEOUT_MS = 6000

async function req(path, { method = 'GET', body, signal } = {}) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(path, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: signal || ctrl.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const ct = res.headers.get('content-type') || ''
    return ct.includes('application/json') ? await res.json() : await res.text()
  } finally {
    clearTimeout(t)
  }
}

/* Cached liveness so we don't hammer a dead backend with failing requests
   (which spam the console and slow demo-mode fallbacks). One /health probe
   every 15s; all other calls skip the network entirely when offline. */
let _liveCache = null
let _liveAt = 0
let _inflight = null
const LIVE_TTL = 15000

async function ensureLive() {
  const now = Date.now()
  if (_liveCache !== null && now - _liveAt < LIVE_TTL) return _liveCache
  // Dedupe concurrent probes so a page-load burst fires one /health, not many.
  if (_inflight) return _inflight
  _inflight = (async () => {
    try {
      await req('/health')
      _liveCache = true
    } catch {
      _liveCache = false
    }
    _liveAt = Date.now()
    _inflight = null
    return _liveCache
  })()
  return _inflight
}

/** Ping the backend. Returns true if the Blueman backend is live. */
export async function isLive() {
  return ensureLive()
}

export async function getInfo(fallback = null) {
  if (!(await ensureLive())) return fallback
  try { return await req('/v1/info') } catch { return fallback }
}

export async function getModels(fallback = []) {
  if (!(await ensureLive())) return fallback
  try {
    const data = await req('/v1/models')
    return (data && data.data) ? data.data.map((m) => m.id) : fallback
  } catch { return fallback }
}

/** Non-streaming chat. messages: [{role, content}]. */
export async function chat(messages, { model, temperature } = {}, fallback = null) {
  if (!(await ensureLive())) return fallback
  try {
    const data = await req('/v1/chat/completions', {
      method: 'POST',
      body: { model: model || 'default', messages, temperature, stream: false },
    })
    return data?.choices?.[0]?.message?.content ?? fallback
  } catch { return fallback }
}

/** Streaming chat — yields text deltas. Falls back to a single fallback chunk. */
export async function* chatStream(messages, { model, temperature } = {}, fallback = null) {
  if (!(await ensureLive())) { if (fallback) yield fallback; return }
  let res
  try {
    res = await fetch('/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: model || 'default', messages, temperature, stream: true }),
    })
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)
  } catch {
    if (fallback) yield fallback
    return
  }
  const reader = res.body.getReader()
  const dec = new TextDecoder()
  let buf = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop() || ''
    for (const line of lines) {
      const s = line.trim()
      if (!s.startsWith('data:')) continue
      const payload = s.slice(5).trim()
      if (payload === '[DONE]') return
      try {
        const json = JSON.parse(payload)
        const delta = json?.choices?.[0]?.delta?.content
        if (delta) yield delta
      } catch { /* ignore keep-alive lines */ }
    }
  }
}

/* ---- managed agents ---- */
export async function getAgents(fallback = []) {
  if (!(await ensureLive())) return fallback
  try {
    const data = await req('/v1/managed-agents')
    return Array.isArray(data) ? data : (data?.agents ?? fallback)
  } catch { return fallback }
}
export async function pauseAgent(id) { if (!(await ensureLive())) return null; try { return await req(`/v1/managed-agents/${id}/pause`, { method: 'POST' }) } catch { return null } }
export async function resumeAgent(id) { if (!(await ensureLive())) return null; try { return await req(`/v1/managed-agents/${id}/resume`, { method: 'POST' }) } catch { return null } }
export async function runAgent(id, task) { if (!(await ensureLive())) return null; try { return await req(`/v1/managed-agents/${id}/run`, { method: 'POST', body: { task } }) } catch { return null } }

/* ---- connectors (integrations) ---- */
export async function getConnectors(fallback = []) {
  if (!(await ensureLive())) return fallback
  try {
    const data = await req('/v1/connectors')
    return Array.isArray(data) ? data : (data?.connectors ?? fallback)
  } catch { return fallback }
}
export function connectorOAuthUrl(id) { return `/v1/connectors/${id}/oauth/start` }
export async function syncConnector(id) { if (!(await ensureLive())) return null; try { return await req(`/v1/connectors/${id}/sync`, { method: 'POST' }) } catch { return null } }

/* ---- daily briefing / morning digest ---- */
export async function getDigest(fallback = null) {
  if (!(await ensureLive())) return fallback
  try { return await req('/api/digest') } catch { return fallback }
}
export async function generateDigest() { if (!(await ensureLive())) return null; try { return await req('/api/digest/generate', { method: 'POST' }) } catch { return null } }

/* ---- memory ---- */
export async function searchMemory(query, fallback = []) {
  if (!(await ensureLive())) return fallback
  try {
    const data = await req(`/v1/memory/search?q=${encodeURIComponent(query)}`)
    return data?.results ?? fallback
  } catch { return fallback }
}
