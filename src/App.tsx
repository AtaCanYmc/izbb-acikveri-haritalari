import {useEffect, useState} from 'react';
import {OpenDataMapPage} from "./features/maps/pages/OpenDataMapPage.tsx";

function App() {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const storedTheme = localStorage.getItem('open-data-theme');
        if (storedTheme === 'dark') {
            return true;
        }
        if (storedTheme === 'light') {
            return false;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        // Trigger reflow to ensure CSS transitions work properly
        void root.offsetHeight;

        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('open-data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    return <OpenDataMapPage isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />;
}

export default App
