import React, { useState } from 'react'

export const SPRING = 'cubic-bezier(.34,1.3,.64,1)'

export const STATUS = {
  active: { accent: '#22d3ee', label: 'ACTIVE', glyph: 'rgba(34,211,238,0.12)' },
  thinking: { accent: '#fbbf24', label: 'REASONING', glyph: 'rgba(251,191,36,0.14)' },
  paused: { accent: '#7184a8', label: 'PAUSED', glyph: 'rgba(113,132,168,0.14)' },
}

export const panel = {
  background: 'rgba(13,19,32,0.5)',
  border: '1px solid rgba(99,140,200,0.12)',
  borderRadius: '20px',
  padding: '22px',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  boxShadow: '0 30px 70px -42px rgba(0,0,0,0.85)',
}

export const riseAt = (d) => ({ animation: `jv-rise 0.6s ${SPRING} both`, animationDelay: d + 's' })

export const fmtInt = (n) => Math.round(n).toLocaleString('en-US')

export const cyanGrad = 'linear-gradient(120deg,#a5f3fc,#3b82f6)'
export const goldGrad = 'linear-gradient(120deg,#fde68a,#f59e0b)'

/* tiny hover helper (replaces the design's style-hover/style-focus) */
export function Hoverable({ as = 'div', baseStyle, hoverStyle, children, ...props }) {
  const [h, setH] = useState(false)
  const Tag = as
  return (
    <Tag
      style={{ ...baseStyle, ...(h ? hoverStyle : {}) }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      {...props}
    >
      {children}
    </Tag>
  )
}

/* page header (title + subtitle + optional right slot) */
export function PageHead({ title, subtitle, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '22px', gap: '16px', flexWrap: 'wrap', ...riseAt(0.02) }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600, letterSpacing: '-0.4px', color: '#e8eefa' }}>{title}</h1>
        {subtitle && <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '12px', color: '#56688c', marginTop: '6px' }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  )
}

/* sparkline polyline points */
export function spark(vals, w = 92, h = 30, pad = 3) {
  const min = Math.min(...vals), max = Math.max(...vals), rng = max - min || 1
  return vals
    .map((v, i) => {
      const x = pad + (i / (vals.length - 1)) * (w - pad * 2)
      const y = h - pad - ((v - min) / rng) * (h - pad * 2)
      return x.toFixed(1) + ',' + y.toFixed(1)
    })
    .join(' ')
}

/* gradient progress bar */
export function Bar({ value, paused = false, height = 6 }) {
  return (
    <div style={{ height: height + 'px', borderRadius: '7px', background: 'rgba(99,140,200,0.1)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: value + '%', borderRadius: '7px', background: paused ? 'rgba(113,132,168,0.5)' : 'linear-gradient(90deg,#22d3ee,#3b82f6)', boxShadow: paused ? 'none' : '0 0 10px 0 rgba(34,211,238,0.55)', transition: 'width 0.6s ease' }} />
    </div>
  )
}

/* small pill / tag */
export function Tag({ children, color = '#7dd3e0', bg = 'rgba(34,211,238,0.07)', border = 'rgba(34,211,238,0.22)' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: bg, border: '1px solid ' + border, borderRadius: '999px', padding: '4px 11px', fontSize: '11px', color, whiteSpace: 'nowrap', fontFamily: "'Space Mono',monospace" }}>
      {children}
    </span>
  )
}

/* toggle switch */
export function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ width: '44px', height: '24px', borderRadius: '999px', border: 'none', cursor: 'pointer', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: on ? 'flex-end' : 'flex-start', background: on ? 'linear-gradient(90deg,#22d3ee,#3b82f6)' : 'rgba(99,140,200,0.18)', boxShadow: on ? '0 0 12px -2px rgba(34,211,238,0.7)' : 'none', transition: 'all 0.25s ' + SPRING }}
    >
      <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#e8eefa', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }} />
    </button>
  )
}

/* primary gradient button */
export function PrimaryButton({ children, onClick, style }) {
  return (
    <Hoverable
      as="button"
      onClick={onClick}
      baseStyle={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#04121f', border: 'none', borderRadius: '12px', padding: '10px 16px', fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 22px -8px rgba(59,130,246,0.8)', ...style }}
      hoverStyle={{ filter: 'brightness(1.08)' }}
    >
      {children}
    </Hoverable>
  )
}
