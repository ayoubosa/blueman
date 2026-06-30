import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SPRING, STATUS, panel, riseAt, fmtInt, cyanGrad, goldGrad, spark, Hoverable } from '../ui.jsx'
import { addTokens } from '../usage.js'
import { chat } from '../api.js'

/* keyword-aware demo replies so the assistant doesn't feel canned */
function demoReply(text) {
  const t = text.toLowerCase()
  if (/revenue|sales|money|profit|\$/.test(t)) return "You're at $8,420 today across 3 stores — up 18% week-over-week. Vega flagged that Meta ad CPA rose 31%, so net margin is slightly tighter than last week. Want me to have Vega draft a reallocation plan?"
  if (/email|inbox|mail/.test(t)) return 'You have 2 high-priority emails: a supplier quote and a partnership request. Nova has drafted replies to both — say the word and I’ll send them.'
  if (/content|post|social|newsletter/.test(t)) return 'Lyra has 4 posts and 1 newsletter ready for review on the Content board. They match your “confident, technical, no fluff” tone. Approve, or want edits?'
  if (/schedule|calendar|today|plan|meeting/.test(t)) return 'Your next block is a supplier call at 12:00. Sol kept the morning clear for the content review at 10:30. Should I move anything?'
  if (/agent|fleet|status/.test(t)) return 'All 6 agents are healthy — 5 active, Lyra reasoning. Average efficiency is 90.3%. Atlas is mid-scan on competitor pricing.'
  return "Understood. I've delegated that to the relevant agent and will surface results in the Live Activity feed. Anything else?"
}

const COORDS = [
  { x: 46, y: 34, ty: 24 },
  { x: 214, y: 38, ty: 28 },
  { x: 42, y: 120, ty: 138 },
  { x: 218, y: 116, ty: 134 },
]

const kpiIcon = (children) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
)

