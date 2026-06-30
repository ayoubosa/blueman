import React, { useEffect, useState } from 'react'
import { SPRING, panel, riseAt, Hoverable, PageHead, Tag } from '../ui.jsx'
import { getConnectors, connectorOAuthUrl, syncConnector } from '../api.js'

/* Mirrors OpenJarvis's real connector catalog. `connected` is demo state
   until the JARVIS backend reports actual connection status. */
const CATALOG = [
  { id: 'gmail', name: 'Gmail', cat: 'Comms', desc: 'Read, triage & draft email', connected: true, items: '14.2k threads' },
  { id: 'gcalendar', name: 'Google Calendar', cat: 'Productivity', desc: 'Schedule & meeting awareness', connected: true, items: '38 events/wk' },
  { id: 'google_tasks', name: 'Google Tasks', cat: 'Productivity', desc: 'Task capture & completion', connected: true, items: '21 open' },
  { id: 'notion', name: 'Notion', cat: 'Knowledge', desc: 'Docs, wikis & databases', connected: true, items: '312 pages' },
  { id: 'slack', name: 'Slack', cat: 'Comms', desc: 'Team messages & alerts', connected: false, items: '' },
  { id: 'whatsapp', name: 'WhatsApp', cat: 'Comms', desc: 'Customer & supplier chats', connected: false, items: '' },
  { id: 'gdrive', name: 'Google Drive', cat: 'Knowledge', desc: 'Files & document memory', connected: true, items: '1.8k files' },
  { id: 'stripe', name: 'Stripe', cat: 'Business', desc: 'Revenue, payouts & churn', connected: true, items: '$84k MTD' },
  { id: 'shopify', name: 'Shopify', cat: 'Business', desc: 'Orders, products & customers', connected: true, items: '3 stores' },
  { id: 'meta_ads', name: 'Meta Ads', cat: 'Business', desc: 'Campaign spend & ROAS', connected: false, items: '' },
  { id: 'apple_health', name: 'Apple Health', cat: 'Personal', desc: 'Sleep, activity & recovery', connected: false, items: '' },
  { id: 'weather', name: 'Weather', cat: 'Personal', desc: 'Local forecast for briefings', connected: true, items: 'Casablanca' },
]

const CATS = ['All', 'Comms', 'Productivity', 'Knowledge', 'Business', 'Personal']

const LOGO = (name) => {
  const map = {
    Gmail: '#ea4335', 'Google Calendar': '#4285f4', 'Google Tasks': '#4285f4', Notion: '#e8eefa', Slack: '#e01e5a',
    WhatsApp: '#25d366', 'Google Drive': '#0f9d58', Stripe: '#635bff', Shopify: '#95bf47', 'Meta Ads': '#0668e1',
    'Apple Health': '#fe4f64', Weather: '#22d3ee',
  }
  return map[name] || '#22d3ee'
}

export default function Integrations() {
  const [cat, setCat] = useState('All')
  const [conns, setConns] = useState(CATALOG)
  const [live, setLive] = useState(false)

  useEffect(() => {
    getConnectors(null).then((list) => {
      if (list && list.length) {
        setLive(true)
        setConns((prev) => prev.map((c) => {
          const hit = list.find((x) => (x.id || x.name || '').toLowerCase().includes(c.id))
          return hit ? { ...c, connected: !!(hit.connected ?? hit.status === 'connected') } : c
        }))
      }
    })
  }, [])

  const toggle = async (id) => {
    setConns((cs) => cs.map((c) => (c.id === id ? { ...c, connected: !c.connected } : c)))
    if (live) {
      const c = conns.find((x) => x.id === id)
      if (c && !c.connected) window.open(connectorOAuthUrl(id), '_blank')
      else syncConnector(id)
    }
  }

  const connected = conns.filter((c) => c.connected).length
  const shown = cat === 'All' ? conns : conns.filter((c) => c.cat === cat)

  return (
    <>
      <PageHead
        title="Integrations"
        subtitle={`${connected} connected · ${conns.length} available · ${live ? 'live from Blueman' : 'connect Blueman to authorize'}`}
      />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', ...riseAt(0.16) }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {shown.map((c, i) => {
          const color = LOGO(c.name)
          return (
            <Hoverable key={c.id} baseStyle={{ ...panel, transition: `transform 0.26s ${SPRING}, border-color 0.26s, box-shadow 0.26s`, ...riseAt(0.2 + i * 0.04) }} hoverStyle={{ borderColor: 'rgba(34,211,238,0.35)', transform: 'translateY(-3px)', boxShadow: '0 22px 50px -32px rgba(34,211,238,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '13px', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: color + '1a', border: '1px solid ' + color + '40', fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: '18px', color }}>{c.name[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#e8eefa' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: '#56688c' }}>{c.cat}</div>
                </div>
              </div>
              <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#8195b8', lineHeight: 1.5, minHeight: '34px' }}>{c.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {c.connected ? (
                  <Tag color="#4fae6b" bg="rgba(79,174,107,0.1)" border="rgba(79,174,107,0.3)">
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4fae6b', boxShadow: '0 0 7px 1px rgba(79,174,107,0.7)' }} />
                    Connected{c.items ? ' · ' + c.items : ''}
                  </Tag>
                ) : (
                  <Tag color="#7184a8" bg="rgba(99,140,200,0.06)" border="rgba(99,140,200,0.16)">Not connected</Tag>
                )}
                <Hoverable as="button" onClick={() => toggle(c.id)}
                  baseStyle={{ padding: '7px 14px', borderRadius: '10px', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: '12px', fontWeight: 600, border: 'none', background: c.connected ? 'rgba(99,140,200,0.08)' : 'linear-gradient(135deg,#22d3ee,#3b82f6)', color: c.connected ? '#9fb3d4' : '#04121f' }}
                  hoverStyle={c.connected ? { color: '#f59e9e' } : { filter: 'brightness(1.08)' }}>
                  {c.connected ? 'Disconnect' : 'Connect'}
                </Hoverable>
              </div>
            </Hoverable>
          )
        })}
      </div>
    </>
  )
}
