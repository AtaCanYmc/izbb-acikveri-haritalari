import {useState, useMemo} from 'react';
import {Search, X, MapPin, Layers, Sun, Moon, ArrowUpRight} from 'lucide-react';
import clsx from 'clsx';
import {mapRegistry} from '../config/mapRegistry.ts';

interface HomePageProps {
    onSelectMap: (mapId: string) => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

export const HomePage = ({onSelectMap, isDarkMode, onToggleTheme}: HomePageProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = useMemo(() => {
        const unique = Array.from(new Set(mapRegistry.map((m) => m.category)));
        return ['all', ...unique];
    }, []);

    const filteredMaps = useMemo(() => {
        const q = searchQuery.toLocaleLowerCase('tr-TR').trim();
        return mapRegistry.filter((map) => {
            const matchesCategory = selectedCategory === 'all' || map.category === selectedCategory;
            const matchesSearch = !q ||
                map.title.toLocaleLowerCase('tr-TR').includes(q) ||
                map.description.toLocaleLowerCase('tr-TR').includes(q) ||
                map.category.toLocaleLowerCase('tr-TR').includes(q);
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    const groupedMaps = useMemo(() => {
        return filteredMaps.reduce(
            (acc, map) => {
                const category = map.category;
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(map);
                return acc;
            },
            {} as Record<string, typeof mapRegistry>
        );
    }, [filteredMaps]);

    return (
        <div className={clsx(
            'min-h-screen flex flex-col transition-colors duration-200',
            isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        )}>
            {/* Top Navigation */}
            <header className={clsx(
                'sticky top-0 z-40 border-b backdrop-blur-md transition-colors',
                isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
            )}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                            İZ
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold tracking-tight">İzmir Açık Veri Harita Atlası</h1>
                            <p className={clsx('text-xs hidden sm:block', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                                36 belediye açık veri katmanı tek arayüzde
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onToggleTheme}
                            aria-label={isDarkMode ? 'Açık temaya geç' : 'Koyu temaya geç'}
                            className={clsx(
                                'h-11 w-11 rounded-xl border flex items-center justify-center transition-colors',
                                isDarkMode
                                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            )}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
                {/* Search & Overview Hero */}
                <section className="mb-8">
                    <div className="mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                            Şehir Verilerini Haritada İnceleyin
                        </h2>
                        <p className={clsx('text-sm sm:text-base max-w-2xl', isDarkMode ? 'text-slate-300' : 'text-slate-600')}>
                            Sağlık kurumlarından otoparklara, afet toplanma alanlarından kültür merkezlerine kadar tüm belediye lokasyonlarını anlık olarak sorgulayın.
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="relative max-w-2xl mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Harita ara: eczane, otopark, kütüphane, vapur, pazar..."
                            className={clsx(
                                'w-full pl-10 pr-10 py-3.5 rounded-xl border text-sm font-medium outline-none transition-all shadow-sm',
                                isDarkMode
                                    ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
                                    : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
                            )}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                aria-label="Aramayı temizle"
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {categories.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            const count = cat === 'all'
                                ? mapRegistry.length
                                : mapRegistry.filter((m) => m.category === cat).length;
                            const label = cat === 'all' ? 'Tümü' : cat;

                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={clsx(
                                        'px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 min-h-[44px]',
                                        isSelected
                                            ? 'bg-sky-600 text-white shadow-sm'
                                            : isDarkMode
                                                ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                    )}
                                >
                                    <span>{label}</span>
                                    <span className={clsx(
                                        'px-1.5 py-0.5 rounded-md text-[10px] font-mono',
                                        isSelected
                                            ? 'bg-sky-700 text-white'
                                            : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                                    )}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Status Bar */}
                <div className={clsx(
                    'py-2 px-3 rounded-lg text-xs font-mono mb-6 flex items-center justify-between border',
                    isDarkMode ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                )}>
                    <span>{filteredMaps.length} harita katmanı listeleniyor</span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        İzBB API Çevrimiçi
                    </span>
                </div>

                {/* Empty State */}
                {filteredMaps.length === 0 && (
                    <div className={clsx(
                        'p-12 text-center rounded-2xl border my-8',
                        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    )}>
                        <MapPin size={36} className="mx-auto text-slate-400 mb-3" />
                        <h3 className="font-bold text-base mb-1">Arama kriterlerine uygun harita bulunamadı</h3>
                        <p className={clsx('text-xs max-w-sm mx-auto mb-4', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                            Farklı bir anahtar kelime deneyin veya kategori filtresini temizleyin.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                            }}
                            className="px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition-colors min-h-[44px]"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                )}

                {/* Map Grid by Group */}
                {Object.entries(groupedMaps).map(([category, maps]) => (
                    <section key={category} className="mb-10">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="font-bold text-lg tracking-tight flex items-center gap-2">
                                <Layers size={18} className="text-sky-600 dark:text-sky-400" />
                                {category}
                            </h3>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                {maps.length} harita
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {maps.map((map) => (
                                <button
                                    key={map.id}
                                    type="button"
                                    onClick={() => onSelectMap(map.id)}
                                    className={clsx(
                                        'group p-5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between min-h-[160px]',
                                        isDarkMode
                                            ? 'bg-slate-900 border-slate-800 hover:border-sky-500/60 hover:bg-slate-850'
                                            : 'bg-white border-slate-200 hover:border-sky-500 hover:shadow-md'
                                    )}
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className={clsx(
                                                'font-bold text-sm tracking-tight transition-colors line-clamp-1',
                                                isDarkMode ? 'text-slate-100 group-hover:text-sky-400' : 'text-slate-900 group-hover:text-sky-600'
                                            )}>
                                                {map.title}
                                            </h4>
                                            <ArrowUpRight size={16} className="text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                                        </div>

                                        <p className={clsx(
                                            'text-xs line-clamp-2 leading-relaxed mb-4',
                                            isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                        )}>
                                            {map.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                                        <span className={clsx(
                                            'px-2 py-0.5 rounded font-mono',
                                            isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                                        )}>
                                            {map.category}
                                        </span>
                                        <span className="font-semibold text-sky-600 dark:text-sky-400">
                                            Haritayı Görüntüle
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                ))}
            </main>

            {/* Simple Footer */}
            <footer className={clsx(
                'border-t py-6 px-4 text-center text-xs transition-colors',
                isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-500' : 'border-slate-200 bg-white text-slate-500'
            )}>
                <p>
                    Veri Kaynağı: İzmir Büyükşehir Belediyesi Açık Veri Portalı (acikveri.bizizmir.com) &bull; CC BY 4.0
                </p>
            </footer>
        </div>
    );
};
