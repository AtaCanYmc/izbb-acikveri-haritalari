import {useEffect, useRef, useState} from 'react';
import {Download, Code, ArrowLeft, Search, X, Check, Sun, Moon, Contrast} from 'lucide-react';
import clsx from 'clsx';
import {mapRegistry} from '../config/mapRegistry.ts';
import type {MapDefinition, MapPoint} from '../types/mapData.ts';
import {getCategoryConfig} from '../utils/categoryMeta.ts';
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
    onBackToHome?: () => void;
    onCloseSidebar?: () => void;
    loading: boolean;
    isSidebarOpen: boolean;
    isDarkMode: boolean;
    onToggleTheme: () => void;
    isHighContrast?: boolean;
    onToggleHighContrast?: () => void;
    onDownload: () => void;
    onOpenDeveloperDocs: () => void;
}

const Header = ({
    mapDefinition,
    activeMapId,
    searchTerm,
    onMapChange,
    onSearchChange,
    onBackToHome,
    isDarkMode,
    onToggleTheme,
    isHighContrast = false,
    onToggleHighContrast,
    onDownload,
    onOpenDeveloperDocs,
}: Pick<OpenDataSidebarProps, 'mapDefinition' | 'activeMapId' | 'searchTerm' | 'onMapChange' | 'onSearchChange'> & {
    onBackToHome?: () => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
    isHighContrast?: boolean;
    onToggleHighContrast?: () => void;
    onDownload: () => void;
    onOpenDeveloperDocs: () => void;
}) => {
    return (
        <div className={clsx(
            'p-4 sm:p-5 border-b shrink-0 transition-colors',
            isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'
        )}>
            {/* Top action row */}
            <div className="flex items-center justify-between gap-2 mb-3">
                {onBackToHome && (
                    <button
                        type="button"
                        onClick={onBackToHome}
                        className={clsx(
                            'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors min-h-[36px]',
                            isDarkMode
                                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        )}
                        title="Tüm harita kataloğuna dön"
                    >
                        <ArrowLeft size={14} />
                        <span>Tüm Haritalar</span>
                    </button>
                )}

                <div className="flex items-center gap-1.5 ml-auto">
                    {onToggleHighContrast && (
                        <button
                            type="button"
                            onClick={onToggleHighContrast}
                            aria-pressed={isHighContrast}
                            aria-label={isHighContrast ? 'Yüksek kontrast temasını kapat' : 'Yüksek kontrast temasını aç (WCAG AAA)'}
                            title="Yüksek Kontrast (WCAG AAA)"
                            className={clsx(
                                'h-9 w-9 rounded-lg border transition-colors flex items-center justify-center shrink-0',
                                isDarkMode
                                    ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                            )}
                        >
                            <Contrast size={16} />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onToggleTheme}
                        aria-label={isDarkMode ? 'Açık temaya geç' : 'Koyu temaya geç'}
                        className={clsx(
                            'h-9 w-9 rounded-lg border transition-colors flex items-center justify-center shrink-0',
                            isDarkMode
                                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        )}
                    >
                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    <button
                        type="button"
                        onClick={onOpenDeveloperDocs}
                        aria-label="Geliştirici API dokümanları"
                        className={clsx(
                            'h-9 w-9 rounded-lg border transition-colors flex items-center justify-center shrink-0',
                            isDarkMode
                                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        )}
                        title="Geliştirici API Dokümanları"
                    >
                        <Code size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={onDownload}
                        aria-label="Harita verilerini indir"
                        className={clsx(
                            'h-9 w-9 rounded-lg border transition-colors flex items-center justify-center shrink-0',
                            isDarkMode
                                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        )}
                        title="Veriyi Dışa Aktar"
                    >
                        <Download size={16} />
                    </button>
                </div>
            </div>

            {/* Title & Category with authentic icon */}
            <div className="mb-3 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                    <img
                        src={getCategoryConfig(mapDefinition.category).iconUrl}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={clsx(
                            'text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border',
                            getCategoryConfig(mapDefinition.category).badgeClass
                        )}>
                            {mapDefinition.category}
                        </span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight leading-snug">
                        {mapDefinition.title}
                    </h1>
                    <p className={clsx(
                        'text-xs mt-1 leading-relaxed line-clamp-2',
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    )}>
                        {mapDefinition.description}
                    </p>
                </div>
            </div>

            {/* Map Selector & Search Controls */}
            <div className="space-y-2.5">
                {/* Select Map */}
                <div className="relative">
                    <label htmlFor="map-select-dropdown" className="sr-only">Harita Seçin</label>
                    <select
                        id="map-select-dropdown"
                        value={activeMapId}
                        onChange={(event) => onMapChange(event.target.value)}
                        className={clsx(
                            'w-full appearance-none px-3.5 py-2.5 pr-8 border rounded-lg text-xs font-medium outline-none transition-all cursor-pointer',
                            isDarkMode
                                ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-sky-500'
                                : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-sky-500'
                        )}
                    >
                        {Array.from(new Map(mapRegistry.map((m) => [m.category, m])).entries()).map(([category]) => {
                            const mapsInCategory = mapRegistry.filter((m) => m.category === category);
                            return (
                                <optgroup key={category} label={category}>
                                    {mapsInCategory.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.title}
                                        </option>
                                    ))}
                                </optgroup>
                            );
                        })}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {/* Instant Search Input */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Search size={14} />
                    </div>
                    <input
                        type="search"
                        placeholder={mapDefinition.searchPlaceholder}
                        aria-label={mapDefinition.searchPlaceholder}
                        value={searchTerm}
                        onChange={(event) => onSearchChange(event.target.value)}
                        className={clsx(
                            'w-full pl-9 pr-8 py-2.5 border rounded-lg text-xs font-medium outline-none transition-all',
                            isDarkMode
                                ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-sky-500'
                                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-sky-500'
                        )}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => onSearchChange('')}
                            aria-label="Aramayı temizle"
                            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const PointCard = ({
    point,
    optionId,
    isSelected,
    isFocused,
    onSelectPoint,
    onFocus,
    isDarkMode,
    itemRef,
}: {
    point: MapPoint;
    optionId: string;
    isSelected: boolean;
    isFocused: boolean;
    onSelectPoint: (point: MapPoint) => void;
    onFocus: () => void;
    isDarkMode: boolean;
    itemRef: (node: HTMLDivElement | null) => void;
}) => {
    return (
        <div
            ref={itemRef}
            id={optionId}
            role="option"
            aria-selected={isSelected}
            tabIndex={isFocused ? 0 : -1}
            onFocus={onFocus}
            onClick={() => onSelectPoint(point)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPoint(point);
                }
            }}
            className={clsx(
                'p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                isSelected
                    ? isDarkMode
                        ? 'border-sky-500 bg-sky-950/40 shadow-sm ring-1 ring-sky-500/30'
                        : 'border-sky-600 bg-sky-50/70 shadow-sm ring-1 ring-sky-600/30'
                    : isDarkMode
                        ? 'border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-800/80'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <h3 className={clsx(
                    'font-bold text-xs tracking-tight leading-snug',
                    isSelected
                        ? isDarkMode ? 'text-sky-400' : 'text-sky-700'
                        : isDarkMode ? 'text-slate-100' : 'text-slate-900'
                )}>
                    {point.title}
                </h3>
                {isSelected && (
                    <Check size={14} className={isDarkMode ? 'text-sky-400' : 'text-sky-600'} />
                )}
            </div>

            {point.subtitle && (
                <p className={clsx(
                    'text-[11px] mt-1 line-clamp-2 leading-relaxed',
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                )}>
                    {point.subtitle}
                </p>
            )}

            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                {point.badge ? (
                    <span className={clsx(
                        'px-2 py-0.5 rounded font-mono font-medium uppercase',
                        isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                    )}>
                        {point.badge}
                    </span>
                ) : (
                    <span />
                )}

                {point.actions?.[0] && (
                    <span className="font-semibold text-sky-600 dark:text-sky-400">
                        {point.actions[0].label} &rarr;
                    </span>
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
    onCloseSidebar,
    loading,
    isDarkMode,
}: Pick<OpenDataSidebarProps, 'mapDefinition' | 'points' | 'selectedPoint' | 'onSelectPoint' | 'onCloseSidebar' | 'loading' | 'isDarkMode'>) => {
    const [focusedIndex, setFocusedIndex] = useState(0);
    const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

    const safeFocusedIndex = points.length === 0 ? 0 : Math.min(focusedIndex, points.length - 1);

    useEffect(() => {
        if (!selectedPoint) return;
        const selectedIdx = points.findIndex((p) => p.id === selectedPoint.id);
        if (selectedIdx >= 0) {
            itemRefs.current[selectedIdx]?.scrollIntoView({block: 'nearest'});
        }
    }, [selectedPoint, points]);

    const moveFocus = (nextIndex: number) => {
        if (points.length === 0) return;
        const clamped = Math.max(0, Math.min(points.length - 1, nextIndex));
        setFocusedIndex(clamped);
        const node = itemRefs.current[clamped];
        if (node) {
            node.focus();
            node.scrollIntoView({block: 'nearest'});
        }
    };

    const handleListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (points.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            moveFocus(safeFocusedIndex + 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            moveFocus(safeFocusedIndex - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            moveFocus(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            moveFocus(points.length - 1);
        } else if (e.key === 'Escape' && onCloseSidebar) {
            e.preventDefault();
            onCloseSidebar();
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-slate-400">
                <div className="w-8 h-8 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mb-3" />
                <span>Veriler yükleniyor...</span>
            </div>
        );
    }

    if (points.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-slate-400">
                <p className="font-semibold mb-1 text-slate-600 dark:text-slate-300">{mapDefinition.emptyStateTitle}</p>
                <p className="text-[11px] max-w-xs">{mapDefinition.emptyStateDescription}</p>
            </div>
        );
    }

    const activeOptionId = points[safeFocusedIndex] ? `point-option-${safeFocusedIndex}` : undefined;

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className={clsx(
                'px-4 py-2 border-b text-[11px] font-mono flex items-center justify-between shrink-0',
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            )}>
                <span>{points.length} lokasyon bulundu</span>
                <span className="text-[10px] opacity-75">↑↓ Gezin · Enter Seç</span>
            </div>
            <div
                role="listbox"
                aria-label={`${mapDefinition.title} konum listesi`}
                aria-activedescendant={activeOptionId}
                onKeyDown={handleListKeyDown}
                className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar"
            >
                {points.map((point, index) => (
                    <PointCard
                        key={point.id}
                        point={point}
                        optionId={`point-option-${index}`}
                        isSelected={selectedPoint?.id === point.id}
                        isFocused={index === safeFocusedIndex}
                        onSelectPoint={onSelectPoint}
                        onFocus={() => setFocusedIndex(index)}
                        isDarkMode={isDarkMode}
                        itemRef={(node) => {
                            itemRefs.current[index] = node;
                        }}
                    />
                ))}
            </div>
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
        onBackToHome,
        onCloseSidebar,
        loading,
        isSidebarOpen,
        isDarkMode,
        onToggleTheme,
        isHighContrast,
        onToggleHighContrast,
        onDownload,
        onOpenDeveloperDocs,
    } = props;

    return (
        <aside
            aria-label="Harita kontrol paneli"
            className={clsx(
                'fixed md:relative z-[1010] h-full border-r transition-[width,transform] duration-200 ease-out flex flex-col overflow-hidden',
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
                isSidebarOpen
                    ? 'w-[320px] sm:w-[360px] md:w-[380px] translate-x-0'
                    : 'w-0 -translate-x-full md:translate-x-0 md:w-0'
            )}
        >
            <div className="w-[320px] sm:w-[360px] md:w-[380px] h-full flex flex-col">
                <Header
                    mapDefinition={mapDefinition}
                    activeMapId={activeMapId}
                    searchTerm={searchTerm}
                    onMapChange={onMapChange}
                    onSearchChange={onSearchChange}
                    onBackToHome={onBackToHome}
                    isDarkMode={isDarkMode}
                    onToggleTheme={onToggleTheme}
                    isHighContrast={isHighContrast}
                    onToggleHighContrast={onToggleHighContrast}
                    onDownload={onDownload}
                    onOpenDeveloperDocs={onOpenDeveloperDocs}
                />
                <PointsList
                    mapDefinition={mapDefinition}
                    points={points}
                    selectedPoint={selectedPoint}
                    onSelectPoint={onSelectPoint}
                    onCloseSidebar={onCloseSidebar}
                    loading={loading}
                    isDarkMode={isDarkMode}
                />
                <Footer isDarkMode={isDarkMode} />
            </div>
        </aside>
    );
};
