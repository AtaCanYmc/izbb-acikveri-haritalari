import {useEffect, useMemo, useState} from "react";
import type {Eczane} from "../../types/eczane.ts";
import {fetchNobetciEczaneler} from "../../services/api.ts";
import toast from "react-hot-toast";

const usePharmacyPage = () => {
    const [eczaneler, setEczaneler] = useState<Eczane[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEczane, setSelectedEczane] = useState<Eczane | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [locationStatus, setLocationStatus] = useState<PermissionState>('prompt');
    const [showLocationWarning, setShowLocationWarning] = useState(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadData = async () => {
        try {
            setLoading(true);
            const data = await fetchNobetciEczaneler();
            setEczaneler(data);
            toast.success('Eczaneler güncellendi');
        } catch (error) {
            console.error("Veri çekme hatası:", error);
            toast.error('Eczane listesi alınamadı. Lütfen internetinizi kontrol edin.', {
                duration: 5000, // 5 saniye görünsün
                position: 'top-center',
            });
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const checkLocationPermission = async () => {
        // 1. Standart Permissions API kontrolü (Chrome, Firefox, Edge)
        if (navigator.permissions && navigator.permissions.query) {
            try {
                const result = await navigator.permissions.query({name: 'geolocation'});
                handleStatusChange(result.state);
                result.onchange = () => handleStatusChange(result.state);
                return;
            } catch (error) {
                console.log("Permissions API hatası, fallback yöntemine geçiliyor.", error);
            }
        }

        // 2. Safari / iOS Fallback (Doğrudan istek atma)
        // Safari'de durumu anlamanın en iyi yolu küçük bir istek yapmaktır.
        navigator.geolocation.getCurrentPosition(
            () => handleStatusChange('granted'),
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    handleStatusChange('denied');
                }
            }
        );
    };

    const handleStatusChange = (state: PermissionState) => {
        setLocationStatus(state);
        if (state === 'granted') {
            setShowLocationWarning(false);
            // Sayfa yenileme döngüsüne girmemek için dikkatli olunmalı
        } else {
            setShowLocationWarning(true);
        }
    };

    const handleRetryLocationPermission = () => {
        // Kullanıcıya konum izni vermesi için tekrar deneme fırsatı sunar
        setShowLocationWarning(false);
        checkLocationPermission().then(r => r);
    };

    useEffect(() => {
        // Verileri yükle
        loadData().then(r => r);

        // Kullanıcının konum izni durumunu kontrol et
        setInterval(() => {
            checkLocationPermission().then(r => r);
        }, 1000 * 5); // Her 5 saniyede bir kontrol et
    }, []);

    const filteredEczaneler = useMemo(() => {
        return eczaneler.filter(e =>
            e.Adi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.Bolge.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [eczaneler, searchTerm]);

    return {
        eczaneler: filteredEczaneler,
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
    };
};

export default usePharmacyPage
