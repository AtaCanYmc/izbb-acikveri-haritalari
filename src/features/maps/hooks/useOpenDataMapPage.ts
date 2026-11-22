import {useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";
import type {MapDefinition, MapPoint} from "../types/mapData.ts";
import {readCachedMapPoints, recordMapView, writeCachedMapPoints} from "../utils/offlineCache.ts";
import {normalizeTurkish} from "../utils/searchUtils.ts";
import {useLocationPermission} from "./useLocationPermission.ts";

const matchesSearch = (point: MapPoint, searchTerm: string) => {
    const normalizedSearch = normalizeTurkish(searchTerm);

    if (!normalizedSearch) {
        return true;
    }

    const haystack = normalizeTurkish(
        [
            point.title,
            point.subtitle,
            point.description,
            point.badge,
            ...point.detailLines,
        ]
            .filter(Boolean)
            .join(' '),
    );

    return haystack.includes(normalizedSearch);
};

export const useOpenDataMapPage = (mapDefinition: MapDefinition | null) => {
    const [points, setPoints] = useState<MapPoint[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const locationPermission = useLocationPermission();

    useEffect(() => {
        let cancelled = false;

        if (!mapDefinition) {
            setPoints([]);
            setSelectedPoint(null);
            setLoading(false);
            return;
        }

        const loadPoints = async () => {
            recordMapView(mapDefinition.id);
            const freshCache = readCachedMapPoints(mapDefinition.id);
            if (freshCache && freshCache.length > 0) {
                setPoints(freshCache);
                setLoading(false);
            } else {
                setLoading(true);
            }

            try {
                const nextPoints = await mapDefinition.loadPoints();
                if (cancelled) {
                    return;
                }
                setPoints(nextPoints);
                setSelectedPoint(null);
                writeCachedMapPoints(mapDefinition.id, nextPoints);
                toast.success(`${mapDefinition.title} verileri güncellendi`);
            } catch (error) {
                if (cancelled) {
                    return;
                }
                const staleCache = freshCache ?? readCachedMapPoints(mapDefinition.id, {allowStale: true});
                if (staleCache && staleCache.length > 0) {
                    setPoints(staleCache);
                    toast('Çevrimdışı önbellek verisi gösteriliyor', {icon: '⚡'});
                } else {
                    console.error(`${mapDefinition.id} verileri yüklenemedi`, error);
                    toast.error('Harita verileri alınamadı. Lütfen daha sonra tekrar deneyin.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadPoints();

        return () => {
            cancelled = true;
        };
    }, [mapDefinition]);

    useEffect(() => {
        setSearchTerm('');
        setSelectedPoint(null);
        
        if (mapDefinition?.id && typeof window !== 'undefined' && window.plausible) {
            window.plausible('map_view', { props: { mapId: mapDefinition.id, mapTitle: mapDefinition.title } });
        }
    }, [mapDefinition?.id, mapDefinition?.title]);

    const filteredPoints = useMemo(() => {
        return points.filter((point) => matchesSearch(point, searchTerm));
    }, [points, searchTerm]);

    useEffect(() => {
        if (!selectedPoint) {
            return;
        }

        const stillExists = filteredPoints.some((point) => point.id === selectedPoint.id);

        if (!stillExists) {
            setSelectedPoint(filteredPoints[0] ?? null);
        }
    }, [filteredPoints, selectedPoint]);

    return {
        points: filteredPoints,
        searchTerm,
        setSearchTerm,
        selectedPoint,
        setSelectedPoint,
        loading,
        isSidebarOpen,
        setIsSidebarOpen,
        ...locationPermission,
    };
};
