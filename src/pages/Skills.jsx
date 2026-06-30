import React, { useState } from 'react'
import { SPRING, panel, riseAt, Hoverable, PageHead, Toggle, Tag } from '../ui.jsx'

const SKILLS = [
  { id: 'web', name: 'Web Browsing', cat: 'Research', desc: 'Autonomous Playwright-driven browsing & scraping', icon: 'globe', installed: true, stars: '85k' },
  { id: 'rag', name: 'RAG Retrieval', cat: 'Memory', desc: 'Vector search over your knowledge base', icon: 'layers', installed: true, stars: '84k' },
  { id: 'code', name: 'Code Execution', cat: 'Compute', desc: 'Secure sandboxed Python/JS via E2B', icon: 'terminal', installed: true, stars: '8.9k' },
  { id: 'mail', name: 'Email Outreach', cat: 'Comms', desc: 'Draft & send personalized campaigns', icon: 'mail', installed: true, stars: '12k' },
  { id: 'sql', name: 'SQL Analyst', cat: 'Data', desc: 'Natural-language queries over warehouses', icon: 'database', installed: false, stars: '21k' },
  { id: 'img', name: 'Vision & OCR', cat: 'Perception', desc: 'Image understanding and document parsing', icon: 'eye', installed: false, stars: '33k' },
  { id: 'voice', name: 'Voice I/O', cat: 'Comms', desc: 'Speech-to-text and natural TTS responses', icon: 'mic', installed: false, stars: '19k' },
  { id: 'sched', name: 'Scheduler', cat: 'Automation', desc: 'Cron-based and event-driven triggers', icon: 'clock', installed: true, stars: '15k' },
  { id: 'crm', name: 'CRM Sync', cat: 'Data', desc: 'Two-way sync with Salesforce & HubSpot', icon: 'refresh', installed: false, stars: '9.4k' },
]

const CATS = ['All', 'Research', 'Memory', 'Compute', 'Comms', 'Data', 'Automation', 'Perception']

const ICONS = {
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" /></>,
  layers: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
  terminal: <><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></>,
  database: <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
  mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 16 14" /></>,
  refresh: <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.5 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></>,
}

export default function Skills() {
  const [cat, setCat] = useState('All')
  const [query, setQuery] = useState('')
  const [skills, setSkills] = useState(SKILLS)

  const toggle = (id) => setSkills((s) => s.map((k) => (k.id === id ? { ...k, installed: !k.installed } : k)))
  const installed = skills.filter((s) => s.installed).length
  const shown = skills.filter((s) => (cat === 'All' || s.cat === cat) && (s.name.toLowerCase().includes(query.toLowerCase()) || s.desc.toLowerCase().includes(query.toLowerCase())))

  return (
    <>
      <PageHead
        title="Skills Marketplace"
        subtitle={`${installed} installed · ${skills.length} available · curated from top GitHub repos`}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '280px', maxWidth: '40vw', background: 'rgba(11,17,29,0.6)', border: '1px solid rgba(99,140,200,0.14)', borderRadius: '12px', padding: '10px 14px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#56688c" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search skills…" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#cdd8ec', fontFamily: "'Inter',sans-serif", fontSize: '13px' }} />
          </div>
        }
      />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', ...riseAt(0.2) }}>
        {CATS.map((c) => {
          const on = cat === c
          return (
            <Hoverable as="button" key={c} onClick={() => setCat(c)}
              baseStyle={{ padding: '7px 14px', borderRadius: '999px', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: on ? 600 : 400, border: on ? '1px solid rgba(34,211,238,0.4)' : '1px solid rgba(99,140,200,0.14)', background: on ? 'rgba(34,211,238,0.12)' : 'rgba(11,17,29,0.5)', color: on ? '#bfe9f5' : '#7184a8', transition: 'all 0.2s' }}
              hoverStyle={on ? {} : { color: '#9fb3d4' }}>
              {c}
            </Hoverable>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '16px' }}>
        {shown.map((s, i) => (
          <Hoverable key={s.id} baseStyle={{ ...panel, transition: `transform 0.26s ${SPRING}, border-color 0.26s, box-shadow 0.26s`, ...riseAt(0.26 + i * 0.05) }} hoverStyle={{ borderColor: 'rgba(34,211,238,0.35)', transform: 'translateY(-3px)', boxShadow: '0 22px 50px -32px rgba(34,211,238,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: s.installed ? 'linear-gradient(135deg, rgba(34,211,238,0.18), rgba(59,130,246,0.12))' : 'rgba(99,140,200,0.08)', border: '1px solid ' + (s.installed ? 'rgba(34,211,238,0.3)' : 'rgba(99,140,200,0.14)'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.installed ? '#67e8f9' : '#7184a8' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{ICONS[s.icon]}</svg>
              </div>
              <Toggle on={s.installed} onClick={() => toggle(s.id)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#e8eefa' }}>{s.name}</h3>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#8195b8', lineHeight: 1.5, minHeight: '36px' }}>{s.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Tag color="#7184a8" bg="rgba(99,140,200,0.08)" border="rgba(99,140,200,0.16)">{s.cat}</Tag>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'Space Mono',monospace", fontSize: '11px', color: '#caa86a' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15 9 22 9.3 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.3 9 9" /></svg>
                {s.stars}
              </span>
            </div>
          </Hoverable>
        ))}
      </div>
    </>
  )
}
