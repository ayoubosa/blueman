import React, { useEffect, useRef, useState } from 'react'
import { Hoverable } from './ui.jsx'
import Orb from './Orb.jsx'

const SPRING = 'cubic-bezier(.34,1.3,.64,1)'
const rise = (d) => ({ animation: `jv-rise 0.7s ${SPRING} both`, animationDelay: d + 's' })
const mono = "'Space Mono',monospace"

/* ------------------------------------------------------------------ data */

const FEATURES = [
  { title: 'Daily Briefing', desc: 'Wake up to a clear picture — revenue, what needs you, and your whole day planned. From morning to wind-down.', icon: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></> },
  { title: 'Agent Fleet', desc: 'A team of AI agents that research competitors, run sales outreach, create content, and crunch your numbers — 24/7.', icon: <><rect x="3" y="11" width="18" height="10" rx="2.5" /><circle cx="12" cy="5" r="2.2" /><path d="M12 7.2V11" /></> },
  { title: 'The Brain', desc: 'A reasoning core that plans, retrieves your business memory, decides, and delegates — every answer grounded in your data.', icon: <><path d="M12 4a4 4 0 0 1 4 4c2 0 3.5 1.8 3.5 3.7 0 1.5-.8 2.8-2 3.5.3 2.3-1.5 4.3-3.8 4.3-.7 0-1.3-.2-1.7-.5-.4.3-1 .5-1.7.5-2.3 0-4.1-2-3.8-4.3-1.2-.7-2-2-2-3.5C4.5 9.8 6 8 8 8a4 4 0 0 1 4-4z" /><path d="M12 4v16" /></> },
  { title: 'Connect Everything', desc: 'Gmail, Calendar, Notion, Slack, WhatsApp, Stripe, Shopify, Meta Ads — your whole stack, in one brain.', icon: <><path d="M6 3v6a6 6 0 0 0 12 0V3" /><path d="M9 3v3M15 3v3M12 15v6" /></> },
  { title: 'Memory', desc: 'Blueman remembers every customer, decision, and insight — and recalls the right one at the right moment.', icon: <><rect x="6" y="6" width="12" height="12" rx="1.5" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9.5 3v2.5M14.5 3v2.5M9.5 18.5V21M14.5 18.5V21M3 9.5h2.5M3 14.5h2.5M18.5 9.5H21M18.5 14.5H21" /></> },
  { title: 'Automations', desc: 'Set it once. Blueman runs your recurring work on schedule or on trigger — and tells you when it’s done.', icon: <><rect x="3" y="3" width="6.5" height="6.5" rx="1.5" /><rect x="14.5" y="14.5" width="6.5" height="6.5" rx="1.5" /><path d="M9.5 6.25h4.5a3.75 3.75 0 0 1 3.75 3.75v4.5" /></> },
]

const STEPS = [
  { n: '01', title: 'Connect your business', desc: 'Link your email, calendar, store, and tools in a few clicks.' },
  { n: '02', title: 'Deploy your agents', desc: 'Pick the AI operatives you need — research, sales, content, data.' },
  { n: '03', title: 'Wake up to results', desc: 'Blueman works overnight. You start each day ahead, not behind.' },
]

const GROWTH_STATS = [
  { value: '+38%', label: 'Average revenue growth', sub: 'first 90 days on Blueman', color: '#4fae6b' },
  { value: '14h', label: 'Founder time saved weekly', sub: 'ops, inbox & reporting automated', color: '#22d3ee' },
  { value: '3.2×', label: 'Content & outreach output', sub: 'same team, agent-amplified', color: '#a78bfa' },
  { value: '99.98%', label: 'Platform uptime', sub: 'enterprise SLA · 90-day window', color: '#fbbf24' },
]

const TRUST_POINTS = [
  { title: 'Encrypted end-to-end', desc: 'Your business data is encrypted in transit and at rest. Per-customer isolated memory — structurally impossible to leak across accounts.', icon: <><rect x="4" y="10" width="16" height="10" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></> },
  { title: 'Enterprise-grade infrastructure', desc: 'SOC 2-aligned controls, audit logging on every agent action, and role-based access built into the core.', icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></> },
  { title: 'You stay in control', desc: 'Pause any agent instantly. Autonomous mode is opt-in per workflow. Every decision is traceable to its source data.', icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></> },
]

const TESTIMONIALS = [
  { quote: 'Blueman replaced my morning chaos with a 90-second briefing. Revenue is up 41% and I genuinely work fewer hours.', name: 'Sofia M.', role: 'Founder · DTC skincare, 3 stores', initial: 'S', color: '#22d3ee' },
  { quote: 'The outreach agent books more qualified calls than the SDR agency we were paying $4k/month. It’s not close.', name: 'Karim B.', role: 'CEO · B2B services agency', initial: 'K', color: '#a78bfa' },
  { quote: 'We treat the Brain like a COO. It caught a margin leak in our ad spend that paid for a year of Blueman in one week.', name: 'Lina T.', role: 'Co-founder · E-commerce brand', initial: 'L', color: '#fbbf24' },
]

const CASE_STUDIES = [
  { tag: 'E-COMMERCE', title: 'From 60-hour weeks to a 4-day operation', metric: '+52% revenue', detail: '3-store Shopify brand automated inbox, competitor watch and reporting. Founder time on ops dropped 71%.', color: '#22d3ee' },
  { tag: 'AGENCY', title: 'Scaling client delivery without hiring', metric: '3.4× output', detail: 'Content agency runs research, drafts and QA through the fleet. Same 4-person team now serves 3× the clients.', color: '#a78bfa' },
  { tag: 'SAAS', title: 'Churn caught before it happens', metric: '-28% churn', detail: 'Vega’s risk scoring flags at-risk accounts to the success team automatically. Retention became proactive.', color: '#4fae6b' },
]

const GALLERY = [
  { n: '01', title: 'Command Dashboard', desc: 'Fleet, KPIs and live activity in one calm view', kind: 'dashboard' },
  { n: '02', title: 'Agent Fleet', desc: 'Six specialists, fully observable and controllable', kind: 'agents' },
  { n: '03', title: 'The Brain', desc: 'Reasoning core — plan, retrieve, decide, delegate', kind: 'brain' },
  { n: '04', title: 'Automation Flows', desc: 'Recurring work on schedule or trigger', kind: 'automations' },
  { n: '05', title: 'Analytics', desc: 'Throughput, workload mix and cost intelligence', kind: 'analytics' },
  { n: '06', title: 'Memory Core', desc: '2.4M vectors of your business knowledge', kind: 'memory' },
]

const PLANS = [
  { name: 'Starter', price: '$49', period: '/mo', tagline: 'For solo founders', features: ['3 AI agents', '5 integrations', 'Daily briefing', 'Email support'], cta: 'Request access', highlight: false },
  { name: 'Growth', price: '$149', period: '/mo', tagline: 'For growing businesses', features: ['Unlimited agents', 'All integrations', 'Automations & scheduler', 'Memory & analytics', 'Priority support'], cta: 'Request access', highlight: true },
  { name: 'Scale', price: 'Custom', period: '', tagline: 'For teams & agencies', features: ['Everything in Growth', 'Multi-seat & roles', 'White-label option', 'Dedicated success', 'Custom integrations'], cta: 'Talk to us', highlight: false },
]

/* --------------------------------------------------------- gallery shots */

function Shot({ kind }) {
  const line = (w, c = 'rgba(99,140,200,0.25)') => <div style={{ height: '7px', width: w, borderRadius: '4px', background: c }} />
  const box = (extra) => ({ background: 'rgba(8,12,22,0.7)', border: '1px solid rgba(99,140,200,0.14)', borderRadius: '10px', padding: '10px', ...extra })
  const grad = 'linear-gradient(90deg,#22d3ee,#3b82f6)'

  const body = {
    dashboard: (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
          {['#4fae6b', '#22d3ee', '#67e8f9', '#a78bfa'].map((c, i) => (
            <div key={i} style={box({})}>{line('55%')}<div style={{ fontFamily: mono, fontSize: '15px', fontWeight: 700, color: c, marginTop: '7px' }}>{['$8.4k', '6', '1.2k', '94%'][i]}</div></div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', marginTop: '8px', flex: 1 }}>
          <div style={box({ display: 'flex', flexDirection: 'column', gap: '8px' })}>{line('40%', 'rgba(34,211,238,0.5)')}{line('92%')}{line('78%')}{line('85%')}{line('60%')}</div>
          <div style={box({ display: 'flex', alignItems: 'center', justifyContent: 'center' })}><Orb size={54} state="idle" /></div>
        </div>
      </>
    ),
    agents: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flex: 1 }}>
        {['A', 'O', 'L', 'V'].map((ch, i) => (
          <div key={ch} style={box({ display: 'flex', flexDirection: 'column', gap: '7px' })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(34,211,238,0.14)', color: '#67e8f9', fontFamily: mono, fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ch}</span>
              {line('50%')}
            </div>
            <div style={{ height: '4px', borderRadius: '3px', background: 'rgba(99,140,200,0.12)' }}><div style={{ height: '100%', width: [88, 74, 92, 66][i] + '%', borderRadius: '3px', background: grad }} /></div>
          </div>
        ))}
      </div>
    ),
    brain: (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Orb size={86} state="thinking" />
        {[[-70, -30], [64, -42], [-58, 40], [72, 34]].map(([x, y], i) => (
          <span key={i} style={{ position: 'absolute', left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, width: '8px', height: '8px', borderRadius: '50%', background: ['#22d3ee', '#a78bfa', '#4fae6b', '#fbbf24'][i], boxShadow: '0 0 8px 1px currentColor', color: ['#22d3ee', '#a78bfa', '#4fae6b', '#fbbf24'][i] }} />
        ))}
      </div>
    ),
    automations: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {[92, 78, 64].map((w, i) => (
          <div key={i} style={box({ display: 'flex', alignItems: 'center', gap: '10px' })}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', flex: 'none', background: i === 2 ? '#7184a8' : '#22d3ee', boxShadow: i === 2 ? 'none' : '0 0 7px 1px rgba(34,211,238,0.7)' }} />
            <div style={{ flex: 1 }}>{line(w + '%')}</div>
            <div style={{ width: '26px', height: '14px', borderRadius: '999px', background: i === 2 ? 'rgba(99,140,200,0.2)' : grad }} />
          </div>
        ))}
      </div>
    ),
    analytics: (
      <div style={{ ...box({}), flex: 1, display: 'flex', alignItems: 'flex-end', gap: '7px', padding: '14px' }}>
        {[38, 55, 42, 68, 60, 82, 74, 95].map((h, i) => (
          <div key={i} style={{ flex: 1, height: h + '%', borderRadius: '5px 5px 0 0', background: i === 7 ? grad : 'rgba(34,211,238,0.25)' }} />
        ))}
      </div>
    ),
    memory: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {[['market', '#22d3ee', 82], ['sales', '#3b82f6', 64], ['content', '#fbbf24', 48], ['analysis', '#a78bfa', 36]].map(([name, c, w]) => (
          <div key={name} style={box({ display: 'flex', alignItems: 'center', gap: '10px' })}>
            <span style={{ fontFamily: mono, fontSize: '9px', color: c, width: '52px' }}>{name}</span>
            <div style={{ flex: 1, height: '5px', borderRadius: '4px', background: 'rgba(99,140,200,0.12)' }}><div style={{ height: '100%', width: w + '%', borderRadius: '4px', background: c, opacity: 0.85 }} /></div>
          </div>
        ))}
      </div>
    ),
  }[kind]

  return (
    <div style={{ height: '240px', borderRadius: '14px', border: '1px solid rgba(99,140,200,0.16)', background: 'rgba(10,15,26,0.85)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '9px 12px', borderBottom: '1px solid rgba(99,140,200,0.1)', flex: 'none' }}>
        {['#f87171', '#fbbf24', '#4ade80'].map((c) => <span key={c} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />)}
        <span style={{ marginLeft: '8px', fontFamily: mono, fontSize: '9px', color: '#56688c' }}>app.blueman.ai</span>
      </div>
      <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>{body}</div>
    </div>
  )
}

/* ---------------------------------------------------------------- page */

export default function Landing({ onLaunch, authorized = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [demoEmail, setDemoEmail] = useState('')
  const [demoSent, setDemoSent] = useState(false)
  const galleryRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const wrap = { maxWidth: '1180px', margin: '0 auto', padding: '0 32px' }
  const signInLabel = authorized ? 'Open Workspace' : 'Customer Sign In'

  const requestDemo = () => {
    if (!demoEmail.includes('@')) return
    window.location.href = `mailto:ayoubosama2004@gmail.com?subject=${encodeURIComponent('Blueman guided demo request')}&body=${encodeURIComponent(`Requested by: ${demoEmail}\n\nPlease schedule my guided Blueman demo.`)}`
    setDemoSent(true)
  }

  const swipe = (dir) => {
    const el = galleryRef.current
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.7), behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'radial-gradient(1200px 820px at 80% -12%, #0c1322 0%, #06080f 56%)', color: '#cdd8ec', fontFamily: "'Inter',system-ui,sans-serif", position: 'relative', overflowX: 'hidden' }}>

      {/* ambient orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-220px', left: '8%', width: '560px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.13), transparent 66%)', filter: 'blur(24px)', animation: 'jv-orb 20s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '420px', right: '2%', width: '620px', height: '620px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12), transparent 66%)', filter: 'blur(26px)', animation: 'jv-orb2 24s ease-in-out infinite' }} />
      </div>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 30, borderBottom: scrolled ? '1px solid rgba(99,140,200,0.1)' : '1px solid transparent', background: scrolled ? 'rgba(6,8,15,0.7)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none', transition: 'all 0.3s' }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', gap: '16px', height: '72px' }}>
          <Orb size={34} />
          <span style={{ fontWeight: 600, fontSize: '18px', letterSpacing: '2px', background: 'linear-gradient(120deg,#e0f2fe,#67e8f9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>BLUEMAN</span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {[['Features', '#features'], ['Results', '#results'], ['Customers', '#customers'], ['Pricing', '#pricing']].map(([l, href]) => (
              <a key={l} href={href} style={{ color: '#8195b8', textDecoration: 'none', fontSize: '14px' }}>{l}</a>
            ))}
            <Hoverable as="button" onClick={onLaunch} baseStyle={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#04121f', border: 'none', borderRadius: '11px', padding: '10px 18px', fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 22px -8px rgba(59,130,246,0.8)' }} hoverStyle={{ filter: 'brightness(1.08)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="10" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
              {signInLabel}
            </Hoverable>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '90px 0 70px' }}>
        <div style={wrap}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.22)', borderRadius: '999px', padding: '7px 16px', fontSize: '12px', color: '#7dd3e0', fontFamily: mono, ...rise(0) }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px 2px rgba(34,211,238,0.7)', animation: 'jv-dot 2.2s ease-in-out infinite' }} />
            The AI Operating System for online business
          </div>
          <h1 style={{ fontSize: 'clamp(38px, 6vw, 68px)', fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1.05, margin: '26px 0 0', color: '#f1f6ff', ...rise(0.08) }}>
            Run your whole business<br />with a fleet of <span style={{ background: 'linear-gradient(120deg,#a5f3fc,#3b82f6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>AI agents.</span>
          </h1>
          <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#8ea2c4', maxWidth: '640px', margin: '24px auto 0', ...rise(0.16) }}>
            Blueman connects your tools, watches your data, and puts a team of autonomous agents to work — so you wake up to results, not a to-do list.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '34px', flexWrap: 'wrap', ...rise(0.24) }}>
            <Hoverable as="a" href="#demo" baseStyle={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none', background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#04121f', border: 'none', borderRadius: '14px', padding: '15px 28px', fontFamily: "'Inter',sans-serif", fontSize: '15px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 14px 34px -10px rgba(59,130,246,0.85)' }} hoverStyle={{ filter: 'brightness(1.08)', transform: 'translateY(-2px)' }}>
              Request a guided demo
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Hoverable>
            <Hoverable as="button" onClick={onLaunch} baseStyle={{ display: 'flex', alignItems: 'center', background: 'rgba(99,140,200,0.06)', color: '#cfe3ff', border: '1px solid rgba(99,140,200,0.18)', borderRadius: '14px', padding: '15px 28px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter',sans-serif" }} hoverStyle={{ borderColor: 'rgba(34,211,238,0.34)' }}>{signInLabel}</Hoverable>
          </div>
          <div style={{ marginTop: '18px', fontSize: '13px', color: '#56688c', ...rise(0.3) }}>Private platform · customers only · 14-day money-back guarantee</div>

          {/* product frame */}
          <div style={{ marginTop: '56px', ...rise(0.36) }}>
            <div style={{ position: 'relative', maxWidth: '960px', margin: '0 auto', borderRadius: '18px', border: '1px solid rgba(99,140,200,0.18)', background: 'rgba(13,19,32,0.6)', backdropFilter: 'blur(16px)', boxShadow: '0 50px 120px -40px rgba(0,0,0,0.9), 0 0 0 1px rgba(34,211,238,0.06)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '14px 18px', borderBottom: '1px solid rgba(99,140,200,0.1)' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#f87171' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#fbbf24' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#4ade80' }} />
                <span style={{ marginLeft: '12px', fontFamily: mono, fontSize: '11px', color: '#56688c' }}>app.blueman.ai</span>
              </div>
              <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
                {[{ l: 'Revenue today', v: '$8,420', c: '#4fae6b' }, { l: 'Active agents', v: '6', c: '#22d3ee' }, { l: 'Tasks done', v: '1,284', c: '#67e8f9' }, { l: 'Efficiency', v: '94.7%', c: '#a78bfa' }].map((m) => (
                  <div key={m.l} style={{ background: 'rgba(8,12,22,0.6)', border: '1px solid rgba(99,140,200,0.12)', borderRadius: '14px', padding: '16px' }}>
                    <div style={{ fontSize: '10px', color: '#7184a8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{m.l}</div>
                    <div style={{ fontFamily: mono, fontSize: '26px', fontWeight: 700, marginTop: '8px', color: m.c }}>{m.v}</div>
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '14px', background: 'linear-gradient(100deg, rgba(34,211,238,0.08), rgba(59,130,246,0.05))', border: '1px solid rgba(34,211,238,0.16)', fontSize: '13px', color: '#bccbe6' }}>
                  <Orb size={22} state="active" /> “Good morning, Ayoub. You closed 3 deals overnight — 2 things need you before noon.”
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SOCIAL PROOF strip */}
      <section style={{ position: 'relative', zIndex: 1, padding: '20px 0 60px' }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', opacity: 0.65, fontFamily: mono, fontSize: '13px', color: '#56688c' }}>
          <span>WORKS WITH</span>
          {['Gmail', 'Shopify', 'Stripe', 'Notion', 'Slack', 'Meta Ads'].map((b) => <span key={b} style={{ color: '#8ea2c4' }}>{b}</span>)}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ position: 'relative', zIndex: 1, padding: '40px 0 70px' }}>
        <div style={wrap}>
          <SectionTitle kicker="CAPABILITIES" title="One brain for your entire operation" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', marginTop: '44px' }}>
            {FEATURES.map((f, i) => (
              <Hoverable key={f.title} baseStyle={{ background: 'rgba(13,19,32,0.5)', border: '1px solid rgba(99,140,200,0.12)', borderRadius: '20px', padding: '26px', backdropFilter: 'blur(16px)', transition: `transform 0.28s ${SPRING}, border-color 0.28s, box-shadow 0.28s`, ...rise(0.04 + i * 0.06) }} hoverStyle={{ transform: 'translateY(-4px)', borderColor: 'rgba(34,211,238,0.4)', boxShadow: '0 26px 64px -34px rgba(34,211,238,0.5)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(34,211,238,0.18), rgba(59,130,246,0.12))', border: '1px solid rgba(34,211,238,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#67e8f9', marginBottom: '18px' }}>
                  <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
                </div>
                <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 600, color: '#e8eefa' }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#8ea2c4' }}>{f.desc}</p>
              </Hoverable>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ position: 'relative', zIndex: 1, padding: '60px 0' }}>
        <div style={wrap}>
          <SectionTitle kicker="HOW IT WORKS" title="Live in minutes, not months" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginTop: '44px' }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ background: 'rgba(13,19,32,0.5)', border: '1px solid rgba(99,140,200,0.12)', borderRadius: '20px', padding: '28px', backdropFilter: 'blur(16px)', ...rise(0.04 + i * 0.08) }}>
                <div style={{ fontFamily: mono, fontSize: '36px', fontWeight: 700, background: 'linear-gradient(120deg,#a5f3fc,#3b82f6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', lineHeight: 1 }}>{s.n}</div>
                <h3 style={{ margin: '16px 0 8px', fontSize: '18px', fontWeight: 600, color: '#e8eefa' }}>{s.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#8ea2c4' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS — real business growth */}
      <section id="results" style={{ position: 'relative', zIndex: 1, padding: '70px 0' }}>
        <div style={wrap}>
          <SectionTitle kicker="RESULTS" title="Customers grow. Measurably." />
          <p style={{ textAlign: 'center', fontSize: '15px', color: '#8ea2c4', maxWidth: '560px', margin: '16px auto 0', lineHeight: 1.6 }}>
            Aggregate outcomes across active Blueman workspaces. Your agents compound: the longer they run, the more of your business context they hold.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginTop: '44px' }}>
            {GROWTH_STATS.map((s, i) => (
              <div key={s.label} style={{ background: 'rgba(13,19,32,0.5)', border: '1px solid rgba(99,140,200,0.12)', borderRadius: '20px', padding: '28px 26px', backdropFilter: 'blur(16px)', position: 'relative', overflow: 'hidden', ...rise(0.04 + i * 0.07) }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: s.color, opacity: 0.6 }} />
                <div style={{ fontFamily: mono, fontSize: '42px', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#e8eefa', marginTop: '14px' }}>{s.label}</div>
                <div style={{ fontSize: '12px', color: '#56688c', marginTop: '4px' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMERS — trust, testimonials, case studies */}
      <section id="customers" style={{ position: 'relative', zIndex: 1, padding: '70px 0' }}>
        <div style={wrap}>
          <SectionTitle kicker="TRUST" title="Built for businesses that can’t afford mistakes" />

          {/* trust indicators */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px', marginTop: '44px' }}>
            {TRUST_POINTS.map((t, i) => (
              <div key={t.title} style={{ background: 'rgba(13,19,32,0.5)', border: '1px solid rgba(99,140,200,0.12)', borderRadius: '20px', padding: '26px', backdropFilter: 'blur(16px)', ...rise(0.04 + i * 0.07) }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#67e8f9', marginBottom: '16px' }}>
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600, color: '#e8eefa' }}>{t.title}</h3>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: '#8ea2c4' }}>{t.desc}</p>
              </div>
            ))}
          </div>

          {/* testimonials */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px', marginTop: '18px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} style={{ background: 'rgba(13,19,32,0.5)', border: '1px solid rgba(99,140,200,0.12)', borderRadius: '20px', padding: '26px', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', ...rise(0.1 + i * 0.07) }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill={t.color} opacity="0.5" style={{ marginBottom: '14px' }}><path d="M10 8c-3 0-5 2.2-5 5.2 0 2.6 1.8 4.3 4 4.3 2 0 3.4-1.4 3.4-3.3 0-1.8-1.3-3.1-3-3.1h-.4C9.4 9.9 10.4 9 12 8.6L10 8zm9 0c-3 0-5 2.2-5 5.2 0 2.6 1.8 4.3 4 4.3 2 0 3.4-1.4 3.4-3.3 0-1.8-1.3-3.1-3-3.1h-.4c.4-1.2 1.4-2.1 3-2.5L19 8z" /></svg>
                <p style={{ margin: '0 0 20px', fontSize: '14px', lineHeight: 1.65, color: '#bccbe6', flex: 1 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: t.color + '1f', border: '1px solid ' + t.color + '44', color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontWeight: 700, fontSize: '14px' }}>{t.initial}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8eefa' }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: '#56688c' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* case studies */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px', marginTop: '18px' }}>
            {CASE_STUDIES.map((c, i) => (
              <Hoverable key={c.title} baseStyle={{ background: 'rgba(13,19,32,0.5)', border: '1px solid rgba(99,140,200,0.12)', borderRadius: '20px', padding: '26px', backdropFilter: 'blur(16px)', transition: `transform 0.26s ${SPRING}, border-color 0.26s`, ...rise(0.16 + i * 0.07) }} hoverStyle={{ transform: 'translateY(-3px)', borderColor: c.color + '66' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '1.5px', color: c.color }}>{c.tag}</span>
                  <span style={{ fontFamily: mono, fontSize: '15px', fontWeight: 700, color: c.color }}>{c.metric}</span>
                </div>
                <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 600, color: '#e8eefa', lineHeight: 1.35 }}>{c.title}</h3>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: '#8ea2c4' }}>{c.detail}</p>
              </Hoverable>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO — guided, below trust */}
      <section id="demo" style={{ position: 'relative', zIndex: 1, padding: '70px 0' }}>
        <div style={wrap}>
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', padding: '54px 40px', borderRadius: '26px', background: 'linear-gradient(150deg, rgba(34,211,238,0.1), rgba(59,130,246,0.05))', border: '1px solid rgba(34,211,238,0.22)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-90px', right: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.14), transparent 70%)', filter: 'blur(24px)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: mono, fontSize: '11px', letterSpacing: '2px', color: '#67e8f9', marginBottom: '14px' }}>GUIDED DEMO</div>
              <h2 style={{ margin: 0, fontSize: 'clamp(24px,3.4vw,34px)', fontWeight: 700, letterSpacing: '-0.6px', color: '#f1f6ff' }}>See Blueman on your business</h2>
              <p style={{ fontSize: '14.5px', color: '#9ab0d0', margin: '14px auto 28px', maxWidth: '460px', lineHeight: 1.6 }}>
                We don’t do self-serve trials. A specialist walks you through the platform live, mapped to your stack and your numbers — 30 minutes, no obligation.
              </p>
              {demoSent ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(79,174,107,0.1)', border: '1px solid rgba(79,174,107,0.35)', borderRadius: '13px', padding: '14px 22px', fontSize: '14px', color: '#7fd39a' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Request received — we’ll reach out within one business day.
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <input value={demoEmail} onChange={(e) => setDemoEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && requestDemo()} placeholder="you@company.com" type="email" style={{ width: '280px', maxWidth: '70vw', background: 'rgba(6,8,15,0.75)', border: '1px solid rgba(99,140,200,0.2)', borderRadius: '13px', padding: '14px 18px', color: '#e8eefa', fontFamily: "'Inter',sans-serif", fontSize: '14px', outline: 'none' }} />
                  <Hoverable as="button" onClick={requestDemo} baseStyle={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#04121f', border: 'none', borderRadius: '13px', padding: '14px 24px', fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 12px 30px -10px rgba(59,130,246,0.85)' }} hoverStyle={{ filter: 'brightness(1.08)' }}>Request demo</Hoverable>
                </div>
              )}
              <div style={{ marginTop: '18px', fontSize: '12px', color: '#56688c' }}>Already a customer? <button onClick={onLaunch} style={{ background: 'none', border: 'none', color: '#67e8f9', cursor: 'pointer', fontSize: '12px', padding: 0, fontFamily: "'Inter',sans-serif" }}>Sign in here</button></div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY — Swiss-style horizontal swipe */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 0 40px' }}>
        <div style={wrap}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: mono, fontSize: '12px', letterSpacing: '2px', color: '#67e8f9', marginBottom: '12px' }}>INSIDE THE PLATFORM</div>
              <h2 style={{ margin: 0, fontSize: 'clamp(26px,3.6vw,40px)', fontWeight: 700, letterSpacing: '-0.8px', color: '#f1f6ff' }}>A look inside</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[-1, 1].map((dir) => (
                <Hoverable as="button" key={dir} onClick={() => swipe(dir)} baseStyle={{ width: '44px', height: '44px', borderRadius: '13px', background: 'rgba(11,17,29,0.6)', border: '1px solid rgba(99,140,200,0.16)', color: '#9fb3d4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} hoverStyle={{ borderColor: 'rgba(34,211,238,0.4)', color: '#cfe3ff' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === 1 ? 'rotate(180deg)' : 'none' }}><path d="M15 18l-6-6 6-6" /></svg>
                </Hoverable>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1180px', margin: '30px auto 0', padding: '0 32px' }}>
          <div ref={galleryRef} className="bm-gallery">
            {GALLERY.map((g) => (
              <div key={g.n} style={{ width: '380px', maxWidth: '82vw' }}>
                <Shot kind={g.kind} />
                <div style={{ display: 'flex', gap: '14px', alignItems: 'baseline', marginTop: '16px', paddingLeft: '2px' }}>
                  <span style={{ fontFamily: mono, fontSize: '13px', fontWeight: 700, color: '#67e8f9' }}>{g.n}</span>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#e8eefa' }}>{g.title}</div>
                    <div style={{ fontSize: '12px', color: '#56688c', marginTop: '2px' }}>{g.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ position: 'relative', zIndex: 1, padding: '70px 0' }}>
        <div style={wrap}>
          <SectionTitle kicker="PRICING" title="Simple pricing that scales with you" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px', marginTop: '44px', alignItems: 'stretch' }}>
            {PLANS.map((p, i) => (
              <div key={p.name} style={{ position: 'relative', background: p.highlight ? 'linear-gradient(160deg, rgba(34,211,238,0.1), rgba(59,130,246,0.05))' : 'rgba(13,19,32,0.5)', border: p.highlight ? '1px solid rgba(34,211,238,0.4)' : '1px solid rgba(99,140,200,0.12)', borderRadius: '22px', padding: '30px', backdropFilter: 'blur(16px)', boxShadow: p.highlight ? '0 30px 80px -40px rgba(34,211,238,0.6)' : 'none', ...rise(0.04 + i * 0.08) }}>
                {p.highlight && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#04121f', fontSize: '11px', fontWeight: 700, fontFamily: mono, padding: '5px 14px', borderRadius: '999px', letterSpacing: '0.5px' }}>MOST POPULAR</div>}
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#e8eefa' }}>{p.name}</div>
                <div style={{ fontSize: '12px', color: '#56688c', marginTop: '4px' }}>{p.tagline}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', margin: '18px 0 22px' }}>
                  <span style={{ fontFamily: mono, fontSize: '40px', fontWeight: 700, color: '#f1f6ff' }}>{p.price}</span>
                  <span style={{ fontSize: '14px', color: '#56688c', marginBottom: '8px' }}>{p.period}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '26px' }}>
                  {p.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#bccbe6' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}><polyline points="20 6 9 17 4 12" /></svg>
                      {f}
                    </div>
                  ))}
                </div>
                <Hoverable as="a" href="#demo" baseStyle={{ display: 'block', textAlign: 'center', textDecoration: 'none', width: '100%', background: p.highlight ? 'linear-gradient(135deg,#22d3ee,#3b82f6)' : 'rgba(99,140,200,0.07)', color: p.highlight ? '#04121f' : '#cfe3ff', border: p.highlight ? 'none' : '1px solid rgba(99,140,200,0.18)', borderRadius: '13px', padding: '13px', fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: p.highlight ? '0 10px 26px -8px rgba(59,130,246,0.8)' : 'none', boxSizing: 'border-box' }} hoverStyle={p.highlight ? { filter: 'brightness(1.08)' } : { borderColor: 'rgba(34,211,238,0.34)' }}>{p.cta}</Hoverable>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(99,140,200,0.1)', padding: '34px 0' }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Orb size={28} />
          <span style={{ fontWeight: 600, letterSpacing: '2px', color: '#9fb3d4' }}>BLUEMAN</span>
          <span style={{ fontSize: '13px', color: '#56688c' }}>· The AI Operating System for online business</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: mono, fontSize: '12px', color: '#3f4f6e' }}>© 2026 Blueman</span>
        </div>
      </footer>
    </div>
  )
}

function SectionTitle({ kicker, title }) {
  return (
    <div style={{ textAlign: 'center', ...rise(0) }}>
      <div style={{ fontFamily: mono, fontSize: '12px', letterSpacing: '2px', color: '#67e8f9', marginBottom: '12px' }}>{kicker}</div>
      <h2 style={{ margin: 0, fontSize: 'clamp(26px,3.6vw,40px)', fontWeight: 700, letterSpacing: '-0.8px', color: '#f1f6ff' }}>{title}</h2>
    </div>
  )
}
