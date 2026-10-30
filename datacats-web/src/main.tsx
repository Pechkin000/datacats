import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ReactGA from 'react-ga4'
import { ThemeProvider } from './components/layout/ThemeProvider.tsx'
import './styles/globals.css'
import App from './App.tsx'

ReactGA.initialize('G-WHJLEG19K8')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
