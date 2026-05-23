import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import Providers from './app/providers'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
)
