import React, { useState } from 'react'
import { Hoverable } from './ui.jsx'
import { useUsage, setLimit, resetUsage, fmtTokens, estCost } from './usage.js'

const PRESETS = [
  { label: '100K', value: 100_000 },
  { label: '500K', value: 500_000 },
  { label: '1M', value: 1_000_000 },
  { label: '5M', value: 5_000_000 },
  { label: '10M', value: 10_000_000 },
]

export default function UsageBar() {
  const { used, limit } = useUsage()
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState('')

  const pct = Math.min(100, (used / limit) * 100)
  const remaining = Math.max(0, limit - used)
  const danger = pct >= 90
  const warn = pct >= 70 && pct < 90
  const trackColor = danger ? '#f87171' : warn ? '#fbbf24' : '#22d3ee'
  const grad = danger
    ? 'linear-gradient(90deg,#fb7185,#f87171)'
    : warn
      ? 'linear-gradient(90deg,#fbbf24,#f59e0b)'
      : 'linear-gradient(90deg,#22d3ee,#3b82f6)'

  const applyCustom = () => {
    const n = parseFloat(custom)
    if (!isNaN(n) && n > 0) { setLimit(n * 1_000_000); setCustom('') }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* compact meter (click to expand) */}
      <Hoverable
        as="button"
        onClick={() => setOpen((o) => !o)}
        baseStyle={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '184px', background: 'rgba(11,17,29,0.6)', border: '1px solid ' + (open ? 'rgba(34,211,238,0.4)' : 'rgba(99,140,200,0.14)'), borderRadius: '12px', padding: '9px 13px', cursor: 'pointer', transition: 'all 0.2s' }}
        hoverStyle={{ borderColor: 'rgba(34,211,238,0.34)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#7184a8', letterSpacing: '0.5px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={trackColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9z" /></svg>
            TOKENS
          </span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', fontWeight: 700, color: trackColor }}>{fmtTokens(used)}/{fmtTokens(limit)}</span>
        </div>
        <div style={{ height: '5px', borderRadius: '6px', background: 'rgba(99,140,200,0.12)', overflow: 'hidden', width: '100%' }}>
          <div style={{ height: '100%', width: pct + '%', borderRadius: '6px', background: grad, boxShadow: `0 0 8px 0 ${trackColor}aa`, transition: 'width 0.5s ease' }} />
        </div>
      </Hoverable>

      {/* slide-down detail panel */}
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '340px', zIndex: 50, background: 'rgba(13,19,32,0.96)', border: '1px solid rgba(99,140,200,0.2)', borderRadius: '18px', boxShadow: '0 40px 100px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(34,211,238,0.06)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', overflow: 'hidden', animation: 'jv-palette 0.22s cubic-bezier(.34,1.3,.64,1)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(99,140,200,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#e8eefa' }}>Token Usage</h3>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', color: trackColor }}>{pct.toFixed(1)}% used</span>
              </div>

              {/* big bar */}
              <div style={{ height: '10px', borderRadius: '7px', background: 'rgba(99,140,200,0.12)', overflow: 'hidden', margin: '14px 0 16px' }}>
                <div style={{ height: '100%', width: pct + '%', borderRadius: '7px', background: grad, boxShadow: `0 0 12px 0 ${trackColor}`, transition: 'width 0.5s ease' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[
                  { l: 'Burned', v: fmtTokens(used), c: trackColor },
                  { l: 'Remaining', v: fmtTokens(remaining), c: '#67e8f9' },
                  { l: 'Limit', v: fmtTokens(limit), c: '#e8eefa' },
                ].map((s) => (
                  <div key={s.l} style={{ background: 'rgba(8,12,22,0.6)', border: '1px solid rgba(99,140,200,0.1)', borderRadius: '11px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '9px', color: '#56688c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.l}</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '16px', fontWeight: 700, color: s.c, marginTop: '4px' }}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '12px', fontSize: '11px', color: '#56688c', fontFamily: "'Space Mono',monospace" }}>
                ≈ ${estCost(used).toFixed(2)} spent · ${estCost(remaining).toFixed(2)} left {danger ? '· ⚠ limit almost reached' : ''}
              </div>
            </div>

            {/* set limit */}
            <div style={{ padding: '16px 20px' }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '9px', letterSpacing: '1.5px', color: '#3f4f6e', marginBottom: '10px' }}>SET YOUR MONTHLY LIMIT</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '12px' }}>
                {PRESETS.map((p) => {
                  const on = limit === p.value
                  return (
                    <Hoverable as="button" key={p.label} onClick={() => setLimit(p.value)}
                      baseStyle={{ padding: '7px 13px', borderRadius: '9px', cursor: 'pointer', fontFamily: "'Space Mono',monospace", fontSize: '12px', fontWeight: 700, border: on ? '1px solid rgba(34,211,238,0.45)' : '1px solid rgba(99,140,200,0.14)', background: on ? 'linear-gradient(135deg,#22d3ee,#3b82f6)' : 'rgba(11,17,29,0.6)', color: on ? '#04121f' : '#9fb3d4', transition: 'all 0.18s' }}
                      hoverStyle={on ? {} : { borderColor: 'rgba(34,211,238,0.34)', color: '#cfe3ff' }}>
                      {p.label}
                    </Hoverable>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') applyCustom() }}
                  placeholder="Custom (millions)"
                  inputMode="decimal"
                  style={{ flex: 1, minWidth: 0, background: 'rgba(6,8,15,0.7)', border: '1px solid rgba(99,140,200,0.16)', borderRadius: '10px', padding: '9px 12px', color: '#cdd8ec', fontFamily: "'Inter',sans-serif", fontSize: '12px', outline: 'none' }}
                />
                <Hoverable as="button" onClick={applyCustom} baseStyle={{ flex: 'none', padding: '0 14px', borderRadius: '10px', background: 'rgba(99,140,200,0.07)', border: '1px solid rgba(99,140,200,0.16)', color: '#9fb3d4', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 600 }} hoverStyle={{ color: '#cfe3ff', borderColor: 'rgba(34,211,238,0.34)' }}>Set</Hoverable>
              </div>
              <Hoverable as="button" onClick={resetUsage} baseStyle={{ width: '100%', marginTop: '10px', padding: '9px', borderRadius: '10px', background: 'transparent', border: '1px solid rgba(99,140,200,0.12)', color: '#7184a8', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: '12px' }} hoverStyle={{ color: '#f59e9e', borderColor: 'rgba(248,113,113,0.3)' }}>Reset usage counter</Hoverable>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
