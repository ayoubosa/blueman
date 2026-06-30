import React, { useEffect, useRef, useState } from 'react'
import { SPRING, Hoverable } from './ui.jsx'
import { isLive } from './api.js'
import UsageBar from './UsageBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Briefing from './pages/Briefing.jsx'
import Agents from './pages/Agents.jsx'
import Analytics from './pages/Analytics.jsx'
import Skills from './pages/Skills.jsx'
import Memory from './pages/Memory.jsx'
import Integrations from './pages/Integrations.jsx'
import Automations from './pages/Automations.jsx'
import Settings from './pages/Settings.jsx'

const NAV = ['Dashboard', 'Briefing', 'Agents', 'Analytics', 'Skills', 'Memory', 'Integrations', 'Automations', 'Settings']

const NAV_ICONS = {
  Dashboard: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg>,
  Briefing: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>,
  Agents: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2.5" /><circle cx="12" cy="5" r="2.2" /><path d="M12 7.2V11" /><circle cx="8.5" cy="16" r="1.1" /><circle cx="15.5" cy="16" r="1.1" /></svg>,
  Analytics: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20.5h18" /><rect x="4.5" y="12" width="3.2" height="6.5" rx="1" /><rect x="10.4" y="7" width="3.2" height="11.5" rx="1" /><rect x="16.3" y="4" width="3.2" height="14.5" rx="1" /></svg>,
  Skills: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5l2.4 6.1L20.5 11l-6.1 2.4L12 19.5l-2.4-6.1L3.5 11l6.1-2.4z" /></svg>,
  Memory: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" rx="1.5" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9.5 3v2.5M14.5 3v2.5M9.5 18.5V21M14.5 18.5V21M3 9.5h2.5M3 14.5h2.5M18.5 9.5H21M18.5 14.5H21" /></svg>,
  Integrations: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v6a6 6 0 0 0 12 0V3" /><path d="M9 3v3M15 3v3M12 15v6" /></svg>,
  Automations: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="6.5" height="6.5" rx="1.5" /><rect x="14.5" y="14.5" width="6.5" height="6.5" rx="1.5" /><path d="M9.5 6.25h4.5a3.75 3.75 0 0 1 3.75 3.75v4.5" /></svg>,
  Settings: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="8" x2="20" y2="8" /><circle cx="9" cy="8" r="2.2" /><line x1="4" y1="16" x2="20" y2="16" /><circle cx="15" cy="16" r="2.2" /></svg>,
}

