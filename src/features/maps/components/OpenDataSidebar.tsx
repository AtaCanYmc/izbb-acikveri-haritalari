import {useEffect} from 'react';
import {Download} from 'lucide-react';
import clsx from 'clsx';
import {mapRegistry} from '../config/mapRegistry.ts';
import type {MapDefinition, MapPoint} from '../types/mapData.ts';
import Footer from '../../../components/footer/footer.tsx';

interface OpenDataSidebarProps {
    mapDefinition: MapDefinition;
    activeMapId: string;
    points: MapPoint[];
    selectedPoint: MapPoint | null;
    searchTerm: string;
    onMapChange: (mapId: string) => void;
    onSearchChange: (value: string) => void;
    onSelectPoint: (point: MapPoint) => void;
    loading: boolean;
    isSidebarOpen: boolean;
    isDarkMode: boolean;
    onToggleTheme: () => void;
    onDownload: () => void;
}

const Header = ({
                    mapDefinition,
                    activeMapId,
                    searchTerm,
                    onMapChange,
                    onSearchChange,
                    isDarkMode,
                    onToggleTheme,
                    onDownload,
                }: Pick<OpenDataSidebarProps, 'mapDefinition' | 'activeMapId' | 'searchTerm' | 'onMapChange' | 'onSearchChange'> & {
    isDarkMode: boolean;
    onToggleTheme: () => void;
    onDownload: () => void
}) => {
    return (
        <div className={clsx(
            'p-6 border-b',
            isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'
        )}>
            <div className="flex flex-row items-center justify-between gap-4">
                <div className="text-left ml-1">
                    <h1 className="text-2xl font-black text-red-600 tracking-tighter">İzmir Açık Veri
                        Harita</h1>
                    <p className={clsx(
                        'text-[10px] font-bold uppercase tracking-[0.2em] mt-1',
                        isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    )}>{mapDefinition.title}</p>
                </div>
                <div className="flex flex-row items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onToggleTheme}
                        aria-label={isDarkMode ? 'Acik moda gec' : 'Koyu moda gec'}
                        className={clsx(
                            'h-8 w-8 shrink-0 rounded-full border transition-colors inline-flex items-center justify-center',
                            isDarkMode
                                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        )}
                    >
                        {isDarkMode ? (
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2" aria-hidden="true">
                                <circle cx="12" cy="12" r="4"/>
                                <path
                                    d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2" aria-hidden="true">
                                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
                            </svg>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onDownload}
                        aria-label="Haritayı indir"
                        className={clsx(
                            'h-8 w-8 shrink-0 rounded-full border transition-colors inline-flex items-center justify-center',
                            isDarkMode
                                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        )}
                        title="Haritayı PNG olarak indir"
                    >
                        <Download size={20}/>
                    </button>
                </div>
            </div>

            <p className={clsx(
                'text-[11px] mt-4 leading-relaxed',
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
            )}>{mapDefinition.description}</p>

            <div className={clsx(
                'mt-4 rounded-2xl border shadow-sm p-3 space-y-3',
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            )}>
                <div>
                    <label className={clsx(
                        'text-[10px] font-bold uppercase tracking-[0.2em] block mb-2',
                        isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    )}>
                        Harita Secici
                    </label>
                    <div className="relative">
                        <select
                            value={activeMapId}
                            onChange={(event) => onMapChange(event.target.value)}
                            className={clsx(
                                'w-full appearance-none px-4 py-3 pr-10 border rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all',
                                isDarkMode
                                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                                    : 'bg-white border-slate-200 text-slate-700'
                            )}
                        >
                            {Array.from(new Map(mapRegistry.map(map => [map.category, map])).entries()).map(([category]) => {
                                const mapsInCategory = mapRegistry.filter(map => map.category === category);
                                return (
                                    <optgroup key={category} label={category}>
                                        {mapsInCategory.map((map) => (
                                            <option key={map.id} value={map.id}>
                                                {map.title}
                                            </option>
                                        ))}
                                    </optgroup>
                                );
                            })}
                        </select>
                        <svg
                            className={clsx(
                                'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4',
                                isDarkMode ? 'text-slate-500' : 'text-slate-400'
                            )}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>

                <div>
                    <label className={clsx(
                        'text-[10px] font-bold uppercase tracking-[0.2em] block mb-2',
                        isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    )}>
                        Arama
                    </label>
                    <input
                        type="text"
                        placeholder={mapDefinition.searchPlaceholder}
                        className={clsx(
                            'w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all',
                            isDarkMode
                                ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500'
                                : 'bg-white border-slate-200 text-slate-700 placeholder:text-slate-400'
                        )}
                        value={searchTerm}
                        onChange={(event) => onSearchChange(event.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

const LoadingState = ({isDarkMode}: {isDarkMode: boolean}) => {
    return (
        <div
            className={clsx(
                'flex-1 flex items-center justify-center h-40 animate-pulse italic',
                isDarkMode
                    ? 'text-slate-500 bg-slate-800/50'
                    : 'text-slate-400 bg-slate-50/30'
            )}
        >
            Yukleniyor...
        </div>
    );
};

const EmptyState = ({mapDefinition, isDarkMode}: Pick<OpenDataSidebarProps, 'mapDefinition'> & {isDarkMode: boolean}) => {
    return (
        <div
            className={clsx(
                'flex-1 p-6 text-center flex items-center justify-center',
                isDarkMode
                    ? 'text-slate-400 bg-slate-800/50'
                    : 'text-slate-500 bg-slate-50/30'
            )}
        >
            <div>
                <h3 className={clsx('font-bold', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{mapDefinition.emptyStateTitle}</h3>
                <p className="text-xs mt-2">{mapDefinition.emptyStateDescription}</p>
            </div>
        </div>
    );
};

const PointCard = ({point, isSelected, onSelectPoint, isDarkMode}: {
    point: MapPoint;
    isSelected: boolean;
    onSelectPoint: (point: MapPoint) => void;
    isDarkMode: boolean;
}) => {
    const cardClasses = clsx(
        'p-4 rounded-2xl border transition-all duration-200 cursor-pointer',
        isSelected
            ? isDarkMode
                ? 'border-red-500 bg-slate-800 shadow-md ring-1 ring-red-500/20'
                : 'border-red-500 bg-white shadow-md ring-1 ring-red-500/20'
            : isDarkMode
                ? 'border-transparent bg-slate-800 hover:border-slate-700 shadow-sm'
                : 'border-transparent bg-white hover:border-slate-200 shadow-sm'
    );

    return (
        <div onClick={() => onSelectPoint(point)} className={cardClasses}>
            <h3 className={clsx('font-bold tracking-tight', isDarkMode ? 'text-slate-200' : 'text-slate-800')}>{point.title}</h3>
            {point.subtitle && (
                <p className={clsx('text-[11px] mt-1 line-clamp-2', isDarkMode ? 'text-slate-400' : 'text-slate-500')}>{point.subtitle}</p>
            )}
            <div className="flex items-center justify-between mt-3 gap-3">
                {point.badge && (
                    <span className={clsx(
                        'text-[9px] px-2 py-1 rounded font-bold uppercase',
                        isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                    )}>{point.badge}</span>
                )}
                {point.actions?.[0] && (
                    <span className={clsx('text-xs font-bold', isDarkMode ? 'text-red-400' : 'text-red-600')}>{point.actions[0].label}</span>
                )}
            </div>
        </div>
    );
};

const PointsList = ({
                        mapDefinition,
                        points,
                        selectedPoint,
                        onSelectPoint,
                        loading,
                        isDarkMode
                    }: Pick<OpenDataSidebarProps, 'mapDefinition' | 'points' | 'selectedPoint' | 'onSelectPoint' | 'loading' | 'isDarkMode'>) => {
    if (loading) {
        return <LoadingState isDarkMode={isDarkMode}/>;
    }

    if (points.length === 0) {
        return <EmptyState mapDefinition={mapDefinition} isDarkMode={isDarkMode}/>;
    }

    return (
        <div
            className={clsx(
                'flex-1 overflow-y-auto p-4 space-y-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
                isDarkMode ? 'bg-slate-900' : 'bg-slate-50/30'
            )}
        >
            {points.map((point) => (
                <PointCard
                    key={point.id}
                    point={point}
                    isSelected={selectedPoint?.id === point.id}
                    onSelectPoint={onSelectPoint}
                    isDarkMode={isDarkMode}
                />
            ))}
        </div>
    );
};

export const OpenDataSidebar = (props: OpenDataSidebarProps) => {
    const {
        mapDefinition,
        activeMapId,
        points,
        selectedPoint,
        searchTerm,
        onMapChange,
        onSearchChange,
        onSelectPoint,
        loading,
        isSidebarOpen,
        isDarkMode,
        onToggleTheme,
        onDownload
    } = props;

    // Force reflow when dark mode changes to ensure Tailwind classes are applied
    useEffect(() => {
        void document.documentElement.offsetHeight;
    }, [isDarkMode]);

    return (
        <aside
            className={clsx(
                'fixed md:relative z-[1010] h-full border-r transition-[width,transform] duration-300 ease-in-out flex flex-col overflow-hidden',
                isDarkMode
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-200',
                isSidebarOpen ? 'w-[320px] md:w-[380px] translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-0'
            )}
        >
            <div className="sidebar-content h-full flex flex-col">
                <Header
                    mapDefinition={mapDefinition}
                    activeMapId={activeMapId}
                    searchTerm={searchTerm}
                    onMapChange={onMapChange}
                    onSearchChange={onSearchChange}
                    isDarkMode={isDarkMode}
                    onToggleTheme={onToggleTheme}
                    onDownload={onDownload}
                />
                <PointsList
                    mapDefinition={mapDefinition}
                    points={points}
                    selectedPoint={selectedPoint}
                    onSelectPoint={onSelectPoint}
                    loading={loading}
                    isDarkMode={isDarkMode}
                />
                <Footer isDarkMode={isDarkMode}/>
            </div>
        </aside>
    );
};
