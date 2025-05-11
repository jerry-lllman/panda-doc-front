import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from './router'
import './index.css'
import './assets/styles/theme.css'
import { App } from 'antd'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AppRouter />
    </App>
  </StrictMode>,
)
