import {useEffect} from 'react';
import {openEczaneOnMap} from "../../services/api.ts";
import {PharmacyMap} from "../../components/map/pharmacyMap.tsx";
import logo from '../../assets/eczane_logo.jpg';
import {Menu, ChevronLeft, MapPinOff, X} from 'lucide-react';
import {Toaster} from 'react-hot-toast';
import Footer from "../../components/footer/footer.tsx";
import usePharmacyPage from "./usePharmacyPage.ts";

const useDocumentMetadata = () => {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = 'İzmir Nöbetçi Eczaneler | Canlı Harita ve Liste';

        const upsertMetaTag = (name: string, content: string) => {
            let meta = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

            if (!meta) {
                meta = document.createElement('meta');
                meta.name = name;
                document.head.appendChild(meta);
            }

            const previousContent = meta.getAttribute('content');
            meta.setAttribute('content', content);

            return () => {
                if (previousContent === null) {
                    meta?.remove();
                    return;
                }

                meta.setAttribute('content', previousContent);
            };
        };

        const restoreDescription = upsertMetaTag(
            'description',
            "İzmir'deki tüm güncel nöbetçi eczaneleri harita üzerinde görün, yol tarifi alın ve tek tıkla arayın.",
        );
        const restoreKeywords = upsertMetaTag(
            'keywords',
            'izmir nöbetçi eczane, eczane haritası, nöbetçi eczaneler bugün',
        );

        return () => {
            document.title = previousTitle;
            restoreDescription();
            restoreKeywords();
        };
    }, []);
};

