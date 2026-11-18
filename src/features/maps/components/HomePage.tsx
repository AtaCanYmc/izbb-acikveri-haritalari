import {useState, useMemo} from 'react';
import {Search, X, Layers, Sun, Moon, ArrowRight, ExternalLink, Activity, ShieldAlert, Car, Wifi} from 'lucide-react';
import clsx from 'clsx';
import {mapRegistry} from '../config/mapRegistry.ts';
import {getCategoryConfig} from '../utils/categoryMeta.ts';
import {resolveAssetUrl} from '../../../utils/assetUtils.ts';

interface HomePageProps {
    onSelectMap: (mapId: string) => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

const FEATURED_MAP_IDS = [
    {
        id: 'nobetci-eczaneler',
        badge: 'Canlı Nöbetçi Listesi',
        badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
        icon: Activity,
        accentGrad: 'from-emerald-500/20 via-teal-500/10 to-transparent',
        cta: 'Nöbetçileri Gör',
    },
    {
        id: 'afet-toplanma-alanlari',
        badge: 'Hayati Afet Bilgisi',
        badgeColor: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30',
        icon: ShieldAlert,
        accentGrad: 'from-amber-500/20 via-orange-500/10 to-transparent',
        cta: 'Güvenli Alanı Bul',
    },
    {
        id: 'otoparklar',
        badge: 'Canlı Doluluk',
        badgeColor: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
        icon: Car,
        accentGrad: 'from-sky-500/20 via-blue-500/10 to-transparent',
        cta: 'Otoparkları İncele',
    },
    {
        id: 'wizmirnet',
        badge: 'Ücretsiz Belediye İnterneti',
        badgeColor: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
        icon: Wifi,
        accentGrad: 'from-cyan-500/20 via-teal-500/10 to-transparent',
        cta: 'Bağlantı Noktaları',
    },
];

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

    // Quick filter presets
    const quickFilters = ['Nöbetçi Eczaneler', 'Afet Alanları', 'Otoparklar', 'WiZmirNET', 'Vapur'];

