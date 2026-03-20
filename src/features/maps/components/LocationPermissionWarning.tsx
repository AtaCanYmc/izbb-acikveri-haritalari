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
                'backdrop-blur-md p-5 rounded-[2rem] shadow-2xl relative group transition-colors border',
                isDarkMode
                    ? 'bg-slate-800/95 border-red-900'
                    : 'bg-white/95 border-red-200'
            )}>
                <button
                    onClick={onClose}
                    className={clsx(
                        'absolute top-4 right-4 p-1 rounded-full transition-colors',
                        isDarkMode
                            ? 'text-slate-500 hover:text-slate-400 hover:bg-slate-700' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    )}
                >
                    <X size={18}/>
                </button>

                <div className="flex items-start gap-4 pr-6">
                    <div className={clsx(
                        'p-3 rounded-2xl',
                        isDarkMode ? 'bg-red-950 text-red-400' : 'bg-red-100 text-red-600'
                    )}>
                        <MapPinOff size={24}/>
                    </div>
                    <div className="flex-1">
                        <h4 className={clsx(
                            'font-bold text-sm',
                            isDarkMode ? 'text-slate-100' : 'text-slate-900'
                        )}>Konum Erişimi Kapalı</h4>
                        <p className={clsx(
                            'text-[11px] mt-1 leading-relaxed',
                            isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        )}>
                            Size yakın veri noktalarını daha rahat görebilmeniz için konum izni vermeniz önerilir.
                        </p>
                    </div>
                </div>

                <div className={clsx(
                    'mt-4 p-3 rounded-2xl',
                    isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                )}>
                    <p className={clsx(
                        'text-[10px] font-semibold mb-2 uppercase tracking-wider',
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    )}>iPhone (Safari) için:</p>
                    <p className={clsx(
                        'text-[10px] leading-tight',
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    )}>
                        Adres çubuğundaki <span className="font-bold">AA</span> veya <span className="font-bold">Kilit</span> ikonuna basıp
                        <span className="font-bold"> Web Sitesi Ayarları</span> bölümünden konum iznini açabilirsiniz.
                    </p>
                </div>

                <button
                    onClick={onRetry}
                    className={clsx(
                        'w-full mt-3 py-2 text-[10px] font-bold rounded-xl transition-colors',
                        isDarkMode
                            ? 'text-red-400 bg-red-950 hover:bg-red-900'
                            : 'text-red-700 bg-red-100 hover:bg-red-200'
                    )}
                >
                    Ayarları Tamamladım, Tekrar Dene
                </button>
            </div>
        </div>
    );
};

