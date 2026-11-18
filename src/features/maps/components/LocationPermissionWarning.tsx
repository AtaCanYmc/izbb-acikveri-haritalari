import {MapPinOff, X} from 'lucide-react';
import {clsx} from 'clsx';

interface LocationPermissionWarningProps {
    isVisible: boolean;
    onClose: () => void;
    onRetry: () => void;
    isDarkMode?: boolean;
}

export const LocationPermissionWarning = ({isVisible, onClose, onRetry, isDarkMode = false}: LocationPermissionWarningProps) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="absolute top-20 left-4 right-4 md:left-auto md:right-8 md:w-80 z-[2000] animate-in fade-in slide-in-from-top-4">
            <div className={clsx(
                'backdrop-blur-md p-5 rounded-2xl shadow-xl relative transition-colors border',
                isDarkMode
                    ? 'bg-slate-900/95 border-slate-700'
                    : 'bg-white/95 border-slate-200'
            )}>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Uyarıyı kapat"
                    className={clsx(
                        'absolute top-3.5 right-3.5 p-1.5 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center',
                        isDarkMode
                            ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    )}
                >
                    <X size={18}/>
                </button>

                <div className="flex items-start gap-3.5 pr-6">
                    <div className={clsx(
                        'p-2.5 rounded-xl shrink-0',
                        isDarkMode ? 'bg-sky-950 text-sky-400 border border-sky-800' : 'bg-sky-50 text-sky-700 border border-sky-200'
                    )}>
                        <MapPinOff size={20}/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className={clsx(
                            'font-bold text-sm tracking-tight',
                            isDarkMode ? 'text-slate-100' : 'text-slate-900'
                        )}>Konum Erişimi Kapalı</h4>
                        <p className={clsx(
                            'text-xs mt-1 leading-relaxed',
                            isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        )}>
                            Size en yakın noktaları harita üzerinde görebilmek için tarayıcınızdan konum izni verebilirsiniz.
                        </p>
                    </div>
                </div>

                <div className={clsx(
                    'mt-3.5 p-3 rounded-xl border text-xs leading-relaxed',
                    isDarkMode ? 'bg-slate-800/80 border-slate-700/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                )}>
                    <p className="font-semibold text-[11px] mb-1">Mobil tarayıcılar için:</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Adres çubuğundaki kilit / ayarlar simgesine dokunup konum erişimine izin verebilirsiniz.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onRetry}
                    className="w-full mt-3 py-2.5 px-3 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition-colors min-h-[44px]"
                >
                    Tekrar Dene
                </button>
            </div>
        </div>
    );
};

