import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import clsx from 'clsx';

// Type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
}

export const PwaInstallPrompt = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already dismissed or installed
        const hasDismissed = localStorage.getItem('pwa-prompt-dismissed') === 'true';
        
        // Listen for the install prompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Update UI to notify the user they can add to home screen
            if (!hasDismissed) {
                // Short delay so it doesn't immediately pop up over other initial loading
                setTimeout(() => setIsVisible(true), 2000);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if app is already installed
        window.addEventListener('appinstalled', () => {
            setIsVisible(false);
            setDeferredPrompt(null);
            console.log('PWA was installed');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className={clsx(
                "p-4 rounded-2xl shadow-2xl border flex items-start gap-4",
                isDarkMode 
                    ? "bg-slate-800 border-izmir-800 text-white" 
                    : "bg-white border-izmir-200 text-slate-800"
            )}>
                <div className={clsx(
                    "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                    isDarkMode ? "bg-izmir-900/50 text-izmir-400" : "bg-izmir-100 text-izmir-600"
                )}>
                    <Download size={24} />
                </div>
                
                <div className="flex-1 pt-1">
                    <h3 className="font-bold text-sm mb-1">Uygulamayı İndir</h3>
                    <p className={clsx("text-xs leading-relaxed mb-3", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                        İzmir Açık Veri Haritaları'nı telefonunuza ekleyerek nöbetçi eczaneler ve haritalara anında erişin.
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleInstallClick}
                            className="flex-1 bg-izmir-600 hover:bg-izmir-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Ana Ekrana Ekle
                        </button>
                    </div>
                </div>

                <button 
                    onClick={handleDismiss}
                    className={clsx(
                        "absolute top-3 right-3 p-1 rounded-md transition-colors",
                        isDarkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-400"
                    )}
                    aria-label="Kapat"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};
