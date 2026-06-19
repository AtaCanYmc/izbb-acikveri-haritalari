/// <reference types="vite-plugin-pwa/client" />
interface Window {
    plausible?: (eventName: string, options?: { props: Record<string, string | number | boolean> }) => void;
}
