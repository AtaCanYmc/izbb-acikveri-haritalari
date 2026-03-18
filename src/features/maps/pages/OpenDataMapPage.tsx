import {ChevronLeft, Menu} from 'lucide-react';
import {toast, Toaster} from 'react-hot-toast';
import {useRef, useState} from 'react';
import clsx from 'clsx';
import html2canvas from 'html2canvas';
import {HomePage} from '../components/HomePage.tsx';
import {DownloadModal} from '../components/DownloadModal.tsx';
import {OpenDataMap} from '../components/OpenDataMap.tsx';
import {LocationPermissionWarning} from '../components/LocationPermissionWarning.tsx';
import {OpenDataSidebar} from '../components/OpenDataSidebar.tsx';
import {SelectedPointCard} from '../components/SelectedPointCard.tsx';
import {useDocumentMetadata} from '../hooks/useDocumentMetadata.ts';
import {useMapQueryParam} from '../hooks/useMapQueryParam.ts';
import {useOpenDataMapPage} from '../hooks/useOpenDataMapPage.ts';

const SidebarToggleButton = ({isSidebarOpen, onToggle, isMobile, isDarkMode}: { isSidebarOpen: boolean; onToggle: () => void; isMobile: boolean; isDarkMode: boolean }) => {
    if (isMobile) {
        return (
            <button
                onClick={onToggle}
                className={clsx(
                    'md:hidden absolute top-4 right-4 z-[9999] p-3 rounded-2xl shadow-xl border text-red-600 transition-colors',
                    isDarkMode
                        ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                        : 'bg-white border-slate-100 hover:bg-slate-50'
                )}
            >
                <Menu size={24}/>
            </button>
        );
    }

    return (
        <button
            onClick={onToggle}
            className={clsx(
                'absolute top-4 z-[1002] p-3 rounded-2xl shadow-xl border text-red-600 transition-all duration-300 md:flex hidden',
                isDarkMode
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    : 'bg-white border-slate-100 hover:bg-slate-50',
                isSidebarOpen ? 'left-[390px]' : 'left-4'
            )}
        >
            {isSidebarOpen ? <ChevronLeft size={24}/> : <Menu size={24}/>}
        </button>
    );
};