export default function Dashboard({ agents, toggleAgent, deploy }) {
  const [counters, setCounters] = useState({ agentsN: 0, tasksN: 0, effN: 0, uptN: 0 })
  const [sys, setSys] = useState({ cpu: 41, mem: 57, net: 24 })
  const [chatInput, setChatInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [chatFocus, setChatFocus] = useState(false)
  const replyRef = useRef(null)

  const [messages, setMessages] = useState([
    { from: 'jarvis', text: 'Good morning, Ayoub. All systems nominal — your fleet completed 312 tasks overnight at 94.7% efficiency. How can I assist?' },
  ])

  const feed = [
    { color: '#22d3ee', text: 'Atlas flagged 3 pricing changes from Acme Corp', time: '09:14:02', who: 'Atlas' },
    { color: '#4fae6b', text: 'Orion sent 12 outreach emails · 41% open rate', time: '09:12:47', who: 'Orion' },
    { color: '#fbbf24', text: 'Lyra began reasoning on Q3 campaign brief', time: '09:11:30', who: 'Lyra' },
    { color: '#22d3ee', text: 'Memory index rebuilt · 2.4M vectors', time: '09:09:18', who: 'System' },
    { color: '#4fae6b', text: 'Automation "Daily Digest" completed', time: '09:05:00', who: 'Workflow' },
    { color: '#7184a8', text: 'Vega paused — dataset validation required', time: '08:58:41', who: 'Vega' },
  ]

  useEffect(() => {
    const dur = 1600, start = performance.now()
    const ease = (t) => 1 - Math.pow(1 - t, 3)
    const targets = { agentsN: 12, tasksN: 1284, effN: 94.7, uptN: 99.98 }
    let raf
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur), e = ease(t)
      setCounters({ agentsN: targets.agentsN * e, tasksN: targets.tasksN * e, effN: targets.effN * e, uptN: targets.uptN * e })
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const j = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v + (Math.random() - 0.5) * 14)))
    const id = setInterval(() => setSys((s) => ({ cpu: j(s.cpu, 28, 72), mem: j(s.mem, 44, 78), net: j(s.net, 12, 60) })), 2200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => () => clearTimeout(replyRef.current), [])

  const send = async () => {
    const text = (chatInput || '').trim()
    if (!text) return
    setMessages((m) => [...m, { from: 'user', text }])
    setChatInput('')
    setThinking(true)
    // burn an estimated prompt cost (~1.3 tokens/char + overhead)
    addTokens(Math.round(text.length * 1.3) + 40)
    clearTimeout(replyRef.current)

    // Try the live backend; fall back to a keyword-aware demo reply.
    const fallback = demoReply(text)
    const history = [...messages, { role: 'user', content: text }].map((m) => ({ role: m.role || (m.from === 'user' ? 'user' : 'assistant'), content: m.content || m.text }))
    const reply = await chat(history, {}, null)
    const finalText = reply || fallback
    const delay = reply ? 0 : 1300
    replyRef.current = setTimeout(() => {
      setMessages((m) => [...m, { from: 'jarvis', text: finalText }])
      addTokens(Math.round(finalText.length * 1.3) + 60) // completion tokens
      setThinking(false)
    }, delay)
  }

  const kpis = useMemo(() => {
    const defs = [
      { label: 'Active Agents', display: fmtInt(counters.agentsN), trend: '▲ 2 deployed today', data: [6, 7, 7, 8, 9, 9, 10, 11, 11, 12], gold: false, icon: kpiIcon([<rect key={1} x="3" y="11" width="18" height="10" rx="2.5" />, <circle key={2} cx="12" cy="5" r="2.2" />, <path key={3} d="M12 7.2V11" />]) },
      { label: 'Tasks Completed', display: fmtInt(counters.tasksN), trend: '▲ 312 since midnight', data: [820, 900, 970, 1010, 1080, 1130, 1190, 1230, 1260, 1284], gold: false, icon: kpiIcon([<path key={1} d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />, <polyline key={2} points="22 4 12 14.01 9 11.01" />]) },
      { label: 'Efficiency', display: counters.effN.toFixed(1) + '%', trend: '▲ 1.4% vs last week', data: [89, 90, 90, 91, 92, 92, 93, 94, 94, 95], gold: false, icon: kpiIcon([<polyline key={1} points="23 6 13.5 16.5 8.5 11.5 1 19" />, <polyline key={2} points="17 6 23 6 23 12" />]) },
      { label: 'Uptime · SLA', display: counters.uptN.toFixed(2) + '%', trend: 'Enterprise · 90 days', data: [99.9, 99.95, 99.92, 99.97, 99.96, 99.98, 99.97, 99.99, 99.98, 99.98], gold: true, icon: kpiIcon([<path key={1} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />]) },
    ]
    return defs.map((k, i) => ({
      ...k,
      labelColor: k.gold ? '#caa86a' : '#7184a8',
      iconBg: k.gold ? 'rgba(251,191,36,0.12)' : 'rgba(34,211,238,0.1)',
      iconColor: k.gold ? '#fbbf24' : '#5fd6e6',
      numGradient: k.gold ? goldGrad : cyanGrad,
      sparkPts: spark(k.data),
      sparkColor: k.gold ? '#f59e0b' : '#22d3ee',
      sparkAnim: { animation: 'jv-draw 1.4s ease-out both', animationDelay: 0.5 + i * 0.12 + 's' },
      cardStyle: { ...panel, padding: '18px 18px 16px', position: 'relative', overflow: 'hidden', cursor: 'default', transition: `transform 0.28s ${SPRING}, border-color 0.28s, box-shadow 0.28s`, ...riseAt(0.04 + i * 0.08) },
    }))
  }, [counters])

  const bar = (v) => ({ height: '100%', width: v + '%', borderRadius: '7px', background: 'linear-gradient(90deg,#22d3ee,#3b82f6)', boxShadow: '0 0 10px 0 rgba(34,211,238,0.55)', transition: 'width 0.6s ease' })
  const reasoning = agents.filter((a) => a.status === 'thinking').length
  const idle = agents.filter((a) => a.status === 'paused').length

  return (
    <>
      {/* HERO METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '20px' }}>
        {kpis.map((k) => (
          <Hoverable key={k.label} baseStyle={k.cardStyle} hoverStyle={{ transform: 'translateY(-4px)', borderColor: 'rgba(34,211,238,0.42)', boxShadow: '0 26px 64px -30px rgba(34,211,238,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: k.labelColor, letterSpacing: '0.6px', textTransform: 'uppercase', fontWeight: 500 }}>{k.label}</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: k.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.iconColor }}>{k.icon}</div>
            </div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '40px', fontWeight: 700, marginTop: '12px', lineHeight: 1, background: k.numGradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{k.display}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '10px', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#4fae6b', whiteSpace: 'nowrap' }}>{k.trend}</span>
              <svg width="92" height="30" viewBox="0 0 92 30" fill="none" preserveAspectRatio="none" style={{ flex: 'none' }}>
                <polyline points={k.sparkPts} fill="none" stroke={k.sparkColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="340" style={k.sparkAnim} />
              </svg>
            </div>
          </Hoverable>
        ))}
      </div>

      {/* FLEET + RAIL */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2.05fr) minmax(0,1fr)', gap: '16px' }}>
        <section style={{ ...panel, ...riseAt(0.3) }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#e8eefa', letterSpacing: '-0.2px' }}>Agent Fleet</h2>
              <div style={{ fontSize: '11px', color: '#56688c', marginTop: '3px', fontFamily: "'Space Mono',monospace" }}>{agents.length} deployed · {reasoning} reasoning · {idle} idle</div>
            </div>
            <Hoverable as="button" baseStyle={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#04121f', border: 'none', borderRadius: '11px', padding: '9px 15px', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 22px -8px rgba(59,130,246,0.8)' }} hoverStyle={{ filter: 'brightness(1.08)' }} onClick={deploy}>+ Deploy Agent</Hoverable>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {agents.slice(0, 4).map((a) => {
              const sm = STATUS[a.status]
              const isPaused = a.status === 'paused'
              return (
                <Hoverable key={a.id} baseStyle={{ position: 'relative', background: 'rgba(8,12,22,0.6)', border: '1px solid rgba(99,140,200,0.11)', borderRadius: '16px', padding: '16px', overflow: 'hidden', transition: `transform 0.26s ${SPRING}, border-color 0.26s, box-shadow 0.26s` }} hoverStyle={{ borderColor: 'rgba(34,211,238,0.4)', transform: 'translateY(-3px)', boxShadow: '0 22px 50px -32px rgba(34,211,238,0.55)' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', borderRadius: '16px 16px 0 0', background: sm.accent, opacity: 0.65 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: sm.glyph, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: '14px', color: sm.accent }}>{a.initial}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#e8eefa', lineHeight: 1.15 }}>{a.name}</div>
                      <div style={{ fontSize: '11px', color: '#56688c' }}>{a.role}</div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontFamily: "'Space Mono',monospace", color: sm.accent }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: sm.accent, boxShadow: '0 0 7px 1px ' + sm.accent, animation: isPaused ? 'none' : 'jv-dot 2.2s ease-in-out infinite' }} />
                      {sm.label}
                    </span>
                  </div>
                  <div style={{ margin: '13px 0 4px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#8195b8', minHeight: '28px' }}>
                    {a.status === 'thinking' && (
                      <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', flex: 'none' }}>
                        {[0, 0.2, 0.4].map((d) => <span key={d} style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fbbf24', animation: `jv-think 1.2s ease-in-out ${d}s infinite` }} />)}
                      </span>
                    )}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.task}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#56688c', letterSpacing: '0.5px' }}>EFFICIENCY</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '12px', fontWeight: 700, color: sm.accent }}>{a.eff}%</span>
                  </div>
                  <div style={{ height: '5px', borderRadius: '6px', background: 'rgba(99,140,200,0.1)', overflow: 'hidden', marginTop: '6px' }}>
                    <div style={{ height: '100%', width: a.eff + '%', borderRadius: '6px', background: isPaused ? 'rgba(113,132,168,0.5)' : 'linear-gradient(90deg,#22d3ee,#3b82f6)', boxShadow: isPaused ? 'none' : '0 0 10px 0 rgba(34,211,238,0.6)', transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                    <button onClick={() => toggleAgent(a.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', background: isPaused ? 'linear-gradient(135deg,#22d3ee,#3b82f6)' : 'rgba(99,140,200,0.07)', color: isPaused ? '#04121f' : '#9fb3d4', border: isPaused ? 'none' : '1px solid rgba(99,140,200,0.14)', borderRadius: '10px', padding: '9px', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                      {isPaused ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20" /></svg> : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>}
                      {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <Hoverable as="button" baseStyle={{ flex: 'none', width: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,140,200,0.06)', border: '1px solid rgba(99,140,200,0.12)', borderRadius: '10px', color: '#8195b8', cursor: 'pointer' }} hoverStyle={{ color: '#cfe3ff', borderColor: 'rgba(34,211,238,0.34)' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
                    </Hoverable>
                  </div>
                </Hoverable>
              )
            })}
          </div>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
          {/* TOPOLOGY */}
          <section style={{ ...panel, padding: '18px 20px', ...riseAt(0.34) }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#e8eefa' }}>Fleet Topology</h2>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#56688c' }}>REALTIME</span>
            </div>
            <svg viewBox="0 0 260 150" width="100%" height="160" style={{ display: 'block', overflow: 'visible' }}>
              <defs>
                <radialGradient id="coreg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#a5f3fc" /><stop offset="55%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#3b82f6" /></radialGradient>
              </defs>
              <circle cx="130" cy="75" r="58" fill="none" stroke="rgba(99,140,200,0.1)" />
              <circle cx="130" cy="75" r="38" fill="none" stroke="rgba(99,140,200,0.08)" />
              {agents.slice(0, 4).map((a, i) => {
                const sm = STATUS[a.status], c = COORDS[i]
                return <line key={'e' + a.id} x1="130" y1="75" x2={c.x} y2={c.y} stroke={sm.accent} strokeWidth="1.4" strokeDasharray="3 5" strokeOpacity="0.55" style={a.status === 'paused' ? {} : { animation: 'jv-flow 1.1s linear infinite', animationDelay: i * 0.25 + 's' }} />
              })}
              {agents.slice(0, 4).map((a, i) => {
                const sm = STATUS[a.status], c = COORDS[i]
                return (
                  <g key={'n' + a.id}>
                    <circle cx={c.x} cy={c.y} r="6" fill={sm.accent} style={{ filter: 'drop-shadow(0 0 5px ' + sm.accent + ')', animation: a.status === 'paused' ? 'none' : 'jv-node 2.6s ease-in-out infinite', animationDelay: i * 0.4 + 's' }} />
                    <text x={c.x} y={c.ty} fill="#7184a8" fontFamily="'Space Mono',monospace" fontSize="8" textAnchor="middle">{a.name}</text>
                  </g>
                )
              })}
              <circle cx="130" cy="75" r="15" fill="url(#coreg)" />
              <text x="130" y="78.5" fill="#04121f" fontFamily="'Space Mono',monospace" fontSize="11" fontWeight="700" textAnchor="middle">J</text>
            </svg>
          </section>

          {/* PERFORMANCE */}
          <section style={{ ...panel, ...riseAt(0.4) }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#e8eefa' }}>System Performance</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[{ label: 'CPU · Neural cores', val: sys.cpu, suffix: '%' }, { label: 'Memory · Context pool', val: sys.mem, suffix: '%' }, { label: 'Network · Throughput', val: sys.net, suffix: ' Gbps' }].map((row) => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '7px' }}>
                    <span style={{ color: '#8195b8' }}>{row.label}</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", color: '#67e8f9' }}>{row.val}{row.suffix}</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '7px', background: 'rgba(99,140,200,0.1)', overflow: 'hidden' }}><div style={bar(row.val)} /></div>
                </div>
              ))}
            </div>
          </section>

          {/* ACTIVITY */}
          <section style={{ ...panel, ...riseAt(0.4), flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#e8eefa' }}>Live Activity</h2>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontFamily: "'Space Mono',monospace", color: '#7dd3e0' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22d3ee', animation: 'jv-dot 2s ease-in-out infinite' }} />LIVE
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', overflowY: 'auto', maxHeight: '210px' }}>
              {feed.map((ev, i) => (
                <div key={i} style={{ display: 'flex', gap: '11px', padding: '9px 2px', borderBottom: '1px solid rgba(99,140,200,0.06)' }}>
                  <span style={{ marginTop: '5px', flex: 'none', width: '6px', height: '6px', borderRadius: '50%', background: ev.color, boxShadow: '0 0 7px 1px ' + ev.color }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '12px', color: '#bccbe6', lineHeight: 1.35 }}>{ev.text}</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#3f4f6e', marginTop: '2px' }}>{ev.time} · {ev.who}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* COMMAND JARVIS */}
      <section style={{ ...panel, marginTop: '16px', padding: '22px 24px', ...riseAt(0.46) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ position: 'relative', width: '32px', height: '32px', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(34,211,238,0.38)', borderTopColor: '#22d3ee', animation: 'jv-spin 5s linear infinite' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'radial-gradient(circle,#a5f3fc,#22d3ee 60%,#3b82f6)', animation: 'jv-core 3.4s ease-in-out infinite' }} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#e8eefa' }}>Command Blueman</h2>
            <div style={{ fontSize: '11px', color: '#56688c', fontFamily: "'Space Mono',monospace" }}>Natural language · orchestrates the full fleet</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px', marginBottom: '16px' }}>
          {messages.map((m, i) => {
            const isJ = m.from === 'jarvis'
            return (
              <div key={i} style={{ display: 'flex', justifyContent: isJ ? 'flex-start' : 'flex-end' }}>
                <div style={{ maxWidth: '78%', padding: '12px 16px', borderRadius: isJ ? '4px 16px 16px 16px' : '16px 4px 16px 16px', fontSize: '13px', lineHeight: 1.5, background: isJ ? 'rgba(11,17,29,0.8)' : 'linear-gradient(135deg, rgba(34,211,238,0.18), rgba(59,130,246,0.13))', border: isJ ? '1px solid rgba(34,211,238,0.2)' : '1px solid rgba(34,211,238,0.3)', color: isJ ? '#bccbe6' : '#e8eefa' }}>{m.text}</div>
              </div>
            )
          })}
          {thinking && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ display: 'inline-flex', gap: '5px', alignItems: 'center', background: 'rgba(11,17,29,0.7)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '14px', padding: '13px 16px' }}>
                {[0, 0.2, 0.4].map((d) => <span key={d} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22d3ee', animation: `jv-think 1.2s ease-in-out ${d}s infinite` }} />)}
              </div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(6,8,15,0.7)', border: `1px solid ${chatFocus ? 'rgba(34,211,238,0.5)' : 'rgba(99,140,200,0.16)'}`, borderRadius: '15px', padding: '13px 16px', transition: 'border-color 0.2s' }}>
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send() }} onFocus={() => setChatFocus(true)} onBlur={() => setChatFocus(false)} placeholder="e.g. Have Atlas summarize today's competitor moves…" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#cdd8ec', fontFamily: "'Inter',sans-serif", fontSize: '13px' }} />
          </div>
          <Hoverable as="button" baseStyle={{ flex: 'none', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#04121f', border: 'none', borderRadius: '14px', padding: '13px 20px', fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 24px -8px rgba(59,130,246,0.8)' }} hoverStyle={{ filter: 'brightness(1.08)' }} onClick={send}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" /></svg>
            Send
          </Hoverable>
        </div>
      </section>
    </>
  )
}
