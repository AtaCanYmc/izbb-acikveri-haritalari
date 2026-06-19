import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon/favicon.ico', 'favicon/apple-touch-icon.png', 'favicon/mask-icon.svg'],
            manifest: {
                name: 'İzmir Açık Veri Haritaları',
                short_name: 'İzmir Haritaları',
                description: 'İzmir Büyükşehir Belediyesi\'nin 36 farklı açık veri haritasını interaktif olarak keşfedin.',
                theme_color: '#0284c7',
                background_color: '#0284c7',
                display: 'standalone',
                scope: '/izbb-acikveri-haritalari/',
                start_url: '/izbb-acikveri-haritalari/',
                icons: [
                    {
                        src: 'favicon/web-app-manifest-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: 'favicon/web-app-manifest-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    }
                ],
                categories: ['maps', 'utilities', 'productivity'],
                screenshots: [
                    {
                        src: 'favicon/web-app-manifest-512x512.png',
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
