import React, { useState } from 'react'
import Orb from './Orb.jsx'
import { Hoverable } from './ui.jsx'
import { loginWithBackend, loginWithAccessKey } from './auth.js'

const field = {
  width: '100%', background: 'rgba(6,8,15,0.75)', border: '1px solid rgba(99,140,200,0.18)',
  borderRadius: '12px', padding: '13px 16px', color: '#e8eefa',
  fontFamily: "'Inter',sans-serif", fontSize: '14px', outline: 'none',
}

/**
 * Locked-access screen. The product behind this gate is customers-only:
 * email+password when the backend is live, or a private access key.
 */
export default function AccessGate({ onAuthorized, onBack }) {
  const [mode, setMode] = useState('login') // login | key
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accessKey, setAccessKey] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setBusy(true); setError('')
    const res = mode === 'key'
      ? await loginWithAccessKey(accessKey)
      : await loginWithBackend(email, password)
    setBusy(false)
    if (res.ok) { onAuthorized(); return }
    if (res.error === 'backend-offline') {
      setError('Sign-in service unreachable. Customers with a private access key can use it below.')
      setMode('key')
    } else {
      setError(res.error)
    }
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'radial-gradient(1100px 700px at 50% -10%, #0c1322 0%, #06080f 58%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',system-ui,sans-serif", padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-180px', left: '18%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.12), transparent 66%)', filter: 'blur(24px)', animation: 'jv-orb 20s ease-in-out infinite' }} />

      <div style={{ width: '420px', maxWidth: '94vw', animation: 'jv-rise 0.6s cubic-bezier(.34,1.3,.64,1) both' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
          <Orb size={72} state={busy ? 'thinking' : 'idle'} />
          <div style={{ marginTop: '18px', fontWeight: 600, fontSize: '20px', letterSpacing: '3px', background: 'linear-gradient(120deg,#e0f2fe,#67e8f9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>BLUEMAN</div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', letterSpacing: '2.5px', color: '#56688c', marginTop: '6px' }}>CUSTOMER ACCESS ONLY</div>
        </div>

        <div style={{ background: 'rgba(13,19,32,0.72)', border: '1px solid rgba(99,140,200,0.16)', borderRadius: '22px', padding: '28px', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 40px 100px -40px rgba(0,0,0,0.9), 0 0 0 1px rgba(34,211,238,0.05)' }}>
          {mode === 'login' ? (
            <>
              <h1 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 600, color: '#e8eefa' }}>Sign in to your workspace</h1>
              <p style={{ margin: '0 0 20px', fontSize: '12.5px', color: '#7184a8', lineHeight: 1.55 }}>Blueman is available to subscribed customers. Your agents, memory and data are waiting.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" type="email" autoComplete="email" style={field} />
                <input value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="Password" type="password" autoComplete="current-password" style={field} />
              </div>
            </>
          ) : (
            <>
              <h1 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 600, color: '#e8eefa' }}>Private access</h1>
              <p style={{ margin: '0 0 20px', fontSize: '12.5px', color: '#7184a8', lineHeight: 1.55 }}>Enter the access key you received from the Blueman team.</p>
              <input value={accessKey} onChange={(e) => setAccessKey(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="BLUEMAN-XXXX-XXXX" autoComplete="off" style={{ ...field, fontFamily: "'Space Mono',monospace", letterSpacing: '1px' }} />
            </>
          )}

          {error && <div style={{ marginTop: '14px', fontSize: '12px', color: '#f59e9e', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '10px', padding: '10px 13px', lineHeight: 1.5 }}>{error}</div>}

          <Hoverable as="button" onClick={submit} baseStyle={{ width: '100%', marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#04121f', border: 'none', borderRadius: '13px', padding: '14px', fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 12px 30px -10px rgba(59,130,246,0.85)', opacity: busy ? 0.7 : 1 }} hoverStyle={{ filter: 'brightness(1.08)' }}>
            {busy ? 'Verifying…' : mode === 'login' ? 'Sign in' : 'Unlock workspace'}
            {!busy && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>}
          </Hoverable>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '18px' }}>
            <button onClick={() => { setMode(mode === 'login' ? 'key' : 'login'); setError('') }} style={{ background: 'none', border: 'none', color: '#67e8f9', fontSize: '12px', cursor: 'pointer', fontFamily: "'Inter',sans-serif", padding: 0 }}>
              {mode === 'login' ? 'Have an access key?' : 'Sign in with email instead'}
            </button>
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#56688c', fontSize: '12px', cursor: 'pointer', fontFamily: "'Inter',sans-serif", padding: 0 }}>← Back to site</button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '12px', color: '#56688c' }}>
          Not a customer yet? <a href="#pricing" onClick={onBack} style={{ color: '#67e8f9', textDecoration: 'none' }}>See plans</a> or <a href="#demo" onClick={onBack} style={{ color: '#67e8f9', textDecoration: 'none' }}>request a guided demo</a>.
        </div>
      </div>
    </div>
  )
}
