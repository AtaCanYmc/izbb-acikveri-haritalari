import {ChevronLeft, Menu, ArrowLeft, Layers} from 'lucide-react';
import {toast, Toaster} from 'react-hot-toast';
import {useRef, useState, useCallback} from 'react';
import clsx from 'clsx';
import html2canvas from 'html2canvas';
import {HomePage} from '../components/HomePage.tsx';
import {DownloadModal} from '../components/DownloadModal.tsx';
import {DeveloperDocsModal} from '../../../components/DeveloperDocsModal.tsx';
import {OpenDataMap} from '../components/OpenDataMap.tsx';
import {LocationPermissionWarning} from '../components/LocationPermissionWarning.tsx';
import {OpenDataSidebar} from '../components/OpenDataSidebar.tsx';
import {SelectedPointCard} from '../components/SelectedPointCard.tsx';
import {SEOMetadata} from '../../../components/SEOMetadata.tsx';
import {useMapQueryParam} from '../hooks/useMapQueryParam.ts';
import {useOpenDataMapPage} from '../hooks/useOpenDataMapPage.ts';
import type {MapPoint} from '../types/mapData.ts';
import {getCategoryConfig} from '../utils/categoryMeta.ts';

const DesktopSidebarToggleButton = ({
    isSidebarOpen,
    onToggle,
    isDarkMode,
}: {
    isSidebarOpen: boolean;
    onToggle: () => void;
    isDarkMode: boolean;
}) => {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={isSidebarOpen ? 'Yan paneli daralt' : 'Yan paneli genişlet'}
            className={clsx(
                'absolute top-4 z-[1002] h-11 w-11 rounded-xl shadow-lg border transition-all duration-200 hidden md:flex items-center justify-center min-h-[44px] min-w-[44px]',
                isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
                isSidebarOpen ? 'left-[392px]' : 'left-4'
            )}
        >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
    );
};

const MobileFloatingHeader = ({
    mapTitle,
    category,
    onBackToHome,
    onToggleSidebar,
    isDarkMode,
}: {
    mapTitle: string;
    category?: string;
    onBackToHome: () => void;
    onToggleSidebar: () => void;
    isDarkMode: boolean;
}) => {
    const catConfig = category ? getCategoryConfig(category) : null;

    return (
        <div className="md:hidden fixed top-3 inset-x-3 z-[1002] flex items-center justify-between gap-2 pointer-events-none">
            {/* Back button */}
            <button
                type="button"
                onClick={onBackToHome}
                aria-label="Tüm harita kataloğuna dön"
                className={clsx(
                    'pointer-events-auto h-11 px-3.5 rounded-xl border shadow-md flex items-center gap-1.5 text-xs font-semibold transition-colors shrink-0 min-h-[44px]',
                    isDarkMode
                        ? 'bg-slate-900/95 border-slate-700 text-slate-100 hover:bg-slate-800 backdrop-blur-md'
                        : 'bg-white/95 border-slate-200 text-slate-800 hover:bg-slate-50 backdrop-blur-md'
                )}
            >
                <ArrowLeft size={16} />
                <span>Haritalar</span>
            </button>

            {/* Map title badge with category icon */}
            <div className={clsx(
                'pointer-events-auto px-3 py-2 rounded-xl border shadow-md flex items-center gap-2 text-xs font-bold truncate max-w-[55%] min-h-[44px]',
                isDarkMode
                    ? 'bg-slate-900/95 border-slate-700 text-sky-400 backdrop-blur-md'
                    : 'bg-white/95 border-slate-200 text-sky-700 backdrop-blur-md'
            )}>
                {catConfig ? (
                    <img src={catConfig.iconUrl} alt="" aria-hidden="true" className="w-4 h-4 object-contain shrink-0" />
                ) : (
                    <Layers size={14} className="shrink-0" />
                )}
                <span className="truncate">{mapTitle}</span>
            </div>

            {/* Menu trigger */}
            <button
                type="button"
                onClick={onToggleSidebar}
                aria-label="Menüyü aç/kapat"
                className={clsx(
                    'pointer-events-auto h-11 w-11 rounded-xl border shadow-md flex items-center justify-center transition-colors shrink-0 min-h-[44px] min-w-[44px]',
                    isDarkMode
                        ? 'bg-slate-900/95 border-slate-700 text-slate-100 hover:bg-slate-800 backdrop-blur-md'
                        : 'bg-white/95 border-slate-200 text-slate-800 hover:bg-slate-50 backdrop-blur-md'
                )}
            >
                <Menu size={20} />
            </button>
        </div>
    );
};

