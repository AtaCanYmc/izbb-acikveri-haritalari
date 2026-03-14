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
                name: 'İzmir Nöbetçi Eczane Haritası',
                short_name: 'Nöbetçi Eczane İzmir',
                description: 'İzmir günlük nöbetçi eczane haritası.',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'web-app-manifest-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'web-app-manifest-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    base: '/'
})
