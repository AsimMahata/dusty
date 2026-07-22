import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { SettingsProvider } from './contexts/SettingsContext.tsx'
import './index.css'
import { DustyProvider } from './contexts/DustyContext.tsx'
import { scan } from 'react-scan'

if (import.meta.env.DEV) {
    scan({
        enabled: true,
    })
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SettingsProvider>
                <BrowserRouter>
                    <DustyProvider>
                        <App />
                    </DustyProvider>
                </BrowserRouter>
        </SettingsProvider>
    </StrictMode>,
)
