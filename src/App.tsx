import {useEffect, useState} from 'react';
import {OpenDataMapPage} from "./features/maps/pages/OpenDataMapPage.tsx";
import {PwaInstallPrompt} from "./components/PwaInstallPrompt.tsx";

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

    const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
        const storedContrast = localStorage.getItem('open-data-contrast');
        if (storedContrast === 'high') {
            return true;
        }
        if (storedContrast === 'normal') {
            return false;
        }
        return window.matchMedia('(prefers-contrast: more)').matches;
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

    useEffect(() => {
        const root = document.documentElement;
        if (isHighContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }
        localStorage.setItem('open-data-contrast', isHighContrast ? 'high' : 'normal');
    }, [isHighContrast]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    const toggleHighContrast = () => {
        setIsHighContrast((prev) => !prev);
    };

    return (
        <>
            <OpenDataMapPage
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
                isHighContrast={isHighContrast}
                onToggleHighContrast={toggleHighContrast}
            />
            <PwaInstallPrompt isDarkMode={isDarkMode} />
        </>
    );
}

export default App
