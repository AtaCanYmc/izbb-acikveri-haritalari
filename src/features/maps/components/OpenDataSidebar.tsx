import {useEffect} from 'react';
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
}

// CSS classes for PointCard - ensures Tailwind generates dark mode variants
const POINT_CARD_SELECTED = 'border-red-500 bg-white dark:bg-slate-800 shadow-md ring-1 ring-red-500/20';
const POINT_CARD_UNSELECTED = 'border-transparent bg-white dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 shadow-sm';

const Header = ({
    mapDefinition,
    activeMapId,
    searchTerm,
    onMapChange,
    onSearchChange,
    isDarkMode,
    onToggleTheme,
}: Pick<OpenDataSidebarProps, 'mapDefinition' | 'activeMapId' | 'searchTerm' | 'onMapChange' | 'onSearchChange'> & { isDarkMode: boolean; onToggleTheme: () => void }) => {
    return (
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex flex-row items-center justify-between gap-4">
                <div className="text-left ml-1">
                    <h1 className="text-2xl font-black text-red-600 tracking-tighter dark:text-red-500">{mapDefinition.title}</h1>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 dark:text-slate-500">Acik veri harita gorunumu</p>
                </div>
                <button
                    type="button"
                    onClick={onToggleTheme}
                    aria-label={isDarkMode ? 'Acik moda gec' : 'Koyu moda gec'}
                    className="h-11 w-11 shrink-0 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors inline-flex items-center justify-center"
                >
                    {isDarkMode ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                        </svg>
                    )}
                </button>
            </div>

            <p className="text-[11px] text-slate-500 mt-4 leading-relaxed dark:text-slate-400">{mapDefinition.description}</p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm p-3 space-y-3 dark:bg-slate-800 dark:border-slate-700">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-2 dark:text-slate-500">
                        Harita Secici
                    </label>
                    <div className="relative">
                        <select
                            value={activeMapId}
                            onChange={(event) => onMapChange(event.target.value)}
                            className="w-full appearance-none px-4 py-3 pr-10 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
                        >
                            {mapRegistry.map((map) => (
                                <option key={map.id} value={map.id}>
                                    {map.category} • {map.title}
                                </option>
                            ))}
                        </select>
                        <svg
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500"
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
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-2 dark:text-slate-500">
                        Arama
                    </label>
                    <input
                        type="text"
                        placeholder={mapDefinition.searchPlaceholder}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(event) => onSearchChange(event.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

const LoadingState = () => {
    return (
        <div className="flex-1 flex items-center justify-center h-40 text-slate-400 dark:text-slate-500 animate-pulse italic bg-slate-50/30 dark:bg-slate-800/50">
            Yukleniyor...
        </div>
    );
};

const EmptyState = ({mapDefinition}: Pick<OpenDataSidebarProps, 'mapDefinition'>) => {
    return (
        <div className="flex-1 p-6 text-center text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-800/50 flex items-center justify-center">
            <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">{mapDefinition.emptyStateTitle}</h3>
                <p className="text-xs mt-2">{mapDefinition.emptyStateDescription}</p>
            </div>
        </div>
    );
};

const PointCard = ({point, isSelected, onSelectPoint}: { point: MapPoint; isSelected: boolean; onSelectPoint: (point: MapPoint) => void }) => {
    return (
        <div
            onClick={() => onSelectPoint(point)}
            className={clsx(
                'p-4 rounded-2xl border transition-all duration-200 cursor-pointer',
                isSelected ? POINT_CARD_SELECTED : POINT_CARD_UNSELECTED
            )}
        >
            <h3 className="font-bold text-slate-800 tracking-tight dark:text-slate-200">{point.title}</h3>
            {point.subtitle && <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 dark:text-slate-400">{point.subtitle}</p>}
            <div className="flex items-center justify-between mt-3 gap-3">
                {point.badge && (
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300 font-bold uppercase">{point.badge}</span>
                )}
                {point.actions?.[0] && <span className="text-xs text-red-600 dark:text-red-400 font-bold">{point.actions[0].label}</span>}
            </div>
        </div>
    );
};

const PointsList = ({mapDefinition, points, selectedPoint, onSelectPoint, loading}: Pick<OpenDataSidebarProps, 'mapDefinition' | 'points' | 'selectedPoint' | 'onSelectPoint' | 'loading'>) => {
    if (loading) {
        return <LoadingState/>;
    }

    if (points.length === 0) {
        return <EmptyState mapDefinition={mapDefinition}/>;
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 dark:bg-slate-900 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {points.map((point) => (
                <PointCard
                    key={point.id}
                    point={point}
                    isSelected={selectedPoint?.id === point.id}
                    onSelectPoint={onSelectPoint}
                />
            ))}
        </div>
    );
};

export const OpenDataSidebar = (props: OpenDataSidebarProps) => {
    const {mapDefinition, activeMapId, points, selectedPoint, searchTerm, onMapChange, onSearchChange, onSelectPoint, loading, isSidebarOpen, isDarkMode, onToggleTheme} = props;

    // Force reflow when dark mode changes to ensure Tailwind classes are applied
    useEffect(() => {
        void document.documentElement.offsetHeight;
    }, [isDarkMode]);

    return (
        <aside
            className={`
                fixed md:relative z-[1010] h-full bg-white border-r border-slate-200 
                dark:bg-slate-900 dark:border-slate-800
                transition-[width,transform] duration-300 ease-in-out flex flex-col overflow-hidden
                ${isSidebarOpen ? 'w-[320px] md:w-[380px] translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-0'}
            `}
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
                />
                <PointsList
                    mapDefinition={mapDefinition}
                    points={points}
                    selectedPoint={selectedPoint}
                    onSelectPoint={onSelectPoint}
                    loading={loading}
                />
                <Footer/>
            </div>
        </aside>
    );
};