    return (
        <div className={clsx(
            'min-h-screen flex flex-col transition-colors duration-200',
            isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/70 text-slate-900'
        )}>
            {/* Top Navigation */}
            <header className={clsx(
                'sticky top-0 z-40 border-b backdrop-blur-xl transition-colors',
                isDarkMode ? 'bg-slate-950/85 border-slate-800/80' : 'bg-white/85 border-slate-200/80 shadow-sm'
            )}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={resolveAssetUrl('logo.svg')}
                            alt="İzmir Açık Veri Haritaları"
                            className="w-10 h-10 object-contain rounded-xl shadow-md ring-1 ring-sky-500/20"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base sm:text-lg font-bold tracking-tight">İzmir Açık Veri Harita Atlası</h1>
                                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border border-sky-300/60 dark:border-sky-800">
                                    Resmi İzBB Verileri
                                </span>
                            </div>
                            <p className={clsx('text-xs hidden sm:block', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                                36 belediye açık veri katmanı ve anlık sorgulama
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <div className={clsx(
                            'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono',
                            isDarkMode ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-100/80 border-slate-200 text-slate-600'
                        )}>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>36 Katman Çevrimiçi</span>
                        </div>

                        <a
                            href="https://acikveri.bizizmir.com"
                            target="_blank"
                            rel="noreferrer"
                            className={clsx(
                                'hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors min-h-[44px]',
                                isDarkMode
                                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            )}
                            title="İzmir Büyükşehir Belediyesi Açık Veri Portalı"
                        >
                            <span>acikveri.bizizmir.com</span>
                            <ExternalLink size={13} className="opacity-70" />
                        </a>

                        <button
                            type="button"
                            onClick={onToggleTheme}
                            aria-label={isDarkMode ? 'Açık temaya geç' : 'Koyu temaya geç'}
                            className={clsx(
                                'h-11 w-11 rounded-xl border flex items-center justify-center transition-colors',
                                isDarkMode
                                    ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                            )}
                        >
                            {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-12">
                {/* Hero Showcase Section */}
                <section className={clsx(
                    'relative overflow-hidden rounded-3xl border p-6 sm:p-10 transition-colors shadow-sm',
                    isDarkMode
                        ? 'bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border-slate-800'
                        : 'bg-gradient-to-br from-white via-sky-50/40 to-slate-50 border-sky-100'
                )}>
                    {/* Background decorative glows */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-7 space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                                <span>T.C. İZMİR BÜYÜKŞEHİR BELEDİYESİ AÇIK VERİ KATALOĞU</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
                                İzmir&apos;in Şehir Verilerini <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-500 dark:from-sky-400 dark:to-teal-300">Haritada Keşfedin</span>
                            </h2>

                            <p className={clsx(
                                'text-sm sm:text-base leading-relaxed max-w-2xl',
                                isDarkMode ? 'text-slate-300' : 'text-slate-600'
                            )}>
                                Sağlık kurumlarından otopark canlı doluluğuna, afet toplanma alanlarından WiZmirNET noktalarına kadar 36 belediye katmanını tek harita üzerinde anlık sorgulayın ve yol tarifi alın.
                            </p>

                            {/* Search Box */}
                            <div className="space-y-3 pt-2">
                                <div className="relative max-w-xl">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                        <Search size={20} />
                                    </div>
                                    <input
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Harita ara: eczane, otopark, toplanma alanı, vapur, kütüphane..."
                                        className={clsx(
                                            'w-full pl-12 pr-12 py-4 rounded-2xl border text-sm sm:text-base font-medium outline-none transition-all shadow-md',
                                            isDarkMode
                                                ? 'bg-slate-900/90 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20'
                                                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20'
                                        )}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            aria-label="Aramayı temizle"
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>

                                {/* Quick filter tags */}
                                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                    <span className={clsx('font-medium mr-1', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                                        Hızlı arama:
                                    </span>
                                    {quickFilters.map((term) => (
                                        <button
                                            key={term}
                                            type="button"
                                            onClick={() => setSearchQuery(term)}
                                            className={clsx(
                                                'px-2.5 py-1 rounded-lg border transition-colors',
                                                isDarkMode
                                                    ? 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                                                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                                            )}
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Visual Showcase Graphic */}
                        <div className="lg:col-span-5 flex justify-center items-center">
                            <div className={clsx(
                                'relative w-full max-w-md p-6 rounded-3xl border flex flex-col items-center justify-center text-center shadow-lg backdrop-blur-sm',
                                isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/90 border-sky-100'
                            )}>
                                <div className="w-full max-h-56 flex items-center justify-center overflow-hidden mb-4">
                                    <img
                                        src={resolveAssetUrl('images/illustrations/smart_city.svg')}
                                        alt="İzmir Akıllı Şehir Açık Veri Haritaları"
                                        className="w-full h-auto max-h-52 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex items-center gap-4 text-xs font-mono">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xl font-bold text-sky-600 dark:text-sky-400">36</span>
                                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Veri Katmanı</span>
                                    </div>
                                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                                    <div className="flex flex-col items-center">
                                        <span className="text-xl font-bold text-teal-600 dark:text-teal-400">11</span>
                                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Kategori</span>
                                    </div>
                                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                                    <div className="flex flex-col items-center">
                                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">30</span>
                                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>İlçe Kapsamı</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vital Citizen Services (Featured Quick Access) */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
                                <span>Öne Çıkan & Acil Vatandaş Hizmetleri</span>
                            </h3>
                            <p className={clsx('text-xs mt-0.5', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                                En çok ihtiyaç duyulan belediye harita katmanlarına tek dokunuşla ulaşın
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {FEATURED_MAP_IDS.map((featured) => {
                            const map = mapRegistry.find((m) => m.id === featured.id);
                            if (!map) return null;
                            const catConfig = getCategoryConfig(map.category);
                            const IconComponent = featured.icon;

                            return (
                                <button
                                    key={featured.id}
                                    type="button"
                                    onClick={() => onSelectMap(map.id)}
                                    className={clsx(
                                        'group relative p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 min-h-[200px]',
                                        isDarkMode
                                            ? 'bg-slate-900 border-slate-800 hover:border-sky-500/50'
                                            : 'bg-white border-slate-200/90 hover:border-sky-400'
                                    )}
                                >
                                    <div className={clsx('absolute top-0 right-0 w-36 h-36 bg-gradient-to-br rounded-bl-full pointer-events-none opacity-60', featured.accentGrad)} />

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <div className="w-12 h-12 rounded-2xl p-2.5 flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                                                <img
                                                    src={catConfig.iconUrl}
                                                    alt={catConfig.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full border', featured.badgeColor)}>
                                                {featured.badge}
                                            </span>
                                        </div>

                                        <h4 className="font-bold text-base tracking-tight mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                            {map.title}
                                        </h4>
                                        <p className={clsx('text-xs line-clamp-2 leading-relaxed mb-4', isDarkMode ? 'text-slate-400' : 'text-slate-600')}>
                                            {map.description}
                                        </p>
                                    </div>

                                    <div className="relative z-10 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                                        <span className="flex items-center gap-1.5">
                                            <IconComponent size={14} />
                                            <span>{featured.cta}</span>
                                        </span>
                                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Category Navigation Bar */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-bold tracking-tight">Kategorilere Göre Keşfet</h3>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                            {filteredMaps.length} harita katmanı
                        </span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {categories.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            const count = cat === 'all'
                                ? mapRegistry.length
                                : mapRegistry.filter((m) => m.category === cat).length;
                            const label = cat === 'all' ? 'Tüm Katmanlar' : cat;
                            const catConfig = getCategoryConfig(cat);

                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={clsx(
                                        'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 min-h-[44px] border shadow-xs',
                                        isSelected
                                            ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                                            : isDarkMode
                                                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80'
                                    )}
                                >
                                    {cat !== 'all' ? (
                                        <span className="w-5 h-5 rounded-md p-0.5 flex items-center justify-center bg-white dark:bg-slate-800 shrink-0">
                                            <img
                                                src={catConfig.iconUrl}
                                                alt=""
                                                aria-hidden="true"
                                                className="w-full h-full object-contain"
                                            />
                                        </span>
                                    ) : (
                                        <Layers size={14} className={isSelected ? 'text-white' : 'text-sky-600 dark:text-sky-400'} />
                                    )}
                                    <span>{label}</span>
                                    <span className={clsx(
                                        'px-1.5 py-0.5 rounded-md text-[10px] font-mono',
                                        isSelected
                                            ? 'bg-sky-700 text-white'
                                            : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                                    )}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Empty State */}
                {filteredMaps.length === 0 && (
                    <div className={clsx(
                        'p-12 text-center rounded-3xl border my-8 max-w-lg mx-auto shadow-sm',
                        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    )}>
                        <img
                            src={resolveAssetUrl('images/illustrations/open_data_mesh.svg')}
                            alt="Sonuç bulunamadı"
                            className="w-40 h-auto mx-auto mb-4 opacity-80"
                        />
                        <h3 className="font-bold text-base mb-1">Arama kriterlerine uygun harita bulunamadı</h3>
                        <p className={clsx('text-xs max-w-sm mx-auto mb-5 leading-relaxed', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                            Farklı bir anahtar kelime deneyin veya kategori filtresini sıfırlayın.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                            }}
                            className="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition-colors min-h-[44px]"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                )}

                {/* Map Grid by Group */}
                {Object.entries(groupedMaps).map(([category, maps]) => {
                    const catConfig = getCategoryConfig(category);

                    return (
                        <section key={category} className="space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center">
                                        <img
                                            src={catConfig.iconUrl}
                                            alt={category}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg tracking-tight">{category}</h3>
                                        <p className={clsx('text-xs hidden sm:block', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>
                                            {catConfig.description}
                                        </p>
                                    </div>
                                </div>
                                <span className={clsx('text-xs px-2.5 py-1 rounded-full font-mono border', catConfig.badgeClass)}>
                                    {maps.length} harita
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {maps.map((map) => (
                                    <div
                                        key={map.id}
                                        className={clsx(
                                            'group rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5',
                                            isDarkMode
                                                ? 'bg-slate-900 border-slate-800 hover:border-sky-500/60'
                                                : 'bg-white border-slate-200/90 hover:border-sky-400',
                                            catConfig.borderHoverClass
                                        )}
                                    >
                                        {/* Card Visual Header Banner */}
                                        <div className={clsx(
                                            'relative h-24 px-4 py-3 bg-gradient-to-r flex items-center justify-between overflow-hidden border-b',
                                            catConfig.headerGradient,
                                            isDarkMode ? 'border-slate-800/80' : 'border-slate-100'
                                        )}>
                                            {/* Micro-contour line illustration in background */}
                                            <div className="absolute inset-0 opacity-15 pointer-events-none">
                                                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                                    <defs>
                                                        <pattern id={`grid-${map.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                                                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.8" />
                                                        </pattern>
                                                    </defs>
                                                    <rect width="100%" height="100%" fill={`url(#grid-${map.id})`} />
                                                </svg>
                                            </div>

                                            <div className="relative z-10 flex items-center gap-2.5">
                                                <div className="w-11 h-11 rounded-xl p-2 bg-white dark:bg-slate-800 shadow-sm border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                    <img
                                                        src={catConfig.iconUrl}
                                                        alt={map.title}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-md border', catConfig.badgeClass)}>
                                                        {map.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="relative z-10 flex items-center">
                                                <a
                                                    href={map.sourceUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className={clsx(
                                                        'p-1.5 rounded-lg border text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors',
                                                        isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'
                                                    )}
                                                    title="İzBB Açık Veri Portalı Veri Seti"
                                                >
                                                    <ExternalLink size={13} />
                                                </a>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <div className="mb-4">
                                                <h4 className={clsx(
                                                    'font-bold text-base tracking-tight mb-2 leading-snug transition-colors line-clamp-1',
                                                    isDarkMode ? 'text-slate-100 group-hover:text-sky-400' : 'text-slate-900 group-hover:text-sky-600'
                                                )}>
                                                    {map.title}
                                                </h4>
                                                <p className={clsx(
                                                    'text-xs line-clamp-2 leading-relaxed',
                                                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                                )}>
                                                    {map.description}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                                <span className={clsx('text-[10px] truncate max-w-[170px]', isDarkMode ? 'text-slate-500' : 'text-slate-400')}>
                                                    {map.sourceLabel.split('•')[1]?.trim() || 'Açık Veri Seti'}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => onSelectMap(map.id)}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform min-h-[36px]"
                                                >
                                                    <span>Haritada Aç</span>
                                                    <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </main>

            {/* Comprehensive Civic Footer */}
            <footer className={clsx(
                'border-t mt-16 transition-colors',
                isDarkMode ? 'border-slate-800 bg-slate-950 text-slate-400' : 'border-slate-200 bg-white text-slate-600'
            )}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5">
                                <img
                                    src={resolveAssetUrl('logo.svg')}
                                    alt="İzmir Açık Veri Haritaları"
                                    className="w-8 h-8 object-contain"
                                />
                                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                                    İzmir Açık Veri Harita Atlası
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed max-w-sm">
                                İzmir Büyükşehir Belediyesi Açık Veri Portalı altyapısını kullanarak İzmir halkı ve şehir ziyaretçileri için hazırlanmış bağımsız açık kaynak coğrafi bilgi platformu.
                            </p>
                        </div>

                        <div className="space-y-2 text-xs">
                            <span className="font-bold text-slate-900 dark:text-slate-200 block mb-2">Veri & Kaynaklar</span>
                            <ul className="space-y-1.5">
                                <li>
                                    <a
                                        href="https://acikveri.bizizmir.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors inline-flex items-center gap-1"
                                    >
                                        <span>İzBB Açık Veri Portalı</span>
                                        <ExternalLink size={11} />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.izmir.bel.tr"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors inline-flex items-center gap-1"
                                    >
                                        <span>İzmir Büyükşehir Belediyesi</span>
                                        <ExternalLink size={11} />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/AtaCanYmc/izbb-acikveri-haritalari"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors inline-flex items-center gap-1"
                                    >
                                        <span>GitHub Açık Kaynak Deposu</span>
                                        <ExternalLink size={11} />
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-2 text-xs">
                            <span className="font-bold text-slate-900 dark:text-slate-200 block mb-2">Yasal Uyarı & Lisans</span>
                            <p className="text-xs leading-relaxed">
                                Harita katmanları ve konum bilgileri İzmir Büyükşehir Belediyesi tarafından sağlanan açık veri API servislerinden anlık olarak temin edilmektedir. Veriler Creative Commons Attribution (CC BY 4.0) ile lisanslanmıştır.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                        <p>
                            &copy; {new Date().getFullYear()} İzmir Açık Veri Haritaları. Tüm hakları İzmir halkına aittir.
                        </p>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Sistem durumu: 36/36 Katman Aktif</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
