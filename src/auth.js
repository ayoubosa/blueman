/**
 * Customer access control.
 *
 * The platform is locked: only authenticated, paying customers get past the
 * landing page. Two paths in:
 *
 *  1. Backend login (email + password) — real JWT session when the Blueman
 *     API is live. Subscription is enforced server-side (402 without a plan).
 *  2. Private access key — interim gate while the backend is offline. Only a
 *     SHA-256 hash of the key ships in the bundle, so the key can't be read
 *     from source. This is an access control for the demo period, not a
 *     substitute for the server-side gate.
 */
import { useSyncExternalStore } from 'react'

const KEY = 'blueman_session_v1'
// sha256("<private founder key>") — the plaintext key is never in the bundle.
const ACCESS_KEY_HASH = 'e51bc7d522a29a771929c998da703d5f6d8c4aea93694f0e147fd9d0bb2e0d7a'

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    if (raw && raw.authorized) return raw
  } catch { /* ignore */ }
  return { authorized: false, token: null, plan: null, name: null }
}

let state = load()
const subs = new Set()

function emit() {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
  subs.forEach((f) => f())
}

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Path 1 — backend session. Returns { ok, error }. */
export async function loginWithBackend(email, password) {
  try {
    const res = await fetch('/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const detail = res.status === 401 ? 'Invalid email or password' : `Login failed (${res.status})`
      return { ok: false, error: detail }
    }
    const data = await res.json()
    state = { authorized: true, token: data.access_token, plan: data.plan, name: email.split('@')[0] }
    emit()
    return { ok: true }
  } catch {
    return { ok: false, error: 'backend-offline' }
  }
}

/** Path 2 — private access key (hash-checked locally). Returns { ok, error }. */
export async function loginWithAccessKey(key) {
  const hash = await sha256Hex(key.trim())
  if (hash === ACCESS_KEY_HASH) {
    state = { authorized: true, token: null, plan: 'founder', name: 'Ayoub' }
    emit()
    return { ok: true }
  }
  return { ok: false, error: 'Invalid access key' }
}

export function logout() {
  state = { authorized: false, token: null, plan: null, name: null }
  emit()
}

export function authToken() { return state.token }

function subscribe(f) { subs.add(f); return () => subs.delete(f) }
function snapshot() { return state }

export function useAuth() {
  return useSyncExternalStore(subscribe, snapshot, snapshot)
}
