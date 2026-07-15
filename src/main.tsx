import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { SettingsProvider } from './contexts/SettingsContext.tsx'
import './index.css'
import { DefaultProvider } from './contexts/defaultContext.tsx'
import { DustyProvider } from './contexts/DustyContext.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SettingsProvider>
            <DefaultProvider>
                <BrowserRouter>
                    <DustyProvider>
                        <App />
                    </DustyProvider>
                </BrowserRouter>
            </DefaultProvider>
        </SettingsProvider>
    </StrictMode>,
)
