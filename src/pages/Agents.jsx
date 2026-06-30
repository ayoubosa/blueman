import React, { useState } from 'react'
import { SPRING, STATUS, panel, riseAt, Hoverable, PageHead, PrimaryButton, Bar, Tag } from '../ui.jsx'

export default function Agents({ agents, toggleAgent, deploy }) {
  const [filter, setFilter] = useState('all')

  const counts = {
    all: agents.length,
    active: agents.filter((a) => a.status === 'active').length,
    thinking: agents.filter((a) => a.status === 'thinking').length,
    paused: agents.filter((a) => a.status === 'paused').length,
  }
  const avgEff = Math.round(agents.reduce((s, a) => s + a.eff, 0) / agents.length)
  const shown = filter === 'all' ? agents : agents.filter((a) => a.status === filter)

  const stats = [
    { label: 'Total Agents', value: agents.length, accent: '#22d3ee' },
    { label: 'Currently Active', value: counts.active, accent: '#4fae6b' },
    { label: 'Reasoning', value: counts.thinking, accent: '#fbbf24' },
    { label: 'Avg Efficiency', value: avgEff + '%', accent: '#67e8f9' },
  ]

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'thinking', label: 'Reasoning' },
    { key: 'paused', label: 'Paused' },
  ]

  return (
    <>
      <PageHead
        title="Agent Fleet"
        subtitle={`${agents.length} agents · ${counts.active} running · avg ${avgEff}% efficiency`}
        right={<PrimaryButton onClick={deploy}>+ Deploy New Agent</PrimaryButton>}
      />

      {/* stat strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ ...panel, padding: '18px 20px', ...riseAt(0.04 + i * 0.06) }}>
            <div style={{ fontSize: '11px', color: '#7184a8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{s.label}</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '30px', fontWeight: 700, marginTop: '8px', color: s.accent }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* filter chips */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', ...riseAt(0.26) }}>
        {filters.map((f) => {
          const on = filter === f.key
          return (
            <Hoverable as="button" key={f.key} onClick={() => setFilter(f.key)}
              baseStyle={{ padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: on ? 600 : 400, border: on ? '1px solid rgba(34,211,238,0.4)' : '1px solid rgba(99,140,200,0.14)', background: on ? 'linear-gradient(100deg, rgba(34,211,238,0.15), rgba(59,130,246,0.09))' : 'rgba(11,17,29,0.5)', color: on ? '#bfe9f5' : '#7184a8', transition: 'all 0.2s' }}
              hoverStyle={on ? {} : { color: '#9fb3d4', borderColor: 'rgba(34,211,238,0.25)' }}>
              {f.label} · {counts[f.key]}
            </Hoverable>
          )
        })}
      </div>

      {/* agent grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '16px' }}>
        {shown.map((a, i) => {
          const sm = STATUS[a.status]
          const isPaused = a.status === 'paused'
          return (
            <Hoverable key={a.id} baseStyle={{ ...panel, position: 'relative', overflow: 'hidden', transition: `transform 0.26s ${SPRING}, border-color 0.26s, box-shadow 0.26s`, ...riseAt(0.3 + i * 0.06) }} hoverStyle={{ borderColor: 'rgba(34,211,238,0.4)', transform: 'translateY(-3px)', boxShadow: '0 22px 50px -32px rgba(34,211,238,0.55)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: sm.accent, opacity: 0.7 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: sm.glyph, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: '20px', color: sm.accent, border: '1px solid ' + sm.accent + '40' }}>{a.initial}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#e8eefa' }}>{a.name}</div>
                  <div style={{ fontSize: '12px', color: '#56688c' }}>{a.role}</div>
                </div>
                <Tag color={sm.accent} bg={sm.glyph} border={sm.accent + '40'}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sm.accent, animation: isPaused ? 'none' : 'jv-dot 2.2s ease-in-out infinite' }} />
                  {sm.label}
                </Tag>
              </div>

              <div style={{ background: 'rgba(8,12,22,0.5)', border: '1px solid rgba(99,140,200,0.1)', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px', minHeight: '54px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {a.status === 'thinking' && (
                  <span style={{ display: 'inline-flex', gap: '4px', flex: 'none' }}>
                    {[0, 0.2, 0.4].map((d) => <span key={d} style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fbbf24', animation: `jv-think 1.2s ease-in-out ${d}s infinite` }} />)}
                  </span>
                )}
                <span style={{ fontSize: '12px', color: '#bccbe6', lineHeight: 1.4 }}>{a.task}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#56688c', letterSpacing: '0.5px' }}>EFFICIENCY</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', fontWeight: 700, color: sm.accent }}>{a.eff}%</span>
                  </div>
                  <Bar value={a.eff} paused={isPaused} height={5} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#56688c', letterSpacing: '0.5px' }}>UPTIME</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', fontWeight: 700, color: '#67e8f9' }}>{a.uptime}</span>
                  </div>
                  <Bar value={a.uptimePct} height={5} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', fontFamily: "'Space Mono',monospace", fontSize: '11px', color: '#7184a8' }}>
                <span>◆ {a.tasks.toLocaleString()} tasks</span>
                <span>◆ {a.tokens} tokens</span>
                <span>◆ {a.model}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => toggleAgent(a.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', background: isPaused ? 'linear-gradient(135deg,#22d3ee,#3b82f6)' : 'rgba(99,140,200,0.07)', color: isPaused ? '#04121f' : '#9fb3d4', border: isPaused ? 'none' : '1px solid rgba(99,140,200,0.14)', borderRadius: '10px', padding: '10px', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  {isPaused ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20" /></svg> : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>}
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <Hoverable as="button" baseStyle={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', background: 'rgba(99,140,200,0.06)', border: '1px solid rgba(99,140,200,0.12)', borderRadius: '10px', color: '#9fb3d4', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 500, padding: '10px' }} hoverStyle={{ color: '#cfe3ff', borderColor: 'rgba(34,211,238,0.34)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                  Configure
                </Hoverable>
              </div>
            </Hoverable>
          )
        })}
      </div>
    </>
  )
}