const PharmacyPage = () => {
    useDocumentMetadata();
    const {
        eczaneler,
        searchTerm,
        setSearchTerm,
        selectedEczane,
        setSelectedEczane,
        loading,
        isSidebarOpen,
        setIsSidebarOpen,
        locationStatus,
        showLocationWarning,
        setShowLocationWarning,
        handleRetryLocationPermission
    } = usePharmacyPage();

    // ------------------------ UI BÖLÜMÜ ------------------------

    const getLocationWarning = () => {
        // Eğer konum reddedilmemişse VEYA kullanıcı zaten popup'ı kapattıysa gösterme
        if (locationStatus !== 'denied' || !showLocationWarning) return null;

        return (
            <div
                className="absolute top-20 left-4 right-4 md:left-auto md:right-8 md:w-80 z-[2000] animate-in fade-in slide-in-from-top-4">
                <div
                    className="bg-white/95 backdrop-blur-md p-5 rounded-[2rem] shadow-2xl border border-red-100 relative group">

                    {/* KAPATMA BUTONU */}
                    <button
                        onClick={() => setShowLocationWarning(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <X size={18}/>
                    </button>

                    <div className="flex items-start gap-4 pr-6"> {/* pr-6 butona çarpmaması için */}
                        <div className="bg-red-50 p-3 rounded-2xl text-red-600">
                            <MapPinOff size={24}/>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 text-sm">Konum Erişimi Kapalı</h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                Size en yakın eczaneleri göstermemiz için konum izni vermeniz gerekiyor.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] text-slate-600 font-semibold mb-2 uppercase tracking-wider">
                            iPhone (Safari) için:
                        </p>
                        <p className="text-[10px] text-slate-500 leading-tight">
                            Adres çubuğundaki <span className="font-bold">"AA"</span> veya <span
                            className="font-bold">"Kilit"</span> ikonuna basıp <span className="font-bold">"Web Sitesi Ayarları"</span> kısmından
                            Konum'a "İzin Ver" demelisiniz.
                        </p>
                    </div>

                    {/* Alternatif: Ayarları açamadığı durumlar için Tekrar Dene butonu */}
                    <button
                        onClick={() => handleRetryLocationPermission()}
                        className="w-full mt-3 py-2 text-[10px] font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                    >
                        Ayarları Tamamladım, Tekrar Dene
                    </button>
                </div>
            </div>
        );
    };

    const getIconAndTitle = () => {
        return (
            <div className="flex flex-row items-center justify-between">
                <div className="text-left ml-1">
                    <h1 className="text-2xl font-black text-red-600 tracking-tighter">
                        İZMİR ECZANE
                    </h1>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                        Nöbetçi Eczane Listesi
                    </p>
                </div>
                <img src={logo} alt="İzmir Nöbetçi Eczane Logosu" className="w-12 h-12"/>
            </div>
        );
    };

    const getAsideHeader = () => (
        <div className="p-6 border-b border-slate-50 bg-white">
            {getIconAndTitle()}

            <div className="mt-6">
                <input
                    type="text"
                    placeholder="Eczane veya ilçe ara..."
                    className="w-full px-4 py-3 bg-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );

    const getSidebarToggleButton = (isMobile: boolean) => {
        if (isMobile) {
            return (
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden absolute top-4 right-4 z-[9999] bg-white p-3 rounded-2xl shadow-xl border border-slate-100 text-red-600"
                >
                    <Menu size={24}/>
                </button>
            );
        }

        return (
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`absolute top-4 z-[1002] bg-white p-3 rounded-2xl shadow-xl border border-slate-100 text-red-600 transition-all duration-300 ${
                    isSidebarOpen ? 'left-[390px]' : 'left-4'
                } md:flex hidden`} // Masaüstü için
            >
                {isSidebarOpen ? <ChevronLeft size={24}/> : <Menu size={24}/>}
            </button>
        );
    };

    const getAsideEczaneList = () => (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400 animate-pulse italic">
                    Yükleniyor...
                </div>
            ) : (
                eczaneler.map((eczane) => (
                    <div
                        key={`${eczane.Adi}-${eczane.LokasyonX}`}
                        onClick={() => setSelectedEczane(eczane)}
                        className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                            selectedEczane?.Adi === eczane.Adi
                                ? 'border-red-500 bg-white shadow-md ring-1 ring-red-500/20'
                                : 'border-transparent bg-white hover:border-slate-200 shadow-sm'
                        }`}
                    >
                        <h3 className="font-bold text-slate-800 tracking-tight">{eczane.Adi}</h3>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{eczane.Adres}</p>
                        <div className="flex items-center justify-between mt-3">
                            <span
                                className="text-[9px] bg-slate-100 px-2 py-1 rounded text-slate-600 font-bold uppercase">
                                {eczane.Bolge}
                            </span>
                            <span className="text-xs text-red-600 font-bold">{eczane.Telefon}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );


    const getSelectedEczaneCard = () => {
        if (!selectedEczane) return null;

        return (
            <div className="absolute bottom-8 right-8 z-[1000] w-80 hidden md:block">
                <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="font-bold text-xl text-slate-900">{selectedEczane.Adi}</h2>
                            <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">{selectedEczane.Bolge}</p>
                        </div>
                        <button onClick={() => setSelectedEczane(null)}
                                className="text-slate-300 hover:text-slate-500">✕
                        </button>
                    </div>
                    <p className="text-xs text-slate-600 mb-6 leading-relaxed italic">"{selectedEczane.Adres}"</p>
                    <div className="flex gap-2">
                        <a href={`tel:${selectedEczane.Telefon}`}
                           className="flex-1 bg-red-600 text-white text-center py-3 rounded-xl font-bold text-xs">ARA</a>
                        <button
                            onClick={() => openEczaneOnMap(selectedEczane)}
                            className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold text-xs"
                        >
                            YOL TARİFİ
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const getEczaneMap = () => (
        <div className="absolute inset-0 h-full w-full">
            <PharmacyMap
                eczaneler={eczaneler}
                selectedEczane={selectedEczane}
                onMarkerClick={setSelectedEczane}
            />
        </div>
    );

    const getLoading = () => {
        if (!loading) return null;

        return (
            <div
                className="absolute inset-0 z-[1001] bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <div
                    className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    };

    return (
        <div className="flex h-[100dvh] w-full overflow-hidden bg-white relative font-sans">
            { /* TOASTER (Bildirimler için) */}
            <Toaster/>

            { /* WEB AÇMA/KAPAMA BUTONU */}
            {getSidebarToggleButton(false)}

            {/* SIDEBAR */}
            <aside
                className={`
                fixed md:relative z-[1010] h-full bg-white border-r border-slate-200 
                transition-[width,transform] duration-300 ease-in-out flex flex-col overflow-hidden
                ${isSidebarOpen
                    ? 'w-[320px] md:w-[380px] translate-x-0'
                    : 'w-0 -translate-x-full md:translate-x-0 md:w-0'
                }
            `}
            >
                {/* Sidebar İçeriği */}
                <div className="sidebar-content h-full flex flex-col">
                    {getAsideHeader()}
                    {getAsideEczaneList()}
                    <Footer/>
                </div>
            </aside>

            {/* MOBİL KARARTMA KATMANI */}
            <div
                className={`
                md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[1005] transition-opacity duration-300
                ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* ANA İÇERİK (HARİTA) */}
            <main className="flex-1 relative bg-slate-100 h-full overflow-hidden">
                {getLoading()}
                {getEczaneMap()}
                {getSelectedEczaneCard()}
                {getSidebarToggleButton(true)}
                {getLocationWarning()}
            </main>
        </div>
    );
};

export default PharmacyPage;

