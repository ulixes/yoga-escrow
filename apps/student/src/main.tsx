import React from 'react'
import './polyfills'
import ReactDOM from 'react-dom/client'
import App from './App'
import { WithPrivyProvider } from './privy'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <WithPrivyProvider>
    <App />
  </WithPrivyProvider>
)
