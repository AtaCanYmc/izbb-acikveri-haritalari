import {X, Copy, Check, ExternalLink} from 'lucide-react';
import {useState} from 'react';
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
                    onClick={handleCopy}
                    className={clsx(
                        "p-1.5 rounded-md transition-colors",
                        isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-slate-200 hover:bg-slate-300 text-slate-600"
                    )}
                    title="Kodu kopyala"
                >
                    {copied ? <Check size={14}/> : <Copy size={14}/>}
                </button>
            </div>
            <pre className={clsx(
                "p-4 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed",
                isDarkMode ? "bg-slate-900 text-slate-300" : "bg-slate-100 text-slate-800"
            )}>
                <code>{code}</code>
            </pre>
        </div>
    );
};

export const DeveloperDocsModal = ({isOpen, onClose, isDarkMode}: DeveloperDocsModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-black/50 animate-in fade-in duration-200">
            <div className={clsx(
                "w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200",
                isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
            )}>
                <div className={clsx(
                    "flex items-center justify-between p-4 sm:p-6 border-b",
                    isDarkMode ? "border-slate-700" : "border-slate-100"
                )}>
                    <div>
                        <h2 className={clsx("text-xl font-bold flex items-center gap-2", isDarkMode ? "text-white" : "text-slate-900")}>
                            Geliştiriciler İçin
                        </h2>
                        <p className={clsx("text-sm mt-1", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                            İzmir Açık Veri Portalı API'sini projelerinizde kullanın.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={clsx(
                            "p-2 rounded-full transition-colors",
                            isDarkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"
                        )}
                    >
                        <X size={24}/>
                    </button>
                </div>

                <div className={clsx(
                    "flex-1 overflow-y-auto p-4 sm:p-6 space-y-6",
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                )}>
                    <section>
                        <h3 className={clsx("text-lg font-semibold mb-2", isDarkMode ? "text-white" : "text-slate-900")}>izmir-open-data-js SDK</h3>
                        <p className="text-sm leading-relaxed mb-4">
                            Bu harita projesinin altyapısını oluşturan, İzmir Büyükşehir Belediyesi Açık Veri Portalı için gayriresmi ancak güçlü ve tip güvenli (TypeScript) bir API istemcisidir.
                        </p>
                        
                        <div className="flex gap-4 items-center">
                            <a 
                                href="https://www.npmjs.com/package/izmir-open-data-js" 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-izmir-600 hover:text-izmir-700 font-medium"
                            >
                                NPM Sayfası <ExternalLink size={14}/>
                            </a>
                        </div>
                    </section>

                    <section>
                        <h3 className={clsx("text-lg font-semibold mb-2", isDarkMode ? "text-white" : "text-slate-900")}>Kurulum</h3>
                        <p className="text-sm mb-2">Projenize NPM, Yarn, PNPM veya Bun kullanarak kurabilirsiniz:</p>
                        <CodeBlock 
                            code="npm install izmir-open-data-js" 
                            isDarkMode={isDarkMode} 
                        />
                    </section>

                    <section>
                        <h3 className={clsx("text-lg font-semibold mb-2", isDarkMode ? "text-white" : "text-slate-900")}>Örnek Kullanım</h3>
                        <p className="text-sm mb-2">SDK'yı projenize import edip anında verilere erişmeye başlayabilirsiniz. Promise tabanlıdır.</p>
                        <CodeBlock 
                            code={`import { IzmirClient } from "izmir-open-data-js";\n\n// Nöbetçi Eczaneleri Getir\nconst pharmacies = await IzmirClient.eczaneler.getNobetciList();\nconsole.log(pharmacies[0].Adi, pharmacies[0].Telefon);\n\n// Otopark Doluluk Oranlarını Getir\nconst parkings = await IzmirClient.otopark.getList();\nconst alsancak = parkings.find(p => p.name.includes("Alsancak"));\nconsole.log(alsancak.occupancy.total.free);`}
                            isDarkMode={isDarkMode} 
                        />
                    </section>
                    
                    <section>
                        <h3 className={clsx("text-lg font-semibold mb-2", isDarkMode ? "text-white" : "text-slate-900")}>Desteklenen Servisler</h3>
                        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm mt-3">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-izmir-500"></span>Eczaneler</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-izmir-500"></span>Otoparklar</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-izmir-500"></span>Ulaşım (ESHOT)</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-izmir-500"></span>Sağlık Tesisleri</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-izmir-500"></span>WizmirNET</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-izmir-500"></span>BİSİM (Bisiklet)</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-izmir-500"></span>Vapur İskeleleri</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-izmir-500"></span>Kültür / Sanat</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-izmir-500"></span>Tarihi Yapılar</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};
