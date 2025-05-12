import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from 'antd'
import '@ant-design/v5-patch-for-react-19';
import AppRouter from './router'
import { ThemeProvider } from './components/ThemeProvider'
import './index.css'
import './assets/styles/theme.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App>
        <AppRouter />
      </App>
    </ThemeProvider>
  </StrictMode>,
)
