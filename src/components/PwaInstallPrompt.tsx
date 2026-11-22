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
        let showTimerId: number | undefined;
        
        // Listen for the install prompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Update UI to notify the user they can add to home screen
            if (!hasDismissed) {
                // Short delay so it doesn't immediately pop up over other initial loading
                window.clearTimeout(showTimerId);
                showTimerId = window.setTimeout(() => setIsVisible(true), 2000);
            }
        };

        const handleAppInstalled = () => {
            window.clearTimeout(showTimerId);
            setIsVisible(false);
            setDeferredPrompt(null);
            console.log('PWA was installed');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.clearTimeout(showTimerId);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        
        try {
            // Show the install prompt
            await deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
        } catch (error) {
            console.error('PWA install prompt error:', error);
        } finally {
            // We've used the prompt, and can't use it again, throw it away
            setDeferredPrompt(null);
            setIsVisible(false);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('pwa-prompt-dismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className={clsx(
                "p-4 rounded-2xl shadow-xl border flex items-start gap-3.5",
                isDarkMode 
                    ? "bg-slate-900 border-slate-700 text-slate-100" 
                    : "bg-white border-slate-200 text-slate-900"
            )}>
                <div className={clsx(
                    "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                    isDarkMode ? "bg-sky-950 text-sky-400 border border-sky-800" : "bg-sky-50 text-sky-700 border border-sky-200"
                )}>
                    <Download size={20} />
                </div>
                
                <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="font-bold text-xs tracking-tight mb-1">Uygulama Olarak Yükle</h3>
                    <p className={clsx("text-xs leading-relaxed mb-3", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                        Ana ekranınıza ekleyerek haritalara tek dokunuşla ve çevrimdışı erişebilirsiniz.
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            type="button"
                            onClick={handleInstallClick}
                            className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold py-2.5 px-3 rounded-lg transition-colors min-h-[44px]"
                        >
                            Ana Ekrana Ekle
                        </button>
                    </div>
                </div>

                <button 
                    type="button"
                    onClick={handleDismiss}
                    className={clsx(
                        "p-1.5 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0",
                        isDarkMode ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                    )}
                    aria-label="Bildirimi kapat"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};