const LoadingOverlay = ({isVisible, isDarkMode}: { isVisible: boolean; isDarkMode: boolean }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className={clsx(
            'absolute inset-0 z-[1001] backdrop-blur-sm flex items-center justify-center',
            isDarkMode ? 'bg-slate-950/60' : 'bg-white/60'
        )}>
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export const OpenDataMapPage = ({ isDarkMode = false, onToggleTheme = () => {} }: { isDarkMode?: boolean; onToggleTheme?: () => void }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
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
        title: mapDefinition ? `${mapDefinition.title} | İzmir Açık Veri Haritası` : 'İzmir Açık Veri Haritaları',
        description: mapDefinition?.description || 'İzmir Büyükşehir Belediyesi\'nin açık verilerini harita üzerinde keşfedin',
        keywords: mapDefinition ? `izmir açık veri, ${mapDefinition.title.toLocaleLowerCase('tr-TR')}, harita, api` : 'izmir açık veri, harita',
    });

    const handleOpenDownloadModal = () => {
        setIsDownloadModalOpen(true);
    };

    const handleDownloadPNG = async () => {
        if (!mapContainerRef.current) {
            toast.error('Harita yüklenemedi');
            return;
        }

        const loadingToast = toast.loading('Harita PNG olarak indiriliyor...');

        try {
            // Leaflet container'ını bul
            const leafletContainer = mapContainerRef.current.querySelector('.leaflet-container') as HTMLElement;
            if (!leafletContainer) {
                throw new Error('Harita container\'ı bulunamadı');
            }

            // html2canvas'ın tüm elementleri işlemesi için kısa bir bekleme
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(leafletContainer, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                scale: 1,
                logging: false,
                removeContainer: false,
                foreignObjectRendering: false,
                ignoreElements: (element) => element.tagName === 'svg' || element.tagName === 'iframe',
                onclone: (clonedDocument) => {
                    // Cloned document'teki tüm style tag'larından oklch() temizle
                    const styles = clonedDocument.querySelectorAll('style');
                    styles.forEach(style => {
                        if (style.textContent) {
                            // oklch() fonksiyonlarını white renk ile değiştir
                            style.textContent = style.textContent.replace(/oklch\([^)]*\)/g, '#ffffff');
                        }
                    });
                },
            });

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${mapDef.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.png`;
            link.click();

            toast.dismiss(loadingToast);
            toast.success('Harita PNG olarak başarıyla indirildi!');
        } catch (error) {
            console.error('Harita PNG indirme hatası:', error);
            toast.dismiss(loadingToast);
            toast.error('Harita PNG indirme hatası. Lütfen tekrar deneyiniz.');
        }
    };

    // Anasayfa göster eğer harita seçilmemişse
    if (!mapDefinition) {
        return (
            <>
                <Toaster />
                <HomePage
                    onSelectMap={(mapId) => setMapId(mapId)}
                    isDarkMode={isDarkMode}
                    onToggleTheme={onToggleTheme}
                />
            </>
        );
    }

    // mapDef guaranteed non-null after the check above
    const mapDef = mapDefinition;

    const isLocationWarningVisible = locationStatus === 'denied' && showLocationWarning;

    return (
        <div className="flex h-[100dvh] w-full overflow-hidden bg-white relative font-sans">
            <Toaster/>

            <SidebarToggleButton
                isSidebarOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen((current) => !current)}
                isMobile={false}
                isDarkMode={isDarkMode}
            />

            <OpenDataSidebar
                mapDefinition={mapDef}
                activeMapId={activeMapId || mapDef.id}
                points={points}
                selectedPoint={selectedPoint}
                searchTerm={searchTerm}
                onMapChange={setMapId}
                onSearchChange={setSearchTerm}
                onSelectPoint={setSelectedPoint}
                loading={loading}
                isSidebarOpen={isSidebarOpen}
                isDarkMode={isDarkMode}
                onToggleTheme={onToggleTheme}
                onDownload={handleOpenDownloadModal}
            />

            <div
                className={`
                    md:hidden fixed inset-0 backdrop-blur-sm z-[1005] transition-opacity duration-300
                    ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                    ${isDarkMode ? 'bg-black/40' : 'bg-black/40'}
                `}
                onClick={() => setIsSidebarOpen(false)}
            />

            <main className={clsx(
                'flex-1 relative h-full overflow-hidden',
                isDarkMode ? 'bg-slate-900' : 'bg-slate-100'
            )}>
                <LoadingOverlay isVisible={loading} isDarkMode={isDarkMode}/>
                <div ref={mapContainerRef} className="absolute inset-0 h-full w-full">
                    <OpenDataMap points={points} selectedPoint={selectedPoint} onMarkerClick={setSelectedPoint} isDarkMode={isDarkMode}/>
                </div>
                <SelectedPointCard isDarkMode={isDarkMode} point={selectedPoint} onClose={() => setSelectedPoint(null)}/>
                <SidebarToggleButton
                    isSidebarOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen((current) => !current)}
                    isMobile={true}
                    isDarkMode={isDarkMode}
                />
                <LocationPermissionWarning
                    isVisible={isLocationWarningVisible}
                    onClose={() => setShowLocationWarning(false)}
                    onRetry={handleRetryLocationPermission}
                />
            </main>

            <DownloadModal
                isOpen={isDownloadModalOpen}
                onClose={() => setIsDownloadModalOpen(false)}
                mapTitle={mapDef.title}
                mapPoints={points}
                isDarkMode={isDarkMode}
                onDownloadPNG={handleDownloadPNG}
            />
        </div>
    );
};
