import React, { useEffect, useState } from 'react'
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

  // Keep the route in sync with browser back/forward navigation.
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#', '')
      // In-page anchors (#pricing, #demo, …) are not routes — stay put.
      if (h === 'app' || h === 'access' || h === '') setRoute(h || 'landing')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Already signed in and on the gate? Skip straight to the product.
  useEffect(() => {
    if (route === 'access' && auth.authorized) go('app')
  }, [route, auth.authorized])

  if (route === 'app') {
    if (!auth.authorized) return <AccessGate onAuthorized={() => go('app')} onBack={() => go('landing')} />
    return <App onExit={() => go('landing')} onLogout={() => { logout(); go('landing') }} />
  }
  if (route === 'access') {
    if (auth.authorized) return null
    return <AccessGate onAuthorized={() => go('app')} onBack={() => go('landing')} />
  }
  return <Landing onLaunch={() => go(auth.authorized ? 'app' : 'access')} authorized={auth.authorized} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
