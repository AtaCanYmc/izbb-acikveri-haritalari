import type {MapDefinition} from "../types/mapData.ts";
import {loadDutyPharmacies, loadParkingPoints, loadWifiPoints} from "../services/mapDataLoaders.ts";

export const mapRegistry: MapDefinition[] = [
    {
        id: 'nobetci-eczaneler',
        title: 'Nöbetçi Eczaneler',
        description: 'İzmir genelindeki güncel nöbetçi eczaneleri harita ve liste görünümüyle keşfedin.',
        searchPlaceholder: 'Eczane veya bölge ara...',
        emptyStateTitle: 'Eczane bulunamadı',
        emptyStateDescription: 'Arama terimini temizleyip tekrar deneyin.',
        sourceLabel: 'İzmir Açık Veri Portalı • Nöbetçi Eczaneler',
        sourceUrl: 'https://acikveri.bizizmir.com/dataset/nobetci-eczaneler-ve-eczane-listesi',
        loadPoints: loadDutyPharmacies,
    },
    {
        id: 'otoparklar',
        title: 'Otoparklar',
        description: 'Otopark konumlarını ve doluluk bilgisini canlı olarak harita üzerinde görüntüleyin.',
        searchPlaceholder: 'Otopark veya işletmeci ara...',
        emptyStateTitle: 'Otopark bulunamadı',
        emptyStateDescription: 'Başka bir arama terimi deneyin.',
        sourceLabel: 'İzmir Açık Veri Portalı • Otopark Doluluk ve Lokasyon',
        sourceUrl: 'https://acikveri.bizizmir.com/dataset/otopark-doluluk-ve-lokasyon-bilgileri',
        loadPoints: loadParkingPoints,
    },
    {
        id: 'wizmirnet',
        title: 'WiZmirNET Noktaları',
        description: 'Ücretsiz kablosuz internet noktalarını harita üzerinde görün ve yol tarifi alın.',
        searchPlaceholder: 'İlçe, mahalle veya nokta ara...',
        emptyStateTitle: 'WiZmirNET noktası bulunamadı',
        emptyStateDescription: 'Arama filtresini değiştirip tekrar deneyin.',
        sourceLabel: 'İzmir Açık Veri Portalı • Kablosuz İnternet Bağlantı Noktaları',
        sourceUrl: 'https://acikveri.bizizmir.com/dataset/kablosuz-internet-baglanti-noktalari',
        loadPoints: loadWifiPoints,
    },
];

export const defaultMapId = mapRegistry[0].id;

export const getMapDefinitionById = (mapId: string | null) => {
    if (!mapId) {
        return mapRegistry[0];
    }

    return mapRegistry.find((map) => map.id === mapId) ?? mapRegistry[0];
};

