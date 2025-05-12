import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from 'antd'
import '@ant-design/v5-patch-for-react-19';
import AppRouter from './router'
import './index.css'
import './assets/styles/theme.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AppRouter />
    </App>
  </StrictMode>,
)
