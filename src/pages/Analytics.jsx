import React, { useState } from 'react'
import { panel, riseAt, Hoverable, PageHead, Tag } from '../ui.jsx'

/* build a smooth-ish area path from values */
function areaPath(vals, w, h, pad = 8) {
  const min = Math.min(...vals), max = Math.max(...vals), rng = max - min || 1
  const pts = vals.map((v, i) => [pad + (i / (vals.length - 1)) * (w - pad * 2), h - pad - ((v - min) / rng) * (h - pad * 2)])
  const line = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  const area = line + ` L ${(w - pad).toFixed(1)} ${(h - pad).toFixed(1)} L ${pad} ${(h - pad).toFixed(1)} Z`
  return { line, area, pts }
}

export default function Analytics() {
  const [range, setRange] = useState('7D')
  const series = {
    '7D': [1180, 1240, 1190, 1320, 1290, 1410, 1480],
    '30D': [980, 1040, 1120, 1180, 1090, 1260, 1340, 1290, 1410, 1480],
    '90D': [720, 860, 940, 1080, 1190, 1240, 1310, 1420, 1480, 1520],
  }
  const labels = { '7D': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], '30D': ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'], '90D': ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10'] }
  const data = series[range]
  const W = 820, H = 240
  const { line, area, pts } = areaPath(data, W, H)

  const byAgent = [
    { name: 'Atlas', val: 412, color: '#22d3ee' },
    { name: 'Orion', val: 388, color: '#3b82f6' },
    { name: 'Lyra', val: 286, color: '#fbbf24' },
    { name: 'Vega', val: 198, color: '#a78bfa' },
    { name: 'Nova', val: 164, color: '#34d399' },
  ]
  const maxBar = Math.max(...byAgent.map((b) => b.val))

  const donut = [
    { label: 'Research', pct: 38, color: '#22d3ee' },
    { label: 'Outreach', pct: 27, color: '#3b82f6' },
    { label: 'Content', pct: 21, color: '#fbbf24' },
    { label: 'Analysis', pct: 14, color: '#a78bfa' },
  ]
  let acc = 0
  const R = 54, C = 2 * Math.PI * R

  const kpis = [
    { label: 'Total Tasks', value: '8,412', delta: '+12.4%', up: true },
    { label: 'Avg Response', value: '1.24s', delta: '-0.3s', up: true },
    { label: 'Success Rate', value: '98.7%', delta: '+0.6%', up: true },
    { label: 'Token Spend', value: '14.2M', delta: '+8.1%', up: false },
  ]

  return (
    <>
      <PageHead
        title="Analytics"
        subtitle="Fleet performance · throughput · cost intelligence"
        right={
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(11,17,29,0.6)', border: '1px solid rgba(99,140,200,0.14)', borderRadius: '11px', padding: '4px' }}>
            {['7D', '30D', '90D'].map((r) => (
              <button key={r} onClick={() => setRange(r)} style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: "'Space Mono',monospace", fontSize: '11px', fontWeight: 700, background: range === r ? 'linear-gradient(135deg,#22d3ee,#3b82f6)' : 'transparent', color: range === r ? '#04121f' : '#7184a8' }}>{r}</button>
            ))}
          </div>
        }
      />

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' }}>
        {kpis.map((k, i) => (
          <div key={k.label} style={{ ...panel, padding: '18px 20px', ...riseAt(0.04 + i * 0.06) }}>
            <div style={{ fontSize: '11px', color: '#7184a8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{k.label}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '28px', fontWeight: 700, color: '#e8eefa' }}>{k.value}</span>
              <span style={{ fontSize: '12px', color: k.up ? '#4fae6b' : '#f59e0b' }}>{k.up ? '▲' : '▲'} {k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* main chart + donut */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: '16px', marginBottom: '16px' }}>
        <section style={{ ...panel, ...riseAt(0.28) }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#e8eefa' }}>Task Throughput</h2>
            <Tag>{range} · live</Tag>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="8" y1={H * g} x2={W - 8} y2={H * g} stroke="rgba(99,140,200,0.08)" />)}
            <path d={area} fill="url(#areaFill)" />
            <path d={line} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2000" style={{ animation: 'jv-draw 1.6s ease-out both' }} />
            {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#06080f" stroke="#22d3ee" strokeWidth="2" />)}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#3f4f6e' }}>
            {labels[range].map((l) => <span key={l}>{l}</span>)}
          </div>
        </section>

        <section style={{ ...panel, ...riseAt(0.32), display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 600, color: '#e8eefa' }}>Workload Mix</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '6px 0 18px' }}>
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r={R} fill="none" stroke="rgba(99,140,200,0.1)" strokeWidth="16" />
              {donut.map((d) => {
                const len = (d.pct / 100) * C
                const seg = <circle key={d.label} cx="75" cy="75" r={R} fill="none" stroke={d.color} strokeWidth="16" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-acc} transform="rotate(-90 75 75)" strokeLinecap="butt" />
                acc += len
                return seg
              })}
              <text x="75" y="72" textAnchor="middle" fill="#e8eefa" fontFamily="'Space Mono',monospace" fontSize="22" fontWeight="700">100%</text>
              <text x="75" y="90" textAnchor="middle" fill="#56688c" fontFamily="'Space Mono',monospace" fontSize="9">ALLOCATED</text>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {donut.map((d) => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: d.color }} />
                <span style={{ flex: 1, color: '#bccbe6' }}>{d.label}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", color: '#8195b8' }}>{d.pct}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* per-agent bars */}
      <section style={{ ...panel, ...riseAt(0.4) }}>
        <h2 style={{ margin: '0 0 18px', fontSize: '15px', fontWeight: 600, color: '#e8eefa' }}>Tasks by Agent</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {byAgent.map((b) => (
            <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ width: '70px', fontSize: '12px', color: '#bccbe6' }}>{b.name}</span>
              <div style={{ flex: 1, height: '24px', borderRadius: '8px', background: 'rgba(99,140,200,0.08)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: (b.val / maxBar) * 100 + '%', borderRadius: '8px', background: `linear-gradient(90deg, ${b.color}, ${b.color}88)`, boxShadow: `0 0 14px -2px ${b.color}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px', transition: 'width 0.8s ease' }}>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', fontWeight: 700, color: '#04121f' }}>{b.val}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
