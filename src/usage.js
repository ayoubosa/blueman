import { useSyncExternalStore } from 'react'

/**
 * Tiny global token-usage store with localStorage persistence.
 * Tracks tokens burned vs the user-chosen monthly limit.
 */
const KEY = 'blueman_usage_v1'

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    if (raw && typeof raw.used === 'number' && typeof raw.limit === 'number') return raw
  } catch { /* ignore */ }
  return { used: 248120, limit: 1_000_000 } // demo seed
}

let state = load()
const subs = new Set()

function emit() {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
  subs.forEach((f) => f())
}

export function addTokens(n) {
  if (!n || n < 0) return
  state = { ...state, used: state.used + Math.round(n) }
  emit()
}
export function setLimit(n) {
  state = { ...state, limit: Math.max(1000, Math.round(n)) }
  emit()
}
export function resetUsage() {
  state = { ...state, used: 0 }
  emit()
}

function subscribe(f) { subs.add(f); return () => subs.delete(f) }
function snapshot() { return state }

export function useUsage() {
  return useSyncExternalStore(subscribe, snapshot, snapshot)
}

/** Format large token counts as 1.2M / 248K / 980. */
export function fmtTokens(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2).replace(/\.0+$/, '') + 'M'
  if (n >= 1_000) return Math.round(n / 1000) + 'K'
  return String(Math.round(n))
}

/** Rough blended cost estimate (Claude-ish): ~$6 / 1M tokens. */
export function estCost(tokens) {
  return (tokens / 1_000_000) * 6
}
