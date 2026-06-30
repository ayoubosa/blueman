import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Landing from './Landing'
import './index.css'

function Root() {
  // Start on the marketing site; "Launch Demo" enters the product.
  const [entered, setEntered] = useState(() => window.location.hash === '#app')
  const enter = () => { window.location.hash = 'app'; setEntered(true) }
  const exit = () => { window.location.hash = ''; setEntered(false) }
  return entered ? <App onExit={exit} /> : <Landing onLaunch={enter} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
