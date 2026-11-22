import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon/favicon.ico', 'favicon/apple-touch-icon.png', 'favicon/favicon.svg'],
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/openapi\.izmir\.bel\.tr\/api\/.*/i,
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'izbb-open-data-api',
                            expiration: {
                                maxEntries: 60,
                                maxAgeSeconds: 24 * 60 * 60,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/([a-z0-9-]+\.)?(tile\.openstreetmap\.org|basemaps\.cartocdn\.com)\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'map-tiles-cache',
                            expiration: {
                                maxEntries: 250,
                                maxAgeSeconds: 7 * 24 * 60 * 60,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
            },
            manifest: {
                name: 'İzmir Açık Veri Haritaları',
                short_name: 'İzmir Haritaları',
                description: 'İzmir Büyükşehir Belediyesi\'nin 36 farklı açık veri haritasını interaktif olarak keşfedin.',
                theme_color: '#0284c7',
                background_color: '#0284c7',
                display: 'standalone',
                scope: '/',
                start_url: '/',
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
    base: '/'
})
