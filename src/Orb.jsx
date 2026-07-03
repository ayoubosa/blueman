import React from 'react'

/**
 * The Blueman orb — the visual identity of the agent.
 *
 * Expressive states:
 *   idle      calm rotation, soft breathing core
 *   thinking  faster counter-rotation, amber pulse, orbiting particle
 *   active    bright cyan surge, double particle orbit
 *
 * Built from layered conic rings + a lit core + orbiting particles.
 * Pure CSS animation — zero runtime cost, no canvas, no WebGL.
 */
export default function Orb({ size = 40, state = 'idle' }) {
  const s = {
    idle:     { ring: 'rgba(34,211,238,0.9)',  speed: 6,   core: '#22d3ee', coreAnim: 'jv-core 3.4s ease-in-out infinite', particles: 1 },
    thinking: { ring: 'rgba(251,191,36,0.9)',  speed: 2.2, core: '#fbbf24', coreAnim: 'jv-core-hot 1.6s ease-in-out infinite', particles: 2 },
    active:   { ring: 'rgba(165,243,252,1)',   speed: 3.5, core: '#a5f3fc', coreAnim: 'jv-core-hot 2.2s ease-in-out infinite', particles: 2 },
  }[state] || {}

  const px = (n) => Math.round(size * n) + 'px'

  return (
    <div style={{ position: 'relative', width: size, height: size, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* outer ring — thin, precise */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(34,211,238,0.22)', borderTopColor: s.ring, animation: `jv-spin ${s.speed}s linear infinite` }} />
      {/* middle ring — counter-rotating */}
      <div style={{ position: 'absolute', inset: px(0.14), borderRadius: '50%', border: '1.5px solid rgba(59,130,246,0.2)', borderBottomColor: 'rgba(96,165,250,0.9)', animation: `jv-spinrev ${s.speed * 0.72}s linear infinite` }} />
      {/* inner tick ring — dashed, slow */}
      <div style={{ position: 'absolute', inset: px(0.26), borderRadius: '50%', border: '1px dashed rgba(148,197,255,0.28)', animation: `jv-spin ${s.speed * 2.4}s linear infinite` }} />
      {/* core */}
      <div style={{ width: px(0.3), height: px(0.3), borderRadius: '50%', background: `radial-gradient(circle at 38% 34%, #e0fbff, ${s.core} 55%, #1d4ed8)`, animation: s.coreAnim }} />
      {/* orbiting particles */}
      {Array.from({ length: s.particles }).map((_, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, animation: `jv-spin ${s.speed * (1 + i * 0.5)}s linear infinite`, animationDelay: -i * 1.1 + 's' }}>
          <span style={{ position: 'absolute', top: '-2px', left: '50%', width: px(0.09), height: px(0.09), marginLeft: px(-0.045), borderRadius: '50%', background: s.core, boxShadow: `0 0 ${px(0.15)} ${s.core}` }} />
        </div>
      ))}
    </div>
  )
}
