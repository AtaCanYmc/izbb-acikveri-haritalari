import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'İzmir Açık Veri Haritaları',
                short_name: 'İzmir Haritaları',
                description: 'İzmir Büyükşehir Belediyesi\'nin 37 farklı açık veri haritasını interaktif olarak keşfedin.',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/izbb-acikveri-haritalari/',
                start_url: '/izbb-acikveri-haritalari/',
                icons: [
                    {
                        src: 'web-app-manifest-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: 'web-app-manifest-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    }
                ],
                categories: ['maps', 'utilities', 'productivity'],
                screenshots: [
                    {
                        src: 'web-app-manifest-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        form_factor: 'wide'
                    }
                ]
            }
        })
    ],
    base: '/izbb-acikveri-haritalari/'
})
