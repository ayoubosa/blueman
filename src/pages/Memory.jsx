import React, { useState } from 'react'
import { panel, riseAt, Hoverable, PageHead, Tag, Bar } from '../ui.jsx'

const ENTRIES = [
  { id: 1, ns: 'market', text: 'Acme Corp raised Series C at $1.2B valuation, expanding into EMEA', agent: 'Atlas', score: 0.97, time: '2m ago' },
  { id: 2, ns: 'sales', text: 'Decision-maker at Globex prefers async demos over live calls', agent: 'Orion', score: 0.94, time: '14m ago' },
  { id: 3, ns: 'content', text: 'Q3 campaign tone: confident, technical, sparing on superlatives', agent: 'Lyra', score: 0.92, time: '38m ago' },
  { id: 4, ns: 'market', text: 'Competitor pricing shifted to usage-based across 3 SKUs', agent: 'Atlas', score: 0.91, time: '1h ago' },
  { id: 5, ns: 'analysis', text: 'Churn correlates with <2 logins/week in first 30 days (r=0.74)', agent: 'Vega', score: 0.89, time: '2h ago' },
  { id: 6, ns: 'sales', text: 'Initiative Q is budget-approved for Q4; revisit in September', agent: 'Orion', score: 0.86, time: '3h ago' },
]

const NS_COLOR = { market: '#22d3ee', sales: '#3b82f6', content: '#fbbf24', analysis: '#a78bfa' }

export default function Memory() {
  const [query, setQuery] = useState('')
  const shown = ENTRIES.filter((e) => e.text.toLowerCase().includes(query.toLowerCase()) || e.ns.includes(query.toLowerCase()))

  const stats = [
    { label: 'Total Vectors', value: '2.41M', accent: '#22d3ee' },
    { label: 'Namespaces', value: '4', accent: '#3b82f6' },
    { label: 'Index Size', value: '6.8 GB', accent: '#fbbf24' },
    { label: 'Recall @10', value: '98.2%', accent: '#34d399' },
  ]
  const namespaces = [
    { name: 'market', vectors: '912k', pct: 38 },
    { name: 'sales', vectors: '648k', pct: 27 },
    { name: 'content', vectors: '504k', pct: 21 },
    { name: 'analysis', vectors: '342k', pct: 14 },
  ]

  return (
    <>
      <PageHead
        title="Memory"
        subtitle="Universal agent memory · 2.41M vectors · Qdrant + Mem0"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '320px', maxWidth: '44vw', background: 'rgba(11,17,29,0.6)', border: '1px solid rgba(99,140,200,0.14)', borderRadius: '12px', padding: '10px 14px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#56688c" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Semantic search across memory…" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#cdd8ec', fontFamily: "'Inter',sans-serif", fontSize: '13px' }} />
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ ...panel, padding: '18px 20px', ...riseAt(0.04 + i * 0.06) }}>
            <div style={{ fontSize: '11px', color: '#7184a8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{s.label}</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '28px', fontWeight: 700, marginTop: '8px', color: s.accent }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: '16px' }}>
        {/* entries */}
        <section style={{ ...panel, ...riseAt(0.28) }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#e8eefa' }}>Recent Memories</h2>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#56688c' }}>{shown.length} RESULTS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {shown.map((e) => {
              const color = NS_COLOR[e.ns] || '#7184a8'
              return (
                <Hoverable key={e.id} baseStyle={{ display: 'flex', gap: '14px', padding: '14px', borderRadius: '14px', background: 'rgba(8,12,22,0.5)', border: '1px solid rgba(99,140,200,0.1)', transition: 'all 0.2s', cursor: 'default' }} hoverStyle={{ borderColor: 'rgba(34,211,238,0.3)', background: 'rgba(8,12,22,0.75)' }}>
                  <div style={{ width: '4px', borderRadius: '4px', background: color, flex: 'none' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#dbe5f5', lineHeight: 1.45 }}>{e.text}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#56688c' }}>
                      <Tag color={color} bg={color + '14'} border={color + '33'}>{e.ns}</Tag>
                      <span>◆ {e.agent}</span>
                      <span>◆ {e.time}</span>
                    </div>
                  </div>
                  <div style={{ flex: 'none', textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '14px', fontWeight: 700, color: '#67e8f9' }}>{e.score.toFixed(2)}</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '9px', color: '#3f4f6e' }}>SIMILARITY</div>
                  </div>
                </Hoverable>
              )
            })}
          </div>
        </section>

        {/* namespace distribution */}
        <section style={{ ...panel, ...riseAt(0.34), height: 'fit-content' }}>
          <h2 style={{ margin: '0 0 18px', fontSize: '15px', fontWeight: 600, color: '#e8eefa' }}>Namespaces</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {namespaces.map((n) => (
              <div key={n.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#bccbe6' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '3px', background: NS_COLOR[n.name] }} />
                    {n.name}
                  </span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', color: '#8195b8' }}>{n.vectors}</span>
                </div>
                <Bar value={n.pct} height={6} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', padding: '14px', borderRadius: '12px', background: 'linear-gradient(150deg, rgba(34,211,238,0.08), rgba(59,130,246,0.04))', border: '1px solid rgba(34,211,238,0.16)' }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#7184a8', marginBottom: '4px' }}>LAST REINDEX</div>
            <div style={{ fontSize: '13px', color: '#dbe5f5' }}>09:09:18 · 2.4M vectors · 4.2s</div>
          </div>
        </section>
      </div>
    </>
  )
}
