import React, { useState } from 'react'
import { panel, riseAt, Hoverable, PageHead, PrimaryButton, Toggle, Tag } from '../ui.jsx'

const FLOWS = [
  { id: 1, name: 'Daily Digest', trigger: 'Every day · 08:00', desc: 'Summarize overnight activity and email the team', agent: 'Lyra', runs: 184, success: 99.5, on: true, last: 'completed · 09:05' },
  { id: 2, name: 'Competitor Watch', trigger: 'Every 6 hours', desc: 'Scan competitor sites for pricing & product changes', agent: 'Atlas', runs: 612, success: 98.1, on: true, last: 'completed · 06:00' },
  { id: 3, name: 'Lead Enrichment', trigger: 'On new CRM record', desc: 'Enrich inbound leads with firmographic data', agent: 'Orion', runs: 1421, success: 97.4, on: true, last: 'completed · 09:11' },
  { id: 4, name: 'Weekly Report', trigger: 'Mondays · 07:00', desc: 'Generate and distribute the weekly performance deck', agent: 'Vega', runs: 26, success: 100, on: false, last: 'paused' },
  { id: 5, name: 'Churn Alert', trigger: 'On risk score > 0.7', desc: 'Flag at-risk accounts and notify success team', agent: 'Vega', runs: 73, success: 96.0, on: true, last: 'completed · 08:42' },
]

export default function Automations() {
  const [flows, setFlows] = useState(FLOWS)
  const toggle = (id) => setFlows((f) => f.map((x) => (x.id === id ? { ...x, on: !x.on, last: x.on ? 'paused' : 'queued' } : x)))

  const activeCount = flows.filter((f) => f.on).length
  const totalRuns = flows.reduce((s, f) => s + f.runs, 0)
  const avgSuccess = (flows.reduce((s, f) => s + f.success, 0) / flows.length).toFixed(1)

  const stats = [
    { label: 'Active Workflows', value: activeCount, accent: '#22d3ee' },
    { label: 'Total Runs', value: totalRuns.toLocaleString(), accent: '#3b82f6' },
    { label: 'Avg Success', value: avgSuccess + '%', accent: '#34d399' },
    { label: 'Triggers', value: flows.length, accent: '#fbbf24' },
  ]

  return (
    <>
      <PageHead
        title="Automations"
        subtitle={`${activeCount} active · ${totalRuns.toLocaleString()} total runs · ${avgSuccess}% success`}
        right={<PrimaryButton>+ Create Automation</PrimaryButton>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ ...panel, padding: '18px 20px', ...riseAt(0.04 + i * 0.06) }}>
            <div style={{ fontSize: '11px', color: '#7184a8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{s.label}</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '28px', fontWeight: 700, marginTop: '8px', color: s.accent }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {flows.map((f, i) => (
          <Hoverable key={f.id} baseStyle={{ ...panel, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: '20px', transition: 'all 0.22s', ...riseAt(0.2 + i * 0.06) }} hoverStyle={{ borderColor: 'rgba(34,211,238,0.3)' }}>
            {/* status node */}
            <div style={{ position: 'relative', width: '44px', height: '44px', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '13px', background: f.on ? 'linear-gradient(135deg, rgba(34,211,238,0.18), rgba(59,130,246,0.12))' : 'rgba(99,140,200,0.08)', border: '1px solid ' + (f.on ? 'rgba(34,211,238,0.3)' : 'rgba(99,140,200,0.14)') }} />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={f.on ? '#67e8f9' : '#7184a8'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative' }}><rect x="3" y="3" width="6.5" height="6.5" rx="1.5" /><rect x="14.5" y="14.5" width="6.5" height="6.5" rx="1.5" /><path d="M9.5 6.25h4.5a3.75 3.75 0 0 1 3.75 3.75v4.5" /></svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#e8eefa' }}>{f.name}</h3>
                <Tag color={f.on ? '#7dd3e0' : '#7184a8'} bg={f.on ? 'rgba(34,211,238,0.07)' : 'rgba(99,140,200,0.06)'} border={f.on ? 'rgba(34,211,238,0.22)' : 'rgba(99,140,200,0.14)'}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: f.on ? '#22d3ee' : '#7184a8', animation: f.on ? 'jv-dot 2.2s ease-in-out infinite' : 'none' }} />
                  {f.on ? 'ENABLED' : 'PAUSED'}
                </Tag>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#8195b8' }}>{f.desc}</p>
              <div style={{ display: 'flex', gap: '16px', fontFamily: "'Space Mono',monospace", fontSize: '11px', color: '#56688c', flexWrap: 'wrap' }}>
                <span>⏲ {f.trigger}</span>
                <span>◆ {f.agent}</span>
                <span>↻ {f.runs.toLocaleString()} runs</span>
                <span style={{ color: '#4fae6b' }}>✓ {f.success}%</span>
                <span>· {f.last}</span>
              </div>
            </div>

            <div style={{ flex: 'none' }}><Toggle on={f.on} onClick={() => toggle(f.id)} /></div>
          </Hoverable>
        ))}
      </div>
    </>
  )
}
