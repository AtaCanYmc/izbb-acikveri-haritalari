import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'leaflet/dist/leaflet.css';
import {registerSW} from 'virtual:pwa-register'
import {HelmetProvider} from 'react-helmet-async';

registerSW({immediate: true})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HelmetProvider>
            <App/>
        </HelmetProvider>
    </StrictMode>,
)
