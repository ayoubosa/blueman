import React, { useEffect, useState } from 'react'
import { Hoverable } from './ui.jsx'

const SPRING = 'cubic-bezier(.34,1.3,.64,1)'
const rise = (d) => ({ animation: `jv-rise 0.7s ${SPRING} both`, animationDelay: d + 's' })

const FEATURES = [
  { title: 'Daily Briefing', desc: 'Wake up to a clear picture — revenue, what needs you, and your whole day planned. From morning to wind-down.', icon: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></> },
  { title: 'Agent Fleet', desc: 'A team of AI agents that research competitors, run sales outreach, create content, and crunch your numbers — 24/7.', icon: <><rect x="3" y="11" width="18" height="10" rx="2.5" /><circle cx="12" cy="5" r="2.2" /><path d="M12 7.2V11" /></> },
  { title: 'Business Analytics', desc: 'Live revenue, throughput, and cost intelligence across every store and channel — in one calm view.', icon: <><path d="M3 20.5h18" /><rect x="4.5" y="12" width="3.2" height="6.5" rx="1" /><rect x="10.4" y="7" width="3.2" height="11.5" rx="1" /><rect x="16.3" y="4" width="3.2" height="14.5" rx="1" /></> },
  { title: 'Connect Everything', desc: 'Gmail, Calendar, Notion, Slack, WhatsApp, Stripe, Shopify, Meta Ads — your whole stack, in one brain.', icon: <><path d="M6 3v6a6 6 0 0 0 12 0V3" /><path d="M9 3v3M15 3v3M12 15v6" /></> },
  { title: 'Memory', desc: 'Blueman remembers every customer, decision, and insight — and recalls the right one at the right moment.', icon: <><rect x="6" y="6" width="12" height="12" rx="1.5" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9.5 3v2.5M14.5 3v2.5M9.5 18.5V21M14.5 18.5V21M3 9.5h2.5M3 14.5h2.5M18.5 9.5H21M18.5 14.5H21" /></> },
  { title: 'Automations', desc: 'Set it once. Blueman runs your recurring work on schedule or on trigger — and tells you when it’s done.', icon: <><rect x="3" y="3" width="6.5" height="6.5" rx="1.5" /><rect x="14.5" y="14.5" width="6.5" height="6.5" rx="1.5" /><path d="M9.5 6.25h4.5a3.75 3.75 0 0 1 3.75 3.75v4.5" /></> },
]

const STEPS = [
  { n: '01', title: 'Connect your business', desc: 'Link your email, calendar, store, and tools in a few clicks.' },
  { n: '02', title: 'Deploy your agents', desc: 'Pick the AI operatives you need — research, sales, content, data.' },
  { n: '03', title: 'Wake up to results', desc: 'Blueman works overnight. You start each day ahead, not behind.' },
]

const PLANS = [
  { name: 'Starter', price: '$49', period: '/mo', tagline: 'For solo founders', features: ['3 AI agents', '5 integrations', 'Daily briefing', 'Email support'], cta: 'Start free trial', highlight: false },
  { name: 'Growth', price: '$149', period: '/mo', tagline: 'For growing businesses', features: ['Unlimited agents', 'All integrations', 'Automations & scheduler', 'Memory & analytics', 'Priority support'], cta: 'Start free trial', highlight: true },
  { name: 'Scale', price: 'Custom', period: '', tagline: 'For teams & agencies', features: ['Everything in Growth', 'Multi-seat & roles', 'White-label option', 'Dedicated success', 'Custom integrations'], cta: 'Talk to us', highlight: false },
]

function Logo({ size = 40 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(34,211,238,0.32)', borderTopColor: 'rgba(34,211,238,0.95)', animation: 'jv-spin 6s linear infinite' }} />
      <div style={{ position: 'absolute', inset: '6px', borderRadius: '50%', border: '1.5px solid rgba(59,130,246,0.28)', borderBottomColor: 'rgba(96,165,250,0.9)', animation: 'jv-spinrev 4.5s linear infinite' }} />
      <div style={{ width: size * 0.32, height: size * 0.32, borderRadius: '50%', background: 'radial-gradient(circle,#a5f3fc,#22d3ee 60%,#3b82f6)', animation: 'jv-core 3.4s ease-in-out infinite' }} />
    </div>
  )
}

export default function Landing({ onLaunch }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const wrap = { maxWidth: '1180px', margin: '0 auto', padding: '0 32px' }

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
          <Logo size={34} />
          <span style={{ fontWeight: 600, fontSize: '18px', letterSpacing: '2px', background: 'linear-gradient(120deg,#e0f2fe,#67e8f9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>BLUEMAN</span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {['Features', 'How it works', 'Pricing'].map((l) => (
              <a key={l} href={'#' + l.replace(/\s/g, '-').toLowerCase()} style={{ color: '#8195b8', textDecoration: 'none', fontSize: '14px' }}>{l}</a>
            ))}
            <Hoverable as="button" onClick={onLaunch} baseStyle={{ background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#04121f', border: 'none', borderRadius: '11px', padding: '10px 18px', fontFamily: "'Inter',sans-serif", fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 22px -8px rgba(59,130,246,0.8)' }} hoverStyle={{ filter: 'brightness(1.08)' }}>Live Demo</Hoverable>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '90px 0 70px' }}>
        <div style={wrap}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.22)', borderRadius: '999px', padding: '7px 16px', fontSize: '12px', color: '#7dd3e0', fontFamily: "'Space Mono',monospace", ...rise(0) }}>
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
            <Hoverable as="button" onClick={onLaunch} baseStyle={{ display: 'flex', alignItems: 'center', gap: '9px', background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#04121f', border: 'none', borderRadius: '14px', padding: '15px 28px', fontFamily: "'Inter',sans-serif", fontSize: '15px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 14px 34px -10px rgba(59,130,246,0.85)' }} hoverStyle={{ filter: 'brightness(1.08)', transform: 'translateY(-2px)' }}>
              Launch the live demo
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Hoverable>
            <Hoverable as="a" href="#pricing" baseStyle={{ display: 'flex', alignItems: 'center', textDecoration: 'none', background: 'rgba(99,140,200,0.06)', color: '#cfe3ff', border: '1px solid rgba(99,140,200,0.18)', borderRadius: '14px', padding: '15px 28px', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }} hoverStyle={{ borderColor: 'rgba(34,211,238,0.34)' }}>See pricing</Hoverable>
          </div>
          <div style={{ marginTop: '18px', fontSize: '13px', color: '#56688c', ...rise(0.3) }}>No card required · 14-day free trial · Cancel anytime</div>

          {/* mock product frame */}
          <div style={{ marginTop: '56px', ...rise(0.36) }}>
            <div style={{ position: 'relative', maxWidth: '960px', margin: '0 auto', borderRadius: '18px', border: '1px solid rgba(99,140,200,0.18)', background: 'rgba(13,19,32,0.6)', backdropFilter: 'blur(16px)', boxShadow: '0 50px 120px -40px rgba(0,0,0,0.9), 0 0 0 1px rgba(34,211,238,0.06)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '14px 18px', borderBottom: '1px solid rgba(99,140,200,0.1)' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#f87171' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#fbbf24' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#4ade80' }} />
                <span style={{ marginLeft: '12px', fontFamily: "'Space Mono',monospace", fontSize: '11px', color: '#56688c' }}>app.blueman.ai</span>
              </div>
              <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
                {[{ l: 'Revenue today', v: '$8,420', c: '#4fae6b' }, { l: 'Active agents', v: '6', c: '#22d3ee' }, { l: 'Tasks done', v: '1,284', c: '#67e8f9' }, { l: 'Efficiency', v: '94.7%', c: '#a78bfa' }].map((m) => (
                  <div key={m.l} style={{ background: 'rgba(8,12,22,0.6)', border: '1px solid rgba(99,140,200,0.12)', borderRadius: '14px', padding: '16px' }}>
                    <div style={{ fontSize: '10px', color: '#7184a8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{m.l}</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '26px', fontWeight: 700, marginTop: '8px', color: m.c }}>{m.v}</div>
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '14px', background: 'linear-gradient(100deg, rgba(34,211,238,0.08), rgba(59,130,246,0.05))', border: '1px solid rgba(34,211,238,0.16)', fontSize: '13px', color: '#bccbe6' }}>
                  <Logo size={22} /> “Good morning, Ayoub. You closed 3 deals overnight — 2 things need you before noon.”
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SOCIAL PROOF strip */}
      <section style={{ position: 'relative', zIndex: 1, padding: '20px 0 60px' }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', opacity: 0.65, fontFamily: "'Space Mono',monospace", fontSize: '13px', color: '#56688c' }}>
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
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '36px', fontWeight: 700, background: 'linear-gradient(120deg,#a5f3fc,#3b82f6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', lineHeight: 1 }}>{s.n}</div>
                <h3 style={{ margin: '16px 0 8px', fontSize: '18px', fontWeight: 600, color: '#e8eefa' }}>{s.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#8ea2c4' }}>{s.desc}</p>
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
                {p.highlight && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#04121f', fontSize: '11px', fontWeight: 700, fontFamily: "'Space Mono',monospace", padding: '5px 14px', borderRadius: '999px', letterSpacing: '0.5px' }}>MOST POPULAR</div>}
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#e8eefa' }}>{p.name}</div>
                <div style={{ fontSize: '12px', color: '#56688c', marginTop: '4px' }}>{p.tagline}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', margin: '18px 0 22px' }}>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '40px', fontWeight: 700, color: '#f1f6ff' }}>{p.price}</span>
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
                <Hoverable as="button" onClick={onLaunch} baseStyle={{ width: '100%', background: p.highlight ? 'linear-gradient(135deg,#22d3ee,#3b82f6)' : 'rgba(99,140,200,0.07)', color: p.highlight ? '#04121f' : '#cfe3ff', border: p.highlight ? 'none' : '1px solid rgba(99,140,200,0.18)', borderRadius: '13px', padding: '13px', fontFamily: "'Inter',sans-serif", fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: p.highlight ? '0 10px 26px -8px rgba(59,130,246,0.8)' : 'none' }} hoverStyle={p.highlight ? { filter: 'brightness(1.08)' } : { borderColor: 'rgba(34,211,238,0.34)' }}>{p.cta}</Hoverable>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 0 90px' }}>
        <div style={wrap}>
          <div style={{ textAlign: 'center', padding: '60px 32px', borderRadius: '26px', background: 'linear-gradient(150deg, rgba(34,211,238,0.12), rgba(59,130,246,0.06))', border: '1px solid rgba(34,211,238,0.22)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-80px', right: '-40px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.16), transparent 70%)', filter: 'blur(24px)' }} />
            <h2 style={{ position: 'relative', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, letterSpacing: '-0.8px', color: '#f1f6ff', margin: 0 }}>Your business, on autopilot.</h2>
            <p style={{ position: 'relative', fontSize: '17px', color: '#9ab0d0', margin: '16px auto 30px', maxWidth: '520px' }}>See exactly what Blueman can do for you — explore the full live demo right now.</p>
            <Hoverable as="button" onClick={onLaunch} baseStyle={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '9px', background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: '#04121f', border: 'none', borderRadius: '14px', padding: '16px 32px', fontFamily: "'Inter',sans-serif", fontSize: '16px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 14px 34px -10px rgba(59,130,246,0.85)' }} hoverStyle={{ filter: 'brightness(1.08)', transform: 'translateY(-2px)' }}>
              Launch the live demo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Hoverable>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(99,140,200,0.1)', padding: '34px 0' }}>
        <div style={{ ...wrap, display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Logo size={28} />
          <span style={{ fontWeight: 600, letterSpacing: '2px', color: '#9fb3d4' }}>BLUEMAN</span>
          <span style={{ fontSize: '13px', color: '#56688c' }}>· The AI Operating System for online business</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '12px', color: '#3f4f6e' }}>© 2026 Blueman</span>
        </div>
      </footer>
    </div>
  )
}

function SectionTitle({ kicker, title }) {
  return (
    <div style={{ textAlign: 'center', ...rise(0) }}>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '12px', letterSpacing: '2px', color: '#67e8f9', marginBottom: '12px' }}>{kicker}</div>
      <h2 style={{ margin: 0, fontSize: 'clamp(26px,3.6vw,40px)', fontWeight: 700, letterSpacing: '-0.8px', color: '#f1f6ff' }}>{title}</h2>
    </div>
  )
}
