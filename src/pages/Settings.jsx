import React, { useState } from 'react'
import { panel, riseAt, Hoverable, PageHead, Toggle, PrimaryButton } from '../ui.jsx'

const MODELS = [
  { id: 'opus', name: 'Claude Opus 4.8', desc: 'Most capable · deep reasoning', badge: 'FLAGSHIP' },
  { id: 'sonnet', name: 'Claude Sonnet 4.6', desc: 'Balanced speed & intelligence', badge: 'BALANCED' },
  { id: 'haiku', name: 'Claude Haiku 4.5', desc: 'Fastest · cost-efficient', badge: 'FAST' },
]

function Card({ title, children, delay }) {
  return (
    <section style={{ ...panel, ...riseAt(delay) }}>
      <h2 style={{ margin: '0 0 18px', fontSize: '15px', fontWeight: 600, color: '#e8eefa' }}>{title}</h2>
      {children}
    </section>
  )
}

function Row({ label, desc, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '12px 0', borderBottom: '1px solid rgba(99,140,200,0.07)' }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '13px', color: '#dbe5f5' }}>{label}</div>
        {desc && <div style={{ fontSize: '11px', color: '#56688c', marginTop: '2px' }}>{desc}</div>}
      </div>
      <div style={{ flex: 'none' }}>{children}</div>
    </div>
  )
}

const field = { width: '100%', background: 'rgba(6,8,15,0.7)', border: '1px solid rgba(99,140,200,0.16)', borderRadius: '11px', padding: '11px 14px', color: '#cdd8ec', fontFamily: "'Inter',sans-serif", fontSize: '13px', outline: 'none' }

export default function Settings() {
  const [model, setModel] = useState('opus')
  const [prefs, setPrefs] = useState({ notifications: true, autonomy: true, telemetry: false, darkSounds: true, streaming: true })
  const [showKey, setShowKey] = useState(false)
  const flip = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }))

  return (
    <>
      <PageHead title="Settings" subtitle="Account · model · integrations · preferences" right={<PrimaryButton>Save Changes</PrimaryButton>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '16px' }}>
        {/* Profile */}
        <Card title="Profile" delay={0.06}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg,#22d3ee,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '20px', color: '#04121f', boxShadow: '0 8px 22px -6px rgba(59,130,246,0.7)' }}>AY</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#e8eefa' }}>Ayoub</div>
              <div style={{ fontSize: '12px', color: '#56688c' }}>Founder · Online Business</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#7184a8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Display Name</label>
              <input defaultValue="Ayoub" style={field} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#7184a8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Email</label>
              <input defaultValue="ayoubosama2004@gmail.com" style={field} />
            </div>
          </div>
        </Card>

        {/* Model */}
        <Card title="Default Model" delay={0.1}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MODELS.map((m) => {
              const on = model === m.id
              return (
                <Hoverable key={m.id} onClick={() => setModel(m.id)}
                  baseStyle={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '13px', cursor: 'pointer', border: on ? '1px solid rgba(34,211,238,0.4)' : '1px solid rgba(99,140,200,0.12)', background: on ? 'linear-gradient(100deg, rgba(34,211,238,0.12), rgba(59,130,246,0.07))' : 'rgba(8,12,22,0.5)', transition: 'all 0.2s' }}
                  hoverStyle={on ? {} : { borderColor: 'rgba(34,211,238,0.25)' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid ' + (on ? '#22d3ee' : '#3f4f6e'), display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    {on && <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px 1px rgba(34,211,238,0.8)' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8eefa' }}>{m.name}</div>
                    <div style={{ fontSize: '11px', color: '#56688c' }}>{m.desc}</div>
                  </div>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '9px', color: '#67e8f9', border: '1px solid rgba(34,211,238,0.25)', borderRadius: '6px', padding: '3px 7px', flex: 'none' }}>{m.badge}</span>
                </Hoverable>
              )
            })}
          </div>
        </Card>

        {/* API Keys */}
        <Card title="API Keys" delay={0.14}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', color: '#7184a8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Anthropic API Key</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type={showKey ? 'text' : 'password'} defaultValue="sk-ant-api03-xxxxxxxxxxxxxxxx" style={{ ...field, fontFamily: "'Space Mono',monospace" }} />
              <Hoverable as="button" onClick={() => setShowKey((s) => !s)} baseStyle={{ flex: 'none', padding: '0 14px', borderRadius: '11px', background: 'rgba(99,140,200,0.07)', border: '1px solid rgba(99,140,200,0.14)', color: '#9fb3d4', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: '12px' }} hoverStyle={{ color: '#cfe3ff', borderColor: 'rgba(34,211,238,0.34)' }}>{showKey ? 'Hide' : 'Show'}</Hoverable>
            </div>
          </div>
          <Row label="Vector DB · Qdrant" desc="Connected · cluster eu-central-1">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'Space Mono',monospace", fontSize: '11px', color: '#4fae6b' }}><span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4fae6b', boxShadow: '0 0 8px 1px rgba(79,174,107,0.7)' }} />LIVE</span>
          </Row>
          <Row label="Mem0 · Memory Layer" desc="Connected · 2.41M vectors">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'Space Mono',monospace", fontSize: '11px', color: '#4fae6b' }}><span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4fae6b', boxShadow: '0 0 8px 1px rgba(79,174,107,0.7)' }} />LIVE</span>
          </Row>
        </Card>

        {/* Preferences */}
        <Card title="Preferences" delay={0.18}>
          <Row label="Push Notifications" desc="Alerts for agent events & failures"><Toggle on={prefs.notifications} onClick={() => flip('notifications')} /></Row>
          <Row label="Autonomous Mode" desc="Let agents act without confirmation"><Toggle on={prefs.autonomy} onClick={() => flip('autonomy')} /></Row>
          <Row label="Response Streaming" desc="Stream tokens as they generate"><Toggle on={prefs.streaming} onClick={() => flip('streaming')} /></Row>
          <Row label="Interface Sounds" desc="Subtle audio feedback on actions"><Toggle on={prefs.darkSounds} onClick={() => flip('darkSounds')} /></Row>
          <Row label="Anonymous Telemetry" desc="Share usage data to improve Blueman"><Toggle on={prefs.telemetry} onClick={() => flip('telemetry')} /></Row>
        </Card>
      </div>
    </>
  )
}
