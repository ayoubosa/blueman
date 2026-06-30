import React, { useEffect, useState } from 'react'
import { panel, riseAt, Hoverable, PageHead, PrimaryButton, Tag } from '../ui.jsx'
import { getDigest, generateDigest } from '../api.js'

/* demo briefing used until the JARVIS backend is connected */
const DEMO = {
  greeting: 'Good morning, Ayoub',
  summary: "You closed 3 deals overnight and your fleet handled 312 tasks at 94.7% efficiency. 2 items need your attention before noon. Revenue is tracking +18% week-over-week.",
  weather: { temp: '24°', cond: 'Clear', city: 'Casablanca' },
  highlights: [
    { icon: 'dollar', color: '#4fae6b', title: 'Revenue up 18% WoW', detail: '$8,420 in the last 24h across 3 stores' },
    { icon: 'mail', color: '#22d3ee', title: '2 high-priority emails', detail: 'A supplier quote and a partnership request' },
    { icon: 'alert', color: '#fbbf24', title: 'Ad spend anomaly', detail: 'Meta campaign CPA up 31% — Vega is investigating' },
    { icon: 'check', color: '#a78bfa', title: 'Content ready to ship', detail: 'Lyra drafted 4 posts + 1 newsletter for review' },
  ],
}

const SCHEDULE = [
  { time: '07:30', title: 'Morning briefing', who: 'Blueman', done: true, kind: 'system' },
  { time: '09:00', title: 'Review overnight sales & ad performance', who: 'Vega', done: true, kind: 'work' },
  { time: '10:30', title: 'Approve Lyra’s content batch', who: 'You', done: false, kind: 'review' },
  { time: '12:00', title: 'Supplier call — restock negotiation', who: 'You', done: false, kind: 'meeting' },
  { time: '14:00', title: 'Orion runs outreach to 40 warm leads', who: 'Orion', done: false, kind: 'work' },
  { time: '16:30', title: 'Weekly P&L snapshot generated', who: 'Vega', done: false, kind: 'work' },
  { time: '21:00', title: 'Evening wind-down digest', who: 'Blueman', done: false, kind: 'system' },
]

const KIND_COLOR = { system: '#22d3ee', work: '#3b82f6', review: '#fbbf24', meeting: '#a78bfa' }

const ICONS = {
  dollar: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></>,
  alert: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
  check: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
}

export default function Briefing() {
  const [data, setData] = useState(DEMO)
  const [live, setLive] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    getDigest(null).then((d) => { if (d) { setData({ ...DEMO, ...d }); setLive(true) } })
  }, [])

  const regenerate = async () => {
    setBusy(true)
    const d = await generateDigest()
    if (d) { setData({ ...DEMO, ...d }); setLive(true) }
    setBusy(false)
  }

  const doneCount = SCHEDULE.filter((s) => s.done).length

  return (
    <>
      <PageHead
        title="Daily Briefing"
        subtitle={live ? 'Live from Blueman · generated this morning' : 'Demo briefing · connect Blueman for live data'}
        right={<PrimaryButton onClick={regenerate}>{busy ? 'Generating…' : '↻ Regenerate'}</PrimaryButton>}
      />

      {/* hero summary */}
      <section style={{ ...panel, padding: '26px 28px', marginBottom: '16px', position: 'relative', overflow: 'hidden', ...riseAt(0.04) }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-30px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%)', filter: 'blur(20px)' }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', position: 'relative' }}>
          <div style={{ maxWidth: '70%' }}>
            <div style={{ fontSize: '26px', fontWeight: 600, color: '#e8eefa', letterSpacing: '-0.4px', marginBottom: '12px' }}>{data.greeting}</div>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.6, color: '#bccbe6' }}>{data.summary}</p>
          </div>
          <div style={{ flex: 'none', textAlign: 'right' }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '44px', fontWeight: 700, background: 'linear-gradient(120deg,#a5f3fc,#3b82f6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', lineHeight: 1 }}>{data.weather.temp}</div>
            <div style={{ fontSize: '13px', color: '#8195b8', marginTop: '6px' }}>{data.weather.cond} · {data.weather.city}</div>
          </div>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: '16px' }}>
        {/* highlights */}
        <section style={{ ...panel, ...riseAt(0.16) }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600, color: '#e8eefa' }}>Needs Your Attention</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.highlights.map((h, i) => (
              <Hoverable key={i} baseStyle={{ display: 'flex', gap: '14px', padding: '14px', borderRadius: '14px', background: 'rgba(8,12,22,0.5)', border: '1px solid rgba(99,140,200,0.1)', transition: 'all 0.2s', cursor: 'default' }} hoverStyle={{ borderColor: h.color + '55', background: 'rgba(8,12,22,0.75)' }}>
                <div style={{ width: '40px', height: '40px', flex: 'none', borderRadius: '11px', background: h.color + '1a', border: '1px solid ' + h.color + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', color: h.color }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{ICONS[h.icon]}</svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#e8eefa' }}>{h.title}</div>
                  <div style={{ fontSize: '12px', color: '#8195b8', marginTop: '2px' }}>{h.detail}</div>
                </div>
              </Hoverable>
            ))}
          </div>
        </section>

        {/* day timeline */}
        <section style={{ ...panel, ...riseAt(0.22) }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#e8eefa' }}>Today’s Plan</h2>
            <Tag>{doneCount}/{SCHEDULE.length} done</Tag>
          </div>
          <div style={{ position: 'relative', paddingLeft: '8px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '6px', bottom: '6px', width: '2px', background: 'rgba(99,140,200,0.15)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {SCHEDULE.map((s, i) => {
                const c = KIND_COLOR[s.kind]
                return (
                  <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', position: 'relative' }}>
                    <div style={{ width: '10px', height: '10px', marginTop: '4px', borderRadius: '50%', flex: 'none', zIndex: 1, background: s.done ? c : 'rgba(13,19,32,1)', border: '2px solid ' + c, boxShadow: s.done ? '0 0 8px 1px ' + c : 'none' }} />
                    <div style={{ flex: 1, minWidth: 0, opacity: s.done ? 0.55 : 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '11px', color: '#67e8f9' }}>{s.time}</span>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#dbe5f5', textDecoration: s.done ? 'line-through' : 'none' }}>{s.title}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#56688c', marginTop: '2px' }}>{s.who}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
