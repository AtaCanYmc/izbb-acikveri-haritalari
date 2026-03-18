import {useState} from 'react';
import {Github, Heart, Linkedin, ChevronDown, ChevronUp} from 'lucide-react';
import clsx from 'clsx';

interface FooterProps {
    isDarkMode?: boolean;
}

const Footer = ({isDarkMode = false}: FooterProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const currentYear = new Date().getFullYear();

    return (
        <footer className={clsx(
            'border-t mt-auto transition-all duration-300',
            isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-100 bg-white'
        )}>
            {/* Tetikleyici Buton (Kullanıcı buraya basarak açar/kapatır) */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={clsx(
                    'w-full py-2 flex items-center justify-center transition-colors',
                    isDarkMode ? 'text-slate-500 hover:text-red-400' : 'text-slate-400 hover:text-red-500'
                )}
            >
                {isExpanded ? <ChevronDown size={20}/> : <ChevronUp size={20}/>}
                <span className="text-[9px] uppercase font-bold tracking-widest ml-2">
                    {isExpanded ? 'Gizle' : 'Hakkında'}
                </span>
            </button>

            {/* Açılır Panel */}
            <div className={`
                overflow-x-scroll transition-all duration-300 ease-in-out
                ${isExpanded ? 'max-h-150 opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <div className={clsx(
                    'p-6 pt-2 flex flex-col gap-4',
                    isDarkMode ? 'text-slate-300' : ''
                )}>
                    {/* Proje Bilgisi */}
                    <div>
                        <h3 className="text-[13px] text-red-600 font-medium tracking-wide mb-1">İzmir Açık Veri Haritası</h3>
                        <p className={clsx(
                            'text-[11px] font-medium tracking-wide',
                            isDarkMode ? 'text-slate-400' : ''
                        )}>
                            İzmir Büyükşehir Belediyesi açık veri portalındaki harita odaklı API uçlarını tek bir arayüzde
                            keşfetmeniz için geliştirilmiş açık kaynak bir projedir.
                        </p>
                        <p className={clsx(
                            'text-[11px] mt-1 italic',
                            isDarkMode ? 'text-slate-500' : 'text-slate-600'
                        )}>Not: Bu uygulama resmi bir kurum yayını değildir. Veriler doğrudan açık veri servislerinden alınır.</p>
                    </div>

                    {/* Veri Kaynağı */}
                    <div>
                        <h3 className="text-[13px] text-red-600 font-medium tracking-wide mb-1">Veri Kaynağı</h3>
                        <p className={clsx(
                            'text-[11px] font-medium tracking-wide mb-1',
                            isDarkMode ? 'text-slate-400' : ''
                        )}>Seçtiğiniz veri kümesine göre içerik dinamik olarak yüklenir.</p>
                        <a
                            href="https://acikveri.bizizmir.com"
                            target="_blank"
                            className={clsx(
                                'text-[8px] hover:underline flex items-center gap-1',
                                isDarkMode ? 'text-blue-400' : 'text-blue-500'
                            )}
                        >
                            İzmir Büyükşehir Belediyesi Açık Veri Portalı
                        </a>
                    </div>

                    {/* Geliştirici Bilgisi */}
                    <div className={clsx(
                        'flex items-center gap-2 mt-3',
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    )}>
                        <span className="text-[8px] font-medium tracking-wide uppercase">Geliştirici:</span>
                        <a
                            href="https://github.com/AtaCanYmc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={clsx(
                                'text-[8px] font-bold transition-colors underline decoration-offset-4',
                                isDarkMode
                                    ? 'text-slate-300 hover:text-red-400'
                                    : 'text-slate-900 hover:text-red-600 decoration-slate-200'
                            )}
                        >
                            Ata Can Yaymacı
                        </a>
                    </div>

                    {/* Alt Kısım: İkonlar ve Telif */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3">
                            <a href="https://github.com/AtaCanYmc/izbb-acikveri-haritalari" target="_blank"
                               className={clsx(
                                   'transition-colors',
                                   isDarkMode
                                       ? 'text-slate-500 hover:text-slate-300'
                                       : 'text-slate-400 hover:text-slate-900'
                               )}>
                                <Github size={16}/>
                            </a>
                            <a href="https://www.linkedin.com/in/ata-can-yaymacı/"
                               className={clsx(
                                   'transition-colors',
                                   isDarkMode
                                       ? 'text-slate-500 hover:text-slate-300'
                                       : 'text-slate-400 hover:text-slate-900'
                               )} target="_blank">
                                <Linkedin size={16}/>
                            </a>
                        </div>

                        <div className={clsx(
                            'flex items-center gap-1 text-[10px] font-medium',
                            isDarkMode ? 'text-slate-500' : 'text-slate-400'
                        )}>
                            <span>{currentYear}</span>
                            <span>•</span>
                            <span>İzmir</span>
                            <Heart size={10} className="text-red-500 fill-red-500"/>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;