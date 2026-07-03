import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Landing from './Landing'
import AccessGate from './AccessGate'
import { useAuth, logout } from './auth.js'
import './index.css'

/**
 * Route map (hash-based):
 *   (none)   → public landing page — the ONLY thing non-customers see
 *   #access  → sign-in / locked-access screen
 *   #app     → the product — requires an authorized session
 */
function Root() {
  const auth = useAuth()
  const [route, setRoute] = useState(() => window.location.hash.replace('#', '') || 'landing')

  const go = (r) => { window.location.hash = r === 'landing' ? '' : r; setRoute(r) }

  if (route === 'app') {
    if (!auth.authorized) return <AccessGate onAuthorized={() => go('app')} onBack={() => go('landing')} />
    return <App onExit={() => go('landing')} onLogout={() => { logout(); go('landing') }} />
  }
  if (route === 'access') {
    if (auth.authorized) { go('app'); return null }
    return <AccessGate onAuthorized={() => go('app')} onBack={() => go('landing')} />
  }
  return <Landing onLaunch={() => go(auth.authorized ? 'app' : 'access')} authorized={auth.authorized} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
