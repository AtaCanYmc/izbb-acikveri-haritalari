import {useState} from 'react';
import {Github, Heart, Linkedin, ChevronDown, ChevronUp} from 'lucide-react';

const Footer = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-100 bg-white mt-auto transition-all duration-300">
            {/* Tetikleyici Buton (Kullanıcı buraya basarak açar/kapatır) */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-2 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
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
                <div className="p-6 pt-2 flex flex-col gap-4">
                    {/* Proje Bilgisi */}
                    <div>
                        <h3 className="text-[13px] text-red-600 font-medium tracking-wide mb-1">İzmir Açık Veri Haritası</h3>
                        <p className="text-[11px] font-medium tracking-wide">
                            İzmir Büyükşehir Belediyesi açık veri portalındaki harita odaklı API uçlarını tek bir arayüzde
                            keşfetmeniz için geliştirilmiş açık kaynak bir projedir.
                        </p>
                        <p className="text-[11px] mt-1 italic">Not: Bu uygulama resmi bir kurum yayını değildir. Veriler doğrudan açık veri servislerinden alınır.</p>
                    </div>

                    {/* Veri Kaynağı */}
                    <div>
                        <h3 className="text-[13px] text-red-600 dark:text-red-500 font-medium tracking-wide mb-1">Veri Kaynağı</h3>
                        <p className="text-[11px] font-medium tracking-wide dark:text-slate-300 mb-1">Seçtiğiniz veri kümesine göre içerik dinamik olarak yüklenir.</p>
                        <a
                            href="https://acikveri.bizizmir.com"
                            target="_blank"
                            className="text-[8px] text-blue-400 dark:text-blue-300 hover:underline flex items-center gap-1"
                        >
                            İzmir Büyükşehir Belediyesi Açık Veri Portalı
                        </a>
                    </div>

                    {/* Geliştirici Bilgisi */}
                    <div className="flex items-center gap-2 text-slate-500 mt-3">
                        <span className="text-[8px] font-medium tracking-wide uppercase">Geliştirici:</span>
                        <a
                            href="https://github.com/AtaCanYmc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[8px] font-bold text-slate-900 hover:text-red-600 transition-colors underline decoration-slate-200 underline-offset-4"
                        >
                            Ata Can Yaymacı
                        </a>
                    </div>

                    {/* Alt Kısım: İkonlar ve Telif */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3">
                            <a href="https://github.com/AtaCanYmc/izbb-acikveri-haritalari" target="_blank"
                               className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                                <Github size={16}/>
                            </a>
                            <a href="https://www.linkedin.com/in/ata-can-yaymacı/"
                               className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors" target="_blank">
                                <Linkedin size={16}/>
                            </a>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
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