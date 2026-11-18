import {X, Copy, Check, ExternalLink} from 'lucide-react';
import {useState, useEffect} from 'react';
import clsx from 'clsx';

interface DeveloperDocsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
}

const CodeBlock = ({code, isDarkMode}: { code: string, isDarkMode: boolean }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group mt-2 mb-4">
            <div className="absolute right-2 top-2 z-10">
                <button
                    type="button"
                    onClick={handleCopy}
                    aria-label="Kodu kopyala"
                    className={clsx(
                        "p-2 rounded-lg transition-colors flex items-center justify-center min-w-[36px] min-h-[36px]",
                        isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-white hover:bg-slate-100 text-slate-700 shadow-xs border border-slate-200"
                    )}
                    title="Kodu kopyala"
                >
                    {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                </button>
            </div>
            <pre className={clsx(
                "p-4 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed border custom-scrollbar",
                isDarkMode ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
            )}>
                <code>{code}</code>
            </pre>
        </div>
    );
};

export const DeveloperDocsModal = ({isOpen, onClose, isDarkMode}: DeveloperDocsModalProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dev-docs-modal-title"
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Box */}
            <div className={clsx(
                "relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border z-10 overscroll-contain",
                isDarkMode ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"
            )}>
                {/* Header */}
                <div className={clsx(
                    "flex items-center justify-between p-4 sm:p-5 border-b shrink-0",
                    isDarkMode ? "border-slate-800" : "border-slate-100"
                )}>
                    <div>
                        <h2 id="dev-docs-modal-title" className="text-lg font-bold tracking-tight">
                            Geliştirici Dokümantasyonu
                        </h2>
                        <p className={clsx("text-xs mt-0.5", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                            İzmir Açık Veri Portalı API servislerini kendi projelerinizde kullanın.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Kapat"
                        className={clsx(
                            "p-2 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center",
                            isDarkMode ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                        )}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar text-xs leading-relaxed">
                    <section>
                        <h3 className="font-bold text-sm mb-1.5 flex items-center justify-between">
                            <span>izmir-open-data-js SDK</span>
                            <a 
                                href="https://www.npmjs.com/package/izmir-open-data-js" 
                                target="_blank" 
                                rel="noreferrer noopener"
                                className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:underline font-mono text-[11px]"
                            >
                                npm sayfası <ExternalLink size={12} />
                            </a>
                        </h3>
                        <p className={isDarkMode ? "text-slate-400" : "text-slate-600"}>
                            Bu harita projesinin veri katmanını besleyen, İzmir Büyükşehir Belediyesi Açık Veri Portalı için geliştirilmiş tip güvenli (TypeScript) açık kaynak API kütüphanesidir.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-sm mb-1.5">Kurulum</h3>
                        <p className={clsx("mb-2", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                            Projenize npm, pnpm veya yarn ile ekleyebilirsiniz:
                        </p>
                        <CodeBlock 
                            code="npm install izmir-open-data-js" 
                            isDarkMode={isDarkMode} 
                        />
                    </section>

                    <section>
                        <h3 className="font-bold text-sm mb-1.5">Örnek Kullanım</h3>
                        <p className={clsx("mb-2", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                            SDK asenkron Promise tabanlıdır:
                        </p>
                        <CodeBlock 
                            code={`import { IzmirClient } from "izmir-open-data-js";

// Nöbetçi eczaneleri çekme
const pharmacies = await IzmirClient.eczaneler.getNobetciList();
console.log(pharmacies[0].Adi, pharmacies[0].Telefon);

// Otopark doluluk oranlarını sorgulama
const parkings = await IzmirClient.otopark.getList();
const alsancak = parkings.find(p => p.name.includes("Alsancak"));
console.log(alsancak?.occupancy?.total?.free);`}
                            isDarkMode={isDarkMode} 
                        />
                    </section>
                    
                    <section>
                        <h3 className="font-bold text-sm mb-2">Desteklenen Veri Servisleri</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                            {['Eczaneler', 'Otoparklar', 'Hastaneler', 'Kütüphaneler', 'WiZmirNET', 'Vapur İskeleleri', 'Afet Alanları', 'Müzeler', 'Tarihi Yapılar'].map((item) => (
                                <div
                                    key={item}
                                    className={clsx(
                                        'p-2 rounded-lg border flex items-center gap-1.5',
                                        isDarkMode ? 'bg-slate-800/60 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                                    )}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                                    <span className="truncate">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className={clsx(
                    "p-4 border-t shrink-0 flex justify-end",
                    isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-100 bg-slate-50/50"
                )}>
                    <button
                        type="button"
                        onClick={onClose}
                        className={clsx(
                            "px-4 py-2 rounded-lg font-semibold text-xs transition-colors min-h-[44px]",
                            isDarkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        )}
                    >
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
};
