import logo from '../../../assets/eczane_logo.jpg';
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
}

const Header = ({
    mapDefinition,
    activeMapId,
    searchTerm,
    onMapChange,
    onSearchChange,
}: Pick<OpenDataSidebarProps, 'mapDefinition' | 'activeMapId' | 'searchTerm' | 'onMapChange' | 'onSearchChange'>) => {
    return (
        <div className="p-6 border-b border-slate-50 bg-white">
            <div className="flex flex-row items-center justify-between gap-4">
                <div className="text-left ml-1">
                    <h1 className="text-2xl font-black text-red-600 tracking-tighter">{mapDefinition.title}</h1>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Açık veri harita görünümü</p>
                </div>
                <img src={logo} alt="İzmir Açık Veri Haritası" className="w-12 h-12 rounded-xl object-cover"/>
            </div>

            <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">{mapDefinition.description}</p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm p-3 space-y-3">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-2">
                        Harita Seçici
                    </label>
                    <div className="relative">
                        <select
                            value={activeMapId}
                            onChange={(event) => onMapChange(event.target.value)}
                            className="w-full appearance-none px-4 py-3 pr-10 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                        >
                            {mapRegistry.map((map) => (
                                <option key={map.id} value={map.id}>
                                    {map.category} • {map.title}
                                </option>
                            ))}
                        </select>
                        <svg
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
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
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block mb-2">
                        Arama
                    </label>
                    <input
                        type="text"
                        placeholder={mapDefinition.searchPlaceholder}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
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
        <div className="flex flex-col items-center justify-center h-40 text-slate-400 animate-pulse italic">
            Yükleniyor...
        </div>
    );
};

const EmptyState = ({mapDefinition}: Pick<OpenDataSidebarProps, 'mapDefinition'>) => {
    return (
        <div className="p-6 text-center text-slate-500">
            <h3 className="font-bold text-slate-800">{mapDefinition.emptyStateTitle}</h3>
            <p className="text-xs mt-2">{mapDefinition.emptyStateDescription}</p>
        </div>
    );
};

const PointCard = ({point, isSelected, onSelectPoint}: { point: MapPoint; isSelected: boolean; onSelectPoint: (point: MapPoint) => void }) => {
    return (
        <div
            onClick={() => onSelectPoint(point)}
            className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isSelected
                    ? 'border-red-500 bg-white shadow-md ring-1 ring-red-500/20'
                    : 'border-transparent bg-white hover:border-slate-200 shadow-sm'
            }`}
        >
            <h3 className="font-bold text-slate-800 tracking-tight">{point.title}</h3>
            {point.subtitle && <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{point.subtitle}</p>}
            <div className="flex items-center justify-between mt-3 gap-3">
                {point.badge && (
                    <span className="text-[9px] bg-slate-100 px-2 py-1 rounded text-slate-600 font-bold uppercase">{point.badge}</span>
                )}
                {point.actions?.[0] && <span className="text-xs text-red-600 font-bold">{point.actions[0].label}</span>}
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
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
    const {mapDefinition, activeMapId, points, selectedPoint, searchTerm, onMapChange, onSearchChange, onSelectPoint, loading, isSidebarOpen} = props;

    return (
        <aside
            className={`
                fixed md:relative z-[1010] h-full bg-white border-r border-slate-200 
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