export default function App({ onExit }) {
  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState('Dashboard')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')
  const paletteInputRef = useRef(null)

  const [live, setLive] = useState(false)

  const [agents, setAgents] = useState([
    { id: 'atlas', initial: 'A', name: 'Atlas', role: 'Market & Competitor Research', status: 'active', eff: 96, task: 'Scanning competitor pricing across your niche', uptime: '18d', uptimePct: 99, tasks: 4120, tokens: '3.2M', model: 'Opus 4.8' },
    { id: 'orion', initial: 'O', name: 'Orion', role: 'Sales & Lead Outreach', status: 'active', eff: 91, task: 'Drafting follow-ups to 48 warm leads', uptime: '12d', uptimePct: 97, tasks: 3880, tokens: '2.7M', model: 'Sonnet 4.6' },
    { id: 'lyra', initial: 'L', name: 'Lyra', role: 'Content & Social', status: 'thinking', eff: 88, task: 'Generating this week’s posts + newsletter', uptime: '9d', uptimePct: 95, tasks: 2860, tokens: '4.1M', model: 'Opus 4.8' },
    { id: 'vega', initial: 'V', name: 'Vega', role: 'Business Data & Analytics', status: 'active', eff: 84, task: 'Reconciling Stripe revenue with ad spend', uptime: '21d', uptimePct: 99, tasks: 1980, tokens: '1.9M', model: 'Sonnet 4.6' },
    { id: 'nova', initial: 'N', name: 'Nova', role: 'Inbox & Customer Comms', status: 'active', eff: 93, task: 'Triaging 17 customer conversations', uptime: '6d', uptimePct: 96, tasks: 1640, tokens: '1.2M', model: 'Haiku 4.5' },
    { id: 'sol', initial: 'S', name: 'Sol', role: 'Day Planner & Scheduler', status: 'active', eff: 90, task: 'Arranging tomorrow’s calendar & tasks', uptime: '4d', uptimePct: 94, tasks: 980, tokens: '0.8M', model: 'Haiku 4.5' },
  ])

  const toggleAgent = (id) =>
    setAgents((list) =>
      list.map((a) => (a.id === id ? { ...a, status: a.status === 'paused' ? 'active' : 'paused', task: a.status === 'paused' ? 'Resuming workflow…' : 'Paused by operator' } : a))
    )
  const pauseAll = () => { setPaletteOpen(false); setAgents((l) => l.map((a) => ({ ...a, status: 'paused', task: 'Paused by operator' }))) }
  const deploy = () => { setPaletteOpen(false); setActive('Agents') }
  const goto = (n) => { setActive(n); setPaletteOpen(false) }

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); setPaletteOpen((p) => !p) }
      else if (e.key === 'Escape') setPaletteOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (paletteOpen) { const t = setTimeout(() => paletteInputRef.current && paletteInputRef.current.focus(), 40); return () => clearTimeout(t) }
  }, [paletteOpen])

  /* ping the JARVIS backend; re-check every 20s */
  useEffect(() => {
    let cancelled = false
    const check = () => isLive().then((v) => { if (!cancelled) setLive(v) })
    check()
    const id = setInterval(check, 20000)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  const W = collapsed ? '84px' : '252px'
  const navLabelStyle = collapsed ? { display: 'none' } : {}
  const brandTextStyle = collapsed ? { display: 'none' } : { minWidth: 0 }

  const navBase = (name) => {
    const on = active === name
    return {
      display: 'flex', alignItems: 'center', gap: '13px', justifyContent: collapsed ? 'center' : 'flex-start',
      padding: collapsed ? '11px' : '10px 13px', borderRadius: '12px', cursor: 'pointer', width: '100%', textAlign: 'left',
      fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: on ? 600 : 400,
      border: on ? '1px solid rgba(34,211,238,0.28)' : '1px solid transparent',
      background: on ? 'linear-gradient(100deg, rgba(34,211,238,0.15), rgba(59,130,246,0.09))' : 'transparent',
      color: on ? '#bfe9f5' : '#7184a8', boxShadow: on ? '0 8px 22px -14px rgba(34,211,238,0.8)' : 'none',
      transition: 'background 0.2s, color 0.2s',
    }
  }

  const page = (() => {
    const props = { agents, toggleAgent, deploy }
    switch (active) {
      case 'Briefing': return <Briefing />
      case 'Agents': return <Agents {...props} />
      case 'Analytics': return <Analytics />
      case 'Skills': return <Skills />
      case 'Memory': return <Memory />
      case 'Integrations': return <Integrations />
      case 'Automations': return <Automations />
      case 'Settings': return <Settings />
      default: return <Dashboard {...props} />
    }
  })()

  const cmdActions = [
    { label: 'Deploy a new agent', onClick: deploy, kbd: '⏎', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2.5" /><circle cx="12" cy="5" r="2.2" /><path d="M12 7.2V11" /></svg> },
    { label: 'Pause the entire fleet', onClick: pauseAll, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg> },
    { label: 'Open Daily Briefing', onClick: () => goto('Briefing'), icon: NAV_ICONS.Briefing },
    { label: 'Open Analytics', onClick: () => goto('Analytics'), icon: NAV_ICONS.Analytics },
    { label: 'Browse Skills', onClick: () => goto('Skills'), icon: NAV_ICONS.Skills },
    { label: 'Search Memory', onClick: () => goto('Memory'), icon: NAV_ICONS.Memory },
    { label: 'Manage Integrations', onClick: () => goto('Integrations'), icon: NAV_ICONS.Integrations },
    { label: 'Create an Automation', onClick: () => goto('Automations'), icon: NAV_ICONS.Automations },
  ].filter((a) => a.label.toLowerCase().includes(paletteQuery.toLowerCase()))

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'radial-gradient(1200px 820px at 80% -12%, #0c1322 0%, #06080f 56%)', color: '#cdd8ec', fontFamily: "'Inter',system-ui,sans-serif", display: 'flex', position: 'relative', overflow: 'hidden' }}>

      {/* ambient orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-200px', left: '10%', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.14), transparent 66%)', filter: 'blur(22px)', animation: 'jv-orb 20s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-240px', right: '6%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.13), transparent 66%)', filter: 'blur(26px)', animation: 'jv-orb2 24s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '34%', right: '32%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.06), transparent 66%)', filter: 'blur(28px)', animation: 'jv-orb 28s ease-in-out infinite' }} />
      </div>

      {/* SIDEBAR */}
      <aside style={{ width: W, flex: 'none', display: 'flex', flexDirection: 'column', padding: collapsed ? '24px 16px' : '24px 20px', borderRight: '1px solid rgba(99,140,200,0.08)', background: 'rgba(8,11,20,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', position: 'relative', zIndex: 2, height: '100vh', transition: `width 0.4s ${SPRING}, padding 0.4s` }}>
        <div onClick={onExit} title="Back to site" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '4px 2px 0', cursor: onExit ? 'pointer' : 'default' }}>
          <div style={{ position: 'relative', width: '40px', height: '40px', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(34,211,238,0.32)', borderTopColor: 'rgba(34,211,238,0.95)', animation: 'jv-spin 6s linear infinite' }} />
            <div style={{ position: 'absolute', inset: '6px', borderRadius: '50%', border: '1.5px solid rgba(59,130,246,0.28)', borderBottomColor: 'rgba(96,165,250,0.9)', animation: 'jv-spinrev 4.5s linear infinite' }} />
            <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: 'radial-gradient(circle,#a5f3fc,#22d3ee 60%,#3b82f6)', animation: 'jv-core 3.4s ease-in-out infinite' }} />
          </div>
          <div style={brandTextStyle}>
            <div style={{ fontWeight: 600, fontSize: '17px', letterSpacing: '3px', lineHeight: 1, background: 'linear-gradient(120deg,#e0f2fe,#67e8f9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>BLUEMAN</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '9px', letterSpacing: '2px', color: '#56688c', marginTop: '4px' }}>AGENT OS · v4.2</div>
          </div>
        </div>

        <div style={{ ...navLabelStyle, fontFamily: "'Space Mono',monospace", fontSize: '9px', letterSpacing: '2px', color: '#3f4f6e', padding: '30px 12px 10px' }}>CONTROL</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {NAV.slice(0, 8).map((n) => (
            <Hoverable as="button" key={n} baseStyle={navBase(n)} hoverStyle={active === n ? {} : { color: '#9fb3d4' }} onClick={() => goto(n)}>
              {NAV_ICONS[n]}<span style={navLabelStyle}>{n}</span>
            </Hoverable>
          ))}
        </nav>

        <div style={{ ...navLabelStyle, fontFamily: "'Space Mono',monospace", fontSize: '9px', letterSpacing: '2px', color: '#3f4f6e', padding: '26px 12px 10px' }}>SYSTEM</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <Hoverable as="button" baseStyle={navBase('Settings')} hoverStyle={active === 'Settings' ? {} : { color: '#9fb3d4' }} onClick={() => goto('Settings')}>
            {NAV_ICONS.Settings}<span style={navLabelStyle}>Settings</span>
          </Hoverable>
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!collapsed && (
            <div style={{ background: 'linear-gradient(150deg, rgba(34,211,238,0.1), rgba(59,130,246,0.05))', border: '1px solid rgba(34,211,238,0.18)', borderRadius: '16px', padding: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', letterSpacing: '1px', color: '#7184a8' }}>FLEET HEALTH</span>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px 2px rgba(34,211,238,0.7)', animation: 'jv-dot 2.4s ease-in-out infinite' }} />
              </div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '24px', fontWeight: 700, background: 'linear-gradient(120deg,#67e8f9,#3b82f6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>99.98%</div>
              <div style={{ fontSize: '11px', color: '#56688c', marginTop: '2px' }}>Optimal · 0 incidents</div>
            </div>
          )}
          <Hoverable as="button" baseStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', background: 'rgba(148,178,224,0.05)', border: '1px solid rgba(148,178,224,0.1)', color: '#7184a8', borderRadius: '12px', padding: '10px', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: '12px' }} hoverStyle={{ borderColor: 'rgba(34,211,238,0.3)', color: '#9fb3d4' }} onClick={() => setCollapsed((c) => !c)}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.4s', transform: collapsed ? 'rotate(180deg)' : 'none' }}><path d="M15 18l-6-6 6-6" /></svg>
            <span style={navLabelStyle}>Collapse</span>
          </Hoverable>
        </div>
      </aside>

      {/* MAIN COLUMN */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, height: '100vh' }}>

        {/* HEADER */}
        <header style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', padding: '18px 32px', borderBottom: '1px solid rgba(99,140,200,0.08)' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ margin: 0, fontSize: '21px', fontWeight: 600, letterSpacing: '-0.4px', color: '#e8eefa', whiteSpace: 'nowrap' }}>Good morning, Ayoub</h1>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: live ? 'rgba(34,211,238,0.07)' : 'rgba(251,191,36,0.08)', border: '1px solid ' + (live ? 'rgba(34,211,238,0.22)' : 'rgba(251,191,36,0.28)'), borderRadius: '999px', padding: '5px 12px', fontSize: '11px', color: live ? '#7dd3e0' : '#e7c06a', whiteSpace: 'nowrap' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: live ? '#22d3ee' : '#fbbf24', boxShadow: '0 0 8px 2px ' + (live ? 'rgba(34,211,238,0.7)' : 'rgba(251,191,36,0.6)'), animation: 'jv-dot 2.2s ease-in-out infinite' }} />
                {live ? 'Blueman online' : 'Demo mode · backend offline'}
              </span>
            </div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', color: '#56688c', marginTop: '5px', letterSpacing: '0.4px' }}>Monday · June 30, 2026 · 09:14 — 4 active workflows</div>
          </div>

          <div style={{ flex: 1, minWidth: '16px' }} />

          <UsageBar />

          <Hoverable as="button" baseStyle={{ display: 'flex', alignItems: 'center', gap: '10px', width: '260px', maxWidth: '28vw', minWidth: '160px', background: 'rgba(11,17,29,0.6)', border: '1px solid rgba(99,140,200,0.14)', borderRadius: '13px', padding: '11px 14px', cursor: 'text', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }} hoverStyle={{ borderColor: 'rgba(34,211,238,0.34)' }} onClick={() => setPaletteOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#56688c" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <span style={{ flex: 1, minWidth: 0, textAlign: 'left', color: '#56688c', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Search or command…</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#3f4f6e', border: '1px solid rgba(99,140,200,0.18)', borderRadius: '6px', padding: '2px 6px' }}>⌘K</span>
          </Hoverable>

          <Hoverable as="button" baseStyle={{ position: 'relative', width: '42px', height: '42px', borderRadius: '13px', background: 'rgba(11,17,29,0.6)', border: '1px solid rgba(99,140,200,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9fb3d4' }} hoverStyle={{ borderColor: 'rgba(34,211,238,0.34)', color: '#cfe3ff' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
            <span style={{ position: 'absolute', top: '9px', right: '10px', width: '7px', height: '7px', borderRadius: '50%', background: '#fbbf24', boxShadow: '0 0 8px 1px rgba(251,191,36,0.8)' }} />
          </Hoverable>

          <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '13px', background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px', color: '#04121f', boxShadow: '0 6px 20px -6px rgba(59,130,246,0.7)' }}>AY</div>
            <div style={brandTextStyle}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#e8eefa', lineHeight: 1.15 }}>Ayoub</div>
              <div style={{ fontSize: '11px', color: '#56688c' }}>Founder · Online Business</div>
            </div>
          </div>
        </header>

        {/* PAGE */}
        <div key={active} style={{ flex: 1, overflowY: 'auto', padding: '26px 32px 32px' }}>
          {page}
        </div>
      </div>

      {/* COMMAND PALETTE */}
      {paletteOpen && (
        <div onClick={() => setPaletteOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(4,6,12,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '13vh', animation: 'jv-veil 0.18s ease-out' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '580px', maxWidth: '90vw', background: 'rgba(13,19,32,0.92)', border: '1px solid rgba(99,140,200,0.2)', borderRadius: '18px', boxShadow: '0 40px 100px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(34,211,238,0.08)', overflow: 'hidden', animation: 'jv-palette 0.22s cubic-bezier(.34,1.3,.64,1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 18px', borderBottom: '1px solid rgba(99,140,200,0.1)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input ref={paletteInputRef} value={paletteQuery} onChange={(e) => setPaletteQuery(e.target.value)} placeholder="Jump to a page or run an action…" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#e8eefa', fontFamily: "'Inter',sans-serif", fontSize: '15px' }} />
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#3f4f6e', border: '1px solid rgba(99,140,200,0.18)', borderRadius: '6px', padding: '3px 7px' }}>ESC</span>
            </div>
            <div style={{ padding: '10px', maxHeight: '50vh', overflowY: 'auto' }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '9px', letterSpacing: '1.5px', color: '#3f4f6e', padding: '8px 10px 6px' }}>QUICK ACTIONS</div>
              {cmdActions.map((row) => (
                <Hoverable as="button" key={row.label} baseStyle={{ display: 'flex', alignItems: 'center', gap: '13px', width: '100%', padding: '11px 10px', borderRadius: '11px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#cdd8ec', fontFamily: "'Inter',sans-serif", fontSize: '13.5px', transition: 'background 0.15s' }} hoverStyle={{ background: 'rgba(34,211,238,0.08)' }} onClick={row.onClick}>
                  <span style={{ width: '30px', height: '30px', flex: 'none', borderRadius: '9px', background: 'rgba(34,211,238,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#67e8f9' }}>{row.icon}</span>
                  <span style={{ flex: 1, textAlign: 'left' }}>{row.label}</span>
                  {row.kbd && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#3f4f6e' }}>{row.kbd}</span>}
                </Hoverable>
              ))}
              {cmdActions.length === 0 && <div style={{ padding: '20px 10px', textAlign: 'center', color: '#56688c', fontSize: '13px' }}>No matching actions</div>}
            </div>
            <div style={{ display: 'flex', gap: '16px', padding: '11px 18px', borderTop: '1px solid rgba(99,140,200,0.1)', fontFamily: "'Space Mono',monospace", fontSize: '10px', color: '#3f4f6e' }}>
              <span>⏎ to run</span><span>↑↓ to navigate</span><span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
