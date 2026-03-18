import {MapPin, Database, Layers} from 'lucide-react';
import clsx from 'clsx';
import {mapRegistry} from '../config/mapRegistry.ts';

interface HomePageProps {
    onSelectMap: (mapId: string) => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

export const HomePage = ({onSelectMap, isDarkMode, onToggleTheme}: HomePageProps) => {
    const groupedMaps = mapRegistry.reduce(
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

    return (
        <div className={clsx(
            'min-h-screen transition-colors duration-300',
            isDarkMode ? 'bg-slate-950' : 'bg-white'
        )}>
            {/* Header */}
            <div className={clsx(
                'border-b',
                isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
            )}>
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className={clsx(
                                'text-4xl font-bold mb-2',
                                isDarkMode ? 'text-white' : 'text-slate-900'
                            )}>
                                İzmir Açık Veri Haritaları
                            </h1>
                            <p className={clsx(
                                'text-slate-600 dark:text-slate-400',
                                isDarkMode ? 'text-slate-400' : 'text-slate-600'
                            )}>
                                İzmir Büyükşehir Belediyesi'nin açık verilerini harita üzerinde keşfedin
                            </p>
                        </div>
                        <button
                            onClick={onToggleTheme}
                            className={clsx(
                                'h-12 w-12 rounded-full border transition-colors inline-flex items-center justify-center',
                                isDarkMode
                                    ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                            )}
                            title={isDarkMode ? 'Açık moda geç' : 'Koyu moda geç'}
                        >
                            {isDarkMode ? (
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="4" />
                                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className={clsx(
                        'p-6 rounded-2xl border',
                        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    )}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={clsx(
                                'p-3 rounded-lg',
                                isDarkMode ? 'bg-blue-950' : 'bg-blue-100'
                            )}>
                                <MapPin size={24} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                            </div>
                            <h3 className={clsx('font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>{mapRegistry.length}</h3>
                        </div>
                        <p className={clsx('text-sm', isDarkMode ? 'text-slate-400' : 'text-slate-600')}>Kullanılabilir Harita</p>
                    </div>

                    <div className={clsx(
                        'p-6 rounded-2xl border',
                        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    )}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={clsx(
                                'p-3 rounded-lg',
                                isDarkMode ? 'bg-purple-950' : 'bg-purple-100'
                            )}>
                                <Database size={24} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                            </div>
                            <h3 className={clsx('font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>4</h3>
                        </div>
                        <p className={clsx('text-sm', isDarkMode ? 'text-slate-400' : 'text-slate-600')}>Veri Kategorisi</p>
                    </div>

                    <div className={clsx(
                        'p-6 rounded-2xl border',
                        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    )}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={clsx(
                                'p-3 rounded-lg',
                                isDarkMode ? 'bg-green-950' : 'bg-green-100'
                            )}>
                                <Layers size={24} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
                            </div>
                            <h3 className={clsx('font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>∞</h3>
                        </div>
                        <p className={clsx('text-sm', isDarkMode ? 'text-slate-400' : 'text-slate-600')}>Veri Noktası</p>
                    </div>
                </div>

                {/* Maps by Category */}
                {Object.entries(groupedMaps).map(([category, maps]) => (
                    <div key={category} className="mb-12">
                        <h2 className={clsx(
                            'text-2xl font-bold mb-6',
                            isDarkMode ? 'text-white' : 'text-slate-900'
                        )}>
                            {category}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {maps.map((map) => (
                                <button
                                    key={map.id}
                                    onClick={() => onSelectMap(map.id)}
                                    className={clsx(
                                        'p-6 rounded-2xl border transition-all duration-200 text-left group',
                                        isDarkMode
                                            ? 'bg-slate-800 border-slate-700 hover:border-red-500'
                                            : 'bg-white border-slate-200 hover:border-red-500 hover:shadow-lg'
                                    )}
                                >
                                    <div className="mb-4">
                                        <h3 className={clsx(
                                            'text-lg font-bold transition-colors',
                                            isDarkMode
                                                ? 'text-white group-hover:text-red-400'
                                                : 'text-slate-900 group-hover:text-red-600'
                                        )}>
                                            {map.title}
                                        </h3>
                                        <p className={clsx(
                                            'text-sm mt-1',
                                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                        )}>
                                            {map.category}
                                        </p>
                                    </div>

                                    <p className={clsx(
                                        'text-sm mb-4 line-clamp-2',
                                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                                    )}>
                                        {map.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className={clsx(
                                            'text-xs font-semibold uppercase tracking-wide',
                                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                        )}>
                                            Haritayı Aç
                                        </span>
                                        <svg
                                            className={clsx(
                                                'w-5 h-5 text-red-600 group-hover:translate-x-1 transition-transform',
                                                isDarkMode ? 'text-red-400' : 'text-red-600'
                                            )}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Footer Info */}
                <div className={clsx(
                    'mt-16 p-8 rounded-2xl border',
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                )}>
                    <h3 className={clsx(
                        'font-bold mb-3',
                        isDarkMode ? 'text-white' : 'text-slate-900'
                    )}>
                        Hakkında
                    </h3>
                    <p className={clsx(
                        'text-sm leading-relaxed',
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    )}>
                        Bu uygulama, İzmir Büyükşehir Belediyesi'nin açık veri portalında sunulan harita odaklı API uçlarını tek bir
                        arayüzde keşfetmeniz için geliştirilmiş, açık kaynak bir projedir. Veriler doğrudan açık veri servislerinden
                        alınmakta ve gerçek zamanlı olarak güncellenmektedir.
                    </p>
                </div>
            </div>
        </div>
    );
};