const LoadingOverlay = ({isVisible, isDarkMode}: { isVisible: boolean; isDarkMode: boolean }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className={clsx(
            'absolute inset-0 z-[1001] backdrop-blur-xs flex flex-col items-center justify-center gap-3 transition-opacity',
            isDarkMode ? 'bg-slate-950/60 text-slate-300' : 'bg-white/70 text-slate-700'
        )}>
            <div className="w-10 h-10 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono font-medium">Veri katmanı yükleniyor...</span>
        </div>
    );
};

export const OpenDataMapPage = ({ isDarkMode = false, onToggleTheme = () => {} }: { isDarkMode?: boolean; onToggleTheme?: () => void }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isDeveloperDocsOpen, setIsDeveloperDocsOpen] = useState(false);
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

    const handleSelectPoint = useCallback((point: MapPoint) => {
        setSelectedPoint(point);
        // On mobile view, close the sidebar so the marker card and map are in view
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, [setSelectedPoint, setIsSidebarOpen]);

    const handleOpenDownloadModal = () => {
        setIsDownloadModalOpen(true);
    };

    const handleDownloadPNG = async () => {
        if (!mapContainerRef.current || !mapDefinition) {
            toast.error('Harita yüklenemedi');
            return;
        }

        const loadingToast = toast.loading('Harita görseli hazırlanıyor...');

        try {
            const leafletContainer = mapContainerRef.current.querySelector('.leaflet-container') as HTMLElement | null;
            if (!leafletContainer) {
                toast.dismiss(loadingToast);
                toast.error('Harita bileşeni bulunamadı');
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 400));

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
                    const styles = clonedDocument.querySelectorAll('style');
                    styles.forEach(style => {
                        if (style.textContent) {
                            style.textContent = style.textContent.replace(/oklch\([^)]*\)/g, '#ffffff');
                        }
                    });
                },
            });

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${mapDefinition.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.png`;
            link.click();

            toast.dismiss(loadingToast);
            toast.success('Harita görseli indirildi');
        } catch (error) {
            console.error('Harita indirme hatası:', error);
            toast.dismiss(loadingToast);
            toast.error('Harita indirme hatası oluştu');
        }
    };

    // Return Home Page if no specific map selected
    if (!mapDefinition) {
        return (
            <>
                <SEOMetadata 
                    title="İzmir Açık Veri Haritaları | 36 Canlı Şehir Haritası ve Nöbetçi Eczaneler" 
                    description="İzmir Büyükşehir Belediyesi açık verileriyle nöbetçi eczaneler, afet toplanma alanları, canlı otopark dolulukları ve 36 şehir haritasını interaktif keşfedin."
                    keywords="izmir açık veri, izmir harita atlası, nöbetçi eczaneler izmir, otopark doluluk, afet toplanma alanları, wizmirnet, belediye verileri"
                    url="https://izmirharitalari.atacanymc.com.tr/"
                />
                <Toaster position="bottom-center" />
                <HomePage
                    onSelectMap={(mapId) => setMapId(mapId)}
                    isDarkMode={isDarkMode}
                    onToggleTheme={onToggleTheme}
                />
            </>
        );
    }

    const mapDef = mapDefinition;
    const isLocationWarningVisible = locationStatus === 'denied' && showLocationWarning;

    return (
        <div className="flex h-[100dvh] w-full overflow-hidden relative font-sans">
            <SEOMetadata 
                title={`${mapDef.title} | İzmir Açık Veri Harita Atlası`}
                description={mapDef.description || `${mapDef.title} - İzmir Büyükşehir Belediyesi resmi açık veri harita katmanı.`}
                keywords={`izmir açık veri, ${mapDef.title.toLocaleLowerCase('tr-TR')}, ${mapDef.category.toLocaleLowerCase('tr-TR')}, izmir harita`}
                url={`https://izmirharitalari.atacanymc.com.tr/?map=${mapDef.id}`}
                category={mapDef.category}
                mapId={mapDef.id}
            />
            <Toaster position="bottom-center" />

            {/* Desktop Sidebar Toggle Button */}
            <DesktopSidebarToggleButton
                isSidebarOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen((current) => !current)}
                isDarkMode={isDarkMode}
            />

            {/* Mobile Top Floating Header */}
            <MobileFloatingHeader
                mapTitle={mapDef.title}
                category={mapDef.category}
                onBackToHome={() => setMapId(null)}
                onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
                isDarkMode={isDarkMode}
            />

            {/* Sidebar Component */}
            <OpenDataSidebar
                mapDefinition={mapDef}
                activeMapId={activeMapId || mapDef.id}
                points={points}
                selectedPoint={selectedPoint}
                searchTerm={searchTerm}
                onMapChange={setMapId}
                onSearchChange={setSearchTerm}
                onSelectPoint={handleSelectPoint}
                onBackToHome={() => setMapId(null)}
                loading={loading}
                isSidebarOpen={isSidebarOpen}
                isDarkMode={isDarkMode}
                onToggleTheme={onToggleTheme}
                onDownload={handleOpenDownloadModal}
                onOpenDeveloperDocs={() => setIsDeveloperDocsOpen(true)}
            />

            {/* Mobile Sidebar Backdrop Overlay */}
            <div
                className={clsx(
                    'md:hidden fixed inset-0 z-[1005] transition-opacity duration-200',
                    isSidebarOpen
                        ? 'opacity-100 pointer-events-auto bg-slate-950/50 backdrop-blur-xs'
                        : 'opacity-0 pointer-events-none'
                )}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Main Interactive Map Canvas */}
            <main className={clsx(
                'flex-1 relative h-full overflow-hidden',
                isDarkMode ? 'bg-slate-950' : 'bg-slate-100'
            )}>
                <LoadingOverlay isVisible={loading} isDarkMode={isDarkMode} />
                <div ref={mapContainerRef} className="absolute inset-0 h-full w-full">
                    <OpenDataMap
                        points={points}
                        selectedPoint={selectedPoint}
                        onMarkerClick={handleSelectPoint}
                        isDarkMode={isDarkMode}
                    />
                </div>

                {/* Selected Point Details (Floating card on desktop, bottom sheet on mobile) */}
                <SelectedPointCard
                    isDarkMode={isDarkMode}
                    point={selectedPoint}
                    onClose={() => setSelectedPoint(null)}
                />

                <LocationPermissionWarning
                    isVisible={isLocationWarningVisible}
                    onClose={() => setShowLocationWarning(false)}
                    onRetry={handleRetryLocationPermission}
                    isDarkMode={isDarkMode}
                />
            </main>

            {/* Modals */}
            <DownloadModal
                isOpen={isDownloadModalOpen}
                onClose={() => setIsDownloadModalOpen(false)}
                mapTitle={mapDef.title}
                mapPoints={points}
                isDarkMode={isDarkMode}
                onDownloadPNG={handleDownloadPNG}
            />

            <DeveloperDocsModal
                isOpen={isDeveloperDocsOpen}
                onClose={() => setIsDeveloperDocsOpen(false)}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};
