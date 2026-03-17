import {MapPin, Database, Layers} from 'lucide-react';
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
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                                İzmir Açık Veri Haritaları
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                İzmir Büyükşehir Belediyesi'nin açık verilerini harita üzerinde keşfedin
                            </p>
                        </div>
                        <button
                            onClick={onToggleTheme}
                            className="h-12 w-12 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors inline-flex items-center justify-center"
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
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                                <MapPin size={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">{mapRegistry.length}</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Kullanılabilir Harita</p>
                    </div>

                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-purple-100 dark:bg-purple-950 rounded-lg">
                                <Database size={24} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">4</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Veri Kategorisi</p>
                    </div>

                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-green-100 dark:bg-green-950 rounded-lg">
                                <Layers size={24} className="text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">∞</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Veri Noktası</p>
                    </div>
                </div>

                {/* Maps by Category */}
                {Object.entries(groupedMaps).map(([category, maps]) => (
                    <div key={category} className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                            {category}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {maps.map((map) => (
                                <button
                                    key={map.id}
                                    onClick={() => onSelectMap(map.id)}
                                    className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-red-500 dark:hover:border-red-500 transition-all duration-200 text-left group"
                                >
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                            {map.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                            {map.category}
                                        </p>
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                                        {map.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            Haritayı Aç
                                        </span>
                                        <svg
                                            className="w-5 h-5 text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform"
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
                <div className="mt-16 p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                        Hakkında
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Bu uygulama, İzmir Büyükşehir Belediyesi'nin açık veri portalında sunulan harita odaklı API uçlarını tek bir
                        arayüzde keşfetmeniz için geliştirilmiş, açık kaynak bir projedir. Veriler doğrudan açık veri servislerinden
                        alınmakta ve gerçek zamanlı olarak güncellenmektedir.
                    </p>
                </div>
            </div>
        </div>
    );
};

