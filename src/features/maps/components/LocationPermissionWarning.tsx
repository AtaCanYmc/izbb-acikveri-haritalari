import {MapPinOff, X} from 'lucide-react';

interface LocationPermissionWarningProps {
    isVisible: boolean;
    onClose: () => void;
    onRetry: () => void;
}

export const LocationPermissionWarning = ({isVisible, onClose, onRetry}: LocationPermissionWarningProps) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="absolute top-20 left-4 right-4 md:left-auto md:right-8 md:w-80 z-[2000] animate-in fade-in slide-in-from-top-4">
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-5 rounded-[2rem] shadow-2xl border border-red-100 dark:border-red-900 relative group">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <X size={18}/>
                </button>

                <div className="flex items-start gap-4 pr-6">
                    <div className="bg-red-50 dark:bg-red-950 p-3 rounded-2xl text-red-600 dark:text-red-400">
                        <MapPinOff size={24}/>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Konum Erişimi Kapalı</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            Size yakın veri noktalarını daha rahat görebilmeniz için konum izni vermeniz önerilir.
                        </p>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-2xl">
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold mb-2 uppercase tracking-wider">iPhone (Safari) için:</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        Adres çubuğundaki <span className="font-bold">AA</span> veya <span className="font-bold">Kilit</span> ikonuna basıp
                        <span className="font-bold"> Web Sitesi Ayarları</span> bölümünden konum iznini açabilirsiniz.
                    </p>
                </div>

                <button
                    onClick={onRetry}
                    className="w-full mt-3 py-2 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-xl hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                >
                    Ayarları Tamamladım, Tekrar Dene
                </button>
            </div>
        </div>
    );
};

