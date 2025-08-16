import React from 'react'
import ReactDOM from 'react-dom/client'
import './polyfills'
import App from './App'
import { WithPrivyProvider } from './privy'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WithPrivyProvider>
      <App />
    </WithPrivyProvider>
  </React.StrictMode>
)

