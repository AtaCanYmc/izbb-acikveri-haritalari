import {ChevronLeft, Menu} from 'lucide-react';
import {Toaster} from 'react-hot-toast';
import {OpenDataMap} from '../components/OpenDataMap.tsx';
import {LocationPermissionWarning} from '../components/LocationPermissionWarning.tsx';
import {OpenDataSidebar} from '../components/OpenDataSidebar.tsx';
import {SelectedPointCard} from '../components/SelectedPointCard.tsx';
import {useDocumentMetadata} from '../hooks/useDocumentMetadata.ts';
import {useMapQueryParam} from '../hooks/useMapQueryParam.ts';
import {useOpenDataMapPage} from '../hooks/useOpenDataMapPage.ts';

const SidebarToggleButton = ({isSidebarOpen, onToggle, isMobile}: { isSidebarOpen: boolean; onToggle: () => void; isMobile: boolean }) => {
    if (isMobile) {
        return (
            <button
                onClick={onToggle}
                className="md:hidden absolute top-4 right-4 z-[9999] bg-white p-3 rounded-2xl shadow-xl border border-slate-100 text-red-600"
            >
                <Menu size={24}/>
            </button>
        );
    }

    return (
        <button
            onClick={onToggle}
            className={`absolute top-4 z-[1002] bg-white p-3 rounded-2xl shadow-xl border border-slate-100 text-red-600 transition-all duration-300 ${
                isSidebarOpen ? 'left-[390px]' : 'left-4'
            } md:flex hidden`}
        >
            {isSidebarOpen ? <ChevronLeft size={24}/> : <Menu size={24}/>}
        </button>
    );
};

const LoadingOverlay = ({isVisible}: { isVisible: boolean }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="absolute inset-0 z-[1001] bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export const OpenDataMapPage = () => {
    const {activeMap, activeMapId, setMapId} = useMapQueryParam();
    const mapDefinition = activeMap;
    const {
        points,
        searchTerm,
        setSearchTerm,
        selectedPoint,
        setSelectedPoint,
        loading,
        isSidebarOpen,
        setIsSidebarOpen,
        locationStatus,
        showLocationWarning,
        setShowLocationWarning,
        handleRetryLocationPermission,
    } = useOpenDataMapPage(mapDefinition);

    useDocumentMetadata({
        title: `${mapDefinition.title} | İzmir Açık Veri Haritası`,
        description: mapDefinition.description,
        keywords: `izmir açık veri, ${mapDefinition.title.toLocaleLowerCase('tr-TR')}, harita, api`,
    });

    const isLocationWarningVisible = locationStatus === 'denied' && showLocationWarning;

    return (
        <div className="flex h-[100dvh] w-full overflow-hidden bg-white relative font-sans">
            <Toaster/>

            <SidebarToggleButton
                isSidebarOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen((current) => !current)}
                isMobile={false}
            />

            <OpenDataSidebar
                mapDefinition={mapDefinition}
                activeMapId={activeMapId}
                points={points}
                selectedPoint={selectedPoint}
                searchTerm={searchTerm}
                onMapChange={setMapId}
                onSearchChange={setSearchTerm}
                onSelectPoint={setSelectedPoint}
                loading={loading}
                isSidebarOpen={isSidebarOpen}
            />

            <div
                className={`
                    md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[1005] transition-opacity duration-300
                    ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 relative bg-slate-100 h-full overflow-hidden">
                <LoadingOverlay isVisible={loading}/>
                <div className="absolute inset-0 h-full w-full">
                    <OpenDataMap points={points} selectedPoint={selectedPoint} onMarkerClick={setSelectedPoint}/>
                </div>
                <SelectedPointCard point={selectedPoint} onClose={() => setSelectedPoint(null)}/>
                <SidebarToggleButton
                    isSidebarOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen((current) => !current)}
                    isMobile={true}
                />
                <LocationPermissionWarning
                    isVisible={isLocationWarningVisible}
                    onClose={() => setShowLocationWarning(false)}
                    onRetry={handleRetryLocationPermission}
                />
            </main>
        </div>
    );
};
